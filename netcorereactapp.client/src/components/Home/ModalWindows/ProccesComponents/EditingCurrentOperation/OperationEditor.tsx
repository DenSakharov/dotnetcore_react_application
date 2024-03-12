import {formatDate} from "../../../Services/DateTimeConverterService.tsx";

export const OperationEditor = (props) => {
    //console.log(props.operation.dateOfCreture+"\n"+props.operation.dateOfEdited)
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

            <button onClick={props.onSave}>Save</button>
        </div>
    );
};