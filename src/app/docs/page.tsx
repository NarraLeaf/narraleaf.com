import { redirect } from 'next/navigation';
import { docsRoute } from '@/lib/shared';

/** Default docs hub lands on NarraLeaf Project overview (first documentation tab). */
export default function DocsIndexPage() {
  redirect(`${docsRoute}/narraleaf-project`);
}
