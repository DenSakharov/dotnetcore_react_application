import {CenteredDivColumn, CenteredDivRow} from "../../Home/CommonComponents/CenteredDivRow.tsx";
import {useEffect, useRef, useState} from "react";
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
import {ProccesMobXStore} from "../../../store/ProccesMobXStore.ts";
import {reaction, toJS} from "mobx";
import {observer} from "mobx-react";

export default observer(MaterialForm)
function MaterialForm(materialInputArray: Material[]) {
    const [materials, setMaterials] =
        useState<Material[]>(Array.isArray(materialInputArray) ? materialInputArray : []);
    useEffect(() => {
        //console.log('materials',materials)
    }, [materials]);
    const [material,setMaterial]=
        useState({
        caption:'',
        loadWeightM3: 0,
        profileAndSize: 0,
        organizationCaption: '',
        quantity: 0,
    })
    useEffect(() => {

    }, [material]);
  /*  reaction(
        () => ProccesMobXStore.procces.materials,
        (materials) => {
            //console.log('materials:', toJS(materials) );
        }
    );*/
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        // Валидация для поля "number"
        if ((name === 'loadWeightM3' ||
            name === 'profileAndSize' ||
            name === 'quantity') && !value.match(/^\d+$/)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: 'Пожалуйста, введите число.'
            }))
        }
        else {
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
        const allFieldsFilled =
            Object.entries(material).every(([fieldName, value]) => {
            // Проверяем, что значение не пустое, является строкой и не является массивом или объектом
            return (typeof value === 'string' && value.trim() !== '') ||
                Array.isArray(value) || typeof value === 'object';
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
            return; // Прерываем отправку данных
        }
        const newMaterial: Material = {
            caption: material.caption,
            loadWeightM3:  parseInt(material.loadWeightM3),
            profileAndSize: parseInt(material.profileAndSize),
            organizationCaption: material.organizationCaption,
            quantity:  parseInt(material.quantity),
        };
        ProccesMobXStore.addItem('materials', newMaterial);
        setMaterials(prevMaterials => [...prevMaterials, newMaterial]);

        /*setMaterial({
            caption: '',
            loadWeightM3: 0,
            profileAndSize: 0,
            organizationCaption: '',
            quantity: 0,
        });*/
        toggleInfoVisibility()
    };
    const deleteBtn = (index) => {
        ProccesMobXStore.removeItem('materials', index);
    }
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
                                    name="loadWeightM3"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}
                                    error={Boolean(errors.loadWeightM3)}
                                    helperText={errors.loadWeightM3}
                                />
                            </CenteredDivRow>
                            <CenteredDivRow>
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Профиль и размеры"
                                    variant="outlined"
                                    name="profileAndSize"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}
                                    error={Boolean(errors.profileAndSize)}
                                    helperText={errors.profileAndSize}
                                />
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Название организации"
                                    variant="outlined"
                                    name="organizationCaption"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}

                                    error={Boolean(errors.organizationCaption)}
                                    helperText={errors.organizationCaption}
                                />
                                <StyledTextFieldLocal
                                    ref={inputRef}
                                    id="outlined-helperText"
                                    label="Количество на загрузку"
                                    variant="outlined"
                                    name="quantity"
                                    onChange={handleTextFieldChange}
                                    autoFocus
                                    sx={{
                                        width: '16ch',
                                        '& .MuiInputLabel-root': {
                                            fontSize: '15px',
                                        },
                                    }}

                                    error={Boolean(errors.quantity)}
                                    helperText={errors.quantity}
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
            {/*{JSON.stringify(ProccesMobXStore.procces.materials)}*/}
            {ProccesMobXStore.procces.materials && // Проверяем, что details является массивом
                ProccesMobXStore.procces.materials.map((material,index) => (
                    <CenteredDivRow key={index}>
                        <IconButton>
                            <EditSharpIcon/>
                        </IconButton>
                        <Typography>
                            {material.caption}
                        </Typography>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteBtn(index)}>
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