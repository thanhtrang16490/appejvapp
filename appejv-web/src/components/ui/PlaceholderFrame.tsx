'use client';

interface PlaceholderFrameProps {
  text?: string;
  className?: string;
  aspectRatio?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
}

export default function PlaceholderFrame({ 
  text = "replace holder", 
  className = "", 
  aspectRatio = "1/1",
  textSize = "sm"
}: PlaceholderFrameProps) {
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div 
      className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
    >
      <span className={`${textSizeClasses[textSize]} text-gray-500 font-medium text-center px-2`}>
        {text}
      </span>
    </div>
  );
}