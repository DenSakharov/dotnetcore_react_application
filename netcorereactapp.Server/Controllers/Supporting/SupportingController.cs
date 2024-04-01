using Oper=ClassesLibrary.Models.Operation;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClassesLibrary.Models;
using System.Security.Policy;
using System.Text.RegularExpressions;
using netcorereactapp.Server.Services.ModelServices;
using System.Drawing;
using System.Linq;
using System.Collections.Generic;
using Color = System.Drawing.Color;
namespace netcorereactapp.Server.Controllers.Supporting
{
    [Authorize]
    [ApiController]
    [Route("supporting")]
    public class SupportingController: ControllerBase
    {
        public SupportingController()
        {

        }
        private readonly string path_excel_template = "C:\\Uploads\\templates.xlsx";
        [HttpGet("template_operations")]
        public async Task<List<Oper>> GetTemplateOpertionsList()
        {
            var lst=ReadExcel(path_excel_template, "операции");
            //ReadExcel(path_excel_template, "оборудование");
            return lst;
        }
        public static List<Oper> ReadExcel(string filePath, string sheetName)
        {
            using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(filePath, false))
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
                                    if (operation.Caption != "" && operation.Caption != null)
                                    {
                                        if (!string.IsNullOrEmpty(operation.Caption) && !operations.Any(op => op.Caption == operation.Caption))
                                        {
                                            operations.Add(operation);
                                        }

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
                                    string pattern = @"\b[А-ЯЁ][а-яё]*\b";

                                    regex = new Regex(pattern);

                                    match = regex.Match(text);
                                    if (match.Success)
                                    {
                                       
                                        operation = new Oper();
                                        operation.Caption = GetCellValue(cell, workbookPart);
                                    }
                                    else
                                    {
                                        childOperation.Caption += " " + text;
                                    }
                                }
                                if (cell.CellReference.ToString().StartsWith('C'))
                                {
                                    equipments = new List<Equipment>();
                                    
                                }
                                if (cell.CellReference.ToString().StartsWith('D'))
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
                    return operations;
                }
                else
                {
                    Console.WriteLine("Sheet not found");
                    return null;
                }
            }
        }
        // Метод для получения цвета заливки ячейки
        private static Color? GetFillColor(WorkbookPart workbookPart, CellFormat cellFormat)
        {
            if (cellFormat != null && cellFormat.FillId != null)
            {
                Fill fill = workbookPart.WorkbookStylesPart.Stylesheet.Fills.ChildElements[(int)cellFormat.FillId.Value] as Fill;
                if (fill != null && fill.PatternFill != null && fill.PatternFill.BackgroundColor != null && fill.PatternFill.BackgroundColor.Rgb != null)
                {
                    Color color = ColorTranslator.FromHtml(fill.PatternFill.BackgroundColor.Rgb.Value);
                    return color;
                }
            }
            return null;
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
