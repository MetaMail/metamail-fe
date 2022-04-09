import { notification, PageHeader } from 'antd';
import {
  IMailContentItem,
  ReadStatusTypeEn,
  MetaMailTypeEn,
} from '../home/interfaces';
import styles from './index.less';
import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { changeMailStatus, getMailDetailByID } from '@/services';
import AttachmentItem from './AttachmentItem';
import CryptoJS from 'crypto-js';

export default function Mail(props: any) {
  const [mail, setMail] = useState<IMailContentItem>();
  const {
    location: { query },
    history,
  } = props;

  const handleLoad = async () => {
    try {
      if (!query?.id && query.id.length === 0) {
        throw new Error();
      }
      const { data } = await getMailDetailByID(window.btoa(query.id));
      console.log(data);
      if (data) {
        // 用户点进来的时候就解密，还是先显示一个锁，等用户点击？
        if ((data.meta_type as MetaMailTypeEn) === MetaMailTypeEn.Encrypted) {
          console.log(data);
          // 获取解密的key
          let keys = data?.meta_header?.keys;
          let key = keys[1]; //TODO: 应该看自己是在收件人还是发件人，获得key
          // @ts-ignore
          let randimBits = await ethereum.request({
            method: 'eth_decrypt',
            params: [
              Buffer.from(key, 'base64').toString(),
              '0x045ff23cF3413f6A355F0ACc6eC6cB2721B95D99',
            ],
          }); // TODO: 替换为用户的地址
          // console.log(randimBits);
          // TODO：存储randomBits，解密附件的时候需要
          data.part_html = CryptoJS.AES.decrypt(
            data.part_html,
            randimBits,
          ).toString(CryptoJS.enc.Utf8);
          // console.log(data.part_html)
          data.part_text = CryptoJS.AES.decrypt(
            data.part_text,
            randimBits,
          ).toString(CryptoJS.enc.Utf8);
        }
        setMail(data);
      }
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch detail info of this e-mail for now.',
      });
      setMail(undefined);
    }
  };

  const handleMarkRead = async () => {
    const mails =
      query?.id && query.id.length > 0
        ? [{ message_id: query.id, mailbox: Number(query.type) }]
        : [];
    await changeMailStatus(mails, undefined, ReadStatusTypeEn.read);
  };
  useEffect(() => {
    handleMarkRead();
    handleLoad();
  }, [query]);

  return (
    <div className={styles.container}>
      <PageHeader
        onBack={() => {
          history.push({
            pathname: '/home/list',
            query: {
              filter: 0,
            },
          });
        }}
        title="Back"
      />
      <div className={styles.mail}>
        <div className={styles.subject}>
          <span className={styles.label}>Subject: </span>
          <span className={styles.info}>{mail?.subject ?? '-'}</span>
        </div>
        <div className={styles.from}>
          <span className={styles.label}> From: </span>
          <span className={styles.info}>
            {mail?.mail_from?.name ?? 'Unknown'}{' '}
            {mail?.mail_from.address
              ? '<' + mail?.mail_from.address + '>'
              : null}
          </span>
        </div>

        <div className={styles.attachments}>
          <div className={styles.label}> Attachments: </div>
          <div className={styles.container}>
            {mail?.attachments?.map((item, idx) => (
              <AttachmentItem
                idx={idx}
                url={item?.download?.url}
                name={item?.filename}
              />
            ))}
          </div>
        </div>

        <div className={styles.content}>
          {mail?.part_html ? parse(mail?.part_html) : mail?.part_text}
        </div>
      </div>
    </div>
  );
}
