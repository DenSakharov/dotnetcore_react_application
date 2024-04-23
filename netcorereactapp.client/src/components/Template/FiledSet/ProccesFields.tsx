import {Box, Tabs, TextField} from "@mui/material";
import {SyntheticEvent, useRef, useState} from "react";
import DetailForm from "./DetailForm.tsx";
import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import TabPanel, {StyledTab, StyledTextFieldLocal} from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import a11yProps from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import MaterialForm from "./MaterialForm.tsx";

export default function ProccesFields({setProccesLocal}){
    const [procces,setProcces]=useState<Procces>({
        caption:'',
        number:'',
        m3 : '',
        kd : '',
        profile_size: '',
        details:[],
        materials:[],
    })
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
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
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
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
            setProccesLocal(procces)
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

                        error={Boolean(errors.number)}
                        helperText={errors.number}
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
                        error={Boolean(errors.OrganizationCaption)}
                        helperText={errors.OrganizationCaption}
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

                        error={Boolean(errors.EquipmentType)}
                        helperText={errors.EquipmentType}
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
                        error={Boolean(errors.EquipmentModel)}
                        helperText={errors.EquipmentModel}
                    />
            </TabPanel>
            <TabPanel value={value} index={2}>
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

                    error={Boolean(errors.PartVolume)}
                    helperText={errors.PartVolume}
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

                    error={Boolean(errors.VolumeIncludingSupportingStructures)}
                    helperText={errors.VolumeIncludingSupportingStructures}
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

                    error={Boolean(errors.BuildingHeight)}
                    helperText={errors.BuildingHeight}
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

                    error={Boolean(errors.LayerThickness)}
                    helperText={errors.LayerThickness}
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

                    error={Boolean(errors.AmountOfRequiredMaterialTakingIntoAccount)}
                    helperText={errors.AmountOfRequiredMaterialTakingIntoAccount}
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

                    error={Boolean(errors.ShieldingGasVolume)}
                    helperText={errors.ShieldingGasVolume}
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

                    error={Boolean(errors.PrintTime)}
                    helperText={errors.PrintTime}
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

                    error={Boolean(errors.LaborIntensity)}
                    helperText={errors.LaborIntensity}
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

                    error={Boolean(errors.AdditionallyInformation)}
                    helperText={errors.AdditionallyInformation}
                />
            </TabPanel>
        </Box>
    )
}
