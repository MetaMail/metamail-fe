import { notification, PageHeader } from 'antd';
import { IMailContentItem, ReadStatusTypeEn } from '../home/interfaces';
import styles from './index.less';
import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { changeMailStatus, getMailDetailByID } from '@/services';
import AttachmentItem from './AttachmentItem';

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

      if (data) {
        setMail(data);
      }
    } catch {
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
