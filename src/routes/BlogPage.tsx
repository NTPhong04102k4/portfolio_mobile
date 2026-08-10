import { BlogIssues } from '@/modules/blog/BlogIssues';

import { RoutePage } from './RoutePage';

export function BlogPage() {
  return (
    <RoutePage routeId="blog">
      <BlogIssues />
    </RoutePage>
  );
}
