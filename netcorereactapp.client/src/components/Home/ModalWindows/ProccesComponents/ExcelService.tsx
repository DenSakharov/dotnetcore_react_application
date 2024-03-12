import axios from "axios";
import  {useState} from "react";
import {Procces} from "../../../../Models/ProccesOperation/Procces.tsx";
import {OperationTable} from "./OperationTable.tsx";
import {formatDate} from "../../Services/DateTimeConverterService.tsx";
import {Operation} from "../../../../Models/ProccesOperation/Operation.tsx";

export default function ExcelService(props) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");
    const [procces,setProcces]=useState<Procces>(null)
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
            `https://localhost:7294/excelimport/import`,
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
        //console.log(procces)
        try {
            const response = await axios.put(
                `https://localhost:7294/procces/updatemodel`, // URL для обновления операции по ее идентификатору
                procces, // Передаем отредактированный объект
                {
                    headers: {
                        'Content-Type': 'application/json', // Устанавливаем заголовок для JSON
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            console.log("Response from confirmEditedOperation:", response.data);
            props.onClose()
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
        console.log(procces)
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
                        <p>ID: {procces.id}</p>
                        <p>Caption: <input type="text" name="caption" value={procces.caption}
                                           onChange={onChangeLocal}/></p>
                        <p>Date of Creation: <input type="datetime-local" name="dateOfCreation"
                                                    value={formatDate(procces.dateOfCreture)}
                                                    readOnly/></p>
                        <p>Date of Editing: <input type="datetime-local" name="dateOfEditing"
                                                   value={formatDate(procces.dateOfEdited)}
                                                   readOnly/></p>
                        <OperationTable operations={procces.operations} onOperationUpdate={updateOperationInProcess}/>
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
