import {CenteredDivRow} from "../Home/CommonComponents/CenteredDivRow.tsx";
import {useEffect, useRef, useState} from "react";
import {StyledTextField} from "./FiledsCompoment.tsx";
import {FormControl, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import axios from "axios";
import config from "../../config/config.json";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {Operation} from "../../Models/ProccesOperation/Operation.tsx";

export const NewOperation=({hidden,addChildOperartion})=>{
    const [operation,setOperation]=useState<Operation>()
    useEffect(()=>{
        //console.log('NewOperation operation\n',operation)
    }),[operation]
    const inputRef = useRef(null);

    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    useEffect(() => {
        // Загрузите список опций из бэкенда
        fetchOptionsFromBackend()
            .then((optionsData) => {
                setOptions(optionsData);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке опций:', error);
            });
    }, []);

    const fetchOptionsFromBackend = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            //console.log('Request sending in procces')
            const response = await axios.get(//`${config.apiUrl}/procces/all`
                `${config.apiUrl}/supporting/template_operations`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            if (response) {
                //console.log(response.data)
                return response.data
            } else {
                console.error('requset failed')
            }
        } catch (e) {
            console.error("Before request \n", e)
        }
    };
    const handleChangeSelect = (event) => {
        setValue(event.target.value);
        //console.log('event.target.value\n',event.target.value)
        const capt= event.target.value.caption
        const equip= event.target.value.equipments
        //console.log('equip',equip)
        setOperation(prevProcess => {

            // Создаем новый объект operation с обновленными полями
            const updatedOperation = {
                ...prevProcess.operation,
                // Устанавливаем новые значения для полей caption и equipments
                caption: capt,
                equipments: equip
            };
            // Возвращаем обновленный объект prevProcess с обновленным operation
            return {
                ...prevProcess,
                operation: updatedOperation
            };
        })
    };

    const handleTextFieldChange = (event) => {
        const { name, value } = event.target;
        setOperation(prevState => ({
            ...prevState,
            operation: {
                ...prevState?.operation, // Добавлена проверка на существование operation
                [name]: value
            }
        }));
    };

    const addBtn=()=>{
        //console.log('addBtn\n',operation)
        addChildOperartion({operation})
        //hidden();
    }
    return(
        <CenteredDivRow>
            <IconButton onClick={addBtn} sx={{color: 'white'}}>
                 <AddSharpIcon/>
            </IconButton>
            <StyledTextField
                ref={inputRef}
                id="outlined-helperText"
                label="№ операции"
                variant="outlined"
                name="number"
                onChange={handleTextFieldChange}
                autoFocus
                sx={{width: '10ch',}}
            />
            <FormControl>
                <InputLabel id="select-label">Выберите что-нибудь</InputLabel>
                <Select
                    labelId="select-label"
                    id="select"
                    value={value}
                    onChange={handleChangeSelect}
                    name="operation"
                >
                   {/* <MenuItem value="">
                        <em>Ничего не выбрано</em>
                    </MenuItem>*/}
                    {options.map((templateOper,index) => (
                        <MenuItem key={index} value={templateOper}>{templateOper.caption}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <StyledTextField
                ref={inputRef}
                id="outlined-helperText"
                label="Трудозатраты"
                variant="outlined"
                name="laborCost"
                onChange={handleTextFieldChange}
                autoFocus
            />
            <StyledTextField
                ref={inputRef}
                id="outlined-helperText"
                label="Группа ответственных"
                variant="outlined"
                name="responsibleGroup"
                onChange={handleTextFieldChange}
                autoFocus
            />
        </CenteredDivRow>
    )
}