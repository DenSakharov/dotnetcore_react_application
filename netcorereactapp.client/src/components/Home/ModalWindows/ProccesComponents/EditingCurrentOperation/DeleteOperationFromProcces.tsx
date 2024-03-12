import  {useState} from "react";
import ModelEditingCurrentOperation from "./ModelEditingCurrentOperation.tsx";

export default function DeleteOperationFromProcces(props){
    //console.log("oper ->"+JSON.stringify( oper) )

    const [isModalEditedOperation, setModalEditedOperation] = useState(false)
    const clickEditedOpereation =()=>{
        setModalEditedOperation(!isModalEditedOperation);
    }
    const handleSave = () => {
        setModalEditedOperation(!isModalEditedOperation);
    };
    return(
        <div>
            <button onClick={clickEditedOpereation}>Редактировать</button>
            {isModalEditedOperation && (
                <ModelEditingCurrentOperation
                    visible={isModalEditedOperation}
                    title='Редактирование выбранной операции'
                    footer={<button onClick={clickEditedOpereation}>Close</button>}
                    onClose={clickEditedOpereation}
                    operation={props.operation}
                    onSave={handleSave}
                    onChange={props.onChange}
                />
            )}
        </div>
    )
}
