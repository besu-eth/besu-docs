import MDXComponents from '@theme-original/MDXComponents';
import Fields from '@site/src/components/ApiFields';

export default {
  ...MDXComponents,
  // Make <Fields> available in all MDX/Markdown without an explicit import.
  Fields,
};
