import React, {useEffect, useRef, useState} from "react";
import {Procces} from "../../../../../Models/ProccesOperation/Procces.tsx";
import axios from "axios";
import config from "../../../../../config/config.json";
import {CircularProgress, Collapse, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import { styled } from '@mui/system';
import {Operation} from "../../../../../Models/ProccesOperation/Operation.tsx";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
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
                console.log(response.data)
                setSelectedProcces(response.data);
            }
        }
        catch (e){
            console.error("Before request \n",e)
        }
    }

    const StyledTextField = styled(TextField)({
        width: '50ch',
        '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
            color: 'white',
        },
    });
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
                            { selectedProcces.attachments &&
                                selectedProcces.attachments.map(attachment => (
                                    <li key={attachment.id} >
                                        {attachment.attachmentData}
                                    </li>
                                ))
                            }
                        </div>
                    </CenteredDivRow>
                    {operations!==undefined &&operations!==null &&(
                    <OperationList operations={operations}/>
                    )}
                </div>
            )}
        </>
    )
}
interface Props {
    operations: Operation[];
}

const OperationList = ({ operations }) => {
    return (
        <List>
            {/* Отображение каждой операции в виде списка */}
            {operations.map(operation => (
                <OperationListItem key={operation.id} operation={operation} />
            ))}
        </List>
    );
};
const OperationListItem = ({ operation }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem button onClick={handleClick}>
                {/*<ListItemText primary={`Номер : ${operation.id}`} />*/}
                <ListItemText primary={` ${operation.caption}`}/>
                {/* <ListItemText primary={`Parent Operation ID: ${operation.parentOperationId}`} />*/}
                <div>
                    {operation.attachments &&
                        operation.attachments.map(attachment => (
                            <li key={attachment.id}>
                                {attachment.attachmentData}
                            </li>
                        ))
                    }
                </div>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {/* Рекурсивный вызов OperationListItem для вложенных операций */}
                    {operation.childsOperations &&
                        operation.childsOperations.map(childOperation => (
                            <OperationListItem key={childOperation.id} operation={childOperation}/>
                        ))
                    }
                </List>
            </Collapse>
        </>
    );
};
export const CenteredDivRow = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width:'100%',
});
export const CenteredDivColumn = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width:'100%',
});