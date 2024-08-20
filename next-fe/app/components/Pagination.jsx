import Link from "next/link";

const Pagination = ({ currentPage, totalPages, path }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={`/${path}/?page=${currentPage - 1}`}>&laquo; Previous</Link>
      )}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={`/${path}/?page=${page}`}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={`/${path}/?page=${currentPage + 1}`}>Next &raquo;</Link>
      )}
    </div>
  );
};

export default Pagination;
