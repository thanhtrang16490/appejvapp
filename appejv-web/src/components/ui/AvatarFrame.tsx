import React from 'react';
import { getAbbreviatedName, getAvatarColor, getAvatarSizeClasses, AvatarFrameProps } from '@/utils/avatarUtils';

/**
 * AvatarFrame component - displays abbreviated name in a colored frame
 */
export default function AvatarFrame({ name, size = 'md', className = '' }: AvatarFrameProps) {
  const abbreviatedName = getAbbreviatedName(name);
  const backgroundColor = getAvatarColor(name);
  const sizeClasses = getAvatarSizeClasses(size);
  
  return (
    <div 
      className={`${sizeClasses.container} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor }}
    >
      <span className={sizeClasses.text}>
        {abbreviatedName}
      </span>
    </div>
  );
}