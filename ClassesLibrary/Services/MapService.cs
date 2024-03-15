using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace ClassesLibrary.Services
{
    public static class MapService
    {
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
                    DateOfCreture = operation.DateOfCreture,
                    ParentOperationId = operation.ParentOperationId,
                    Attachments = MapAttachments(operation.Attachments),
                    ChildsOperations = operation.ChildsOperations.Count == 0 ? null :
                    MapChildStatusesRecursive(operation.ChildsOperations,operation.Id) // Рекурсивный вызов для вложенных статусов
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
         (List<Attachemnt> attachmentModels)
        {
            var list_of_AttacmentDTO = new List<AttachmentDTO>();
            foreach (var attachmentModel in attachmentModels)
            {
                var e = new AttachmentDTO();
                e.AttachmentData = attachmentModel.AttachmentData;
                e.Id = attachmentModel.Id;
                list_of_AttacmentDTO.Add(e);
            }
            return list_of_AttacmentDTO;
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

        public static List<Operation> MapChildStatusesRecursive(List<OperationDTO> operationDTOs, int parentId)
        {
            var operations = new List<Operation>();
            foreach (var operationDTO in operationDTOs)
            {
                var operation = new Operation
                {
                    Id = operationDTO.Id,
                    Caption = operationDTO.Caption,
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

        public static List<Attachemnt> MapAttachments(List<AttachmentDTO> attachmentDTOs)
        {
            var attachments = new List<Attachemnt>();
            foreach (var attachmentDTO in attachmentDTOs)
            {
                var attachment = new Attachemnt
                {
                    Id = attachmentDTO.Id,
                    AttachmentData = attachmentDTO.AttachmentData
                };
                attachments.Add(attachment);
            }
            return attachments;
        }

    }
}
