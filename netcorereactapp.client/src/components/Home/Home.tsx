import {HomeComponent} from './ExcelImportProccesLogic/HomeComponent.tsx'
import Table from "./TableComponent/Table.tsx";

import '../../styles/Home.css'
import OldOrdersWithStatuses from "./ModalWindows/OldComponents/OldOrdersWithStatuses.tsx";
import {Template} from "../Template/Template.tsx";
import {CenteredDivRow} from "./CommonComponents/CenteredDivRow.tsx";

export function Home() {

    return (
        <div>
            <CenteredDivRow>
            <HomeComponent/>
            <Template/>
            </CenteredDivRow>
            <Table/>
            {/*Старая логика отображения/загрузки заказ-статус модели*/}
            {/*<OldOrdersWithStatuses/>*/}
        </div>
    );
}
