import {Procces} from "../../../Models/ProccesOperation/Procces.tsx";
import {ProccesDTO} from "../../../Models/ProccesOperation/DTO/ProccesDTO.tsx";
import {Operation} from "../../../Models/ProccesOperation/Operation.tsx";
import {OperationDTO} from "../../../Models/ProccesOperation/DTO/OperationDTO.tsx";
import {HistoryDTO} from "../../../Models/ProccesOperation/DTO/HistoryDTO.tsx";
import {History} from "../../../Models/ProccesOperation/History.tsx";
import {Attachment} from "../../../Models/ProccesOperation/Attachment.tsx";
import {AttachmentDTO} from "../../../Models/ProccesOperation/DTO/AttachmentDTO.tsx";

export function mapProccesDTOToProcces(dto: Procces): ProccesDTO {
    //console.log("ProccesDTO :\n",dto)
    return {
        id: dto.id,
        caption: dto.caption,
        dateOfCreture: new Date(dto.dateOfCreture),
        dateOfEdited: new Date(dto.dateOfEdited),
        operations: dto.operations.map(mapOperationDTOToOperation),
        histories: dto.histories.map(mapHistoryDTOToHistory)
    };
}

export function mapOperationDTOToOperation(dto: Operation): OperationDTO {
    //console.log("OperationDTO :\n",dto)
    return {
        id: dto.id,
        caption: dto.caption,
        dateOfCreture: new Date(dto.dateOfCreture),
        dateOfEdited: new Date(dto.dateOfEdited),
        attachments: dto.attachments.map(mapAttachmentDTOToAttachment),
        childsOperations: dto.childsOperations ? dto.childsOperations.map(mapOperationDTOToOperation) : [],
        parentOperationId: dto.parentOperationId
    };
}

export function mapHistoryDTOToHistory(dto: History): HistoryDTO {
    //console.log("HistoryDTO :\n",dto)
    return {
        id: dto.id,
        caption: dto.caption,
        dateOfCreture: new Date(dto.dateOfCreture),
        dateOfEdited: new Date(dto.dateOfEdited),
        message: dto.message
    };
}

export function mapAttachmentDTOToAttachment(dto: Attachment): AttachmentDTO {
    //console.log("AttachmentDTO :\n",dto)
    return {
        id: dto.id,
        caption: dto.caption,
        dateOfCreture: new Date(dto.dateOfCreture),
        dateOfEdited: new Date(dto.dateOfEdited),
        attachmentData: dto.attachmentData
    };
}
