/**
 * Format a timestamp to a human-readable date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a timestamp to a human-readable date and time string
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get timestamp for N hours ago
 */
export function hoursAgo(hours: number): number {
  return Date.now() - hours * 60 * 60 * 1000;
}

/**
 * Get timestamp for N days ago
 */
export function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

/**
 * Check if a timestamp is within the last N hours
 */
export function isWithinHours(timestamp: number, hours: number): boolean {
  return timestamp >= hoursAgo(hours);
}

/**
 * Check if a timestamp is within the last N days
 */
export function isWithinDays(timestamp: number, days: number): boolean {
  return timestamp >= daysAgo(days);
}
