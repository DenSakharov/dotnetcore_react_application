import {Entity} from "./Entity.tsx";
import {Operation} from "./Operation.tsx";
import {History} from "./History.tsx";
import {Attachment} from "./Attachment.tsx";
import {Detail} from "./Detail.tsx";
import {Material} from "./Material.tsx";

export interface Procces extends  Entity{
    number: number,
    OrganizationCaption: string,
    EquipmentType: string,
    EquipmentModel: string,
    PartVolume: number
    VolumeIncludingSupportingStructures: number
    BuildingHeight: number
    LayerThickness: number
    AmountOfRequiredMaterialTakingIntoAccount: number
    ShieldingGasVolume: number
    PrintTime: number
    LaborIntensity: number
    AdditionallyInformation: string

    operations: Operation[];
    histories: History[];
    attachments: Attachment[]
    details: Detail[],
    materials: Material[],

}