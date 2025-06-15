export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No date';
  return dateStr;
}

// Just an alias for consistency with existing code
export const formatRelativeTime = formatDate;