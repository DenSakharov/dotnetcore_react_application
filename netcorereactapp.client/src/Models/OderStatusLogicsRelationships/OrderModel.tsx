import {StatusModel} from "./StatusModel.tsx";

interface OrderModel {
    id: number;
    caption: string;
    dateOfCreature: string;
    dateOfEdited: string;
    statuses: StatusModel[];
}
export const statusMap = {
    0: 'Start',
    1: 'Process',
    2: 'End',
};
export default OrderModel;