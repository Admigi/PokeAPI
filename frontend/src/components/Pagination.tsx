import { useNavigate } from "@tanstack/react-router";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
}

export default function Pagination({ currentPage, totalPages, disabled }: PaginationProps) {
  const navigate = useNavigate({ from: "/" });

  if (totalPages <= 1) return null;

  const goToPage = (newPage: number) => {
    if (disabled) return;
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer"
        style={{ backgroundColor: currentPage === 1 ? "#f0f0f0" : "#1a1a2e", color: currentPage === 1 ? "#bbb" : "#fff" }}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
        <button
          type="button"
          key={n}
          onClick={() => goToPage(n)}
          className="w-9 h-9 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer"
          style={{ backgroundColor: currentPage === n ? "#1a1a2e" : "#f7f8fc", color: currentPage === n ? "#fff" : "#555" }}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer"
        style={{ backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#1a1a2e", color: currentPage === totalPages ? "#bbb" : "#fff" }}
      >
        ›
      </button>
    </div>
  );
}