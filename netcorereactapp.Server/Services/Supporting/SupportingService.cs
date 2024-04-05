using Oper = ClassesLibrary.Models.Operation;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ClassesLibrary.Models;
using System.Text.RegularExpressions;
using System.Drawing;
using Color = System.Drawing.Color;
using ClassesLibrary.Services;
using ClassesLibrary.DataTransferObjects;
using netcorereactapp.Server.Services.Supporting.Interfaces;
using netcorereactapp.Server.Services.ModelServices;
using netcorereactapp.Server.Services.PostgreService;
using ExcelConstructorLibrary.RouteMap;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace netcorereactapp.Server.Services.Supporting
{
    public class SupportingService : ISupportingService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<SupportingService> _logger;
        public SupportingService(ApplicationContext dbContext,
            ILogger<SupportingService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }
        public async Task CreateRouteMapTemplate(string path)
        {
            try
            {
                // Получение последнего объекта из коллекции _dbContext.Procceses
                var lastProcces = _dbContext.Procceses
                     .Include(o => o.Operations)
                        .ThenInclude(o => o.Equipments)
                    .Include(p => p.Operations)
                        .ThenInclude(o => o.Attachments)
                    .Include(p => p.Attachments)
                    .OrderBy(p => p.Id).LastOrDefault();
                if (lastProcces != null)
                {
                    foreach (var operation in lastProcces.Operations)
                    {
                        LoadChildOperationsRecursive(operation);
                    }
                }
                if (lastProcces != null)
                {
                    RouteMapConstructor.CreateCopyFileRouteMap(path, lastProcces);
                }
                else
                {
                    // Коллекция пуста, обработайте это соответствующим образом
                }
            }
            catch (Exception ex)
            {
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
