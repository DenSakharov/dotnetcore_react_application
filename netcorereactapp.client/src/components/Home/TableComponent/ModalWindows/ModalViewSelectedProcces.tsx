import {useEffect} from "react";
import {SelectedProcces} from "./ProccesComponents/SelectedProccesComponents/SelectedProcces.tsx";
import '../../../../styles/ModalViewSelectedProcces.css'
export default function ModalViewSelectedProcces(props){
    // обработчик нажатия клавиши Esc
    const onKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                props.onClose()
                break
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })
    // если компонент невидим, то не отображаем его
    if (!props.visible) return null
    // или возвращаем верстку модального окна
    return (
        <div className='modal' onClick={props.onClose}>
            <div className='modal-dialog' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{props.title}</h3>
                    <span className='modal-close' onClick={props.onClose}>
                        &times;
                    </span>
                </div>
                <div className='modal-content'>
                    <SelectedProcces int={props.proccesId} onClose={props.onClose}/>
                </div>
                {props.footer && <div className='modal-footer'>{props.footer}</div>}
            </div>
        </div>
    )
}