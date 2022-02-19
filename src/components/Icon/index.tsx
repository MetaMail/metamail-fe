import React, { useState } from 'react';

interface IIconProps {
  url: any;
  checkedUrl?: any;
  onClick?: (isSelected: boolean) => void;
  className?: any;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}

export default function Icon({
  url,
  checkedUrl,
  onClick,
  className,
  style,
  imgStyle,
}: IIconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(!isSelected);
      setIsSelected(!isSelected);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={onClick ? { cursor: 'pointer', ...style } : style}
      className={className}
    >
      <img
        src={!isSelected ? url : checkedUrl ?? url}
        style={{
          height: '20px',
          width: '20px',
          ...imgStyle,
        }}
      />
    </div>
  );
}
