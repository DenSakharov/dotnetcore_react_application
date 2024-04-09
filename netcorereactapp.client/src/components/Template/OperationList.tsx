import { ThemeProvider} from "@mui/styles";
import {
    createTheme,
    Grid,
    IconButton,TextField,
} from "@mui/material";
import { CenteredDivRow} from "../Home/CommonComponents/CenteredDivRow.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/system";
import {StyledTextField} from "./FiledsCompoment.tsx";
import {Procces} from "../../Models/ProccesOperation/Procces.tsx";

export const theme = createTheme({
    spacing: 8, // Пример значений отступов
    palette: {
        type: "dark",
        },
    // Другие параметры темы
});
export const OperationList = ({procces, setProcces }):{procces:Procces,setProcces:void} => {
// Обработчик удаления элемента из массива по индексу
    const handleDelete = (index) => {
        // Создание нового массива без удаленного элемента
        const updatedOperations = procces.operations.filter((_, i) => i !== index);
        // Обновление состояния procces с новым массивом операций
        setProcces(prevState => ({
            ...prevState,
            operations: updatedOperations
        }));
    };
    return (
        <ThemeProvider theme={theme}>
            {procces && procces.operations && procces.operations.map((oper, index) => (
                <Grid key={index}>
                    <CenteredDivRow>
                        <StyledTextField
                            id="outlined-helperText"
                            label="№ операции"
                            variant="outlined"
                            name="number"
                            defaultValue={oper.number}
                            sx={{width: '10ch',}}
                            disabled

                        />
                        <StyledTextField
                            id="outlined-helperText"
                            label="Название операции"
                            variant="outlined"
                            name="caption"
                            defaultValue={oper.caption}
                            disabled
                        />
                        <StyledTextField
                            id="outlined-helperText"
                            label="Трудозатраты"
                            variant="outlined"
                            name="laborCost"
                            defaultValue={oper.laborCost}
                            disabled
                        />
                        <StyledTextField
                            id="outlined-helperText"
                            label="Группа ответственных"
                            variant="outlined"
                            name="responsibleGroup"
                            defaultValue={oper.responsibleGroup}
                            disabled
                        />
                        <IconButton sx={{color: 'white'}}
                            onClick={() => handleDelete(index)} >
                            <DeleteIcon style={{ fontSize: 50 }}/>
                        </IconButton>
                    </CenteredDivRow>
                    {/*<Card elevation={3} className={classes.card}>
                        <CardHeader title={`Операция ${index + 1}`}/>
                        <CardContent>
                            <Typography variant="body1">Номер операции: {oper.number}</Typography>
                            <Typography variant="body1">Трудозатраты: {oper.laborCost}</Typography>
                            <Typography variant="body1">Группа ответственности: {oper.responsibleGroup}</Typography>
                            <Typography variant="body1">Название: {oper.caption}</Typography>
                        </CardContent>
                    </Card>*/}
                </Grid>
            ))}
        </ThemeProvider>
    );
};