// Utility functions for CalculateWork module

// Generate a unique ID based on timestamp
export const generateId = () => Date.now().toString();

// Format a date range for display (e.g., "06-01 - 08-31")
export const formatDateRange = (start?: string, end?: string): string => {
  if (!start || !end) return "-";
  return `${start.substring(5)} - ${end.substring(5)}`;
};

// Format a single date in short format (e.g., "06-15")
export const formatDateShort = (date?: string): string => {
  return date ? date.substring(5) : "-";
};
