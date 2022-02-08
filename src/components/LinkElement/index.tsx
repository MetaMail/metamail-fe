import React from 'react';

interface ILinkElementProps {
  name: string;
  link: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  style?: React.CSSProperties;
}

export default function LinkElement({
  name,
  link,
  target,
  style,
}: ILinkElementProps) {
  return (
    <div>
      <a href={link} target={target ?? '_blank'} style={style}>
        {name}
      </a>
    </div>
  );
}
