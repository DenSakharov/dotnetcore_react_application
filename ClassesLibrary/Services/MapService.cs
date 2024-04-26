using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using System.Diagnostics;

namespace ClassesLibrary.Services
{
    public static class MapService
    {
        public static ProccesDTO GetProcces(Procces proccesDTO)
        {
            return new ProccesDTO()
            {
                Id = proccesDTO.Id,
                Caption = proccesDTO.Caption,
                DateOfCreture = proccesDTO.DateOfCreture,
                DateOfEdited = proccesDTO.DateOfEdited,
                number = proccesDTO.number,
                OrganizationCaption = proccesDTO.OrganizationCaption,
                EquipmentType = proccesDTO.EquipmentType,
                EquipmentModel = proccesDTO.EquipmentModel,
                PartVolume = proccesDTO.PartVolume,
                VolumeIncludingSupportingStructures = proccesDTO.VolumeIncludingSupportingStructures,
                BuildingHeight = proccesDTO.BuildingHeight,
                LayerThickness = proccesDTO.LayerThickness,
                AmountOfRequiredMaterialTakingIntoAccount = proccesDTO.AmountOfRequiredMaterialTakingIntoAccount,
                ShieldingGasVolume = proccesDTO.ShieldingGasVolume,
                PrintTime = proccesDTO.PrintTime,
                LaborIntensity = proccesDTO.LaborIntensity,
                AdditionallyInformation = proccesDTO.AdditionallyInformation,
                //material = proccesDTO.material,
                //m3 = proccesDTO.m3,
                //kd = proccesDTO.kd,
                //profile_size = proccesDTO.profile_size,
                Operations = MapChildOperations(proccesDTO.Operations),
                details = MapDetails(proccesDTO.details),
                materials = MapMaterials(proccesDTO.materials),
                Attachments = MapAttachments(proccesDTO.Attachments),
            };
        }
        public static Procces GetProcces(ProccesDTO proccesDTO)
        {
            return new Procces()
            {
                Id = proccesDTO.Id,
                Caption = proccesDTO.Caption,
                DateOfCreture = proccesDTO.DateOfCreture,
                DateOfEdited = proccesDTO.DateOfEdited,
                number = proccesDTO.number,
                //material = proccesDTO.material,
                //m3 = proccesDTO.m3,
                //kd = proccesDTO.kd,
                //profile_size = proccesDTO.profile_size,
                Operations = MapChildOperations(proccesDTO.Operations),
                Attachments = MapAttachments(proccesDTO.Attachments),
            };
        }
        public static List<OperationDTO> MapChildOperations(List<Operation> operations)
        {
            var childOperationsDTOs = new List<OperationDTO>();
            foreach (var operation in operations)
            {
                
                // Создаем и добавляем дочерний статус в список
                var childStatusDTO = new OperationDTO
                {
                    Id = operation.Id,
                    Caption = operation.Caption,
                    number = operation.number,
                    laborCost = operation.laborCost,
                    responsibleGroup = operation.responsibleGroup,
                    textOper=operation.textOper,
                    DateOfCreture = operation.DateOfCreture,
                    ParentOperationId = operation.ParentOperationId,
                    Attachments = MapAttachments(operation.Attachments),
                    ChildsOperations = operation.ChildsOperations.Count == 0 ? null :
                    MapChildStatusesRecursive(operation.ChildsOperations,operation.Id), // Рекурсивный вызов для вложенных статусов
                    Equipments = operation.Equipments.Select(equipment => new EquipmentDTO
                    {
                        Id = equipment.Id,
                        Caption = equipment.Caption,
                    }).ToList(),

                };
                childOperationsDTOs.Add(childStatusDTO);
            }
            return childOperationsDTOs;
        }
        public static List<OperationDTO> MapChildStatusesRecursive(List<Operation> operations, int parentId )
        {
            var childOperationsDTOs = new List<OperationDTO>();
            foreach (var operation in operations)
            {

                // Создаем и добавляем дочерний статус в список
                var childStatusDTO = new OperationDTO
                {
                    Id = operation.Id,
                    Caption = operation.Caption,
                    number = operation.number,
                    laborCost = operation.laborCost,
                    responsibleGroup = operation.responsibleGroup,
                    textOper = operation.textOper,  
                    DateOfCreture = operation.DateOfCreture,
                    ParentOperationId = operation.ParentOperationId,
                    Attachments = MapAttachments(operation.Attachments),
                    ChildsOperations = operation.ChildsOperations.Count == 0 ? null : 
                    MapChildStatusesRecursive(operation.ChildsOperations,
                    operation.Id)
                };
                childOperationsDTOs.Add(childStatusDTO);
            }
            return childOperationsDTOs;
        }
        public static List<AttachmentDTO> MapAttachments
         (List<Attachment> attachmentModels)
        {
            var list_of_AttacmentDTO = new List<AttachmentDTO>();
            foreach (var attachmentModel in attachmentModels)
            {
                var e = new AttachmentDTO();
                e.AttachmentData = attachmentModel.AttachmentData;
                e.Id = attachmentModel.Id;
                e.Category= attachmentModel.Category;
                list_of_AttacmentDTO.Add(e);
            }
            return list_of_AttacmentDTO;
        }

