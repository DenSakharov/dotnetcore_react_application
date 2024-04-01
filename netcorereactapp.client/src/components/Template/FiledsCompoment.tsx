import {CenteredDivColumn, CenteredDivRow} from "../Home/CommonComponents/CenteredDivRow.tsx";
import {IconButton, List, ListItem, ListItemText, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {styled} from "@mui/system";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {NewOperation} from "./NewOperation.tsx";
import {Procces} from "../../Models/ProccesOperation/Procces.tsx";

export const FiledsCompoment=()=>{
    const [procces,setProcces]=useState<Procces>()
    useEffect(()=>{
            console.log('FiledsCompoment useEffect\n',procces)
    }),[procces]
    const inputRef = useRef(null);
    const handleTextFieldChange = (event) => {
        const {name, value} = event.target;
        const valu = inputRef.current.value;
        //console.log('Value changed:', valu);
        setProcces(prevProcces => ({
            ...prevProcces,
            [name]: value
        }));
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
            <CenteredDivRow>
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
                        />
                        <StyledTextField
                            ref={inputRef}
                            id="outlined-helperText"
                            label="Наименование"
                            variant="outlined"
                            name="caption"
                            onChange={handleTextFieldChange}
                            autoFocus
                        />
                    </CenteredDivRow>
                    <IconButton onClick={toggleInfoVisibility} sx={{color: 'white'}}>
                        {hidden ? <RemoveSharpIcon/> : <AddSharpIcon/>}
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
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="КД"
                        variant="outlined"
                        name="kd"
                        onChange={handleTextFieldChange}
                        autoFocus
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
                    />
                    <StyledTextField
                        ref={inputRef}
                        id="outlined-helperText"
                        label="Профиль и размеры"
                        variant="outlined"
                        name="profile_size"
                        onChange={handleTextFieldChange}
                        autoFocus
                    />
                </CenteredDivColumn>
            </CenteredDivRow>
            {hidden &&
                <NewOperation
                    hidden={toggleInfoVisibility}
                    addChildOperartion={addOperation}
                />
            }
            {procces && procces.operations && procces.operations.map((oper, index) => (
                <div key={index}>
                    <p>Number: {oper.number}</p>
                    <p>Labor Cost: {oper.laborCost}</p>
                    <p>Responsible Group: {oper.responsibleGroup}</p>
                    <p>caption: {oper.caption}</p>
                </div>
            ))}
        </CenteredDivColumn>
    )
}
export const StyledTextField = styled(TextField)({
    margin: '5px',
    width: '50ch',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
        '& .MuiInputBase-input:focus, & .MuiInputBase-multiline:focus': {
            color: 'black', // Измените цвет текста при выделении
        },
    },
});