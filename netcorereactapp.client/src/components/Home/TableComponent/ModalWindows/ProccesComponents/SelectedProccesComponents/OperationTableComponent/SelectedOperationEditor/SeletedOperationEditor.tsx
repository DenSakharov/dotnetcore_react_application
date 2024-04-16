import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {
    Button,
    Grid, IconButton,
    List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {Operation} from "../../../../../../../../Models/ProccesOperation/Operation.tsx";
import config from '../../../../../../../../config/config.json'
import {CenteredDivColumn, CenteredDivRow} from "../../../../../../CommonComponents/CenteredDivRow.tsx";
import {StyledTextField} from "../../SelectedProcces.tsx";
import {RenderAttachmentsComponent} from "../../../../../../Services/AttachmentService.tsx";
import SelectingFilesComponents from "../../../../../../CommonComponents/SelectingFilesComponents.tsx";
import ConstructionSharpIcon from '@mui/icons-material/ConstructionSharp';
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddSharpIcon from '@mui/icons-material/LibraryAddSharp';
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";

export const SeletedOperationEditor = forwardRef((props, ref) => {
    const [oper, setOper] = useState<Operation>()
    useEffect(() => {
        //console.info('SeletedOperationEditor operation data :\n',props.operation)
        setOper(props.operation)
    }, [props.operation]);
    useEffect(() => {
        //console.log('oper now\n',oper)
    }, [oper]);
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setOper(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
    };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const addAttachments = async (files) => {
        //console.log("Files after added :\n",files)
        setSelectedFiles(files);
    }
    const saveEdtingOper = async () => {
        //console.log("test")
        try {
            await saveOperation(); // Ждем завершения выполнения функции saveOperation
            props.notif()
            props.onClose(); // После успешного завершения вызываем onClose
        } catch (error) {
            console.error("Error while saving operation:", error);
            // Можно добавить обработку ошибок здесь
        }
    };
    useImperativeHandle(ref, () => ({
        saveEdtingOper: () => {
            saveEdtingOper();
        },
    }));
    const saveOperation = async () => {
        try {
            const tokenValue = localStorage.getItem("authToken");
            const formData = new FormData();
            selectedFiles.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
            //console.info('Перед отправкой запроса о сохраненнии изменения\n',oper)
            formData.append("operation", JSON.stringify(oper))
            const response = await axios.put(
                `${config.apiUrl}/operation/${oper.id}`,
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
    const [visibleEquipmentList, setVisibleEquipmentList] = useState(false);
    const toggleVisibleEquipmentList = () => {
        setVisibleEquipmentList(!visibleEquipmentList);
    };
    const [options, setOptions] = useState([]);
    const [selectEquipment, setSelectEquipment] = useState('');
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
            const response = await axios.get(`${config.apiUrl}/supporting/template_equipments`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            if (response) {
                return response.data
            } else {
                console.error('requset failed')
            }
        } catch (e) {
            console.error("Before request \n", e)
        }
    };
    const handleChangeSelect = (event) => {
        const capt = event.target.value
        setSelectEquipment(event.target.value)

    };
    const addEquipment=async ()=>{
        try {
            const tokenValue = localStorage.getItem("authToken");
            //console.log('',selectEquipment.caption)

            const caption = selectEquipment.caption
            const response=await axios.post(`${config.apiUrl}/equipment/${oper.id}`,
                {caption:caption}, {
                headers: {
                    Authorization: `Bearer ${tokenValue}`,
                    'Content-Type': 'application/json',
                }
            })
            if (response.status == 200) {
                setOper(prevOper => {
                    if (prevOper) {
                        return {
                            ...prevOper,
                            equipments: [...prevOper.equipments, selectEquipment] // Добавляем новый элемент в массив equipments
                        };
                    } else {
                        return prevOper; // Возвращаем предыдущее состояние, если prevOper равен undefined или null
                    }
                });
            } else {
                console.error('request failed')
            }
        }catch (e) {
            console.error("Before request \n", e)
        }
        toggleVisibleEquipmentList()
    }
    const removeEquipment =async (equipmentToRemove) => {
        if(equipmentToRemove.id ){
        try {
            const tokenValue = localStorage.getItem("authToken");
            //console.log('Request sending in procces')
            const response = await axios.delete(`${config.apiUrl}/equipment/${equipmentToRemove.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                    }
                })
            if (response.status==200) {
                setOper(prevOper => {
                    if (prevOper) {
                        const updatedEquipments = prevOper.equipments.filter(equipment => equipment !== equipmentToRemove);
                        return {
                            ...prevOper,
                            equipments: updatedEquipments
                        };
                    } else {
                        return prevOper; // Возвращаем предыдущее состояние, если prevOper равен undefined или null
                    }
                })
            } else {
                console.error('request failed')
            }
        } catch (e) {
            console.error("Before request \n", e)
        }
        }
        else{
        setOper(prevOper => {
            if (prevOper) {
                const updatedEquipments = prevOper.equipments.filter(equipment => equipment !== equipmentToRemove);
                return {
                    ...prevOper,
                    equipments: updatedEquipments
                };
            } else {
                return prevOper; // Возвращаем предыдущее состояние, если prevOper равен undefined или null
            }
        })
        }
    };

    return (
        <div>
            {oper
                &&
                <CenteredDivColumn
                    sx={{}}
                >
                    <CenteredDivColumn
                        sx={{
                            backgroundColor: 'green',
                            border: '2px solid ',
                            borderRadius: '25px',
                            padding: '10px',
                        }}
                    >
                        <CenteredDivRow>
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Номер операции"
                                defaultValue={oper.number}
                                variant="outlined"
                                name="number"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Название операции"
                                defaultValue={oper.caption}
                                variant="outlined"
                                name="caption"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />

                        </CenteredDivRow>
                        <CenteredDivRow>
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Группа ответственных"
                                defaultValue={oper.responsibleGroup}
                                variant="outlined"
                                name="responsibleGroup"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                            <StyledTextField
                                ref={inputRef}
                                id="outlined-helperText"
                                label="Трудоемкость"
                                defaultValue={oper.laborCost}
                                variant="outlined"
                                name="laborCost"
                                onChange={handleTextFieldChange}
                                autoFocus
                            />
                        </CenteredDivRow>
                    </CenteredDivColumn>
                    <CenteredDivColumn
                        sx={{
                            backgroundColor: 'green',
                            border: '2px solid #000',
                            borderRadius: '25px',
                            padding: '10px',
                            margin: '10px',
                            color: 'white'
                        }}
                    >
                            <Typography
                                sx={{mt: 1, mb: 1}} variant="h6" component="div">
                                Оборудование :
                            </Typography>
                            <IconButton
                                onClick={toggleVisibleEquipmentList}
                                sx={{
                                    color: 'white'
                                }}
                            >
                                {visibleEquipmentList ? <RemoveSharpIcon/> : <AddSharpIcon/>}
                            </IconButton>
                            {visibleEquipmentList &&
                                <CenteredDivRow>
                                    <IconButton
                                        onClick={addEquipment}
                                        sx={{
                                            color: 'white',
                                        }}
                                    >
                                        <LibraryAddSharpIcon/>
                                    </IconButton>
                                    <Select
                                        sx={{
                                            color: 'white',
                                            maxWidth:'400px'
                                        }}
                                        labelId="select-label"
                                        id="select"
                                        value={selectEquipment}
                                        onChange={handleChangeSelect}
                                        name="operation"
                                    >
                                        {options && options.map((equipment, index) => (
                                            <MenuItem key={index} value={equipment}>{equipment.caption}</MenuItem>
                                        ))}
                                    </Select>
                                </CenteredDivRow>
                            }
                        {oper.equipments.map(equipment => (
                            <ListItem key={equipment.id}>
                                <ListItemIcon>
                                    <IconButton>
                                        <ConstructionSharpIcon/>
                                    </IconButton>
                                </ListItemIcon>
                                <ListItemText
                                    primary={equipment.caption}
                                />
                                <ListItemIcon>
                                    <IconButton onClick={() => removeEquipment(equipment)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </CenteredDivColumn>
                    <CenteredDivColumn
                        sx={{
                            backgroundColor: 'green',
                            border: '2px solid #000',
                            borderRadius: '25px',
                            padding: '10px',
                            margin: '10px',
                            color: 'white'
                        }}
                    >
                        <TextField
                            label="Текст операции"
                            multiline
                            maxRows={10}
                            variant="standard"
                            name="textOper"
                            defaultValue={oper.textOper}
                            onChange={handleTextFieldChange}
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    color: 'white', // Устанавливаем белый цвет текста внутри поля
                                },
                                '& .MuiFormLabel-root': {
                                    color: 'white', // Устанавливаем белый цвет текста метки
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white', // Устанавливаем белый цвет текста метки при фокусе
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'white', // Устанавливаем белый цвет линии под текстовым полем
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottomColor: 'white', // Устанавливаем белый цвет линии под текстовым полем при наведении
                                },
                            }}
                        />
                    </CenteredDivColumn>
                    <CenteredDivColumn
                        sx={{
                            backgroundColor: 'green',
                            border: '2px solid #000',
                            borderRadius: '25px',
                            padding: '10px',
                            margin: '10px',
                            color: 'white'
                        }}
                    >
                        <Grid item xs={1} md={1}>
                            <Typography sx={{mt: 1, mb: 1}} variant="h6" component="div">
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
                                <RenderAttachmentsComponent
                                    attachments={oper.attachments}
                                    send_request={props.onClose}
                                />
                            }
                        </Grid>

                        <SelectingFilesComponents onSelectedFilesChange={addAttachments}/>
                    </CenteredDivColumn>

                </CenteredDivColumn>
            }
        </div>
    )
})
