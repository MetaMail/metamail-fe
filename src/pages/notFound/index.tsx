import { Button } from 'antd';
import styles from './index.less';
import { history } from 'umi';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h3>Oops! PAGE NOT FOUND</h3>
      <Button
        type="primary"
        onClick={() => {
          history.push('/');
        }}
      >
        Back Home
      </Button>
    </div>
  );
}
