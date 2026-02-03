/**
 * Utility functions for avatar handling
 */

/**
 * Generate abbreviated name from full name
 * @param name - Full name
 * @returns Abbreviated name (first letters of first and last name)
 */
export function getAbbreviatedName(name: string): string {
  if (!name) return 'U';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  
  // Take first letter of first word and first letter of last word
  const firstLetter = words[0].charAt(0).toUpperCase();
  const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
  
  return firstLetter + lastLetter;
}

/**
 * Generate background color based on name
 * @param name - Full name
 * @returns Hex color string
 */
export function getAvatarColor(name: string): string {
  if (!name) return '#6B7280'; // Default gray
  
  const colors = [
    '#EF4444', // Red
    '#F97316', // Orange  
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
  ];
  
  // Generate hash from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use hash to select color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Avatar Frame Component Props
 */
export interface AvatarFrameProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Get size classes for avatar frame
 */
export function getAvatarSizeClasses(size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): {
  container: string;
  text: string;
} {
  switch (size) {
    case 'sm':
      return {
        container: 'w-6 h-6',
        text: 'text-xs'
      };
    case 'md':
      return {
        container: 'w-10 h-10',
        text: 'text-sm'
      };
    case 'lg':
      return {
        container: 'w-16 h-16',
        text: 'text-lg'
      };
    case 'xl':
      return {
        container: 'w-20 h-20',
        text: 'text-xl'
      };
    default:
      return {
        container: 'w-10 h-10',
        text: 'text-sm'
      };
  }
}