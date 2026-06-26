import Link from 'next/link';

export default function EmptyState({ icon = '🗂️', title, message, actionHref, actionLabel }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="max-w-md text-sm text-neutral-500">{message}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
