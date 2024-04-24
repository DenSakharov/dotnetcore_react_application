import {Box, Tabs, TextField} from "@mui/material";
import {SyntheticEvent, useEffect, useRef, useState} from "react";
import DetailForm from "./DetailForm.tsx";
import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import TabPanel, {StyledTab, StyledTextFieldLocal} from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import MaterialForm from "./MaterialForm.tsx";
import {ProccesMobXStore} from "../../../store/ProccesMobXStore.ts";
import {errorsStore} from "../../../store/ErrorsMobXStore.ts";
import { observer } from 'mobx-react';

export default function ProccesFields({setProccesLocal}){
    const [procces, setProcces] = useState<Procces>(ProccesMobXStore.procces);

    useEffect(() => {
        //console.log('Changing : ',procces);
        const isAllFieldsValid = Object.values(procces).every(value => value !== '' && value !== 0);

        if (isAllFieldsValid) {

            ProccesMobXStore.setErrors({});
        } else {
            // Создание объекта с ошибками
            const errors = {};
            // Проверка каждого поля и установка соответствующей ошибки
            Object.entries(procces).forEach(([key, value]) => {
                if (value === '' || value === 0) {
                    errors[key] = 'Значение не может быть пустым или равно 0';
                }
            });
            // Установка ошибок в MobX store
            ProccesMobXStore.setErrors(errors);
        }
    }, [procces]);
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    //#region объявление ссылок для text input
    const numberRef = useRef(null);
    const organizationCaptionRef = useRef(null);
    const equipmentTypeRef = useRef(null);
    const equipmentModelRef = useRef(null);
    const partVolumeRef = useRef(null);
    const volumeIncludingSupportingStructuresRef = useRef(null);
    const buildingHeightRef = useRef(null);
    const layerThicknessRef = useRef(null);
    const amountOfRequiredMaterialRef = useRef(null);
    const shieldingGasVolumeRef = useRef(null);
    const printTimeRef = useRef(null);
    const laborIntensityRef = useRef(null);
    const additionallyInformationRef = useRef(null);
    //#endregion

    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        // Валидация для поля "number"
        if (value.trim() === '') {
            errorsStore.setFieldError(name, 'Это поле обязательно для заполнения.');
        }
        if (name === 'number' && !value.match(/^\d+$/)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Пожалуйста, введите число.'
            }));
            errorsStore.setFieldError(name, 'Пожалуйста, введите число.');
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
            errorsStore.setFieldError(name, null);

            setProcces(prevProcces => ({
                ...prevProcces,
                [name]: value
            }));
            // Создаем новый объект процесса с обновленным значением поля
            const newProcces = {
                ...ProccesMobXStore.procces,
                [name]: value
            };

            // Устанавливаем новый объект процесса с помощью setProcces
            ProccesMobXStore.setProcces(newProcces);
        }
    };

    return(
        <Box
            sx={{ flexGrow: 1, display: 'flex',height: '400px',width:'100' }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{
                    color:'white',
                    borderRight: 1,
                    borderColor: 'yellowgreen',
                    width: '150px',
                    '& .MuiTab-root': {
                        transition: 'background-color 0.3s', // добавляем анимацию при изменении фона вкладки
                        '&:focus': {
                            color: 'yellowgreen', // меняем фон при активации вкладки
                        },
                    },
            }}
            >
                <StyledTab
                    label="Название"
                />
                <StyledTab label="Информация об используемом оборудовании" />
                <StyledTab label="Спецификация платформы построения" />
                <StyledTab label="Материал" />
                <StyledTab label="Размеры параметров построения" />
                <StyledTab label="Характеристики печати" />
                <StyledTab label="Доплнительная информация" />
            </Tabs>
            <TabPanel value={value} index={0}>
                    <StyledTextFieldLocal
                        ref={numberRef}
                        id="outlined-helperText"
                        label="№"
                        variant="outlined"
                        name="number"
                        onChange={handleTextFieldChange}
                        autoFocus
                        sx={{width: '10ch',}}

                        defaultValue={ProccesMobXStore.procces.number}

                        error={Boolean(ProccesMobXStore.errors.number)}
                        helperText={ProccesMobXStore.errors.number}
                    />
                    <StyledTextFieldLocal
                        ref={organizationCaptionRef}
                        id="outlined-helperText"
                        label="Наименование организации"
                        variant="outlined"
                        name="OrganizationCaption"
                        onChange={handleTextFieldChange}
                        autoFocus
                        sx={{width: '50ch',}}

                        defaultValue={ProccesMobXStore.procces.OrganizationCaption}

                        error={Boolean(ProccesMobXStore.errors.OrganizationCaption)}
                        helperText={ProccesMobXStore.errors.OrganizationCaption}
                    />
            </TabPanel>
            <TabPanel value={value} index={1}>
                    <StyledTextFieldLocal
                        ref={equipmentTypeRef}
                        id="outlined-helperText"
                        label="Тип оборудования"
                        variant="outlined"
                        name="EquipmentType"
                        onChange={handleTextFieldChange}
                        autoFocus
                        sx={{width: '50ch',}}

                        defaultValue={ProccesMobXStore.procces.EquipmentType}

                        error={Boolean(ProccesMobXStore.errors.EquipmentType)}
                        helperText={ProccesMobXStore.errors.EquipmentType}

                    />
                    <StyledTextFieldLocal
                        ref={equipmentModelRef}
                        id="outlined-helperText"
                        label="Модель оборудования"
                        variant="outlined"
                        name="EquipmentModel"
                        onChange={handleTextFieldChange}
                        autoFocus
                        sx={{width: '50ch',}}

                        defaultValue={ProccesMobXStore.procces.EquipmentModel}

                        error={Boolean(ProccesMobXStore.errors.EquipmentModel)}
                        helperText={ProccesMobXStore.errors.EquipmentModel}
                    />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <StyledTextFieldLocal
                    ref={partVolumeRef}
                    id="outlined-helperText"
                    label="Наименование деталей (название процесса)"
                    variant="outlined"
                    name="caption"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.caption}

                    error={Boolean(ProccesMobXStore.errors.caption)}
                    helperText={ProccesMobXStore.errors.caption}
                />
                <DetailForm detailArray={procces.details}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <MaterialForm materialInputArray={procces.materials}/>
            </TabPanel>
            <TabPanel value={value} index={4}>
                <StyledTextFieldLocal
                    ref={partVolumeRef}
                    id="outlined-helperText"
                    label="Объем детали"
                    variant="outlined"
                    name="PartVolume"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.PartVolume}

                    error={Boolean(ProccesMobXStore.errors.PartVolume)}
                    helperText={ProccesMobXStore.errors.PartVolume}
                />
                <StyledTextFieldLocal
                    ref={volumeIncludingSupportingStructuresRef}
                    id="outlined-helperText"
                    label="Объем с учетом поддерживающих структур"
                    variant="outlined"
                    name="VolumeIncludingSupportingStructures"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.VolumeIncludingSupportingStructures}

                    error={Boolean(ProccesMobXStore.errors.VolumeIncludingSupportingStructures)}
                    helperText={ProccesMobXStore.errors.VolumeIncludingSupportingStructures}
                />
                <StyledTextFieldLocal
                    ref={buildingHeightRef}
                    id="outlined-helperText"
                    label="Высота построения"
                    variant="outlined"
                    name="BuildingHeight"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.BuildingHeight}

                    error={Boolean(ProccesMobXStore.errors.BuildingHeight)}
                    helperText={ProccesMobXStore.errors.BuildingHeight}
                />
                <StyledTextFieldLocal
                    ref={layerThicknessRef}
                    id="outlined-helperText"
                    label="Толщина слоя"
                    variant="outlined"
                    name="LayerThickness"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.LayerThickness}

                    error={Boolean(ProccesMobXStore.errors.LayerThickness)}
                    helperText={ProccesMobXStore.errors.LayerThickness}
                />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <StyledTextFieldLocal
                    ref={amountOfRequiredMaterialRef}
                    id="outlined-helperText"
                    label="Количество необходимого материала с учетом КИМ"
                    variant="outlined"
                    name="AmountOfRequiredMaterialTakingIntoAccount"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.AmountOfRequiredMaterialTakingIntoAccount}

                    error={Boolean(ProccesMobXStore.errors.AmountOfRequiredMaterialTakingIntoAccount)}
                    helperText={ProccesMobXStore.errors.AmountOfRequiredMaterialTakingIntoAccount}
                />
                <StyledTextFieldLocal
                    ref={shieldingGasVolumeRef}
                    id="outlined-helperText"
                    label="Объем зщитного газа"
                    variant="outlined"
                    name="VolumeIncludingSupportingStructures"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.ShieldingGasVolume}

                    error={Boolean(ProccesMobXStore.errors.ShieldingGasVolume)}
                    helperText={ProccesMobXStore.errors.ShieldingGasVolume}
                />
                <StyledTextFieldLocal
                    ref={printTimeRef}
                    id="outlined-helperText"
                    label="Время печати"
                    variant="outlined"
                    name="PrintTime"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.PrintTime}

                    error={Boolean(ProccesMobXStore.errors.PrintTime)}
                    helperText={ProccesMobXStore.errors.PrintTime}
                />
                <StyledTextFieldLocal
                    ref={laborIntensityRef}
                    id="outlined-helperText"
                    label="Трудоемкость"
                    variant="outlined"
                    name="LaborIntensity"
                    onChange={handleTextFieldChange}
                    autoFocus
                    sx={{
                        width: '50ch',
                        '& .MuiInputLabel-root': {
                            fontSize: '15px',
                        },
                    }}

                    defaultValue={ProccesMobXStore.procces.LaborIntensity}

                    error={Boolean(ProccesMobXStore.errors.LaborIntensity)}
                    helperText={ProccesMobXStore.errors.LaborIntensity}
                />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <TextField
                    ref={additionallyInformationRef}
                    label="Дополнительная информация"
                    multiline
                    maxRows={10}
                    variant="standard"
                    name="AdditionallyInformation"
                    onChange={handleTextFieldChange}
                    sx={{
                        width: '500px',
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

                    defaultValue={ProccesMobXStore.procces.AdditionallyInformation}

                    error={Boolean(ProccesMobXStore.errors.AdditionallyInformation)}
                    helperText={ProccesMobXStore.errors.AdditionallyInformation}
                />
            </TabPanel>
        </Box>
    )
}
