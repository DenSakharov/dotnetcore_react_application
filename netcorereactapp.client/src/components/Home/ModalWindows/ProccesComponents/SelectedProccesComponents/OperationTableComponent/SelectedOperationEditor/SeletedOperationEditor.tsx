import {Operation} from "../../../../../../../Models/ProccesOperation/Operation.tsx";
import React, {useEffect, useRef, useState} from "react";
import {StyledTextField} from "../../SelectedProcces.tsx";
import {CenteredDivColumn} from "../../OperationListComponents/CenteredDivRow.tsx";
import {Button, IconButton, Snackbar} from "@mui/material";
import axios from "axios";
import config from "../../../../../../../config/config.json";
import { Notifications} from "../../../../../../UniversalComponents/Notifications/Notifications.tsx";
export const SeletedOperationEditor=({operation,onClose,notif})=>{
    let [oper,setOper]=useState<Operation>()
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
            /* selectedFiles.forEach((file, index) => {
                formData.append(`file${index}`, file);
            }); */
            console.info(oper)
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
                    <Button onClick={saveEdtingOper}>Сохранить</Button>
                </CenteredDivColumn>
            }
        </div>
    )
}