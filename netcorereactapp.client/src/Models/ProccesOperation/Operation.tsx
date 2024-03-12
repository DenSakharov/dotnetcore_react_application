import {Entity} from "./Entity.tsx";
import {Attachment} from "./Attachment.tsx";

export interface Operation extends Entity{
    attachments: Attachment[];
    childsOperations: Operation[];
    parentOperationId: number | null;
}