import {Box, Tabs, TextField} from "@mui/material";
import {SyntheticEvent, useRef, useState} from "react";
import DetailForm from "./DetailForm.tsx";
import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import TabPanel, {StyledTab, StyledTextFieldLocal} from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import a11yProps from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import MaterialForm from "./MaterialForm.tsx";

export default function ProccesFields(){
    const [procces,setProcces]=useState<Procces>({
        caption:'',
        number:'',
        material : '',
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
    const inputRef = useRef(null);
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
                    label="Название " {...a11yProps(0)}
                />
                <StyledTab label="Информация об используемом оборудовании" {...a11yProps(1)} />
                <StyledTab label="Спецификация платформы построения" {...a11yProps(2)} />
                <StyledTab label="Материал" {...a11yProps(3)} />
                <StyledTab label="Размеры параметров построения" {...a11yProps(4)} />
                <StyledTab label="Характеристики печати" {...a11yProps(5)} />
                <StyledTab label="Доплнительная информация" {...a11yProps(6)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                    <StyledTextFieldLocal
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
                    <StyledTextFieldLocal
                        ref={inputRef}
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
                        ref={inputRef}
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
                        ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
                    ref={inputRef}
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
