// src/components/Pagination.jsx

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-12 text-sm text-gray-700">
      <button
      className="text-[19px] font-[600] text-[#c3bcbc]"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 ${
              currentPage === page
                ? "font-semibold text-black border-b-3 border-black"
                : ""
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
      className="text-[19px] font-[600] text-[#c3bcbc]"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
