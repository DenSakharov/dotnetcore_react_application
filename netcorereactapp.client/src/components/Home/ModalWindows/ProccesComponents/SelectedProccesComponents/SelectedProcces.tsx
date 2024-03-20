import {useEffect, useRef, useState} from "react";
import {Procces} from "../../../../../Models/ProccesOperation/Procces.tsx";
import axios from "axios";
import config from "../../../../../config/config.json";
import {CircularProgress, IconButton, List, ListItemAvatar, TextField, Typography} from "@mui/material";
import {styled} from '@mui/system';
import {Operation} from "../../../../../Models/ProccesOperation/Operation.tsx";
import OperationListComponent from "./OperationListComponents/OperationListComponent.tsx";
import {OperationTableComponent} from "./OperationTableComponent/OperationTableComponent.tsx";
import {CenteredDivRow} from "./OperationListComponents/CenteredDivRow.tsx";
import {addingAttachmentsToProcces, renderAttachments} from "../../../Services/AttachmentService.tsx";
import AssignmentTurnedInSharpIcon from '@mui/icons-material/AssignmentTurnedInSharp';
import SelectingFiles from "../SelectingMultipleFilesForAttachments/SelectingFiles.tsx";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';

export const SelectedProcces = ({ int , onClose}: { int: string ,onClose: void}) =>{
    const [selectedProcces,setSelectedProcces]=useState<Procces>()
    const [operations,setOperations]=useState<Operation[]>()
    useEffect(()=>{
        getCurrentProcces()
    },[])
    useEffect(() => {
        //console.log("selectedProcces changed:", selectedProcces);
        setOperations(selectedProcces?.operations)
    }, [selectedProcces]);
    useEffect(() => {
        //console.log('operations\n',operations);
    }, [operations]);
    const getCurrentProcces=async()=>{
        try {
            const tokenValue = localStorage.getItem("authToken");
            const response = await axios.get(//`${config.apiUrl}/procces/all`
                `${config.apiUrl}/procces/${int}`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            if(response)
            {
                //console.log(response.data)
                setSelectedProcces(response.data);
            }
        }
        catch (e){
            console.error("Before request \n",e)
        }
    }
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const { name, value } = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setSelectedProcces(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
    };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const addAttachments=async (files)=>{
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    }
    const confirmEditedOperation = async () => {
        const tokenValue = localStorage.getItem("authToken");
        /*const formData = new FormData();
        formData.append('files', selectedFiles);
        formData.append('procces', selectedProcces);*/
        console.log(selectedProcces)
        //const procces: Procces=selectedProcces
        try {
            const response = await axios.put(
                `${config.apiUrl}/procces/updatemodel`, // URL для обновления операции по ее идентификатору
                selectedProcces, // Передаем отредактированный объект
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log("Response from confirmEditedOperation:", response.data);
            if(response.status==200)
            {
                const res= await addingAttachmentsToProcces(selectedProcces?.id,selectedFiles,onClose)
                //props.onClose()
            }
            // Возможно, здесь вы захотите обновить состояние приложения или выполнить другие действия
        } catch (error) {
            console.error("Error while confirming edited operation:", error);
            // Обработка ошибки
        }
    };
    const [view, setView] = useState(false);
    const click_view_table = (e: any) => {
        if(view)
            setView(false)
        else
            setView(true)
    }
    const [infoVisible, setInfoVisible] = useState(false);

    const toggleInfoVisibility = () => {
        setInfoVisible(!infoVisible);
    };

    return (
        <>
            {!selectedProcces && (
                <CenteredDivRow>
                    <CircularProgress/>
                </CenteredDivRow>)}
            {selectedProcces && (
                <div>
                    <CenteredDivRow>
                        <Typography variant="body1">
                            ID: {selectedProcces ? selectedProcces.id : ''}
                        </Typography>
                        <StyledTextField
                            ref={inputRef}
                            id="outlined-helperText"
                            label="Название процесса"
                            defaultValue={selectedProcces.caption}
                            helperText="Отредактировать название процесса"
                            variant="outlined"
                            name="caption"
                            onChange={handleTextFieldChange}
                            autoFocus
                        />
                        <div>
                            {selectedProcces.attachments &&
                                <List>
                                    {renderAttachments(selectedProcces.attachments)}
                                </List>
                            }
                        </div>
                        <IconButton onClick={toggleInfoVisibility}>
                            {infoVisible ? <RemoveSharpIcon /> : <AddSharpIcon />}
                        </IconButton>
                        {infoVisible && (
                            <div>
                                <SelectingFiles onSelectedFilesChange={addAttachments}/>
                            </div>
                        )}

                    </CenteredDivRow>
                    <button className="styled-button"
                            title={view ? "Показать таблицу" : "Показать Список"} onClick={click_view_table}>
                        {view ? "Показать таблицу" : "Показать Список"}
                    </button>
                    <ListItemAvatar>
                        <IconButton onClick={confirmEditedOperation} edge="end" aria-label="delete">
                            <AssignmentTurnedInSharpIcon  />
                        </IconButton>
                    </ListItemAvatar>
                    {
                        view ? (
                                operations !== undefined && operations !== null &&
                                <OperationListComponent operations={operations}/>
                            )
                            :
                            (
                                operations !== undefined && operations !== null &&
                                <div>
                                    <OperationTableComponent operations={operations}/>
                                </div>
                            )
                        /* :
                         (
                             <div>
                                 <CenteredDivRow>
                                     <CircularProgress/>
                                 </CenteredDivRow>
                             </div>
                         )*/
                    }

                </div>
            )}
        </>
    )
}
export const StyledTextField = styled(TextField)({
    margin: '5px',
    width: '50ch',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
    },
});

