import {IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import {handleDownload} from "./DownloadFileService.tsx";
import axios from "axios";
import config from "../../../config/config.json";

export const addingAttachmentsToProcces = async (id,selectedFiles,onClose)=>{
    const tokenValue = localStorage.getItem("authToken");

    const formData = new FormData();
    //console.log("files",selectedFiles)
    selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
    });

    const response = await axios.put(
        `${config.apiUrl}/procces/${id}/updatefile`,
        formData, // Передаем FormData вместо обычного объекта
        {
            headers: {
                'Content-Type': 'multipart/form-data', // Устанавливаем заголовок для FormData
                Authorization: `Bearer ${tokenValue}`,
            },
        }
    );
    //console.log(response.status)
    if(response.status==200)
    {
        onClose()
    }
}

export const SaveAttachmentsToOperation=async(id,selectedFiles,onClose)=>{

    const tokenValue = localStorage.getItem("authToken");
    const formData = new FormData();
    //console.log("files",selectedFiles)
    selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
    });
    const response = await axios.put(
        `${config.apiUrl}/operation/${id}/updatefile`,
        formData, // Передаем FormData вместо обычного объекта
        {
            headers: {
                'Content-Type': 'multipart/form-data', // Устанавливаем заголовок для FormData
                Authorization: `Bearer ${tokenValue}`,
            },
        }
    );
    //console.log(response.status)
    if(response.status==200)
    {
        onClose()
    }
}
export const renderAttachments = (attachments) => (
    attachments.map((attachment, index) => (
        <ListItem key={index}>
            <ListItemAvatar>
                <IconButton onClick={() => handleDownload(attachment)}>
                    <FolderIcon />
                </IconButton>
            </ListItemAvatar>
            {/* Добавьте здесь код для отображения вложений */}
            <ListItemText primary={attachment.attachmentData} />
            <ListItemAvatar>
                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon  />
                </IconButton>
            </ListItemAvatar>
        </ListItem>
    ))
);