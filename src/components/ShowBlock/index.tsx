import React from 'react';
import styles from './index.less';
interface IShowBlockProps {
  imgSrc: string;
  title: string;
  desc?: string;
}

export default function ShowBlock({ imgSrc, title, desc }: IShowBlockProps) {
  return (
    <div className={styles.block}>
      <img className={styles.img} src={imgSrc} alt="show image"></img>

      <div className={styles.info}>
        <div className={styles.title}>{title ?? '-'}</div>
        <div className={styles.desc}>{desc ?? '-'}</div>
      </div>
    </div>
  );
}
