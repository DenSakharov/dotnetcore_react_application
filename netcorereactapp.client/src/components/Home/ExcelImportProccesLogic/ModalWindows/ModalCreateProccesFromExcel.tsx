import {useEffect} from "react";
import '../../../../styles/Modal.css'
import '../../../../styles/ModalCreateOrderFromExcel.css'
import ExcelImportComponent from "../Components/ExcelImportComponent.tsx";
export const ModalCreateProccesFromExcel = (props) => {
    // ���������� ������� ������� Esc
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
    // ���� ��������� �������, �� �� ���������� ���
    if (!props.visible) return null
    // ��� ���������� ������� ���������� ����
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
                    <ExcelImportComponent onClose={props.onClose}/>
                </div>
                {props.footer && <div className='modal-footer'>{props.footer}</div>}
            </div>
        </div>
    )
}