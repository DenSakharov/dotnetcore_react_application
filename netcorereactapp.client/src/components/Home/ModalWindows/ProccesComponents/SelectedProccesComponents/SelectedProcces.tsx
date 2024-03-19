import React, {useEffect, useRef, useState} from "react";
import {Procces} from "../../../../../Models/ProccesOperation/Procces.tsx";
import axios from "axios";
import config from "../../../../../config/config.json";
import {CircularProgress, TextField, Typography} from "@mui/material";
import {styled} from '@mui/system';
import {Operation} from "../../../../../Models/ProccesOperation/Operation.tsx";
import OperationListComponent from "./OperationListComponents/OperationListComponent.tsx";
import {OperationTableComponent} from "./OperationTableComponent/OperationTableComponent.tsx";
import {CenteredDivRow} from "./OperationListComponents/CenteredDivRow.tsx";

export const SelectedProcces = ({ int }: { int: string }) =>{
    const [selectedProcces,setSelectedProcces]=useState<Procces|null>()
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
    const [view, setView] = useState(false);

    const click_view_table = (e: any) => {
        if(view)
            setView(false)
        else
            setView(true)
    }
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
                                selectedProcces.attachments.map(attachment => (
                                    <li key={attachment.id}>
                                        {attachment.attachmentData}
                                    </li>
                                ))
                            }
                        </div>
                    </CenteredDivRow>
                    <button className="styled-button"
                            title={view ? "Показать таблицу" : "Показать Список"} onClick={click_view_table}>
                        {view ? "Показать таблицу" : "Показать Список"}
                    </button>
                    {
                        view ?(
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
    margin:'5px',
    width: '50ch',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
    },
});

