import {EntityDTO} from "./EntityDTO.tsx";
import {AttachmentDTO} from "./AttachmentDTO.tsx";

export interface OperationDTO extends EntityDTO {
    attachments: AttachmentDTO[];
    childsOperations: OperationDTO[];
    parentOperationId: number | null;
}