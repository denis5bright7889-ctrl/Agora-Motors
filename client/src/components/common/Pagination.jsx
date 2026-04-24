// client/src/components/common/Pagination.jsx

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paginationRange } from '../../utils/helpers';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const range = paginationRange(page, pages);

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <PageBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </PageBtn>

      {range.map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-9 text-center text-slate-400 text-sm">…</span>
        ) : (
          <PageBtn
            key={item}
            onClick={() => onPageChange(item)}
            active={item === page}
          >
            {item}
          </PageBtn>
        )
      )}

      <PageBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </PageBtn>
    </nav>
  );
}

function PageBtn({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center
        transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100'
        }
      `}
      {...props}
    >
      {children}
    </button>
  );
}
