import {Entity} from "./Entity.tsx";

export interface Material extends Entity {
    LoadWeightM3: number,
    ProfileAndSize: number,
    OrganizationCaption: string,
    Quantity: number,
}