export const Pagination = ({totalPages, currentPage, onPageChange}) => {
    const handleClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <div>
            <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
            </button>
            {Array.from({length: totalPages}, (_, index) => (
                <button key={index} onClick={() => handleClick(index + 1)} disabled={currentPage === index + 1}>
                    {index + 1}
                </button>
            ))}
            <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
            </button>
        </div>
    );
};