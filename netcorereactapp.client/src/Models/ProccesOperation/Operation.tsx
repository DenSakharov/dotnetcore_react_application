import {Entity} from "./Entity.tsx";
import {Attachment} from "./Attachment.tsx";

export interface Operation extends Entity{
    number: string
    laborCost: string
    responsibleGroup: string
    textOper:string
    attachments: Attachment[];
    childsOperations: Operation[];
    parentOperationId: number | null;
}