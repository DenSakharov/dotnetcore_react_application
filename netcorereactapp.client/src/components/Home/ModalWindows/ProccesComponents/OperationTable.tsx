import React, {useState} from "react";
import {Operation} from "../../../../Models/ProccesOperation/Operation.tsx";
import DeleteOperationFromProcces from "./EditingCurrentOperation/DeleteOperationFromProcces.tsx";
import {formatDate} from "../../Services/DateTimeConverterService.tsx";

export const OperationTable: React.FC<{
    operations: Operation[],
    onOperationUpdate: (updatedOperation: Operation, operationId: number) => void
}> = ({operations, onOperationUpdate}) => {
    const renderOperation = (operation: Operation) => {
        return (
            <tr key={operation.id}>
                <td>{operation.id}</td>
                <td>{operation.caption}</td>
                <td><input type="datetime-local" name="dateOfCreation" value={formatDate(operation.dateOfCreture)} readOnly/></td>
                <td><input type="datetime-local" name="dateOfEditing" value={formatDate(operation.dateOfEdited)} readOnly/></td>
                <td>
                    <DeleteOperationFromProcces operation={operation}  onChange={onOperationUpdate}/>
                </td>
            </tr>
        )
    };
    const renderNestedOperations = (operations: Operation[]) => {
        //console.log("response -> " + JSON.stringify(operations) )
        return operations.map((operation: Operation, index) => (
            <React.Fragment key={index/*operation*/}>
                {renderOperation(operation)}
                {operation.childsOperations && operation.childsOperations.length > 0 && (
                    <tr>
                        <td colSpan={4}>
                                <table>
                                    <tbody>
                                    {renderNestedOperations(operation.childsOperations)}
                                    </tbody>
                                </table>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        ));
    };
    const [showChilds, setShowChilds] = useState<{ [key: number]: boolean }>({});
    const toggleChilds = (operationId: number) => {
        setShowChilds(prevState => ({
            ...prevState,
            [operationId]: !prevState[operationId]
        }));
    };
    return (
        <div style={{ overflowX: 'auto', maxHeight:"400px"}}>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Caption</th>
                    <th>Date of Creation</th>
                    <th>Date of Editing</th>
                </tr>
                </thead>
                <tbody>
                {operations.map((operation, index) => (
                    <React.Fragment key={/*operation.id*/index}>
                        {renderOperation(operation)}
                        {operation.childsOperations && operation.childsOperations.length > 0 && (
                            <tr>
                                <td colSpan={4}>
                                    <button onClick={() => toggleChilds(index)}>
                                        {showChilds[index] ? 'Скрыть' : 'Показать'}
                                    </button>
                                    {showChilds[index] && (
                                        <table>
                                            <tbody>
                                            {renderNestedOperations(operation.childsOperations)}
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};