        public static List<Detail> MapDetails(List<DetailDTO> detailsDTO)
        {
            var details = new List<Detail>();
            foreach (var VARIABLE in detailsDTO)
            {
                var detail = new Detail()
                {
                    Caption = VARIABLE.Caption,
                    Quantity = VARIABLE.Quantity,
                };
                details.Add(detail);
            }

            return details;
        }
        public static List<DetailDTO> MapDetails(List<Detail> details)
        {
            var detailDtos = new List<DetailDTO>();
            foreach (var VARIABLE in details)
            {
                var detail = new DetailDTO()
                {
                    Caption = VARIABLE.Caption,
                    Quantity = VARIABLE.Quantity,
                };
                detailDtos.Add(detail);
            }

            return detailDtos;
        }
        public static List<Material> MapMaterials(List<MaterialDTO> materialDtos)
        {
            var materials = new List<Material>();
            foreach (var VARIABLE in materialDtos)
            {
                var detail = new Material()
                {
                    Caption = VARIABLE.Caption,
                    OrganizationCaption = VARIABLE.OrganizationCaption,
                    LoadWeightM3 = VARIABLE.LoadWeightM3,
                    ProfileAndSize = VARIABLE.ProfileAndSize,
                    Quantity = VARIABLE.Quantity,
                };
                materials.Add(detail);
            }

            return materials;
        }
        public static List<MaterialDTO> MapMaterials(List<Material> Materials)
        {
            var materialDtos = new List<MaterialDTO>();
            foreach (var VARIABLE in Materials)
            {
                var material = new MaterialDTO()
                {
                    Caption = VARIABLE.Caption,
                    OrganizationCaption = VARIABLE.OrganizationCaption,
                    LoadWeightM3 = VARIABLE.LoadWeightM3,
                    ProfileAndSize = VARIABLE.ProfileAndSize,
                    Quantity = VARIABLE.Quantity,
                };
                materialDtos.Add(material);
            }

            return materialDtos;
        }
        public static List<Operation> MapChildOperations(List<OperationDTO> operationDTOs)
        {
            var operations = new List<Operation>();
            foreach (var operationDTO in operationDTOs)
            {
                var operation = new Operation
                {
                    Id = operationDTO.Id,
                    Caption = operationDTO.Caption,
                    number=operationDTO.number,
                    laborCost = operationDTO.laborCost, 
                    responsibleGroup = operationDTO.responsibleGroup,
                    textOper=operationDTO.textOper,
                    DateOfCreture = operationDTO.DateOfCreture,
                    ParentOperationId = operationDTO.ParentOperationId,
                    Attachments = MapAttachments(operationDTO.Attachments),
                    ChildsOperations = operationDTO.ChildsOperations == null ?
                        new List<Operation>() :
                        MapChildStatusesRecursive(operationDTO.ChildsOperations, operationDTO.Id),
                    Equipments = operationDTO.Equipments.Select(equipment => new Equipment
                    {
                        Id = equipment.Id,
                        Caption = equipment.Caption,
                    }).ToList(),
                };
                operations.Add(operation);
            }
            return operations;
        }

        public static List<Operation> MapChildStatusesRecursive(List<OperationDTO> operationDTOs, int parentId)
        {
            var operations = new List<Operation>();
            foreach (var operationDTO in operationDTOs)
            {
                var operation = new Operation
                {
                    Id = operationDTO.Id,
                    Caption = operationDTO.Caption,
                    number = operationDTO.number,
                    laborCost = operationDTO.laborCost,
                    responsibleGroup = operationDTO.responsibleGroup,
                    textOper = operationDTO.textOper,
                    DateOfCreture = operationDTO.DateOfCreture,
                    ParentOperationId = operationDTO.ParentOperationId,
                    Attachments = MapAttachments(operationDTO.Attachments),
                    ChildsOperations = operationDTO.ChildsOperations == null ?
                        new List<Operation>() :
                        MapChildStatusesRecursive(operationDTO.ChildsOperations, operationDTO.Id)
                };
                operations.Add(operation);
            }
            return operations;
        }

        public static List<Attachment> MapAttachments(List<AttachmentDTO> attachmentDTOs)   
        {
            var attachments = new List<Attachment>();
            foreach (var attachmentDTO in attachmentDTOs)
            {
                var attachment = new Attachment
                {
                    Id = attachmentDTO.Id,
                    AttachmentData = attachmentDTO.AttachmentData,
                    Category = attachmentDTO.Category,
                };
                attachments.Add(attachment);
            }
            return attachments;
        }

    }
}
