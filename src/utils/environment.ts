
/**
 * Environment utility to handle different domains for development and production
 */

// Get the current base URL
export const getBaseUrl = (): string => {
  // In development, use the current window location
  if (import.meta.env.DEV) {
    return window.location.origin;
  }
  // In production, use the production domain
  return 'https://connect.gazouyi.com';
};

// Get the full URL for a specific path
export const getFullUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Ensure path starts with a slash if not empty
  const formattedPath = path && !path.startsWith('/') ? `/${path}` : path;
  return `${baseUrl}${formattedPath}`;
};
