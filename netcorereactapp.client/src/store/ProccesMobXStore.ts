import { makeObservable, observable, action } from 'mobx';

export const ProccesMobXStore = {
    procces: {
        number: 0,
        caption: '',
        OrganizationCaption: '',
        EquipmentType: '',
        EquipmentModel: '',
        PartVolume: 0,
        VolumeIncludingSupportingStructures: 0,
        BuildingHeight: 0,
        LayerThickness: 0,
        AmountOfRequiredMaterialTakingIntoAccount: 0,
        ShieldingGasVolume: 0,
        PrintTime: 0,
        LaborIntensity: 0,
        AdditionallyInformation: ''
    },

    errors: {},

    setProcces(newProcces) {
        ProccesMobXStore.procces = newProcces;
    },

    setErrors(newErrors) {
        ProccesMobXStore.errors = newErrors;
    },
};

makeObservable(ProccesMobXStore, {
    procces: observable,
    errors: observable,
    setProcces: action,
    setErrors: action,
});
