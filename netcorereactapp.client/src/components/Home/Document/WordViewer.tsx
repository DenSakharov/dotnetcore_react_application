import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import downloadFile from '../Services/DownloadFileService';
export const fetchFile = async (fileId) => {
    try {
        const base64String = await downloadFile(parseInt(fileId));
        const link = document.createElement('a');
        link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64String;
        link.download = 'document.docx';
        link.click();
    } catch (error) {
        console.error('Error fetching file:', error);
    }
};
export default function WordViewer() {
    const [fileData, setFileData] = useState(); // Массив объектов файлов
    const { fileId } = useParams(); // Пол
    useEffect(() => {
        const fetchFile = async () => {
            try {
                const base64String = await downloadFile(parseInt(fileId));
                const link = document.createElement('a');
                link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64String;
                link.download = 'document.docx';
                link.click();
                setFileData(base64String)
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        fetchFile();
    },[] );
    return (
        <div>
            <h1>File Preview</h1>
            <DocViewer
                documents={[ { uri: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${fileData}` } ]}
                pluginRenderers={DocViewerRenderers}
            />
        </div>
    );
}
