import React, { ReactElement, useEffect } from 'react';
import '../../styles/Modal.css'
import OrderModel from './OrdersPage';
import { SelectedOrder } from './SelectedOrder';


// интерфейс для пропсов
interface ModalProps {
    visible: boolean
    title: string
    content: ReactElement | string
    footer: ReactElement | string
    onClose: () => void
    order: OrderModel | null
}

export const Modal = ({
    visible = false,
    title = '',
    content = '',
    footer = '',
    onClose,
    order,
}: ModalProps) => {
    // обработчик нажатия клавиши Esc
    const onKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose()
                break
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })
    // если компонент невидим, то не отображаем его
    if (!visible) return null

    //console.log('Order prop in Modal:', order);
    const closeModal = () => {
        onClose(); // Закрыть модальное окно
        window.location.reload();
    };
    // или возвращаем верстку модального окна
    return (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{title}</h3>
                    <span className='modal-close' onClick={onClose}>
                        &times;
                    </span>
                </div>
                <div className='modal-content'>
                    {content}
                    {order ? (
                        <div>
                            <SelectedOrder orderInput={order} closeModal={onClose} />
                        </div>
                    ) : (
                        <p>Invalid orderId or order data is not available</p>
                    )}
                </div>

                {footer && <div className='modal-footer'>{footer}</div>}
            </div>
        </div>
    )
}