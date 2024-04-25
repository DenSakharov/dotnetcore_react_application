import { makeObservable, observable, action } from 'mobx';

export const ProccesMobXStore = {
    initialProcces: () => ({
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
        AdditionallyInformation: '',
        operations: [] // ƒобавл€ем массив дл€ хранени€ операций
    }),
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
        AdditionallyInformation: '',
        operations: [] // ƒобавл€ем массив дл€ хранени€ операций
    },
    errors: {},

    setProcces(newProcces) {
        ProccesMobXStore.procces = newProcces;
    },

    setErrors(newErrors) {
        ProccesMobXStore.errors = newErrors;
    },
    addOperation(operation) {
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            operations: [...ProccesMobXStore.procces.operations, operation]
        };
    },
    removeOperation(index) {
        const newOperations = [...ProccesMobXStore.procces.operations];
        newOperations.splice(index, 1);
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            operations: newOperations
        };
    },
    resetProcces() {
        ProccesMobXStore.procces = this.initialProcces();
    }
};

makeObservable(ProccesMobXStore, {
    initialProcces:observable,
    procces: observable,
    errors: observable,
    setProcces: action,
    setErrors: action,
});
