import {Entity} from "./Entity.tsx";
import {Operation} from "./Operation.tsx";

export interface Procces extends  Entity{
    operations: Operation[];
    histories: any[];
}