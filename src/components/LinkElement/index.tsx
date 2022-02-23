import React from 'react';
import styles from './index.less';

interface ILinkElementProps {
  name: string;
  link: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export default function LinkElement({
  name,
  link,
  target,
}: ILinkElementProps) {
  return (
    <div className={styles.wrapper}>
      <a href={link} target={target ?? '_blank'} className={styles.text}>
        {name}
      </a>
    </div>
  );
}
