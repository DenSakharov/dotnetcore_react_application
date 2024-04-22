import {CenteredDivColumn, CenteredDivRow} from "../Home/CommonComponents/CenteredDivRow.tsx";
import {useEffect, useRef, useState} from "react";
import {StyledTextField} from "./FieldsAndOperationsAddingComponent.tsx";
import {FormControl, IconButton, InputLabel, keyframes, MenuItem, Select, Typography} from "@mui/material";
import axios from "axios";
import config from "../../config/config.json";
import PlaylistAddCheckTwoToneIcon from '@mui/icons-material/PlaylistAddCheckTwoTone';
import {Operation} from "../../Models/ProccesOperation/Operation.tsx";
import {buttonHover} from "../../styles/Annimations/Buttons/button_animations_hover.tsx";
import {selectStyle} from "../../styles/SingleComponents/Select/selectStyle.ts";

export const NewOperation=({hidden,addChildOperartion})=>{
    //const [operation,setOperation]=useState<Operation>()
    const [operation, setOperation] = useState({
        operation: {
            caption:'',
            number: '',
            laborCost: '',
            responsibleGroup: '',
            textOper:'',
        }
    });
    const [errors, setErrors] = useState({});
    useEffect(()=>{
        //console.log('NewOperation operation\n',operation)
    }),[operation]
    const inputRef = useRef(null);

    const [options, setOptions] = useState([]);
    const [selectedTemplateOperation, setSelectedTemplateOperation] = useState('');
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
                //console.log('fetchOptionsFromBackend\n',response.data)
                return response.data
            } else {
                console.error('requset failed')
            }
        } catch (e) {
            console.error("Before request \n", e)
        }
    };

    const [error, setError] = useState(false);
    const handleChangeSelect = (event) => {
        setSelectedTemplateOperation(event.target.value);
        //console.log('event.target.value\n',event.target.value)
        const capt= event.target.value.caption
        const equip= event.target.value.equipments
        const childsOperations= event.target.value.childsOperations
        const textOper= event.target.value.textOper

        if (event.target.value.error) {
            // Обработка ошибки: вывод сообщения об ошибке или другие действия
            console.error('Ошибка в выбранном значении:', event.target.value.error);
            // Остановка обновления состояния
            return;
        }
        setOperation(prevProcess => {

            // Создаем новый объект operation с обновленными полями
            const updatedOperation = {
                ...prevProcess.operation,
                // Устанавливаем новые значения для полей caption и equipments
                caption: capt,
                equipments: equip,
                childsOperations: childsOperations,
                textOper:textOper,
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
        // Валидация для поля "number"
        if (name === 'number' && !value.match(/^\d+$/)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Пожалуйста, введите число.'
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
            setOperation(prevState => ({
                ...prevState,
                operation: {
                    ...prevState?.operation,
                    [name]: value
                }
            }));
        }
    };

    const addBtn = () => {
        const oper = operation.operation;
        //console.log('', oper);
        const allFieldsFilled = Object.entries(oper).every(([fieldName, value]) => {
            // Проверяем, что значение не пустое, является строкой и не является массивом или объектом
            return (typeof value === 'string' && value.trim() !== '') || Array.isArray(value) || typeof value === 'object';
        });

        if (!allFieldsFilled) {
            // Если не все поля заполнены, устанавливаем сообщения об ошибке для каждого незаполненного поля
            const newErrors = {};
            for (const fieldName in oper) {
                if (typeof oper[fieldName] === 'string' && !oper[fieldName].trim() && fieldName !== 'equipments') {
                    newErrors[fieldName] = 'Это поле обязательно для заполнения.';
                }
            }
            setErrors(newErrors);
            console.error(errors)
            return; // Прерываем отправку данных
        }
        //console.log('addBtn\n', operation);
        addChildOperartion({ operation });
        hidden();
    };
    return(
        <CenteredDivRow>
            <IconButton onClick={addBtn} sx={{color: 'white'}}>
                <CenteredDivColumn
                    sx={{ ...buttonHover.centeredDivColumn }}
                >
                    <PlaylistAddCheckTwoToneIcon />
                    <Typography sx={{fontSize:13}}>Добавить</Typography>
                </CenteredDivColumn>
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

                error={Boolean(errors.number)}
                helperText={errors.number ? 'Поле обязательно для заполнения' : ''}
            />
            <FormControl sx={selectStyle}>
                <InputLabel id="select-label">Выберите что-нибудь</InputLabel>
                <Select
                    labelId="select-label"
                    id="select"
                    value={selectedTemplateOperation}
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

                error={Boolean(errors.laborCost)}
                helperText={errors.laborCost ? 'Поле обязательно для заполнения' : ''}
            />
            <StyledTextField
                ref={inputRef}
                id="outlined-helperText"
                label="Группа ответственных"
                variant="outlined"
                name="responsibleGroup"
                onChange={handleTextFieldChange}
                autoFocus

                error={Boolean(errors.responsibleGroup)}
                helperText={errors.responsibleGroup ? 'Поле обязательно для заполнения' : ''}
            />
        </CenteredDivRow>
    )
}