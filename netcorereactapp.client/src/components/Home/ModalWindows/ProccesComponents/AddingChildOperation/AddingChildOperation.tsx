import {GeneralModalWindow} from "../../GeneralModalWindow.tsx";
import {EditorFieldsOperations} from "./EditorFieldsOperations.tsx";
import {useEffect, useState} from "react";
import {Operation} from "../../../../../Models/ProccesOperation/Operation.tsx";

interface AddingChildOperationProps {
    parentOperation: Operation;
    open: boolean; // Пропс для управления открытием модального окна
    onClose: () => void;
}

export const AddingChildOperation = ({ parentOperation, open, onClose }: AddingChildOperationProps) => {
    const [operation, setOperation] = useState<Operation>(parentOperation);

    useEffect(() => {
        //console.log('oper\n',parentOperation)
        setOperation(parentOperation);
    }, [parentOperation]);

    return (
        <div>
            <GeneralModalWindow
                modalCaption="Добавление дочереней операции к объекту"
                open={open} // Передаем пропс open в GeneralModalWindow
                childComponent={EditorFieldsOperations}
                childComponentProps={{
                    onClose: onClose, // Передаем функцию onClose из внешнего компонента
                    operation: operation
                }}
            />
        </div>
    );
};