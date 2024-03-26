import  {useEffect, useRef, useState} from "react";
import {
    Button,
    Grid,
    List,
    Typography
} from "@mui/material";
import axios from "axios";
import {Operation} from "../../../../../../../../Models/ProccesOperation/Operation.tsx";
import config from '../../../../../../../../config/config.json'
import {CenteredDivColumn} from "../../../../../../CommonComponents/CenteredDivRow.tsx";
import {StyledTextField} from "../../SelectedProcces.tsx";
import {RenderAttachmentsComponent, renderAttachments} from "../../../../../../Services/AttachmentService.tsx";
import SelectingFilesComponents from "../../../../../../CommonComponents/SelectingFilesComponents.tsx";

export const SeletedOperationEditor=({operation,onClose,notif})=>{
    const [oper,setOper]=useState<Operation>()
    useEffect(() => {
        //console.info(operation)
        setOper(operation)
    }, [operation]);
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const { name, value } = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setOper(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
    };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const addAttachments=async (files)=>{
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    }
    const saveEdtingOper = async (e) => {
        try {
            await saveOperation(); // Ждем завершения выполнения функции saveOperation
            notif()
            onClose(); // После успешного завершения вызываем onClose
        } catch (error) {
            console.error("Error while saving operation:", error);
            // Можно добавить обработку ошибок здесь
        }
    };
    const saveOperation = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const formData = new FormData();
             selectedFiles.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
            //console.info(oper)
            formData.append("operation", JSON.stringify(oper))
            const response = await axios.put(
                `${config.apiUrl}/operation/${operation.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            //console.log(response.status)
            if (response.status === 200) {
            }
        } catch (error) {
            console.error("Error during request:", error);
            throw error; // Передаем ошибку дальше, чтобы ее обработать в вызывающем коде
        }
    };
    return(
        <div>
            {oper
                &&
                <CenteredDivColumn>
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="Название процесса"
                        defaultValue={oper.caption}
                        helperText="Отредактировать название процесса"
                        variant="outlined"
                        name="caption"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                    <Grid item xs={1} md={1}>
                        <Typography sx={{ mt: 1, mb: 1 }} variant="h6" component="div">
                           Вложения операции :
                        </Typography>
                           {/* <List>
                                {renderAttachments (oper.attachments)}
                            </List>*/}
                      {/*  {oper.attachments
                        &&
                            renderAttachments (oper.attachments)
                        }*/}
                        {oper.attachments &&
                            <RenderAttachmentsComponent attachments={oper.attachments}/>
                        }
                    </Grid>
                    <SelectingFilesComponents onSelectedFilesChange={addAttachments}/>
                    <Button onClick={saveEdtingOper}>Сохранить</Button>
                </CenteredDivColumn>
            }
        </div>
    )
}
