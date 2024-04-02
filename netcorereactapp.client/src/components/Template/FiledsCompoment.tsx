import {CenteredDivColumn, CenteredDivRow} from "../Home/CommonComponents/CenteredDivRow.tsx";
import {IconButton, TextField} from "@mui/material";

import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {styled} from "@mui/system";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {NewOperation} from "./NewOperation.tsx";
import {Procces} from "../../Models/ProccesOperation/Procces.tsx";
import {OperationList} from "./OperationList.tsx";
import '../../styles/FiledsCompoment.scss'
import axios from "axios";
import config from "../../config/config.json";
import {addingAttachmentsToProcces} from "../Home/Services/AttachmentService.tsx";
export const FiledsCompoment = forwardRef((props, ref) => {
    const [procces,setProcces]=useState<Procces>({
        caption:'',
    })
    useEffect(()=>{
            //console.log('FiledsCompoment useEffect\n',procces)
    }),[procces]
    const saveProcces=async()=>{
        const tokenValue = localStorage.getItem("authToken");
        console.log(procces)
        try {
            const response = await axios.post(
                `${config.apiUrl}/procces/create`,
                procces, // Передаем отредактированный объект
                {
                    headers: {
                        //'Content-Type': 'application/json', // Устанавливаем заголовок для JSON
                        Authorization: `Bearer ${tokenValue}`,
                    },
                }
            );
            if(response.status==200)
            {
                console.log(response.data)
                //props.onClose()
            }
        } catch (error) {
            console.error("Error while confirming edited operation:", error);
            // Обработка ошибки
        }

    }
    useImperativeHandle(ref, () => ({
        saveProcces: () => {
            saveProcces();
        },
    }));
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setProcces(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
    };

    const [hidden, setHidden] = useState(false);
    const toggleInfoVisibility = () => {
        setHidden(!hidden);
    };
    const addOperation = ({ operation }) => {
        const localOper=operation.operation
        setProcces(prevState => {
            // Если operations еще не инициализирован, создаем новый массив и добавляем операцию
            if (!prevState.operations) {
                return {
                    ...prevState,
                    operations: [localOper]
                };
            } else {
                // Если operations уже инициализирован, добавляем новую операцию к существующему массиву
                return {
                    ...prevState,
                    operations: [...prevState.operations, localOper]
                };
            }
        });
    };
    return (
        <CenteredDivColumn>
            <CenteredDivRow>
                <CenteredDivColumn>
                    <CenteredDivRow>
                        <StyledTextField
                            ref={inputRef}
                            id="outlined-helperText"
                            label="№"
                            variant="outlined"
                            name="number"
                            onChange={handleTextFieldChange}
                            autoFocus
                            sx={{width: '10ch',}}
                        />
                        <StyledTextField
                            ref={inputRef}
                            id="outlined-helperText"
                            label="Наименование"
                            variant="outlined"
                            name="caption"
                            onChange={handleTextFieldChange}
                            autoFocus
                        />
                    </CenteredDivRow>
                    <IconButton onClick={toggleInfoVisibility} sx={{color: 'white'}}>
                        {hidden ? <RemoveSharpIcon/> : <AddSharpIcon/>}
                    </IconButton>
                </CenteredDivColumn>
                <CenteredDivColumn>
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="Материал"
                        variant="outlined"
                        name="material"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="КД"
                        variant="outlined"
                        name="kd"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                </CenteredDivColumn>
                <CenteredDivColumn>
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="М3"
                        variant="outlined"
                        name="m3"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="Профиль и размеры"
                        variant="outlined"
                        name="profile_size"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                </CenteredDivColumn>
            </CenteredDivRow>
            {hidden &&
                <NewOperation
                    hidden={toggleInfoVisibility}
                    addChildOperartion={addOperation}
                />
            }
            {procces && procces.operations &&
                <div className="oper_list">
                <OperationList procces={procces}/>
                </div>
            }
           {/* {procces && procces.operations && procces.operations.map((oper, index) => (
                <Grid key={index}>
                    <Card elevation={3}>
                        <CardHeader title={`Операция ${index + 1}`} />
                        <CardContent>
                            <Typography variant="body1">Номер операции: {oper.number}</Typography>
                            <Typography variant="body1">Трудозатраты: {oper.laborCost}</Typography>
                            <Typography variant="body1">Группа ответственности: {oper.responsibleGroup}</Typography>
                            <Typography variant="body1">Название: {oper.caption}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}*/}
        </CenteredDivColumn>
    )
})

export const StyledTextField = styled(TextField)({
    margin: '5px',
    width: '50ch',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
        '& .MuiInputBase-input:focus, & .MuiInputBase-multiline:focus': {
            color: 'black', // Измените цвет текста при выделении
        },
    },
});