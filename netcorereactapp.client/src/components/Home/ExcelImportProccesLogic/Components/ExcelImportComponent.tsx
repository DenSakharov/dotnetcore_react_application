import axios from "axios";
import {useEffect, useState} from "react";
import {Procces} from "../../../../Models/ProccesOperation/Procces.tsx";
import {OperationsTable} from "./OperationsTable.tsx";
import {formatDate} from "../../Services/DateTimeConverterService.tsx";
import {Operation} from "../../../../Models/ProccesOperation/Operation.tsx";
import config from '../../../../config/config.json';

import "../../../../styles/ExcelService.css"
import {addingAttachmentsToProcces} from "../../Services/AttachmentService.tsx";
import SelectingFilesComponents from "../../CommonComponents/SelectingFilesComponents.tsx";

export default function ExcelImportComponent(props) {
    const [selectedFile, setSelectedFile] = useState()
    const [errorMessage, setErrorMessage] = useState("");
    const [procces,setProcces]=useState<Procces>(null)

    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        //console.log("ExcelService useEffect selectedFiles :\n",selectedFiles)
    }, [selectedFiles]);
    function handleFileChange(event) {
        const file = event.target.files[0];
        setSelectedFile(file)
    }

    const exportExcelFile = async () => {
        const tokenValue = localStorage.getItem("authToken");
        // Создаем объект FormData для передачи данных файла
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post(
            `${config.apiUrl}/excelimport/import`,
            formData, // Передаем FormData вместо обычного объекта
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Устанавливаем заголовок для FormData
                    Authorization: `Bearer ${tokenValue}`,
                },
            }
        );
        //console.log("response -> " + JSON.stringify(response.data) )
        setProcces(response.data)

    }
    const updateOperationInProcess = (updatedOperation: Operation, operationId: number) => {
        if (!procces) return;

        const updatedOperations = procces.operations.map(operation => {
            if (operation.id === operationId) {
                console.log(`Обновляется операция с id ${operationId}:`, operation);
                console.log('Изменения:', updatedOperation);
                return updatedOperation;
            }
            return operation;
        });

        setProcces(prevProcces => ({
            ...prevProcces,
            operations: updatedOperations
        }));
    };

    const sendTotalResultProccesWithOperations =async ()=>{
        //console.log(procces)
        confirmEditedOperation()
    }
    const confirmEditedOperation = async () => {
        const tokenValue = localStorage.getItem("authToken");
        console.log(procces)
        /*const formData = new FormData();
        formData.append('files', selectedFiles);
        formData.append('procces', procces);*/
        try {
            const response = await axios.put(
                `${config.apiUrl}/procces/updatemodel`, // URL для обновления операции по ее идентификатору
                procces, // Передаем отредактированный объект
                {
                    headers: {
                        'Content-Type': 'application/json', // Устанавливаем заголовок для JSON
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log("Response from confirmEditedOperation:", response.data);
            if(response.status==200)
            {
               const res= await addingAttachmentsToProcces(procces.id,selectedFiles,props.onClose())
                //props.onClose()
            }
            // Возможно, здесь вы захотите обновить состояние приложения или выполнить другие действия
        } catch (error) {
            console.error("Error while confirming edited operation:", error);
            // Обработка ошибки
        }
    };
    const onChangeLocal = (event) => {
        const { name, value } = event.target;
        // Создаем обновленный объект процесса с измененным значением
        const updatedProcces = {
            ...procces,
            [name]: value
        };
        // Обновляем состояние процесса
        setProcces(updatedProcces);
        //console.log(procces)
    };
    //code for adding files to procces from component SelectingFiles
    const handleSelectedFilesChange = (files) => {
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    };

    return (
        <div>
            <div className="file-upload">
                <label>
                    Выберите файл:
                    <input type="file" accept=".xlsx" onChange={handleFileChange}/>
                </label>
            </div>
            <div className="action-buttons">
                <button onClick={exportExcelFile}>Отправить файл Excel</button>
            </div>
            <div>
                {procces && (
                    <>
                        <div className="container">
                            <div className="grid">
                                <div className="row">
                                    <div className="col">
                                        <h3>Номер : {procces.id}</h3>
                                    </div>
                                    <div className="col">
                                        <h3>Название : <input type="text" name="caption" value={procces.caption}
                                                           onChange={onChangeLocal}/></h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h3>Дата создания : <input type="datetime-local" name="dateOfCreation"
                                                                    value={formatDate(procces.dateOfCreture)}
                                                                    readOnly/></h3>
                                    </div>
                                    <div className="col">
                                        <h3>Дата редактирования : <input type="datetime-local" name="dateOfEditing"
                                                                   value={formatDate(procces.dateOfEdited)}
                                                                   readOnly/></h3>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <SelectingFilesComponents onSelectedFilesChange={handleSelectedFilesChange}/>
                            </div>
                        </div>
                        <OperationsTable operations={procces.operations} onOperationUpdate={updateOperationInProcess}/>
                    </>
                )}
            </div>
            <div className="error-message">
                {errorMessage && <div>{errorMessage}</div>}
            </div>
            <div>
                <button onClick={sendTotalResultProccesWithOperations}>
                    Подтвердить процесс из Excel
                </button>
            </div>
        </div>
    )
}
