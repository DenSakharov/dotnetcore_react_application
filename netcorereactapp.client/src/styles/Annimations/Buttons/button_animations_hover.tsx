import {keyframes} from "@mui/material";
export const changeBackgroundColor = keyframes`
        0% {
            background-color: darkgreen;
        }
        100% {
            background-color: greenyellow;
        }
        //прикол с переключением
       /* 0% {
            background-color: darkgreen;
        }
        25% {
            background-color: firebrick;
            width: 50px;
            height: 1000px;
        }
        50% {
            background-color: pink;
            width: 1000px;
            height: 100px;
        }
        75% {
            background-color: darkorange;
            width: 50px;
            height: 1000px;
        }
        100% {
            background-color: green;
        }*/
    `;
export const backBackgroundColor = keyframes`
        0% {
            background-color: greenyellow;
        }
        100% {
            background-color: darkgreen;
        }
    `;
export const buttonHover = {
    centeredDivColumn: {
        width: '100px',
        border: '4px solid',
        borderRadius: '25px',
        backgroundColor: 'darkgreen',
        "&:hover": {
            cursor: 'pointer',
            color: 'black',
            backgroundColor: 'white',
            animation: `${changeBackgroundColor} 0.5s ease-in-out`,
        },
        "&:not(:hover)": {
            cursor: 'default',
            backgroundColor: 'darkgreen',
            animation: `${backBackgroundColor} 0.5s ease-in-out`,
        },
    },
    iconButton: {
        fontSize: '50px',
        "&:hover": {
            cursor: 'pointer',
            color: 'black',
            backgroundColor: 'white',
            borderRadius: '100%',
            animation: `${changeBackgroundColor} 0.5s ease-in-out`,
        },
        "&:not(:hover)": {
            cursor: 'default',
            backgroundColor: 'darkgreen',
            borderRadius: '100%',
            animation: `${backBackgroundColor} 0.5s ease-in-out`,
        },
    },
};
export const buttonHoverBorderRadius = {
    centeredDivColumn: {
        width: '100px',
        border: '4px solid',
        borderRadius: '25px',
        backgroundColor: 'darkgreen',
        "&:hover": {
            cursor: 'pointer',
            color: 'black',
            backgroundColor: 'white',
            animation: `${changeBackgroundColor} 0.5s ease-in-out`,
        },
        "&:not(:hover)": {
            cursor: 'default',
            backgroundColor: 'darkgreen',
            animation: `${backBackgroundColor} 0.5s ease-in-out`,
        },
    },
    iconButton: {
        fontSize: '50px',
        "&:hover": {
            cursor: 'pointer',
            color: 'black',
            backgroundColor: 'white',
            borderRadius: '25px',
            animation: `${changeBackgroundColor} 0.5s ease-in-out`,
        },
        "&:not(:hover)": {
            cursor: 'default',
            backgroundColor: 'darkgreen',
            borderRadius: '25px',
            animation: `${backBackgroundColor} 0.5s ease-in-out`,
        },
    },
};