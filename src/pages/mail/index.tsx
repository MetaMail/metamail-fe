import { PageHeader } from 'antd';
import { IMailContentItem } from '../home/interfaces';
import styles from './index.less';
import parse from 'html-react-parser';

interface IMailProps extends IMailContentItem {
  handleBack: () => void;
}

export default function Mail({
  subject,
  mail_from,
  part_text,
  part_html,
  handleBack,
}: IMailProps) {
  return (
    <div className={styles.container}>
      <PageHeader onBack={handleBack} title="Back" />
      <div className={styles.mail}>
        <div className={styles.subject}>
          <span className={styles.label}>Subject: </span>
          <span className={styles.info}>{subject}</span>
        </div>
        <div className={styles.from}>
          <span className={styles.label}> From: </span>
          <span className={styles.info}>
            {mail_from?.name ?? 'Unknown'}{' '}
            {mail_from.address ? '<' + mail_from.address + '>' : null}
          </span>
        </div>

        <div className={styles.content}>
          {part_html ? parse(part_html) : part_text}
        </div>
      </div>
    </div>
  );
}
