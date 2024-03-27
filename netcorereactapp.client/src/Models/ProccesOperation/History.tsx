import {Entity} from "./Entity.tsx";

export interface History extends Entity{
    message: string
    proccesId: number
}