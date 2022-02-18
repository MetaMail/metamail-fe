import React from 'react';

interface IIconProps {
  url: any;
}

export default function Icon({ url }: IIconProps) {
  return (
    <div>
      <img
        src={url}
        style={{
          height: '20px',
          width: '20px',
        }}
      />
    </div>
  );
}
