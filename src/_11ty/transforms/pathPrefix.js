module.exports = (content, outputPath) => {
  const pathPrefix = process.env.PATH_PREFIX;

  // Only apply to HTML files and if PATH_PREFIX is set
  if (!pathPrefix || !outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  // Don't apply if pathPrefix is just '/'
  if (pathPrefix === '/') {
    return content;
  }

  // Remove trailing slash from pathPrefix
  const cleanPrefix = pathPrefix.replace(/\/$/, '');

  // Replace asset paths: src="/assets/..." and href="/assets/..."
  let updatedContent = content.replace(
    /(src|href)="(\/assets\/[^"]+)"/g,
    `$1="${cleanPrefix}$2"`
  );

  // Replace CSS and JS paths: src="/css/..." and src="/js/..." and href="/css/..."
  updatedContent = updatedContent.replace(
    /(src|href)="(\/(css|js)\/[^"]+)"/g,
    `$1="${cleanPrefix}$2"`
  );

  // Replace internal page links that start with / (but not external http/https)
  // This handles links like href="/en/..." but skips href="https://..."
  updatedContent = updatedContent.replace(
    /href="(\/[^"/][^"]*)"(?![^<]*<\/script>)/g,
    (match, path) => {
      // Skip if it's already prefixed or if it's a protocol-relative URL
      if (path.startsWith(cleanPrefix) || path.startsWith('//')) {
        return match;
      }
      return `href="${cleanPrefix}${path}"`;
    }
  );

  return updatedContent;
};
