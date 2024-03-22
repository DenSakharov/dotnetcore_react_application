import React, {useState} from 'react';
import {ModalCreateProccesFromExcel} from "./ModalWindows/ModalCreateProccesFromExcel.tsx";

import '../../../styles/HomeComponent.css'
export const HomeComponent: React.FC = () => {
    const [isModalExcelExport, setModalExcelExport] = useState(false)
    const clickExcelExport =(e)=>{
        setModalExcelExport(!isModalExcelExport);
    }
    return (
        <div className="container">
            <div>
                <button className="styled-button"
                        onClick={clickExcelExport}>Добавить новый заказ по Excel шаблону
                </button>
                {isModalExcelExport && (
                    <ModalCreateProccesFromExcel
                        visible={isModalExcelExport}
                        title='Импорт процесса из Excel'
                        footer={<button onClick={clickExcelExport}>Close</button>}
                        onClose={clickExcelExport}
                    />
                )}
            </div>
           {/* <div>
                <OldOrdersWithStatuses/>
            </div>*/}
        </div>
    );
};
