using ClassesLibrary.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Diagnostics;
using System.Text.RegularExpressions;
using Oper = ClassesLibrary.Models.Operation;
using Excel = Microsoft.Office.Interop.Excel;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using DocumentFormat.OpenXml.Wordprocessing;
using System.IO.Packaging;

namespace ExcelConstructorLibrary.RouteMap
{
    public static class RouteMapConstructor
    {
        //private static readonly string pathMainTemplate = "C:\\Uploads\\mainTemplateExcel.xlsx";
        static string destinationFilePath;
        public static byte[] CreateCopyFileRouteMap(string destinationFilePath_, Procces procces,string pathMainTemplate)
        {
            destinationFilePath = destinationFilePath_;
            //создание копии пустого шаблона
            File.Copy(pathMainTemplate, destinationFilePath, true);

            get_template_table();
            //добавление таблицы, для дальнейшего копирования 
            int rangeStart = 34;
            int rangeEnd = 64;
            /*
                        int destinationStart = 65;
                        int destinationEnd = 95;
                        func(destinationStart, destinationEnd);
                        destinationStart = 96;
                        destinationEnd = 126;
                        func(destinationStart, destinationEnd);*/
            try
            {
                return export_excel(destinationFilePath, procces);
            }
            catch (Exception ex)
            {
                // Выводим подробности об ошибке
                Console.WriteLine("Произошла ошибка:");
                Console.WriteLine(ex.ToString());
                return null;
            }

        }
        static ExcelRange sourceRange;
        static void get_template_table()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(new FileInfo(destinationFilePath)))
            {
                var worksheet = package.Workbook.Worksheets["МК"];
                sourceRange = worksheet.Cells[$"A34:DF64"];
            }
        }
        static void insertTemplateTable(int destinationStart, int destinationEnd, ExcelPackage package)
        {
            try
            {
                var worksheet = package.Workbook.Worksheets["МК"];

                // Указываем исходный и целевой диапазоны
                //var sourceRange = worksheet.Cells[$"A{rangeStart}:DF{rangeEnd}"];

                var head_table_sourceRange = worksheet.Cells[$"A34:DF46"];
                var body_table_sourceRange = worksheet.Cells[$"A47:DF64"];

                var head_table_destinationRange = worksheet.Cells[$"A{destinationStart}:DF{destinationStart + 12}"];
                var body_table_destinationRange = worksheet.Cells[$"A{destinationStart + 13}:DF{destinationEnd}"];

               /* sourceRange.Copy(destinationRange,
             //ExcelRangeCopyOptionFlags.ExcludeConditionalFormatting
             ExcelRangeCopyOptionFlags.ExcludeValues
                );*/

                head_table_sourceRange.Copy(head_table_destinationRange,
                    ExcelRangeCopyOptionFlags.ExcludeConditionalFormatting
                    );
                body_table_sourceRange.Copy(body_table_destinationRange,
                    ExcelRangeCopyOptionFlags.ExcludeValues
                    );

                // Сохраняем изменения
                package.Save();
            }
            catch (Exception ex)
            {
            }
        }
        static byte[] export_excel(string destinationFilePath, Procces procces)
        {
            //get_template_table();
            using (var package = new ExcelPackage(new FileInfo(destinationFilePath)))
            {
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                var worksheet = package.Workbook.Worksheets["МК"];
                var operations = procces.Operations;

                int row = 19;

                int index = 0;
                int countPageOperation = 0;

                int contRows = procces.Operations.Count
                    + procces.Operations.Sum(oper => oper.ChildsOperations.Count)
                    + procces.Operations.Sum(oper => oper.Equipments.Count);

                foreach (var operation in operations)
                {
                    /* var cell = worksheet.Cells[row, 23];
                     cell.Value = operation.Caption;
                     var neighborCell = worksheet.Cells[row, 1];
                     neighborCell.Value = "A";*/
                    worksheet.Cells[$"W{row}"].Value = operation.Caption;
                    worksheet.Cells[$"A{row}"].Value = "A";

                    worksheet.Cells[$"R{row}"].Value = operation.number;
                    worksheet.Cells[$"F{row}"].Value = operation.responsibleGroup;
                    worksheet.Cells[$"CY{row}"].Value = operation.laborCost;

                    row++;
                    countPageOperation++;
                    (row, countPageOperation) = IncrementRow(row, countPageOperation, package);

                    foreach (var equipment in operation.Equipments)
                    {
                        worksheet.Cells[row, 23].Value = equipment.Caption;
                        worksheet.Cells[row, 1].Value = "Б";

                        row++;
                        countPageOperation++;
                        (row, countPageOperation) = IncrementRow(row, countPageOperation, package);
                    }

                    foreach (var childOperation in operation.ChildsOperations)
                    {
                        worksheet.Cells[row, 23].Value = childOperation.Caption;
                        worksheet.Cells[row, 1].Value = "О";
                        row++;
                        countPageOperation++;
                        (row, countPageOperation) = IncrementRow(row, countPageOperation, package);
                    }
                }

                /*  for (int row = startRow; 
                      ; row++)
                  {
                      try
                      {

                          //var excelRow = worksheet.Cells[row, 1, row, worksheet.Dimension.End.Column];

                          foreach (var cell in worksheet.Cells)
                          {
                              if (cell.Start.Column == 23 && cell.Start.Row == row)
                              {
                                  Oper operation;
                                  try
                                  {
                                      operation = operations[index];
                                  }catch (Exception ex)
                                  {
                                      break;
                                  }
                                  cell.Value = operation.Caption;
                                  var neighborCell = worksheet.Cells[row, 1];
                                  neighborCell.Value = "A";
                                  row++;
                                  countPageOperation++;
                                  (row, countPageOperation) = IncrementRow(row, countPageOperation);

                                  foreach (var equipment in operation.Equipments)
                                  {
                                      worksheet.Cells[row, 23].Value = equipment.Caption;
                                      worksheet.Cells[row, 1].Value = "Б";
                                      row++;
                                      countPageOperation++;
                                      (row, countPageOperation) = IncrementRow(row, countPageOperation);
                                  }

                                  foreach (var childOperation in operation.ChildsOperations)
                                  {
                                      worksheet.Cells[row, 23].Value = childOperation.Caption;
                                      worksheet.Cells[row, 1].Value = "О";
                                      row++;
                                      countPageOperation++;
                                      (row, countPageOperation) = IncrementRow(row, countPageOperation);
                                  }
                                  index++;
                                  row--;
                              }
                          }


                      }
                      catch (Exception ex)
                      {
                          break;
                          // Handle exceptions if needed
                      }
                  }*/

                package.Save();

                return package.GetAsByteArray();
            }

        }
        private static (int, int) IncrementRow(int currentRow, int count, ExcelPackage package)
        {
            if (currentRow == 33)
            {
                return (currentRow + 14, 0);
            }
            else
            {
                if (count == 17)
                {
                    int destinationStart = currentRow + 1;
                    int destinationEnd = destinationStart + 30;
                    insertTemplateTable(destinationStart, destinationEnd, package);

                    return (currentRow + 14, 0);
                }
                else
                {
                    return (currentRow, count);
                }
            }
        }
        #region Open XML SDK Libary Logics
        static void exportExcel(string destinationFilePath, Procces procces)
        {

            using (FileStream fileStream = File.Open(destinationFilePath, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite))
            {
                // Работаем с файлом Excel через FileStream
                SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(fileStream, true);


                WorkbookPart workbookPart = spreadsheetDocument.WorkbookPart;
                WorksheetPart worksheetPart = GetWorksheetPartByName(workbookPart, "МК");
                if (worksheetPart != null)
                {
                    SheetData sheetData = worksheetPart.Worksheet.Elements<SheetData>().First();
                    var operations = procces.Operations;

                    int startRow = 19;
                    int endRow = 32;

                    int beetween_distance = 14;

                    // Начальный индекс элемента коллекции operations
                    int index = 0;

                    int step = 14;

                    int countPageOperation = 0;




                    // Перебираем промежутки строк
                    for (int row = startRow; row <= sheetData.Elements<Row>().Count(); row++
                        )
                    {
                        try
                        {
                            // Получаем объект Oper для текущей строки
                            Oper operation = operations[index];

                            // Получаем текущую строку Excel
                            Row excelRow = GetRowByIndex(sheetData, row);

                            if (excelRow != null)
                            {

                                foreach (Cell cell in excelRow.Elements<Cell>())
                                {
                                    string cellReference = cell.CellReference.ToString();

                                    // Получаем номер строки и столбца из ссылки на ячейку
                                    string columnName = Regex.Replace(cellReference, @"\d", "");
                                    int rowNumber = int.Parse(Regex.Replace(cellReference, "[^0-9]+", string.Empty));
                                    if (cell.CellReference == $"W{row}")
                                    {
                                        SetVaule(cell, operation.Caption);
                                        cell.CellValue = new CellValue(operation.Caption);
                                        cell.DataType = new EnumValue<CellValues>(CellValues.String);

                                        // Находим соседнюю ячейку
                                        string neighborCellReference = $"A{row}";
                                        Cell neighborCell = GetCellByReference(worksheetPart, neighborCellReference);

                                        // Если ячейка найдена, записываем значение
                                        if (neighborCell != null)
                                        {
                                            SetVaule(neighborCell, "A");
                                            neighborCell.CellValue = new CellValue("A");
                                            neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
                                            try
                                            {
                                                row++;
                                                countPageOperation++;
                                                (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart//, cellsToCopy
                                                      );
                                            }
                                            catch (Exception ex)
                                            {

                                            }
                                            foreach (var equipment in operation.Equipments)
                                            {
                                                neighborCellReference = $"W{row}";
                                                neighborCell = GetCellByReference(worksheetPart, neighborCellReference);

                                                // Если ячейка найдена, записываем значение
                                                if (neighborCell != null)
                                                {
                                                    SetVaule(neighborCell, equipment.Caption);
                                                    neighborCell.CellValue = new CellValue(equipment.Caption);
                                                    neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
                                                }
                                                neighborCellReference = $"A{row}";
                                                neighborCell = GetCellByReference(worksheetPart, neighborCellReference);
                                                if (neighborCell != null)
                                                {
                                                    SetVaule(neighborCell, "Б");
                                                    neighborCell.CellValue = new CellValue("Б");
                                                    neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
                                                }
                                                try
                                                {
                                                    row++;
                                                    countPageOperation++;
                                                    (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart//, cellsToCopy
                                                      );
                                                }
                                                catch (Exception ex)
                                                {

                                                }
                                            }
                                            foreach (var childOperation in operation.ChildsOperations)
                                            {
                                                neighborCellReference = $"W{row}";
                                                neighborCell = GetCellByReference(worksheetPart, neighborCellReference);

                                                // Если ячейка найдена, записываем значение
                                                if (neighborCell != null)
                                                {
                                                    SetVaule(neighborCell, childOperation.Caption);
                                                    neighborCell.CellValue = new CellValue(childOperation.Caption);
                                                    neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
                                                }
                                                neighborCellReference = $"A{row}";
                                                neighborCell = GetCellByReference(worksheetPart, neighborCellReference);
                                                if (neighborCell != null)
                                                {
                                                    SetVaule(neighborCell, "О");
                                                    neighborCell.CellValue = new CellValue("О");
                                                    neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
                                                }
                                                try
                                                {
                                                    row++;
                                                    countPageOperation++;
                                                    (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart//, cellsToCopy
                                                        );
                                                }
                                                catch (Exception ex)
                                                {

                                                }
                                            }
                                            row--;
                                        }
                                        else
                                        {
                                            Console.WriteLine($"Ячейка {neighborCellReference} не найдена.");
                                        }
                                    }
                                }
                            }
                            index++; // Увеличиваем индекс текущего элемента коллекции operations
                        }
                        catch (Exception ex) { }
                        finally { spreadsheetDocument.Save(); }
                    }

                    spreadsheetDocument.Save();
                }
            }

        }
        public static void SetVaule(Cell neighborCell, string value)
        {
            neighborCell.CellValue = new CellValue(value);
            neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
        }

        private static (int, int) IncrementRow(int currentRow, int count, WorksheetPart worksheetPart//,IEnumerable<Cell> cellsToCopy
            )
        {
            if (currentRow == 33)
            {
                return (currentRow + 14, 0);
            }
            else
            {
                if (count == 17)
                {
                    /* string neighborCellReference = $"A{currentRow+2}";
                     var neighborCell = GetCellByReference(worksheetPart, neighborCellReference);
                     InsertTemplatePartRouteMap(cellsToCopy,Convert.ToUInt32( currentRow + 2), worksheetPart);*/
                    return (currentRow + 14, 0);
                }
                else
                {
                    return (currentRow, count);
                }
            }
        }

        public static Cell GetCellByReference(WorksheetPart worksheetPart, string cellReference)
        {
            // Проверяем наличие рабочей части листа
            if (worksheetPart == null)
            {
                return null;
            }

            // Получаем доступ к листу
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();

            // Ищем ячейку с указанной ссылкой
            foreach (Row row in sheetData.Elements<Row>())
            {
                foreach (Cell cell in row.Elements<Cell>())
                {
                    if (cell.CellReference.Value == cellReference)
                    {
                        return cell;
                    }
                }
            }

            // Если ячейка не найдена, возвращаем null
            return null;
        }
        private static Row GetRowByIndex(SheetData sheetData, int index)
        {
            // Используем LINQ для поиска строки по её индексу
            return sheetData.Elements<Row>().FirstOrDefault(row => GetRowIndex(row) == index);
        }
        private static int GetRowIndex(Row row)
        {
            // Получаем строковое представление индекса строки (например, "A1")
            string rowIndex = row.RowIndex.InnerText;

            // Удаляем все символы, кроме цифр
            string numericIndex = Regex.Replace(rowIndex, "[^0-9]+", string.Empty);

            // Преобразуем строковое представление в числовой индекс
            if (int.TryParse(numericIndex, out int index))
            {
                return index;
            }
            else
            {
                // Если не удалось преобразовать индекс, возвращаем -1 или другое значение, указывающее на ошибку
                return -1;
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
        #endregion
    }
}
