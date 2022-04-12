import { Button, Divider, notification, PageHeader } from 'antd';
import {
  IMailContentItem,
  ReadStatusTypeEn,
  MetaMailTypeEn,
} from '../home/interfaces';
import styles from './index.less';
import parse from 'html-react-parser';
import { useState, useEffect, useRef } from 'react';
import { changeMailStatus, getMailDetailByID } from '@/services';
import AttachmentItem from './AttachmentItem';
import CryptoJS from 'crypto-js';
import { connect } from 'umi';
import locked from '@/assets/images/locked.svg';
import DOMPurify from 'dompurify';

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});

function Mail(props: any) {
  const [mail, setMail] = useState<IMailContentItem>();
  const {
    location: { query },
    history,
    address,
  } = props;

  const [readable, setReadable] = useState(true);
  const randomBitsRef = useRef('');

  const handleLoad = async () => {
    try {
      if (!query?.id && query.id.length === 0) {
        throw new Error();
      }
      const { data } = await getMailDetailByID(window.btoa(query.id));

      setMail(data);
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch detail info of this e-mail for now.',
      });
      setMail(undefined);
    }
  };

  const handleDecrypted = async () => {
    let keys = mail?.meta_header?.keys;

    if (keys && keys?.length > 0 && address) {
      let key = keys[1]; //TODO: 应该看自己是在收件人还是发件人，获得key
      // @ts-ignore
      let randomBits = await ethereum.request({
        method: 'eth_decrypt',
        params: [Buffer.from(key, 'base64').toString(), address],
      });

      if (randomBits) {
        randomBitsRef.current = randomBits;

        const res = { ...mail };

        if (res?.part_html) {
          res.part_html = CryptoJS.AES.decrypt(
            res.part_html,
            randomBits,
          ).toString(CryptoJS.enc.Utf8);
        }

        if (res?.part_text) {
          res.part_text = CryptoJS.AES.decrypt(
            res.part_text,
            randomBits,
          ).toString(CryptoJS.enc.Utf8);
        }

        setReadable(true);
        setMail(res as IMailContentItem);
      }
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
    if (query?.type === MetaMailTypeEn.Encrypted + '') {
      setReadable(false);
    }
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
        <div className={styles.to}>
          <span className={styles.label}> To: </span>
          <span className={styles.info}>
            {mail?.mail_to
              ? mail?.mail_to
                  .map((item) =>
                    item.name
                      ? item.name + ' <' + item.address + '>'
                      : item.address,
                  )
                  .join('; ')
              : ''}
          </span>
        </div>

        {readable === true ? (
          <>
            {mail?.attachments && mail.attachments.length > 0 && (
              <div className={styles.attachments}>
                <div className={styles.label}> Attachments: </div>
                <div className={styles.container}>
                  {mail?.attachments?.map((item, idx) => (
                    <AttachmentItem
                      idx={idx}
                      key={idx}
                      url={item?.download?.url}
                      name={item?.filename}
                      randomBits={randomBitsRef.current}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className={styles.content}>
              {mail?.part_html
                ? parse(DOMPurify.sanitize(mail?.part_html))
                : mail?.part_text}
            </div>
          </>
        ) : (
          <div onClick={handleDecrypted} className={styles.locked}>
            <img src={locked} className={styles.icon} />
            <div>Click to decrypt this mail.</div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

export default connect(mapStateToProps)(Mail);
