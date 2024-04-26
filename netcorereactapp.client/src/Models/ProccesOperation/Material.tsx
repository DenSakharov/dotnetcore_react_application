import {Entity} from "./Entity.tsx";

export interface Material extends Entity {
    loadWeightM3: number,
    profileAndSize: number,
    organizationCaption: string,
    quantity: number,
}