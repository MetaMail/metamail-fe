import React, { useState } from 'react';

interface IIconProps {
  url: any;
  checkedUrl?: any;
  onClick?: (isSelected: boolean) => void;
  className?: any;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  select?: boolean;
}

export default function Icon({
  url,
  checkedUrl,
  onClick,
  className,
  style,
  imgStyle,
  select,
}: IIconProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(!select);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={onClick ? { cursor: 'pointer', ...style } : style}
      className={className}
    >
      <img
        src={!select ? url : checkedUrl ?? url}
        style={{
          height: '20px',
          width: '20px',
          ...imgStyle,
        }}
      />
    </div>
  );
}
