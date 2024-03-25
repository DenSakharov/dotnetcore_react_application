import {useEffect, useState} from "react";
import {GeneralModalWindow} from "../../GeneralModalWindow.tsx";
import {EditorFieldsOperationsToAddProcces} from "./EditorFieldsOperationsToAddProcces.tsx";

interface AddingChildOperationProps {
    procces;
    open: boolean; // Пропс для управления открытием модального окна
    onClose: () => void;
    notif:()=>void
}
export const AddChildOperToProc = ({ procces, open, onClose,notif }: AddingChildOperationProps) => {
    const [proccesLocal, setProccesLocal] = useState(procces);

    useEffect(() => {
        setProccesLocal(procces);
    }, [procces]);

    return (
        <div>
            {procces &&
                <GeneralModalWindow
                    modalCaption="Добавление операции к выбранному процессу"
                    open={open} // Передаем пропс open в GeneralModalWindow
                    childComponent={EditorFieldsOperationsToAddProcces}
                    childComponentProps={{
                        onClose: onClose, // Передаем функцию onClose из внешнего компонента
                        operation: proccesLocal,
                        notif: notif,
                    }}
                />
            }
        </div>
    );
}