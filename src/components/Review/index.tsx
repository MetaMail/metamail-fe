import React, { ReactNode } from 'react';
import styles from './index.less';
import fiveStar from '@/assets/homeUI/5star.png';
interface IReview {
  imgSrc: string;
  //name: string;
  content: string;
  desc?: string;
  desc2?: string;
}

export default function Review({
  imgSrc,
  //name,
  content,
  desc,
  desc2,
}: IReview) {
  return (
    <div className={styles.block}>
      <img className={styles.star} src={fiveStar}></img>
      <img className={styles.icon} src={imgSrc}></img>
      <div className={styles.info}>
        <div className={styles.content}>{content ?? '-'}</div>
        <p className={styles.desc}>
          {desc}
          <br />
          {desc2}
        </p>
      </div>
    </div>
  );
}
