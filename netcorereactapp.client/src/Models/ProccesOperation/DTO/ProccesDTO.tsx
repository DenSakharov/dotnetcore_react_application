import {EntityDTO} from "./EntityDTO.tsx";
import {OperationDTO} from "./OperationDTO.tsx";
import {HistoryDTO} from "./HistoryDTO.tsx";

export interface ProccesDTO extends EntityDTO {
    operations: OperationDTO[];
    histories: HistoryDTO[];
}