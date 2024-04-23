import {CenteredDivColumn, CenteredDivRow} from "../../Home/CommonComponents/CenteredDivRow.tsx";
import {IconButton, Typography} from "@mui/material";
import {buttonHover, buttonHoverBorderRadius} from "../../../styles/Annimations/Buttons/button_animations_hover.tsx";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import {useRef, useState} from "react";
import {StyledTextFieldLocal} from "../../../styles/SingleComponents/TabPanel/styles.tsx";
import PlaylistAddCheckTwoToneIcon from "@mui/icons-material/PlaylistAddCheckTwoTone";
import {styled} from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSharpIcon from '@material-ui/icons/EditSharp';
import {Detail} from "../../../Models/ProccesOperation/Detail.tsx";

export default function DetailForm(detailArray: Detail[]) {
    const [details, setDetails] = useState<Detail[]>(Array.isArray(detailArray) ? detailArray : []);

    const [detail,setDetail]=useState({
        caption:'',
        amount:''
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

            setDetail(prevDetail => ({
                ...prevDetail,
                [name]: value
            }));
        }
    };
    const [hidden, setHidden] = useState(false);
    const toggleInfoVisibility = () => {
        setHidden(!hidden);
    };
    const addBtn = () => {
        console.log('details',details)
        const allFieldsFilled = Object.entries(detail).every(([fieldName, value]) => {
            // Проверяем, что значение не пустое, является строкой и не является массивом или объектом
            return (typeof value === 'string' && value.trim() !== '') || Array.isArray(value) || typeof value === 'object';
        });

        if (!allFieldsFilled) {
            // Если не все поля заполнены, устанавливаем сообщения об ошибке для каждого незаполненного поля
            const newErrors = {};
            for (const fieldName in detail) {
                if (typeof detail[fieldName] === 'string' && !detail[fieldName].trim() && fieldName !== 'equipments') {
                    newErrors[fieldName] = 'Это поле обязательно для заполнения.';
                }
            }
            setErrors(newErrors);
            //console.error(errors)
            return; // Прерываем отправку данных
        }
        // Создаем новый объект Detail и добавляем его в массив
        const newDetail: Detail = {
            caption: detail.caption,
            amount: parseInt(detail.amount) // Преобразуем количество в число
        };

        // Обновляем состояние, добавляя новый объект Detail в массив
        setDetails(prevDetails => [...prevDetails, newDetail]);

        // Очищаем состояние для поля detail, чтобы подготовить его к следующему вводу
        setDetail({
            caption: '',
            amount: ''
        });
        toggleInfoVisibility()
    };
    return (
        <CenteredDivColumnLocal sx={{width: '700px'}}>
            {hidden ?
                <CenteredDivColumnLocal >
                    <IconButton onClick={toggleInfoVisibility} sx={{...buttonHover.iconButton}}>
                        <RemoveCircleTwoToneIcon style={{fontSize: 50}}/>
                    </IconButton>
                    <CenteredDivRow sx={{margin:'35px'}}>
                        <IconButton onClick={addBtn} sx={{color: 'white'}}>
                            <CenteredDivColumnLocal
                                sx={{...buttonHover.centeredDivColumn}}
                            >
                                <PlaylistAddCheckTwoToneIcon/>
                                <Typography sx={{fontSize: 13}}>Добавить</Typography>
                            </CenteredDivColumnLocal>
                        </IconButton>
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
                            label="Количество"
                            variant="outlined"
                            name="amount"
                            onChange={handleTextFieldChange}
                            autoFocus
                            sx={{width: '20ch',}}

                            error={Boolean(errors.amount)}
                            helperText={errors.amount}
                        />
                    </CenteredDivRow>
                </CenteredDivColumnLocal>
                :
                (
                    <IconButton onClick={toggleInfoVisibility} sx={{...buttonHoverBorderRadius.iconButton}}>
                        <CenteredDivRow>
                            <Typography>Добавить деталь</Typography>
                            <AddBoxSharpIcon style={{fontSize: 50}}/>
                        </CenteredDivRow>
                    </IconButton>
                )
            }

                {Array.isArray(details) && // Проверяем, что details является массивом
                    details.map((detail) => (
                        <CenteredDivRow key={detail.id}>
                            <IconButton>
                                <EditSharpIcon/>
                            </IconButton>
                            <Typography>
                                {detail.caption}
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