import {CenteredDivColumn, CenteredDivRow} from "../../Home/CommonComponents/CenteredDivRow.tsx";
import {useRef, useState} from "react";
import {IconButton, Typography} from "@mui/material";
import {buttonHover, buttonHoverBorderRadius} from "../../../styles/Annimations/Buttons/button_animations_hover.tsx";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import PlaylistAddCheckTwoToneIcon from "@mui/icons-material/PlaylistAddCheckTwoTone";
import {StyledTextFieldLocal} from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/system";
import {Material} from "../../../Models/ProccesOperation/Material.tsx";

export default function MaterialForm(materialInputArray: Material[]) {
    const [materials, setMaterials] = useState<Material[]>(Array.isArray(materialInputArray) ? materialInputArray : []);

    const [material,setMaterial]=useState({
        caption:'',
        LoadWeightM3: '',
        ProfileAndSize: '',
        OrganizationCaption: '',
        Quantity: '',
    })
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        // Валидация для поля "number"
        if (name === 'amount' && !value.match(/^\d+$/)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Пожалуйста, введите число.'
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));

            setMaterial(prevMat => ({
                ...prevMat,
                [name]: value
            }));
        }
    };
    const [hidden, setHidden] = useState(false);
    const toggleInfoVisibility = () => {
        setHidden(!hidden);
    };
    const addBtn = () => {
        //console.log('details',materials)
        //console.log('', oper);
        const allFieldsFilled = Object.entries(material).every(([fieldName, value]) => {
            // Проверяем, что значение не пустое, является строкой и не является массивом или объектом
            return (typeof value === 'string' && value.trim() !== '') || Array.isArray(value) || typeof value === 'object';
        });

        if (!allFieldsFilled) {
            // Если не все поля заполнены, устанавливаем сообщения об ошибке для каждого незаполненного поля
            const newErrors = {};
            for (const fieldName in material) {
                if (typeof material[fieldName] === 'string' && !material[fieldName].trim() && fieldName !== 'equipments') {
                    newErrors[fieldName] = 'Это поле обязательно для заполнения.';
                }
            }
            setErrors(newErrors);
            //console.error(errors)
            return; // Прерываем отправку данных
        }
        // Создаем новый объект Detail и добавляем его в массив
        const newDetail: Material = {
            caption: material.caption,
            LoadWeightM3:  parseInt(material.LoadWeightM3),
            ProfileAndSize: parseInt(material.ProfileAndSize),
            OrganizationCaption: material.OrganizationCaption,
            Quantity:  parseInt(material.Quantity),
        };

        // Обновляем состояние, добавляя новый объект Detail в массив
        setMaterials(prevDetails => [...prevDetails, newDetail]);

        // Очищаем состояние для поля detail, чтобы подготовить его к следующему вводу
        setMaterial({
            caption: '',
            LoadWeightM3: '',
            ProfileAndSize: '',
            OrganizationCaption: '',
            Quantity: '',
        });
        toggleInfoVisibility()
    };
    return (
        <CenteredDivColumnLocal
            sx={{
                width: '700px',
                height: 'auto',
                overflow: 'hidden',
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
            }}
        >
            {hidden ?
                <CenteredDivColumnLocal >
                    <IconButton onClick={toggleInfoVisibility} sx={{...buttonHover.iconButton}}>
                        <RemoveCircleTwoToneIcon style={{fontSize: 50}}/>
                    </IconButton>
                    <CenteredDivRow sx={{margin:'5px'}}>
                        <IconButton onClick={addBtn} sx={{color: 'white'}}>
                            <CenteredDivColumnLocal
                                sx={{...buttonHover.centeredDivColumn}}
                            >
                                <PlaylistAddCheckTwoToneIcon/>
                                <Typography sx={{fontSize: 13}}>Добавить</Typography>
                            </CenteredDivColumnLocal>
                        </IconButton>
                        <CenteredDivColumn
                            sx={{
                                height:'auto',
                            }}
                        >
                            <CenteredDivRow>
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Название"
                                    variant="outlined"
                                    name="caption"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{width: '50ch',}}

                                    error={Boolean(errors.caption)}
                                    helperText={errors.caption}
                                />
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Масса загрузки"
                                    variant="outlined"
                                    name="LoadWeightM3"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}
                                    error={Boolean(errors.LoadWeightM3)}
                                    helperText={errors.LoadWeightM3}
                                />
                            </CenteredDivRow>
                            <CenteredDivRow>
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Профиль и размеры"
                                    variant="outlined"
                                    name="ProfileAndSize"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}
                                    error={Boolean(errors.ProfileAndSize)}
                                    helperText={errors.ProfileAndSize}
                                />
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Название организации"
                                    variant="outlined"
                                    name="OrganizationCaption"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}

                                    error={Boolean(errors.OrganizationCaption)}
                                    helperText={errors.OrganizationCaption}
                                />
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Количество на загрузку"
                                    variant="outlined"
                                    name="Quantity"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}

                                    error={Boolean(errors.Quantity)}
                                    helperText={errors.Quantity}
                                />
                            </CenteredDivRow>
                        </CenteredDivColumn>
                    </CenteredDivRow>
                </CenteredDivColumnLocal>
                :
                (
                    <IconButton onClick={toggleInfoVisibility} sx={{...buttonHoverBorderRadius.iconButton}}>
                        <CenteredDivRow>
                            <Typography>Добавить материал</Typography>
                            <AddBoxSharpIcon style={{fontSize: 50}}/>
                        </CenteredDivRow>
                    </IconButton>
                )
            }

            {Array.isArray(materials) && // Проверяем, что details является массивом
                materials.map(material => (
                    <CenteredDivRow key={material.id}>
                        <IconButton>
                            <EditSharpIcon/>
                        </IconButton>
                        <Typography>
                            {material.caption}
                        </Typography>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                    </CenteredDivRow>
                ))
            }
        </CenteredDivColumnLocal>

    )
};

const CenteredDivColumnLocal = styled(CenteredDivColumn)({
    height: '100%',
});