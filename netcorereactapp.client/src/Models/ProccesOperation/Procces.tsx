import {Entity} from "./Entity.tsx";
import {Operation} from "./Operation.tsx";
import {History} from "./History.tsx";
import {Attachment} from "./Attachment.tsx";
import {Detail} from "./Detail.tsx";
import {Material} from "./Material.tsx";

export interface Procces extends  Entity{
    number: number,
    organizationCaption: string,
    equipmentType: string,
    equipmentModel: string,
    partVolume: number
    volumeIncludingSupportingStructures: number
    buildingHeight: number
    layerThickness: number
    amountOfRequiredMaterialTakingIntoAccount: number
    shieldingGasVolume: number
    printTime: number
    laborIntensity: number
    additionallyInformation: string

    operations: Operation[];
    histories: History[];
    attachments: Attachment[]
    details: Detail[],
    materials: Material[],

}