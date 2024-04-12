import {useRef, useState} from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import {FiledsCompoment} from "./FiledsCompoment.tsx";
const modalBoxSx = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'rgba(0, 128, 0, 1)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const btnSX = {
    color:'green',
    bgcolor: 'black',
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
                <FiledsCompoment ref={childRef} onClose={handleClose}/>
                <Button sx={btnSX} className="styled-button" onClick={handleClose}>Закрыть</Button>
                <Button sx={btnSX} className="styled-button" onClick={save}>Сохранить</Button>
            </Box>
        </Modal>
    );
}
