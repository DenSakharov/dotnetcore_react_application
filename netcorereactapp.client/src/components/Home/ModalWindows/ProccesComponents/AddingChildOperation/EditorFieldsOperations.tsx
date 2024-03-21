import {Button, Card, CardContent, IconButton, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {Operation} from "../../../../../Models/ProccesOperation/Operation.tsx";
import {styled} from "@mui/system";
import axios from "axios";
import config from "../../../../../config/config.json";

export const EditorFieldsOperations=(operation, onClose: ()=>void)=>{
    const [parentOperation,setParentOperation]=useState<Operation>()
    useEffect(() => {
        //console.log(operation)
        setParentOperation(operation.operation)
    }, [operation]);
    useEffect(() => {
        //console.log(parentOperation)
    }, [parentOperation]);
    const[captionChildOperartion,setCaptionChildOperartion]=useState()
    const handleCaptionChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
        const captionChildOPeration=e.target.value
        setCaptionChildOperartion(captionChildOPeration)
        /*setParentOperation(prevState => ({
            ...prevState,
            caption: e.target.value
        }));*/
    };
    const saveChangesFiledsOperation=async()=>{
        const tokenValue = localStorage.getItem("authToken");
        //console.log(" - " + fileId)
        const response =
            await axios.post(`${config.apiUrl}/operation/${parentOperation?.id}/operation`,
                captionChildOperartion,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenValue}`,
                    }
                });
        if(response?.status==200){
            console.log(onClose)
            onClose()
        }
    }

    return (
        <div>
            <CenteredDivColumnLocal>
                {parentOperation &&
                    <Card>
                        <CardContent>
                            <TextField
                                fullWidth
                                label="Название родительской операции"
                                defaultValue={parentOperation.caption}
                                disabled
                                variant="standard"
                                margin="normal"
                            />
                        </CardContent>
                    </Card>
                }
                <Card>
                    <CardContent>
                        <TextField
                            label="Название дочерней операции для добалвения"
                            /* value={parentOperation?.caption}*/
                            onChange={handleCaptionChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={saveChangesFiledsOperation}>
                            Добавить объект
                        </Button>
                    </CardContent>
                </Card>
            </CenteredDivColumnLocal>
            <IconButton onClick={saveChangesFiledsOperation}/>
        </div>
    )
}
export const CenteredDivColumnLocal = styled('div')({
    display: 'grid',
    margin:'10px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    gap: '10px',
});