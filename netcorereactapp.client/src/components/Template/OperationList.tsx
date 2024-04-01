import {makeStyles, ThemeProvider} from "@mui/styles";
import {Card, CardContent, CardHeader, createTheme, Grid, Typography} from "@mui/material";

export const theme = createTheme({
    spacing: 8, // Пример значений отступов
    // Другие параметры темы
});
const useStyles = makeStyles((theme) => ({
    card: {
        margin: 2
    },
}));
export const OperationList = ({procces}) => {
    const classes = useStyles(); // Проверьте, что здесь есть theme

    return (
        <ThemeProvider theme={theme}>
            {procces && procces.operations && procces.operations.map((oper, index) => (
                <Grid key={index}>
                    <Card elevation={3} className={classes.card}>
                        <CardHeader title={`Операция ${index + 1}`}/>
                        <CardContent>
                            <Typography variant="body1">Номер операции: {oper.number}</Typography>
                            <Typography variant="body1">Трудозатраты: {oper.laborCost}</Typography>
                            <Typography variant="body1">Группа ответственности: {oper.responsibleGroup}</Typography>
                            <Typography variant="body1">Название: {oper.caption}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </ThemeProvider>
    );
};