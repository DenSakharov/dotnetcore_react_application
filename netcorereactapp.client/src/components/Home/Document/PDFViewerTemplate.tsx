import {
    Viewer,
    Worker
} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import './Styles/PDFViewerTemplate.css';
export const PDFViewerTemplate = ({ fileData }) => {
    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={`data:application/pdf;base64,${fileData}`} />
            </Worker>
        </div>
        // fileUrl={`data:application/pdf;base64,${fileData}`}
    );
   /* const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const viewerRef = useRef(null);

    const pageNavigationPluginInstance = pageNavigationPlugin();

    useEffect(() => {
        if (viewerRef.current) {
            const unsubscribe = viewerRef.current.subscribe((event) => {
                if (event.type === 'pages-loaded') {
                    setTotalPages(event.pagesCount);
                }
            });
            return () => unsubscribe();
        }
    }, []);

    const handleDocumentLoad = () => {
        setLoading(false);
        //console.log('Document loaded successfully');
    };

    const handleError = (e) => {
        setError(e.message);
        setLoading(false);
        //console.error('Error occurred while loading document:', e);
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex); // Обновляем текущую страницу
        //console.log('Current page index:', pageIndex);
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1); // Переходим на следующую страницу
        }
    };

    const previousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1); // Переходим на предыдущую страницу
        }
    };

    const renderLoader = (percentages) => (
        <div style={{ width: '240px' }}>
            <ProgressBar progress={Math.round(percentages)} />
        </div>
    );

    const renderError = () => (
        <div>
            <h2>Error</h2>
            <p>{error}</p>
        </div>
    );

    return (
        <div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div>
                    <button onClick={previousPage} disabled={currentPage === 0}>
                        Previous Page
                    </button>
                    <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
                        Next Page
                    </button>
                </div>
                <Viewer
                    plugins={[pageNavigationPluginInstance]}
                    fileUrl={`data:application/pdf;base64,${fileData}`}
                    theme={'darkTheme'}
                    renderLoader={renderLoader}
                    renderError={renderError}
                    onDocumentLoad={handleDocumentLoad}
                    onError={handleError}
                    onPageChange={handlePageChange}
                    ref={viewerRef}
                    page={currentPage} // Устанавливаем текущую страницу
                />
            </Worker>
            {loading && <div>Loading...</div>}
        </div>
    );*/
};