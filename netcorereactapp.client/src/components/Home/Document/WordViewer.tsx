import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import downloadFile, {load_convetered_doc_in_pdf} from '../Services/DownloadFileService';
import {CharacterMap, Viewer, Worker, ProgressBar, TextDirection} from "@react-pdf-viewer/core";
import {PDFViewerTemplate} from "./PDFViewerTemplate.tsx";
export default function WordViewer() {
    const [fileData, setFileData] = useState();
    const [base64DataDoc, setBase64DataDoc] = useState();
    const {fileId} = useParams(); // Пол
    useEffect(() => {
        fetchData()
    }, []);
    const fetchData = async () => {
        try {
            //const base64Data = await downloadFile(fileId); // Ожидание получения строки base64
            const base64Data = await load_convetered_doc_in_pdf(fileId);
            if (base64Data) {

                //console.log("result: ", base64Data);
                setFileData(base64Data);
            } else {
                // В случае ошибки выводим сообщение
                console.error('Failed to download file');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    async function downloadBase64File() {
        const base64DataDoc = await downloadFile(fileId);
        if (base64DataDoc) {
            //console.log(base64DataDoc)
            setBase64DataDoc(base64DataDoc)
            const downloadLink = document.createElement("a");
            downloadLink.href = `data: application/msword;base64,${base64DataDoc}`;
            downloadLink.download = "test";
            downloadLink.click();
        } else {
            // В случае ошибки выводим сообщение
            console.error('Failed to download file');
        }

    }
    return (
        <div>
            <h1>Doc Preview</h1>
            {fileData &&
                <div>
                    <button onClick={downloadBase64File}>Скачать</button>
                    <PDFViewerTemplate fileData={fileData}/>

                </div>
            }
        </div>
    );
}
