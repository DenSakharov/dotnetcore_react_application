import {Entity} from "./Entity.tsx";
import {Typography} from "@mui/material";

export interface Attachment extends Entity{
    attachmentData: string;
    category: AttachmentCategory
}
export enum AttachmentCategory {
    Instruction = 'Инструкция',
    Document = 'Документ',
    Model = 'Модель',
    MPK = 'МПК',
    Agreement = 'Договор',
    /*Instruction,//инструкция
    Document,//документ
    Model,//модель
    MPK,//МПК
    Agreement//Договор*/
}
export default function mapCategoryEnumToCaption(category: number) {
    console.log(category)
    switch (category) {
        case 0:
            return "Инструкция"
        case 1:
            return "Документ"
        case 2:
            return "Модель"
        case 3:
            return "МПК"
        case 4:
            return "Договор"
        // Добавьте другие случаи для остальных категорий
        default:
            /*throw new Error(`Unknown category: ${category}`);*/
            return ""
    }
}
export function mapCategoryValueToEnum(categoryValue: number): AttachmentCategory | null {
    switch (categoryValue) {
        case 0:
            return AttachmentCategory.Instruction;
        case 1:
            return AttachmentCategory.Document;
        case 2:
            return AttachmentCategory.Model;
        case 3:
            return AttachmentCategory.MPK;
        case 4:
            return AttachmentCategory.Agreement;
        default:
            return null; // Если значение не сопоставлено ни с одним из значений перечисления
    }
}