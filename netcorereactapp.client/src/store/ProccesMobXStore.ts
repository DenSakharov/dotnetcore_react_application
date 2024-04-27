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
        operations: [], // Добавляем массив для хранения операций
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
        operations: [], // Добавляем массив для хранения операций
        materials:[],
        details:[],
    },
    errors: {},

    setProcces(newProcces) {
        //console.log(newProcces);
        ProccesMobXStore.procces = newProcces;
    },

    setErrors(newErrors) {
        ProccesMobXStore.errors = newErrors;
    },
    // Общий метод для добавления элемента в массив по типу
    addItem(type, item) {
        if (type === 'operations') {
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                operations: [...ProccesMobXStore.procces.operations, item]
            };
        } else if (type === 'details') {
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                details: [...ProccesMobXStore.procces.details, item]
            };
        } else if (type === 'materials') {
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                materials: [...ProccesMobXStore.procces.materials, item]
            };
        } else {
            console.error('Неизвестный тип:', type);
        }
    },

    // Общий метод для удаления элемента из массива по индексу и типу
    removeItem(type, index) {
        if (type === 'operations') {
            const newOperations = [...ProccesMobXStore.procces.operations];
            newOperations.splice(index, 1);
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                operations: newOperations
            };
        } else if (type === 'details') {
            const newDetails = [...ProccesMobXStore.procces.details];
            newDetails.splice(index, 1);
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                details: newDetails
            };
        } else if (type === 'materials') {
            const newMaterials = [...ProccesMobXStore.procces.materials];
            newMaterials.splice(index, 1);
            ProccesMobXStore.procces = {
                ...ProccesMobXStore.procces,
                materials: newMaterials
            };
        } else {
            console.error('Неизвестный тип:', type);
        }
    },
    resetProcces() {
        ProccesMobXStore.procces = this.initialProcces();
    }
};

makeObservable(ProccesMobXStore, {
    initialProcces:observable,
    procces: observable,
    setProcces: action,
    resetProcces: action,

    errors: observable,
    setErrors: action,

    addItem:action,
    removeItem:action,
});
