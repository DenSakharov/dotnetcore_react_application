import add_status_to_status from "../Services/StatusService.tsx";
import {TypesStatus} from "../../../Models/TypesStatus.tsx";
import {useState} from "react";
import {StatusModel} from "../../../Models/StatusModel.tsx";
import {AttachmentModel} from "../../../Models/AttachmentModel.tsx";

export const AddChildStatusToStatus =(props)=>{
    const statusChildId: number=props.selectedChildStatusId
    const [selectedStatus, setSelectedStatus] = useState<TypesStatus>(TypesStatus.Start);
    const [selectedFile, setSelectedFile]=useState(null);
    const handleClick =()=> {
        console.log(statusChildId)
        const status = selectedStatus
        const formData = new FormData();
        formData.append('status', status);
        formData.append('file', selectedFile);
        const resp=add_status_to_status(statusChildId,formData)
        props.onClose()
       /* if(resp.status==200)
        {
            props.onClose()
        }
        else {
            alert("Ошибка добалвения со статусом -> "+resp.status)
        }*/
    }
    const [errorMessage, setErrorMessage] = useState("");
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedStatus((prevStatus) => {
            console.log(`selectedStatus => ${newValue}`);
            return newValue;
        });
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    return(

        <div>
            <div className="select-status">
                <label>
                    Выберите статут для добалвения :
                    <select value={selectedStatus || ""} onChange={handleStatusChange}>
                        <option value="">Выберите статус</option>
                        <option value={TypesStatus.Start}>Start</option>
                        <option value={TypesStatus.Proccess}>Proccess</option>
                        <option value={TypesStatus.End}>End</option>
                    </select>
                </label>
            </div>
            <div className="file-upload">
                <label>
                    Выберите файл:
                    <input type="file" onChange={handleFileChange}/>
                </label>
            </div>
            <button onClick={handleClick}>
                Добавить дочерний статус
            </button>
        </div>
    )
}