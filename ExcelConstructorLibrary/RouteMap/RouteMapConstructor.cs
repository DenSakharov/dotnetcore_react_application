using ClassesLibrary.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Text.RegularExpressions;
using Oper = ClassesLibrary.Models.Operation;

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

            try
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

                        //добавление таблицы, для дальнейшего копирования 
                        string rangeStart = "A34";
                        string rangeEnd = "DF64"; // Например, диапазон A1:C10
                        IEnumerable<Cell> cellsToCopy = GetCellRange(worksheetPart, rangeStart, rangeEnd);

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
                                            /*cell.CellValue = new CellValue(operation.Caption);
                                            cell.DataType = new EnumValue<CellValues>(CellValues.String);*/

                                            // Находим соседнюю ячейку
                                            string neighborCellReference = $"A{row}";
                                            Cell neighborCell = GetCellByReference(worksheetPart, neighborCellReference);

                                            // Если ячейка найдена, записываем значение
                                            if (neighborCell != null)
                                            {
                                                SetVaule(neighborCell, "A");
                                                /*neighborCell.CellValue = new CellValue("A");
                                                neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);*/
                                                try
                                                {
                                                    row++;
                                                    countPageOperation++;
                                                    (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart, cellsToCopy);
                                                }catch (Exception ex)
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
                                                        /*neighborCell.CellValue = new CellValue(equipment.Caption);
                                                        neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);*/
                                                    }
                                                    neighborCellReference = $"A{row}";
                                                    neighborCell = GetCellByReference(worksheetPart, neighborCellReference);
                                                    if (neighborCell != null)
                                                    {
                                                        SetVaule(neighborCell, "Б");
                                                        /*neighborCell.CellValue = new CellValue("Б");
                                                        neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);*/
                                                    }
                                                    try
                                                    {
                                                        row++;
                                                        countPageOperation++;
                                                        (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart, cellsToCopy);
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
                                                        SetVaule(neighborCell,childOperation.Caption);
                                                        /*neighborCell.CellValue = new CellValue(childOperation.Caption);
                                                        neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);*/
                                                    }
                                                    neighborCellReference = $"A{row}";
                                                    neighborCell = GetCellByReference(worksheetPart, neighborCellReference);
                                                    if (neighborCell != null)
                                                    {
                                                        SetVaule(neighborCell, "О");
                                                        /*neighborCell.CellValue = new CellValue("О");
                                                        neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);*/
                                                    }
                                                    try
                                                    {
                                                        row++;
                                                        countPageOperation++;
                                                        (row, countPageOperation) = IncrementRow(row, countPageOperation, worksheetPart, cellsToCopy);
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
            catch (Exception ex)
            {
                // Выводим подробности об ошибке
                Console.WriteLine("Произошла ошибка:");
                Console.WriteLine(ex.ToString());
            }

        }
        public static void SetVaule(Cell neighborCell,string value)
        {
            neighborCell.CellValue = new CellValue(value);
            neighborCell.DataType = new EnumValue<CellValues>(CellValues.String);
        }

        private static (int, int) IncrementRow(int currentRow, int count, WorksheetPart worksheetPart, IEnumerable<Cell> cellsToCopy)
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
        static void InsertTemplatePartRouteMap(IEnumerable<Cell> cellsToCopy, uint nextRowIndex, WorksheetPart worksheetPart)
        {
            if (cellsToCopy == null)
            {
                // Добавьте обработку ситуации, когда cellsToCopy равен null
                return;
            }

            if (worksheetPart == null)
            {
                // Добавьте обработку ситуации, когда worksheetPart равен null
                return;
            }

            foreach (Cell cell in cellsToCopy)
            {
                if (cell != null && cell.CellValue != null)
                {
                    // Получаем значение и стиль ячейки для копирования
                    string cellValue = cell.CellValue.Text;
                    uint? styleIndex = cell.StyleIndex;

                    // Формируем ссылку на новую ячейку в строке ниже
                    string newCellReference = cell.CellReference.Value.Replace(nextRowIndex.ToString(), (nextRowIndex + 1).ToString());

                    // Создаем новую ячейку
                    Cell newCell = InsertCellInWorksheet(worksheetPart, newCellReference);

                    // Устанавливаем значение и стиль новой ячейки
                    newCell.CellValue = new CellValue(cellValue);
                    if (styleIndex.HasValue)
                    {
                        newCell.StyleIndex = styleIndex.Value;
                    }
                }
            }
        }

        public static IEnumerable<Cell> GetCellRange(WorksheetPart worksheetPart, string startCellReference, string endCellReference)
        {
            SheetData sheetData = worksheetPart.Worksheet.Elements<SheetData>().FirstOrDefault();
            if (sheetData == null)
            {
                return null;
            }

            Cell startCell = GetCellByReference(worksheetPart, startCellReference);
            Cell endCell = GetCellByReference(worksheetPart, endCellReference);

            if (startCell == null || endCell == null)
            {
                return null;
            }

            // Находим индекс начальной и конечной строки
            int startRowIndex = GetRowIndexFromCellReference(startCellReference);
            int endRowIndex = GetRowIndexFromCellReference(endCellReference);

            // Находим индекс начального и конечного столбца
            int startColumnIndex = GetColumnIndexFromCellReference(startCellReference);
            int endColumnIndex = GetColumnIndexFromCellReference(endCellReference);

            // Перебираем ячейки в диапазоне и добавляем их в список
            List<Cell> cellRange = new List<Cell>();
            for (int rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++)
            {
                for (int columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++)
                {
                    string cellReference = GetCellReference(columnIndex, rowIndex);
                    Cell cell = GetCellByReference(worksheetPart, cellReference);
                    cellRange.Add(cell);
                }
            }

            return cellRange;
        }
        public static int GetRowIndexFromCellReference(string cellReference)
        {
            if (string.IsNullOrEmpty(cellReference))
            {
                throw new ArgumentNullException(nameof(cellReference));
            }

            int index = 0;
            foreach (char c in cellReference)
            {
                if (char.IsDigit(c))
                {
                    break;
                }
                index++;
            }

            return int.Parse(cellReference.Substring(index)) - 1;
        }

        public static int GetColumnIndexFromCellReference(string cellReference)
        {
            if (string.IsNullOrEmpty(cellReference))
            {
                throw new ArgumentNullException(nameof(cellReference));
            }

            int index = 0;
            foreach (char c in cellReference)
            {
                if (char.IsLetter(c))
                {
                    break;
                }
                index++;
            }

            string columnName = cellReference.Substring(0, index);
            int columnIndex = 0;
            int multiplier = 1;
            for (int i = columnName.Length - 1; i >= 0; i--)
            {
                columnIndex += (columnName[i] - 'A' + 1) * multiplier;
                multiplier *= 26;
            }

            return columnIndex - 1;
        }

        public static string GetCellReference(int columnIndex, int rowIndex)
        {
            int dividend = columnIndex + 1;
            string columnName = string.Empty;

            while (dividend > 0)
            {
                int modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar('A' + modulo) + columnName;
                dividend = (dividend - modulo) / 26;
            }

            return columnName + rowIndex;
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
        public static Cell InsertCellInWorksheet(WorksheetPart worksheetPart, string cellReference)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();

            Cell refCell = null;
            string cellColumnName = GetColumnName(cellReference);
            uint cellRowIndex = GetRowIndex(cellReference);

            // Ищем ячейку, после которой нужно вставить новую ячейку
            foreach (Row row in sheetData.Elements<Row>())
            {
                foreach (Cell cell in row.Elements<Cell>())
                {
                    if (string.Compare(cell.CellReference.Value, cellReference, true) > 0)
                    {
                        refCell = cell;
                        break;
                    }
                }
                if (refCell != null)
                {
                    break;
                }
            }

            // Если такая ячейка не найдена, создаем ее в конце строки
            if (refCell == null)
            {
                Row firstRow = sheetData.Elements<Row>().FirstOrDefault();
                if (firstRow != null)
                {
                    refCell = firstRow.Elements<Cell>().FirstOrDefault();
                }
            }

            // Создаем новую ячейку
            Cell newCell = new Cell() { CellReference = new DocumentFormat.OpenXml.StringValue(cellReference) };
            refCell?.InsertBeforeSelf(newCell);

            return newCell;
        }

        // Вспомогательные методы для получения индекса строки и столбца из ссылки на ячейку

        private static string GetColumnName(string cellReference)
        {
            string columnName = string.Empty;
            foreach (char ch in cellReference)
            {
                if (char.IsLetter(ch))
                    columnName += ch;
                else
                    break;
            }
            return columnName;
        }

        private static uint GetRowIndex(string cellReference)
        {
            string rowIndex = cellReference.Substring(cellReference.IndexOfAny("0123456789".ToCharArray()));
            return uint.Parse(rowIndex);
        }
    }
}
