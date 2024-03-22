import {HomeComponent} from './ExcelImportProccesLogic/HomeComponent.tsx'
import Table from "./TableComponent/Table.tsx";

import '../../styles/Home.css'
import OldOrdersWithStatuses from "./ModalWindows/OldComponents/OldOrdersWithStatuses.tsx";

export function Home() {

    return (
        <div>
            <HomeComponent/>
            <Table/>
            {/*Старая логика отображения/загрузки заказ-статус модели*/}
            {/*<OldOrdersWithStatuses/>*/}
        </div>
    );
}
