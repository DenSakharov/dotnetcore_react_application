import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {Operation} from "../../../Models/ProccesOperation/Operation.tsx";

// Интерфейс для пропсов компонента-потомка
interface ChildComponentProps {
    onClose: () => void;
    notif:()=>void;
    operation;
    procces;
}

// Интерфейс для пропсов модального окна
interface GeneralModalWindowProps {
    modalCaption: string;
    open: boolean; // Принимаем пропс open для управления открытием модального окна
    childComponent: React.ComponentType<ChildComponentProps>;
    childComponentProps: ChildComponentProps;
}

// Общий модальный компонент
export const GeneralModalWindow =({ modalCaption, open, childComponent: ChildComponent, childComponentProps }: GeneralModalWindowProps) => {
    //console.log(open)
    const handleClose = () => {
        //console.log('test')
        childComponentProps.onClose(); // Вызываем функцию onClose из пропсов childComponentProps
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'darkgreen',
                            color: 'white'
                        }
                    }}>
                <DialogTitle>{modalCaption}</DialogTitle>
                <DialogContent>
                    {/* Рендеринг компонента-потомка с пропсами */}
                    <ChildComponent onClose={handleClose} {...childComponentProps} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
