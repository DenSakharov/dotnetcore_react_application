import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// ”кажите путь к pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const DocumnetViewer = ({ base64String }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    //console.log(base64String)
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div>
            <h2>Document Viewer</h2>
            {base64String && (
                <Document
                    file={`data:application/pdf;base64,${base64String}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            )}
            {numPages && (
                <p>Page {pageNumber} of {numPages}</p>
            )}
        </div>
    );
};

export default DocumnetViewer;

