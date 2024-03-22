import {useEffect, useState} from "react";
import {formatDate} from "../../Services/DateTimeConverterService.tsx";
import SelectingFilesComponents from "../../CommonComponents/SelectingFilesComponents.tsx";
import {SaveAttachmentsToOperation} from "../../Services/AttachmentService.tsx";

export const OperationEditorComponent = (props) => {
    //console.log(props.operation.dateOfCreture+"\n"+props.operation.dateOfEdited)
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("OperationEditorComponent component useEffect selectedFiles :\n",selectedFiles)
    }, [selectedFiles]);
    const onChangeLocal = (event) => {
        const { name, value } = event.target;
        // ������� ����������� �������� � ���������� ���������
        const updatedOperation = {
            ...props.operation,
            [name]: value
        };
        // �������� ������� ��� ���������� �������� � ��������
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
            <SelectingFilesComponents onSelectedFilesChange={handleSelectedFilesChange}/>
            <button onClick={
                ()=>SaveAttachmentsToOperation(props.operation.id,selectedFiles,props.onClose)
            }
            >Save</button>
        </div>
    );
};