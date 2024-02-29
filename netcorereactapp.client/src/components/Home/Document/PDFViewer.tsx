import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import downloadFile from "../Services/DownloadFileService.tsx";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {PDFViewerTemplate} from "./PDFViewerTemplate.tsx";
function PDFViewer() {
    const { fileId } = useParams(); // �������� fileId �� ���������� ��������
    const fileIdNumber = parseInt(fileId); // ����������� fileId � �����
    const [fileData, setFileData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //console.log("test")
        fetchData();
        //console.log("base 64 - "+fileData)
        return () => {
            // ������� �������, ���� ��� ����������
        };
    }, [fileIdNumber]);
    async function fetchData() {
        try {
            const base64Data = await downloadFile(fileIdNumber); // �������� ��������� ������ base64
            if (base64Data) {
                //console.log('response - \n' + base64Data);
                setFileData(base64Data);
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
    return (
        <div>
            <h2>Document Viewer</h2>
            {fileData && (
                <div>
                    <PDFViewerTemplate fileData={fileData}/>
                </div>
            )}
        </div>
    );
}


/*
const PDFViewer = () => {
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
                <div>
                <p>test</p>
                <Document
                    file={`data:application/pdf;base64,${base64doc}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                </div>
            )}
            {numPages && (
                <p>Page {pageNumber} of {numPages}</p>
            )}
        </div>
    );
};
*/
    export default PDFViewer;

