import {IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import {handleDownload} from "./DownloadFileService.tsx";
import axios from "axios";
import config from "../../../config/config.json";
import {CenteredDivColumn} from "../CommonComponents/CenteredDivRow.tsx";
import {useEffect, useState} from "react";
import {Attachment} from "../../../Models/ProccesOperation/Attachment.tsx";
import {styled} from "@mui/system";

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
export const RenderAttachmentsComponent = ({ attachments ,send_request}: { attachments: Attachment[],send_request: void }) => {
    const [attachmentsLocal, setAttachmentsLocal] = useState([]);

    useEffect(() => {
        //console.log(attachments);
        setAttachmentsLocal(attachments);
    }, [attachments]);

    const deleteAttachment =async (attachment: Attachment) => {
        try {
            //console.log(attachment.id)
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.delete(
                `${config.apiUrl}/attachment/${attachment.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            if (response.status === 200) {
                //console.log('ok')
                send_request()
            }
        }catch (e) {
            //console.error(e)
        }
    };

    return (
        <div>
            {attachmentsLocal && (
                attachmentsLocal.map((attachment, index) => (
                    <StyledListItem key={index}>
                        <ListItemAvatar>
                            <IconButton onClick={() => handleDownload(attachment)}>
                                <FolderIcon/>
                            </IconButton>
                        </ListItemAvatar>
                        {/* Добавьте здесь код для отображения вложений */}
                        <StyledListItemText primary={attachment.attachmentData.split('\\').pop()}/>
                        <ListItemAvatar>
                            <StyledIconButton edge="end" aria-label="delete"
                                        onClick={()=>{
                                            deleteAttachment(attachment)}
                            }>
                                <StyledDeleteButton/>
                            </StyledIconButton>
                        </ListItemAvatar>
                    </StyledListItem>
                ))
            )}
        </div>
    );
};
const StyledListItem = styled(ListItem)`
    border: 2px solid green;
    border-radius: 50px;
    margin-bottom: 5px;
    padding: 1px;
`;

const StyledListItemText = styled(ListItemText)`
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledIconButton = styled(IconButton)`
    color: #555;
`;

const StyledDeleteButton = styled(DeleteIcon)`
    color: red;
`;
