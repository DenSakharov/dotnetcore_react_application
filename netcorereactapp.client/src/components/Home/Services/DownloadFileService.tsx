import axios from "axios";
import config from '../../../config/config.json'
import {IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export const handleDownload = async (attachment) => {
    //console.info('attachment\n',attachment)
    const fileId = attachment.id;
    const extension = attachment.attachmentData.split('.').pop().toLowerCase();
    if (extension === 'xlsx') {
        //window.location.href = `https://localhost:5173/#/excel/${fileId}`;
        window.open(`https://localhost:5173/#/excel/${fileId}`, '_blank');
    }
    //function view pdf file
    else if (extension === 'pdf') {
        //window.location.href = `https://localhost:5173/#/pdf/${fileId}`;
        window.open(`https://localhost:5173/#/pdf/${fileId}`, '_blank');
    }
    else if (extension === 'doc' || extension === 'docx') {
        //window.location.href = `https://localhost:5173/#/doc/${fileId}`;
        window.open(`https://localhost:5173/#/doc/${fileId}`, '_blank');
        //await fetchFile(fileId)
    }
    else{
        await fetchFile(fileId, attachment.attachmentData)
        //alert("Невозможно открыть файл данного типа расширения !")
    }
};
export default async function downloadFile(fileId) {

    try {
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response = await axios.get(`${config.apiUrl}/filedownload/${fileId}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            }
        });

        return response.data

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
}
export const fetchFile = async (fileId: number, fileName: string) => {
    try {
        const fileNam = fileName.split('\\').pop();
        //console.log("fileName -> " + fileNam);
        const base64String = await downloadFile(parseInt(fileId));
        const link = document.createElement('a');
        link.href = 'data:application/file;base64,' + base64String;
        link.download = fileNam;
        link.click();
    } catch (error) {
        console.error('Error fetching file:', error);
    }
};
export const load_convetered_doc_in_pdf=async (fileId)=>{
    try {
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response = await axios.get(`${config.apiUrl}/converter/${fileId}`, {
            headers: {
                Authorization: `Bearer ${tokenValue}`,
            }
        });
        //console.log("data 1 "+JSON.stringify(response.data))
        return response.data;

    } catch (error) {
        console.error('Error downloading file:', error);
        throw error; // Пробрасывает ошибку для обработки в вызывающем коде
    }
}