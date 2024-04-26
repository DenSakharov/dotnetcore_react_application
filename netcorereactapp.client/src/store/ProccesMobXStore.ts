import { makeObservable, observable, action } from 'mobx';

export const ProccesMobXStore = {
    initialProcces: () => ({
        number: 0,
        caption: '',
        organizationCaption: '',
        equipmentType: '',
        equipmentModel: '',
        partVolume: 0,
        volumeIncludingSupportingStructures: 0,
        buildingHeight: 0,
        layerThickness: 0,
        amountOfRequiredMaterialTakingIntoAccount: 0,
        shieldingGasVolume: 0,
        printTime: 0,
        laborIntensity: 0,
        additionallyInformation: '',
        operations: [], // ƒобавл€ем массив дл€ хранени€ операций
        materials:[],
        details:[],
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
        operations: [], // ƒобавл€ем массив дл€ хранени€ операций
        materials:[],
        details:[],
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
    addDetail(detail) {
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            details: [...ProccesMobXStore.procces.details, detail]
        };
    },
    removeDetail(index) {
        const newDetails = [...ProccesMobXStore.procces.details];
        newDetails.splice(index, 1);
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            details: newDetails
        };
    },
    addMaterial(material) {
        console.log(material);
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            materials: [...ProccesMobXStore.procces.materials, material]
        };
    },
    removeMaterial(index) {
        const materials = [...ProccesMobXStore.procces.materials];
        materials.splice(index, 1);
        ProccesMobXStore.procces = {
            ...ProccesMobXStore.procces,
            materials: materials
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
