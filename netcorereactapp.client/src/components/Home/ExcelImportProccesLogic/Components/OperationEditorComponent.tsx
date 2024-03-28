import {useEffect, useRef, useState} from "react";
import {formatDate} from "../../Services/DateTimeConverterService.tsx";
import SelectingFilesComponents from "../../CommonComponents/SelectingFilesComponents.tsx";
import {SaveAttachmentsToOperation} from "../../Services/AttachmentService.tsx";
import {
    StyledTextField
} from "../../TableComponent/ModalWindows/ProccesComponents/SelectedProccesComponents/SelectedProcces.tsx";

export const OperationEditorComponent = (props) => {
    //console.log(props.operation.dateOfCreture+"\n"+props.operation.dateOfEdited)
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("OperationEditorComponent component useEffect selectedFiles :\n",selectedFiles)
    }, [selectedFiles]);
    const inputRef = useRef(null);
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
         {/*   <div>
                <label>Caption:</label>
                <input type="text" name="caption" value={props.operation.caption} onChange={onChangeLocal}/>
            </div>*/}
            <StyledTextField
                ref={inputRef}
                id="outlined-helperText"
                label="Название операции"
                defaultValue={props.operation.caption}
                helperText="Отредактировать название операции"
                variant="outlined"
                name="caption"
                onChange={onChangeLocal}
                autoFocus
            />
            <div>
                <label>Date of Creation:</label>
                <input type="datetime-local" name="dateOfCreation" value={formatDate(props.operation.dateOfCreture)}
                       readOnly/>

             {/*   <label>Date of Editing:</label>
                <input type="datetime-local" name="dateOfEditing" value={formatDate(props.operation.dateOfEdited)}
                       readOnly/>*/}
            </div>
            <SelectingFilesComponents onSelectedFilesChange={handleSelectedFilesChange}/>
            <button onClick={
                ()=>SaveAttachmentsToOperation(props.operation.id,selectedFiles,props.onClose)
            }
            >Save</button>
        </div>
    );
};