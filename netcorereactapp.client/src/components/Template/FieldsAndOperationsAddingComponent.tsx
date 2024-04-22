import {CenteredDivColumn} from "../Home/CommonComponents/CenteredDivRow.tsx";
import { TextField} from "@mui/material";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {styled} from "@mui/system";
import {NewOperation} from "./NewOperation.tsx";
import {Procces} from "../../Models/ProccesOperation/Procces.tsx";
import {OperationList} from "./OperationList.tsx";
import '../../styles/FiledsCompoment.scss'
import axios from "axios";
import config from "../../config/config.json";
import ProccesFields from "./FiledSet/ProccesFields.tsx";

export const FieldsAndOperationsAddingComponent
    = forwardRef((props, ref) => {
    const [procces,setProcces]=useState<Procces>({
        caption:'',
        number:'',
        OrganizationCaption: '',
        EquipmentType: '',
        EquipmentModel: '',
        PartVolume: '',
        VolumeIncludingSupportingStructures: '',
        BuildingHeight: '',
        LayerThickness:'',
        AmountOfRequiredMaterialTakingIntoAccount: '',
        ShieldingGasVolume: '',
        PrintTime:'',
        LaborIntensity: '',
        AdditionallyInformation: '',
    })
    const [errors, setErrors] = useState({});
    useEffect(()=>{
            //console.log('FiledsCompoment useEffect\n',procces)
    }),[procces]
    const [base64String,setFileData]=useState()
    useEffect(() => {
        if (base64String) {
            //downloadFile(base64String, procces.caption+'.xlsx');
            props.onClose()
        }
    }, [base64String]);
    const downloadFile = (base64String: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        props.onClose()
    };
    const saveProcces=async()=>{
        console.log('',procces)
        // Проверяем, что все поля заполнены
        const allFieldsFilled = Object.values(procces).every(value => {
            // Проверяем, является ли значение строкой и, если да, обрезаем пробельные символы
            if (typeof value === 'string') {
                return value.trim() !== '';
            }
            // Если значение не является строкой, считаем его заполненным
            return true;
        });
        if (!allFieldsFilled) {
            // Если не все поля заполнены, устанавливаем сообщения об ошибке для каждого незаполненного поля
            const newErrors = {};
            for (const fieldName in procces) {
                if (!procces[fieldName].trim()) {
                    newErrors[fieldName] = 'Это поле обязательно для заполнения.';
                }
            }
            setErrors(newErrors);
            return; // Прерываем отправку данных
        }

        const tokenValue = localStorage.getItem("authToken");
        console.log('Complete procces data before send request :\n',procces)
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
                setFileData(response.data)
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

            setProcces(prevProcces => ({
                ...prevProcces,
                [name]: value
            }));
        }
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
            <ProccesFields/>
           {/* <CenteredDivRow
                sx={{
                    backgroundColor: 'darkgreen',
                    border: '2px solid ',
                    borderRadius: '25px',
                    padding: '20px'
                }}
            >
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

                            error={Boolean(errors.number)}
                            helperText={errors.number}
                        />
                        <StyledTextField
                            ref={inputRef}
                            id="outlined-helperText"
                            label="Наименование"
                            variant="outlined"
                            name="caption"
                            onChange={handleTextFieldChange}
                            autoFocus

                            error={Boolean(errors.caption)}
                            helperText={errors.caption}
                        />
                    </CenteredDivRow>
                    <IconButton onClick={toggleInfoVisibility} sx={{ ...buttonHover.iconButton }}>
                        {hidden ? <RemoveCircleTwoToneIcon style={{ fontSize: 50 }}/> :
                            <AddBoxSharpIcon style={{ fontSize: 50 }}/>}
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

                        error={Boolean(errors.material)}
                        helperText={errors.material}
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="КД"
                        variant="outlined"
                        name="kd"
                        onChange={handleTextFieldChange}
                        autoFocus

                        error={Boolean(errors.kd)}
                        helperText={errors.kd}
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

                        error={Boolean(errors.m3)}
                        helperText={errors.m3}
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="Профиль и размеры"
                        variant="outlined"
                        name="profile_size"
                        onChange={handleTextFieldChange}
                        autoFocus

                        error={Boolean(errors.profile_size)}
                        helperText={errors.profile_size}
                    />
                </CenteredDivColumn>
            </CenteredDivRow>*/}
            {hidden &&
                <NewOperation
                    hidden={toggleInfoVisibility}
                    addChildOperartion={addOperation}
                />
            }
            {procces && procces.operations &&
                <div className="oper_list">
                <OperationList procces={procces} setProcces={setProcces}/>
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

export const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: '5px',
    width: '50ch',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
        '&:focus': {
            color: 'white', // Изменяем цвет текста при фокусе
            borderRadius: '40px',
        },
    },
    '& .disabled': {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            borderColor: 'white',
            backgroundColor: 'white', // устанавливаем белый фон
            '& fieldset': {
                color: 'white',
                borderColor: 'white', // устанавливаем белый цвет границы
                backgroundColor: 'white',
            },
        },
        '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
            color: 'white', // устанавливаем белый цвет текста
            borderColor: 'white',
            backgroundColor: 'white',
        },
    },
}));