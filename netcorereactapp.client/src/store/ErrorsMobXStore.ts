import {action, observable} from "mobx";

export const ErrorsStore = observable({
    errors: {
        number: '',
        caption: '',
        OrganizationCaption: '',
        EquipmentType: '',
        EquipmentModel: '',
        PartVolume: '',
        VolumeIncludingSupportingStructures: '',
        BuildingHeight: '',
        LayerThickness: '',
        AmountOfRequiredMaterialTakingIntoAccount: '',
        ShieldingGasVolume: '',
        PrintTime: '',
        LaborIntensity: '',
        AdditionallyInformation: '',
    },

    setFieldError(fieldName: string, error: string) {
        this.errors[fieldName] = error;
    },

    // Другие методы для обновления ошибок при необходимости...
});

// Обертка для установки методов как action
export const errorsStore = {
    ...ErrorsStore,
    setFieldError: action(ErrorsStore.setFieldError),
    // Другие методы, если есть, также можно обернуть как action
};