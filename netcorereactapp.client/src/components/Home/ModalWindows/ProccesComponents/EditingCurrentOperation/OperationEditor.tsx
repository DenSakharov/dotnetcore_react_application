import {formatDate} from "../../../Services/DateTimeConverterService.tsx";
import SelectingFiles from "../SelectingMultipleFilesForAttachments/SelectingFiles.tsx";
import {useEffect, useState} from "react";
import {SaveAttachmentsToOperation} from "../../../Services/AttachmentService.tsx";
export const OperationEditor = (props) => {
    //console.log(props.operation.dateOfCreture+"\n"+props.operation.dateOfEdited)
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("OperationEditor component useEffect selectedFiles :\n",selectedFiles)
    }, [selectedFiles]);
    const onChangeLocal = (event) => {
        const { name, value } = event.target;
        // Создаем обновленную операцию с измененным значением
        const updatedOperation = {
            ...props.operation,
            [name]: value
        };
        // Вызываем функцию для обновления операции в процессе
        props.onChange(updatedOperation, props.operation.id);
    };
    const handleSelectedFilesChange = (files) => {
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    };

    return (
        <div>
            <div>
                <label>ID:</label>
                <input type="text" name="id" value={props.operation.id} readOnly/>
            </div>
            <div>
                <label>Caption:</label>
                <input type="text" name="caption" value={props.operation.caption} onChange={onChangeLocal}/>
            </div>
            <div>
                <label>Date of Creation:</label>
                <input type="datetime-local" name="dateOfCreation" value={formatDate(props.operation.dateOfCreture)}
                       readOnly/>

                <label>Date of Editing:</label>
                <input type="datetime-local" name="dateOfEditing" value={formatDate(props.operation.dateOfEdited)}
                       readOnly/>
            </div>
            <SelectingFiles onSelectedFilesChange={handleSelectedFilesChange}/>
            <button onClick={
                ()=>SaveAttachmentsToOperation(props.operation.id,selectedFiles,props.onClose)
            }
            >Save</button>
        </div>
    );
};