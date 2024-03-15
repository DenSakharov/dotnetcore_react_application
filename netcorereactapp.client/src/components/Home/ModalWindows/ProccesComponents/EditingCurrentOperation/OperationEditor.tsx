import {formatDate} from "../../../Services/DateTimeConverterService.tsx";
import SelectingFiles from "../SelectingMultipleFilesForAttachments/SelectingFiles.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import config from '../../../../../config/config.json'
export const OperationEditor = (props) => {
    //console.log(props.operation.dateOfCreture+"\n"+props.operation.dateOfEdited)
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        console.log("OperationEditor component useEffect selectedFiles :\n",selectedFiles)
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
    const onSave=async()=>{

        const tokenValue = localStorage.getItem("authToken");
        const formData = new FormData();
        //console.log("files",selectedFiles)
        selectedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });
        const response = await axios.put(
            `${config.apiUrl}/operation/${props.operation.id}/updatefile`,
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
            props.onClose()
        }
    }
    return (
        <div>
            <label>ID:</label>
            <input type="text" name="id" value={props.operation.id} readOnly/>

            <label>Caption:</label>
            <input type="text" name="caption" value={props.operation.caption} onChange={onChangeLocal}/>

            <label>Date of Creation:</label>
            <input  type="datetime-local" name="dateOfCreation" value={formatDate(props.operation.dateOfCreture) } readOnly/>

            <label>Date of Editing:</label>
            <input type="datetime-local" name="dateOfEditing" value={formatDate(props.operation.dateOfEdited)} readOnly/>
            <SelectingFiles onSelectedFilesChange={handleSelectedFilesChange}/>
            <button onClick={onSave}>Save</button>
        </div>
    );
};