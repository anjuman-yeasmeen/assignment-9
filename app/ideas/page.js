import IdeasBrowser from '@/components/ideas/IdeasBrowser';

export const metadata = { title: 'Ideas' };

// Next.js 16: searchParams is a Promise and must be awaited.
export default async function IdeasPage({ searchParams }) {
  const sp = await searchParams;
  return (
    <IdeasBrowser
      initialCategory={sp.category || ''}
      initialSearch={sp.search || ''}
    />
  );
}
