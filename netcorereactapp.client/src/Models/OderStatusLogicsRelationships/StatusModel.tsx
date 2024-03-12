import {TypesStatus} from "./TypesStatus.tsx";
import {AttachmentModel} from "./AttachmentModel.tsx";

export interface StatusModel {
    Id: number;
    Type: TypesStatus;
    dateOfCreature: string;
    attachments: AttachmentModel[];
    childStatuses: StatusModel[];
    parentId: number | null; // Идентификатор родительского статуса (опциональный)
}