using Oper = ClassesLibrary.Models.Operation;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ClassesLibrary.Models;
using System.Text.RegularExpressions;
using ClassesLibrary.Services;
using ClassesLibrary.DataTransferObjects;
using netcorereactapp.Server.Services.Supporting.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using ExcelConstructorLibrary.RouteMap;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using Microsoft.Extensions.Configuration;

namespace netcorereactapp.Server.Services.Supporting
{
    public class SupportingService : ISupportingService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<SupportingService> _logger;
        private readonly IFileService _fileService;
        private readonly IConfiguration _configuration;
        public SupportingService(ApplicationContext dbContext,
            ILogger<SupportingService> logger,
            IFileService fileService,
            IConfiguration configuration)
        {
            _configuration = configuration;
            path_to_files = _configuration["Configuration:fileDirectoryPath"];
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        private readonly string path_to_files;
        public async Task<byte[]> CreateRouteMapTemplate(Procces procces=null)
        {
            try
            {
                // Получение последнего объекта из коллекции _dbContext.Procceses
                if (procces != null)
                {
                    procces = _dbContext.Procceses
                     .Include(o => o.Operations)
                        .ThenInclude(o => o.Equipments)
                    .Include(p => p.Operations)
                        .ThenInclude(o => o.Attachments)
                    .Include(p => p.Attachments)
                    .OrderBy(p => p.Id).LastOrDefault();
                }
                if (procces != null)
                {
                    foreach (var operation in procces.Operations)
                    {
                        LoadChildOperationsRecursive(operation);
                    }
                }
                if (procces != null)
                {
                    var path=_fileService.GetUniqueFileName(procces.Caption, ".xlsx");
                    return RouteMapConstructor.CreateCopyFileRouteMap(
                        path_to_files+path, 
                        procces,
                        path_to_files+ "mainTemplateExcel.xlsx"
                        );
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        void LoadChildOperationsRecursive(Operation operation)
        {
            _dbContext.Entry(operation)
                .Collection(o => o.ChildsOperations)
                .Load();
            _dbContext.Entry(operation)
                .Collection(o => o.Attachments)
                .Load();
            foreach (var childOperation in operation.ChildsOperations)
            {
                LoadChildOperationsRecursive(childOperation);
            }
        }
        public List<OperationDTO> ReadExcel(string filePath, string sheetName)
        {
            using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(filePath, true))
            {
                List<Oper> operations = new List<Oper>();

                WorkbookPart workbookPart = spreadsheetDocument.WorkbookPart;
                WorksheetPart worksheetPart = GetWorksheetPartByName(workbookPart, sheetName);
                if (worksheetPart != null)
                {
                    SheetData sheetData = worksheetPart.Worksheet.Elements<SheetData>().First();
                    Oper operation = new Oper();
                    var childOperation = new Oper();
                    List<Equipment> equipments = new List<Equipment>();
                    Equipment equipment = new Equipment();
                    foreach (Row row in sheetData.Elements<Row>())
                    {

                        foreach (Cell cell in row.Elements<Cell>())
                        {
                            string text = GetCellValue(cell, workbookPart);
                            if (text != null && text != "")
                            {
                                if (cell.CellReference.ToString().StartsWith('B'))
                                {
                                    /* if (operation.Caption != "" && operation.Caption != null)
                                     {
                                         if (!string.IsNullOrEmpty(operation.Caption) && !operations.Any(op => op.Caption == operation.Caption))
                                         {

                                         }
                                     }*/
                                    operation = new Oper();
                                    operation.Caption = GetCellValue(cell, workbookPart);
                                    operations.Add(operation);
                                }
                                if (cell.CellReference.ToString().StartsWith('C'))
                                {
                                    if (text.Contains("Примечание"))
                                    {
                                        childOperation = new Oper();
                                        childOperation.Caption = text;
                                        operation.ChildsOperations.Add(childOperation);
                                        continue;
                                    }
                                    // Регулярное выражение для извлечения цифрового идентификатора
                                    Regex regex = new Regex(@"^\d+");

                                    // Ищем соответствия в строке
                                    Match match = regex.Match(text);

                                    // Если найдено соответствие, извлекаем идентификатор
                                    if (match.Success)
                                    {
                                        childOperation = new Oper();
                                        childOperation.Caption = text;
                                        operation.ChildsOperations.Add(childOperation);
                                        continue;
                                    }

                                    childOperation.Caption += " " + text;
                                }
                                if (cell.CellReference.ToString().StartsWith('D'))
                                {
                                    equipments = new List<Equipment>();

                                }
                                if (cell.CellReference.ToString().StartsWith('E'))
                                {
                                    /* if (equipment.Caption != "" && equipment.Caption != null) 
                                     { 
                                         equipments.Add(equipment); 
                                     }*/
                                    equipment = new Equipment();
                                    equipment.Caption = GetCellValue(cell, workbookPart);
                                    if (!string.IsNullOrEmpty(operation.Caption) && !operation.Equipments.Any(op => op.Caption == equipment.Caption))
                                    {
                                        operation.Equipments.Add(equipment);
                                    }

                                }
                            }

                        }
                    }
                    //Console.WriteLine(operations.Count);
                    var opertaionsDTO = MapService.MapChildOperations(operations);
                    return opertaionsDTO;
                }
                else
                {
                    Console.WriteLine("Sheet not found");
                    return null;
                }
            }
        }

        private static WorksheetPart GetWorksheetPartByName(WorkbookPart workbookPart, string sheetName)
        {
            Sheet sheet = workbookPart.Workbook.Descendants<Sheet>().FirstOrDefault(s => s.Name == sheetName);
            if (sheet != null)
            {
                return workbookPart.GetPartById(sheet.Id) as WorksheetPart;
            }
            return null;
        }
        private static string GetCellValue(Cell cell, WorkbookPart workbookPart)
        {
            string value = cell.InnerText;

            if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
            {
                SharedStringTablePart stringTablePart = workbookPart.SharedStringTablePart;
                if (stringTablePart != null)
                {
                    value = stringTablePart.SharedStringTable.ElementAt(int.Parse(value)).InnerText;

                }
            }
            else if (cell.CellFormula != null)
            {
                // Если в ячейке есть формула, то вычисляем ее значение
                value = cell.CellValue.InnerText;
            }

            return value;
        }
    }
}
