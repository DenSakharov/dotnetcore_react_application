import {useRef, useState} from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import {FieldsAndOperationsAddingComponent} from "./FieldsAndOperationsAddingComponent.tsx";
const modalBoxSx = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'rgba(0, 128, 0, 0.9)',
    border: '10px solid #000',
    borderRadius: '25px',
    boxShadow: 24,
    p: 1,
};
const btnSX = {
    margin: '15px',
    color:'darkgreen',
    bgcolor: 'black',
    border: '2px solid #000',
};

export default function MainTemplateModal({ open, handleClose }) {
    const childRef = useRef(null);
    const save = () => {
        //console.log('test')
        if (childRef.current) {
            childRef.current.saveProcces();
        }
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalBoxSx}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Создание процесса
                </Typography>
                <FieldsAndOperationsAddingComponent ref={childRef} onClose={handleClose}/>
                <Button sx={btnSX} className="styled-button" onClick={handleClose}>Закрыть</Button>
                <Button sx={btnSX} className="styled-button" onClick={save}>Сохранить</Button>
            </Box>
        </Modal>
    );
}
