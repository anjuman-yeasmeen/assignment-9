import Link from 'next/link';
import Image from 'next/image';
import { FiMessageSquare, FiArrowRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '@/lib/format';

// Reused on Home, Ideas, and My Ideas. Equal heights via flex column so the
// "View Details" footer always aligns across a grid row.
export default function IdeaCard({ idea, onEdit, onDelete }) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link href={`/ideas/${idea._id}`} className="relative block aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {idea.imageURL ? (
          <Image
            src={idea.imageURL}
            alt={idea.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">💡</div>
        )}
        <span className="chip absolute left-3 top-3 bg-white/90 dark:bg-neutral-900/90">
          {idea.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{idea.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{idea.shortDescription}</p>

        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {idea.authorName}
          </span>
          <span>•</span>
          <span>{formatDate(idea.createdAt)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
            <FiMessageSquare className="h-4 w-4" />
            {idea.commentCount || 0}
          </span>

          {onEdit || onDelete ? (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(idea)}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  <FiEdit2 className="h-3.5 w-3.5" /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(idea)}
                  className="btn-danger px-3 py-1.5 text-xs"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/ideas/${idea._id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all dark:text-brand-400"
            >
              View Details <FiArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
