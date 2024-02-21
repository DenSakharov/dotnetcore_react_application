import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import downloadFile from '../Services/DownloadFileService';

// Укажите путь к pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const DocumnetViewer = () => {
    const { fileId } = useParams(); // Получаем fileId из параметров маршрута
    const fileIdNumber = parseInt(fileId); // Преобразуем fileId в число
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [base64doc, setBase64doc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //console.log("test")
        fetchData();

        return () => {
            // Очистка эффекта, если это необходимо
        };
    }, [fileIdNumber]);
    async function fetchData() {
        try {
            const base64Data = await downloadFile(fileIdNumber); // Ожидание получения строки base64
            if (base64Data) {
                //console.log('response - \n' + base64Data);
                setBase64doc(base64Data);
                setLoading(false); // Устанавливаем состояние загрузки в false
            } else {
                // В случае ошибки выводим сообщение
                console.error('Failed to download file');
                setError('Failed to download file');
                setLoading(false); // Устанавливаем состояние загрузки в false
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            setError(error.message);
            setLoading(false); // Устанавливаем состояние загрузки в false
        }
    }
    if (loading) {
        return <div>Loading...</div>; // Отображаем загрузочное сообщение
    }

    if (error) {
        return <div>Error: {error}</div>; // Отображаем сообщение об ошибке
    }
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div>
            <h2>Document Viewer</h2>
            {base64doc && (
                <Document
                    file={`data:application/pdf;base64,${base64doc}`}
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

