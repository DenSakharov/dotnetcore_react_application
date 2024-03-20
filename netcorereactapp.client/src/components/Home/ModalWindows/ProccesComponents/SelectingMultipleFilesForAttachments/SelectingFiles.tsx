import React, {useEffect, useRef, useState} from "react";
import {IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {CenteredDivColumn} from "../SelectedProccesComponents/OperationListComponents/CenteredDivRow.tsx";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SelectingFiles(props ) {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("SelectingFiles useEffect selectedFiles :\n",selectedFiles)
        props.onSelectedFilesChange(selectedFiles);
    }, [selectedFiles]);
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files]);

    };
    const addAttachments = () => {
        // Вызовет нажатие на скрытый input
        fileInputRef.current.click();
    };
    const onChangeLocal = (event) => {
        const files = event.target.files;
        console.log("files into SelectingFiles component :\n",files)
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...files]);

    };
    const removeFile = (indexToRemove) => {
        setSelectedFiles(prevSelectedFiles => prevSelectedFiles.filter((file, index) => index !== indexToRemove));

    };
    return (
        <div>
            <CenteredDivColumn>
                {/* Область для перетаскивания */}
                <div
                    style={{
                        border: '2px dashed #cccccc',
                        padding: '20px',
                        textAlign: 'center'
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    Перетащите файлы сюда или нажмите для выбора
                </div>

                {/* Инпут для выбора файла */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onChangeLocal}
                    style={{display: 'none'}} // Скрытый input
                />
                <IconButton onClick={addAttachments}>
                    <AttachFileSharpIcon/>
                </IconButton>
                {/* Список выбранных файлов */}
                <ul>
                    {selectedFiles.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={file.name} />
                            <ListItemAvatar>
                                <IconButton onClick={() => removeFile(index)} edge="end" aria-label="delete">
                                    <DeleteIcon  />
                                </IconButton>
                            </ListItemAvatar>
                        </ListItem>
                    ))}
                </ul>
            </CenteredDivColumn>
        </div>
    );
}