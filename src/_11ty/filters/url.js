module.exports = function (url, pathPrefix = '') {
  // If no path prefix or url is absolute (http/https), return as-is
  if (!pathPrefix || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Remove trailing slash from pathPrefix and leading slash from url if present
  const cleanPrefix = pathPrefix.replace(/\/$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanPrefix}${cleanUrl}`;
};
