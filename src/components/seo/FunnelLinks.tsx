import { ContextualInternalLinks } from "@/components/seo/ContextualInternalLinks";

export function FunnelLinksSidebar({ currentPath }: { currentPath: string }) {
  return <ContextualInternalLinks currentPath={currentPath} />;
}
