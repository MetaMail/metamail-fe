import styles from './index.less';
import { DownloadOutlined } from '@ant-design/icons';

export default function AttachmentItem({
  url,
  name,
  idx,
}: {
  url: string;
  name: string;
  idx: number;
}) {
  return (
    <div
      className={styles.item}
      onClick={() => {
        url && window.open(url);
      }}
    >
      <div className={styles.name}>{name ?? `attachment${idx}`}</div>
      <DownloadOutlined />
    </div>
  );
}
