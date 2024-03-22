import {GeneralModalWindow} from "../../GeneralModalWindow.tsx";
import {EditorFieldsOperations} from "./EditorFieldsOperations.tsx";
import {useEffect, useState} from "react";

interface AddingChildOperationProps {
    parentOperation;
    open: boolean; // Пропс для управления открытием модального окна
    onClose: () => void;
    notif:()=>void
}
export const AddingChildOperation = ({ parentOperation, open, onClose,notif }: AddingChildOperationProps) => {
    const [operation, setOperation] = useState(parentOperation);

    useEffect(() => {
        //console.log('oper\n',parentOperation)
        //console.log(typeof onClose)
        setOperation(parentOperation);
    }, [parentOperation]);

    return (
        <div>
            {operation &&
            <GeneralModalWindow
                modalCaption="Добавление дочереней операции к объекту"
                open={open} // Передаем пропс open в GeneralModalWindow
                childComponent={EditorFieldsOperations}
                childComponentProps={{
                    onClose: onClose, // Передаем функцию onClose из внешнего компонента
                    operation: operation,
                    notif: notif,
                }}
            />
            }
        </div>
    );
};