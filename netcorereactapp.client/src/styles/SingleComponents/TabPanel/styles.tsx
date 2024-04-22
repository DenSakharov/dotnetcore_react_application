import {styled} from "@mui/system";
import {Tab, TextField} from "@mui/material";
import {backBackgroundColor, changeBackgroundColor} from "../../Annimations/Buttons/button_animations_hover.tsx";
import {useEffect, useState} from "react";

export const StyledDivColumnLeft=styled("div")(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

        transition: 'width 0.7s ease',
        overflow: 'hidden',
    }
))
export const StyledTextFieldLocal = styled(TextField)(({ theme }) => ({
    margin: '5px',
    width: '700px',
    '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
        color: 'white',
        '&:focus': {
            color: 'white', // »змен€ем цвет текста при фокусе
            borderRadius: '24px',
        },
    },
    '& .disabled': {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            borderColor: 'white',
            backgroundColor: 'white', // устанавливаем белый фон
            '& fieldset': {
                color: 'white',
                borderColor: 'white', // устанавливаем белый цвет границы
                backgroundColor: 'white',
            },
        },
        '& .MuiInputBase-input, & .MuiInputBase-multiline, & .MuiInputLabel-root, & .MuiFormHelperText-root': {
            color: 'white', // устанавливаем белый цвет текста
            borderColor: 'white',
            backgroundColor: 'white',
        },
    },
}));
export const StyledTab = styled(Tab)(({ theme }) => ({
        color:'white',
        transition: 'color 0.3s ease',
        '&.Mui-selected': {
            color: 'yellowgreen',
            border: '1px solid',
            borderRadius:'24px',
        },
        margin:'5px',
        "&:hover": {
            border: '1px solid',
            borderRadius:'24px',
            cursor: 'pointer',
            color: 'black',
            backgroundColor: 'white',
            animation: `${changeBackgroundColor} 0.5s ease-in-out`,
        },
        "&:not(:hover)": {
            border: '1px solid',
            borderRadius:'24px',
            cursor: 'default',
            backgroundColor: 'darkgreen',
            animation: `${backBackgroundColor} 0.5s ease-in-out`,
        },
    }
))

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    const [contentWidth, setContentWidth] = useState<number | null>(null);

    useEffect(() => {
        // «адаем ширину содержимого только дл€ активной вкладки
        setContentWidth(value === index ? document.getElementById(`tabpanel-${index}`)?.offsetWidth : 0);
    }, [value, index]);

    return (
        <StyledDivColumnLeft style={{ width: contentWidth }}>
            {value === index && (
                <StyledDivColumnLeft id={`tabpanel-${index}`} sx={{ p: 3 }}>
                    {children}
                </StyledDivColumnLeft>
            )}
        </StyledDivColumnLeft>
    );
}
