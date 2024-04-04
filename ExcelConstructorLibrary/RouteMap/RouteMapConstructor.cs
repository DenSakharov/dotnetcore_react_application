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

namespace ExcelConstructorLibrary.RouteMap
{
    public static class RouteMapConstructor
    {
        private static readonly string pathMainTemplate = "C:\\Uploads\\mainTemplateExcel.xlsx";
        public static void CreateCopyFileRouteMap(string destinationFilePath, Procces procces)
        {
            /*List<Oper> operations = new List<Oper>() 
            { 
                new Oper() {Caption="operation 1"},
                new Oper() {Caption="operation 2"},
                new Oper() {Caption="operation 3"},
                new Oper() {Caption="operation 4"},
                new Oper() {Caption="operation 5"},
            };*/

            //создание копии пустого шаблона
            File.Copy(pathMainTemplate, destinationFilePath, true);

            //добавление таблицы, для дальнейшего копирования 
            string rangeStart = "A34";
            string rangeEnd = "DF64";

            string destinationStart = "A65";
            try
            {
                func(destinationFilePath);
            }
            catch (Exception ex) { }
            try
            {
                //exportExcel(destinationFilePath, procces);
            }
            catch (Exception ex)
            {
                // Выводим подробности об ошибке
                Console.WriteLine("Произошла ошибка:");
                Console.WriteLine(ex.ToString());
            }

        }

        static void func(string filePath)
        {
            try
            {
                using (var package = new ExcelPackage(new FileInfo(filePath)))
                {
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    var worksheet = package.Workbook.Worksheets["МК"];

                    // Указываем исходный и целевой диапазоны
                    var sourceRange = worksheet.Cells["A34:DF64"];
                    var destinationRange = worksheet.Cells["A65:DF94"];

                    // Копируем содержимое исходного диапазона в целевой диапазон
                   /* sourceRange.Copy(destinationRange, ExcelRangeCopyOptionFlags.ExcludeFormulas |
                                                        ExcelRangeCopyOptionFlags.ExcludeMergedCells |
                                                        ExcelRangeCopyOptionFlags.ExcludeConditionalFormatting
                                                    );*/
                    sourceRange.Copy(destinationRange,
                 ExcelRangeCopyOptionFlags.ExcludeConditionalFormatting
                    );

                    // Сохраняем изменения
                    package.Save();
                }
            }
            catch (Exception ex)
            {
            }
        }

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
    }
}
