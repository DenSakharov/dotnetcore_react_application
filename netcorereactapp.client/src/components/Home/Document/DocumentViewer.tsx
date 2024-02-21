import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import downloadFile from '../Services/DownloadFileService';

// ������� ���� � pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const DocumnetViewer = () => {
    const { fileId } = useParams(); // �������� fileId �� ���������� ��������
    const fileIdNumber = parseInt(fileId); // ����������� fileId � �����
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [base64doc, setBase64doc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //console.log("test")
        fetchData();

        return () => {
            // ������� �������, ���� ��� ����������
        };
    }, [fileIdNumber]);
    async function fetchData() {
        try {
            const base64Data = await downloadFile(fileIdNumber); // �������� ��������� ������ base64
            if (base64Data) {
                //console.log('response - \n' + base64Data);
                setBase64doc(base64Data);
                setLoading(false); // ������������� ��������� �������� � false
            } else {
                // � ������ ������ ������� ���������
                console.error('Failed to download file');
                setError('Failed to download file');
                setLoading(false); // ������������� ��������� �������� � false
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            setError(error.message);
            setLoading(false); // ������������� ��������� �������� � false
        }
    }
    if (loading) {
        return <div>Loading...</div>; // ���������� ����������� ���������
    }

    if (error) {
        return <div>Error: {error}</div>; // ���������� ��������� �� ������
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

