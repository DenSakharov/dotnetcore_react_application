import {Divider, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import {handleDownload} from "./DownloadFileService.tsx";
import axios from "axios";
import config from "../../../config/config.json";
import {useEffect, useState} from "react";
import mapCategoryToEnum, {
    Attachment,
    AttachmentCategory,
    mapCategoryValueToEnum
} from "../../../Models/ProccesOperation/Attachment.tsx";
import {styled} from "@mui/system";
import React from "react";
import {CenteredDivColumn, CenteredDivRow} from "../CommonComponents/CenteredDivRow.tsx";

export const addingAttachmentsToProcces = async (id,selectedFiles,onClose)=>{
    const tokenValue = localStorage.getItem("authToken");

    const formData = new FormData();
    //console.log("files\n",selectedFiles)
    selectedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file.file);
        formData.append(`file_${index}_category`, file.category);
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
export const saveOperationWithAttachments = async (oper,selectedFiles) => {
    try {
        const tokenValue = localStorage.getItem("authToken");
        const formData = new FormData();
        //console.log("files\n",selectedFiles)
        selectedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file.file);
            formData.append(`file_${index}_category`, file.category);
        });
        //console.info('Перед отправкой запроса о сохраненнии изменения\n',oper)
        formData.append("operation", JSON.stringify(oper))
        const response = await axios.put(
            `${config.apiUrl}/operation/${oper.id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${tokenValue}`,
                },
            }
        );
        //console.log(response.status)
        if (response.status === 200) {
        }
    } catch (error) {
        console.error("Error during request:", error);
        throw error; // Передаем ошибку дальше, чтобы ее обработать в вызывающем коде
    }
};
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
export const RenderAttachmentsComponent
    = ({ attachments ,send_request}: { attachments: Attachment[],send_request: void }) => {
    const [attachmentsLocal, setAttachmentsLocal] = useState([]);

    useEffect(() => {
        //console.log("attachments : ",attachments);
        setAttachmentsLocal(attachments);
    }, [attachments]);

    /*const deleteAttachment =async (attachment: Attachment) => {
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
    };*/

    return (
        <div>
            {attachmentsLocal && (
                renderAttachmentByCategory(attachmentsLocal,send_request)
                /*attachmentsLocal.map((attachment, index) => (
                    <StyledListItem key={index}
                                    sx={{
                                        margin:"2px"
                                    }}
                    >
                        <ListItemAvatar>
                            <IconButton onClick={() => handleDownload(attachment)}>
                                <FolderIcon/>
                            </IconButton>
                        </ListItemAvatar>
                        {/!* Добавьте здесь код для отображения вложений *!/}
                        <StyledListItemText primary={attachment.attachmentData.split('\\').pop()}/>
                        {mapCategoryToEnum(attachment.category)}
                        <ListItemAvatar>
                            <StyledIconButton edge="end" aria-label="delete"
                                        onClick={()=>{
                                            deleteAttachment(attachment)}
                            }>
                                <StyledDeleteButton/>
                            </StyledIconButton>
                        </ListItemAvatar>
                    </StyledListItem>
                ))*/
            )
            }
        </div>
    );
};
export const renderAttachmentByCategory=(attachments: Attachment[],send_request: void)=>{
    // Проверяем, является ли attachments массивом
    if (!Array.isArray(attachments)) {
        return []; // Возвращаем пустой массив, если attachments не является массивом
    }
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
    // Группируем вложения по категориям
    const attachmentsByCategory: Record<AttachmentCategory|string, Attachment[]> = {
        [AttachmentCategory.Instruction]: [],
        [AttachmentCategory.Document]: [],
        [AttachmentCategory.Model]: [],
        [AttachmentCategory.MPK]: [],
        [AttachmentCategory.Agreement]: [],
        ["null"]:[]
    };

    // Распределение вложений по категориям
    attachments.forEach((attachment) => {
        const category = mapCategoryValueToEnum(attachment.category);
        if (category !== null) {
            attachmentsByCategory[category].push(attachment);
        } else {
            // Используем null в квадратных скобках для обращения к свойству с ключом null
            attachmentsByCategory["null"].push(attachment);
        }
    });
    // Удаляем категории, в которых нет вложений
    Object.keys(attachmentsByCategory).forEach((category) => {
        if (attachmentsByCategory[category].length === 0) {
            delete attachmentsByCategory[category];
        }
    });
    const categoryElements
        = Object.entries(attachmentsByCategory).map(([category, attachments]) => {
        // Создаем элементы JSX для вложений в текущей категории (в колонке)
        const attachmentItems = attachments.map((attachment, index) => (
            <StyledListItemText key={index} >
                <CenteredDivRow>
                <ListItemAvatar>
                    <IconButton onClick={() => handleDownload(attachment)}>
                        <FolderIcon/>
                    </IconButton>
                </ListItemAvatar>
                <StyledListItemText
                    sx={{
                        textAlign: 'center',
                        color:'white',
                        width: '200px',
                    }}
                    primary={attachment.attachmentData.split('\\').pop()}/>
                {/*{mapCategoryToEnum(attachment.category)}*/}
                <ListItemAvatar>
                    <StyledIconButton edge="end" aria-label="delete"
                                      onClick={()=>{
                                          deleteAttachment(attachment)}
                                      }>
                        <StyledDeleteButton/>
                    </StyledIconButton>
                </ListItemAvatar>
                </CenteredDivRow>
            </StyledListItemText>
        ));

        // Возвращаем элемент категории с вложениями внутри (в колонке)
        return (
            <Grid item xs={3} md={3} key={category}
                  sx={{
                      border: '2px solid',
                      borderRadius:'25px',
                      backgroundColor:'green',
                      margin:'10px',
                      width:'auto',
                      minWidth: '300px',
                  }}
            >
                <CenteredDivColumn sx={{
                    display: 'contents',
                    justifyContent: 'space-between',
                    padding: 0,
                    margin: 0,
                }}>
                    {
                        category!=='null' ?
                    <Typography variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    color:'white',
                                }}
                    >
                        {category}
                    </Typography>
                            :
                            <Typography variant="h6"
                                        sx={{
                                textAlign: 'center',
                                color:'white', }}
                            >
                                Остальное
                            </Typography>
                    }
                    <Divider sx={{ borderWidth: '2px' }} />
                    {attachmentItems}
                </CenteredDivColumn>
            </Grid>
        );
    });

// Возвращаем контейнер с категориями (в строке)
    return (
        <Grid container spacing={2}>
            {categoryElements}
        </Grid>
    );
}


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
