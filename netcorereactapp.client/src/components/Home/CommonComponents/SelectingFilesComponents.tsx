import  {useEffect, useRef, useState} from "react";
import {IconButton, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, Typography} from "@mui/material";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    CenteredDivColumn, CenteredDivRow
} from "./CenteredDivRow.tsx";
import {AttachmentCategory} from "../../../Models/ProccesOperation/Attachment.tsx";

export interface FileWithCategory{
    file: File,
    category: string,
}

export default function SelectingFilesComponents(props) {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState<FileWithCategory[]>([]);

    useEffect(() => {
        props.onSelectedFilesChange(selectedFiles.map(file => ({ ...file, category: file.category || '' })));
    }, [selectedFiles]);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files.map(file => ({ file, category: '' }))]);
    };

    const addAttachments = () => {
        fileInputRef.current.click();
    };

    const onChangeLocal = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files.map(file => ({ file, category: '' }))]);
    };

    const handleSelectCategoryChanged = (event, index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[index].category = event.target.value;
        setSelectedFiles(newSelectedFiles);
    };

    const removeFile = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
    };

    return (
        <CenteredDivColumn>
            <CenteredDivColumn
                style={{
                    backgroundColor: 'darkgreen',
                    border: '2px dashed #cccccc',
                    borderRadius: '25px',
                    padding: '1px',
                    textAlign: 'center',
                    width:'300px',
                    height: '200px',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                Перетащите файлы сюда или нажмите для выбора
            </CenteredDivColumn>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={onChangeLocal}
                style={{ display: 'none' }}
            />
            <IconButton onClick={addAttachments}>
                <AttachFileSharpIcon />
            </IconButton>

            <List>
                {selectedFiles.map((fileWithCategory, index) => (
                    <ListItem key={index}>
                        <CenteredDivRow>
                        <ListItemText primary={fileWithCategory.file.name} />
                        <ListItemAvatar>
                            <IconButton onClick={() => removeFile(index)} edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemAvatar>
                        <Select
                            value={fileWithCategory.category}
                            onChange={(event) => handleSelectCategoryChanged(event, index)}
                            sx={{
                                color: "white"
                            }}
                        >

                            {Object.values(AttachmentCategory).map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                        </CenteredDivRow>
                    </ListItem>
                ))}
            </List>
        </CenteredDivColumn>
    );
}