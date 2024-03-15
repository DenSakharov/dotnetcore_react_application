import {Entity} from "./Entity.tsx";
import {Operation} from "./Operation.tsx";
import {History} from "./History.tsx";
import {Attachment} from "./Attachment.tsx";

export interface Procces extends  Entity{
    operations: Operation[];
    histories: History[];
    attachments: Attachment[]
}