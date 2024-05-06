using ClassesLibrary.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Text.RegularExpressions;
using Oper = ClassesLibrary.Models.Operation;
using OfficeOpenXml;
using System.Text;

namespace ExcelConstructorLibrary.RouteMap
{
    public static class RouteMapConstructor
    {
        //private static readonly string pathMainTemplate = "C:\\Uploads\\mainTemplateExcel.xlsx";
        static string destinationFilePath;
        public static byte[] CreateCopyFileRouteMap(string destinationFilePath_, Procces procces, string pathMainTemplate)
        {
            destinationFilePath = destinationFilePath_;
            //создание копии пустого шаблона
            File.Copy(pathMainTemplate, destinationFilePath, true);

            //get_template_table();
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

        /*static void get_template_table()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(new FileInfo(destinationFilePath)))
            {
                var worksheet = package.Workbook.Worksheets["МК"];
            }
        }*/


        static byte[] export_excel(string destinationFilePath, Procces procces)
        {
            //get_template_table();
            using (var package = new ExcelPackage(new FileInfo(destinationFilePath)))
            {
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                var worksheet = package.Workbook.Worksheets["МК"];
                //данные процесса в шапке 1 ой страницы
                ExcelAssistant.SetCellValue(worksheet, $"AR11", procces.Caption, true, 12);
                var currentValue = worksheet.Cells[$"CO8"].Value;
                ExcelAssistant.SetCellValue(worksheet, $"CO8", currentValue.ToString() + procces.number, false, 12);
                //ExcelAssistant.SetCellValue(worksheet, $"F13", procces.material, false, 10);
                //ExcelAssistant.SetCellValue(worksheet, $"BI15", procces.profile_size, false, 10);
                //ExcelAssistant.SetCellValue(worksheet, $"CD15", procces.kd, false, 10);
                //ExcelAssistant.SetCellValue(worksheet, $"CJ15", procces.m3, false, 10);


                var operations = procces.Operations;

                int row = 19;

                int index = 0;
                int countPageOperation = 0;

                int contRows = procces.Operations.Count
                    + procces.Operations.Sum(oper => oper.ChildsOperations.Count)
                    + procces.Operations.Sum(oper => oper.Equipments.Count);

                foreach (var operation in operations)
                {
                    insertMainOperationRowTemplateStringWithoutValue(row, package);
                    ExcelAssistant.SetCellValue(worksheet, $"W{row}", operation.Caption, true);
                    ExcelAssistant.SetCellValue(worksheet, $"A{row}", "A", true);
                    ExcelAssistant.SetCellValue(worksheet, $"R{row}", operation.number, true);
                    ExcelAssistant.SetCellValue(worksheet, $"F{row}", operation.responsibleGroup, true);
                    ExcelAssistant.SetCellValue(worksheet, $"DF{row}", operation.laborCost, true);

                    row++;
                    countPageOperation++;
                    (row, countPageOperation) = ExcelAssistant.IncrementRow(row, countPageOperation, package);
                    if (operation.Equipments.Count != 0)
                    {
                        StringBuilder sb = new StringBuilder();
                        foreach (var elem in operation.Equipments)
                        {
                            sb.Append(elem.Caption.ToString() + " ");
                        }
                        insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                        var cellWidth = ExcelAssistant.GetCellsWidth(worksheet, $"W{row}:DE{row}");
                        var res_lst = ExcelAssistant.SplitStringToFitCell(sb.ToString(), cellWidth * 7.5);
                        foreach (var lst in res_lst)
                        {
                            var res = lst.ToArray();
                            insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                            ExcelAssistant.SetCellValue(worksheet, $"W{row}", res[res.Length - 1], false);
                            ExcelAssistant.SetCellValue(worksheet, $"A{row}", "Б", false);

                            row++;
                            countPageOperation++;
                            (row, countPageOperation) = ExcelAssistant.IncrementRow(row, countPageOperation, package);
                        }
                    }
                    #region Старая логика для инструментов
                    /* foreach (var equipment in operation.Equipments)
                     {
                         //логика объеденения 
                         insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                         var cellWidth = GetCellsWidth(worksheet, $"W{row}:DE{row}");
                         float oldCellValueWidth;
                         try
                         {
                             currentValue = worksheet.Cells[$"W{row}"].Value;
                             oldCellValueWidth = GetWidthString(currentValue.ToString());
                         }catch (Exception ex) { oldCellValueWidth = 0; }
                         var valueWidth = GetWidthString(equipment.Caption);
                         if (cellWidth*8 <
                             oldCellValueWidth+valueWidth)
                         {
                             row++;
                             countPageOperation++;
                             (row, countPageOperation) = IncrementRow(row, countPageOperation, package);

                             insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                             SetCellValue(worksheet, $"W{row}", equipment.Caption, false);
                             SetCellValue(worksheet, $"A{row}", "Б", false);

                             row++;
                             countPageOperation++;
                             (row, countPageOperation) = IncrementRow(row, countPageOperation, package);
                         }
                         else
                         {
                             // Получаем текущее значение ячейки
                             currentValue = worksheet.Cells[$"W{row}"].Value;

                             // Проверяем, если текущее значение не пустое, иначе просто присваиваем новое значение
                             if (currentValue != null)
                             {
                                 // Конкатенируем текущее значение с новым текстом
                                 //worksheet.Cells[$"W{row}"].Value = currentValue.ToString() + equipment.Caption;
                                 insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                                 SetCellValue(worksheet, $"W{row}", currentValue.ToString() + equipment.Caption, false);
                                 SetCellValue(worksheet, $"A{row}", "Б", false);
                             }
                             else
                             {
                                 // Если текущее значение пустое, просто присваиваем новое значение
                                 insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                                 SetCellValue(worksheet, $"W{row}",  equipment.Caption, false);
                                 SetCellValue(worksheet, $"A{row}", "Б", false);
                                 //worksheet.Cells[$"W{row}"].Value = equipment.Caption;
                             }
                         }
                     }
                     if (operation.Equipments.Count != 0)
                     {
                         row++;
                         countPageOperation++;
                         (row, countPageOperation) = IncrementRow(row, countPageOperation, package);
                     }*/
                    #endregion  
                    //логика для добвления текста операции
                    try
                    {

                        insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                        var cellWidth = ExcelAssistant.GetCellsWidth(worksheet, $"W{row}:DE{row}");
                        var res_lst = ExcelAssistant.SplitStringToFitCell(operation.textOper, cellWidth * 7.3);
                        foreach (var lst in res_lst)
                        {
                            var res = lst.ToArray();
                            insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                            ExcelAssistant.SetCellValue(worksheet, $"W{row}", res[res.Length - 1], false);
                            ExcelAssistant.SetCellValue(worksheet, $"A{row}", "О", false);

                            row++;
                            countPageOperation++;
                            (row, countPageOperation) = ExcelAssistant.IncrementRow(row, countPageOperation, package);
                        }
                    }
                    catch
                    {

                    }
                    //логика заполнения Excel для дочрених операций (переходов)
                    try
                    {
                        foreach (var childOperation in operation.ChildsOperations)
                        {
                            insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                            var valueWidth = ExcelAssistant.GetWidthString(childOperation.Caption);
                            var cellWidth = ExcelAssistant.GetCellsWidth(worksheet, $"W{row}:DE{row}");
                            try
                            {
                                if (cellWidth < valueWidth)
                                {
                                    var res_lst = ExcelAssistant.SplitStringToFitCell(childOperation.Caption, cellWidth * 7.5);
                                    foreach (var lst in res_lst)
                                    {
                                        var res = lst.ToArray();
                                        insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                                        ExcelAssistant.SetCellValue(worksheet, $"W{row}", res[res.Length - 1], false);
                                        ExcelAssistant.SetCellValue(worksheet, $"A{row}", "О1", false);

                                        row++;
                                        countPageOperation++;
                                        (row, countPageOperation) = ExcelAssistant.IncrementRow(row, countPageOperation, package);
                                    }
                                }
                            }
                            catch
                            {
                                insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(row, package);
                                ExcelAssistant.SetCellValue(worksheet, $"W{row}", childOperation.Caption, false);
                                ExcelAssistant.SetCellValue(worksheet, $"A{row}", "О1", false);
                                row++;
                                countPageOperation++;
                                (row, countPageOperation) = ExcelAssistant.IncrementRow(row, countPageOperation, package);
                            }
                            /* SetCellValue(worksheet, $"W{row}", childOperation.Caption, false);
                             SetCellValue(worksheet, $"A{row}", "О", false);
                             row++;
                             countPageOperation++;
                             (row, countPageOperation) = IncrementRow(row, countPageOperation, package);*/
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }

                //логика по заполнению листа ВТР Пооперационная ведомость трудоемкости
                WorkSheetVTR.OperationalLaborIntensitySheet(package,procces);
                
                //логика по заполнению листа СЛ Сопроводительный лист
                WorkSheetSL.fillingOutApprovalSheet(package, procces);
                
                WorkSheetTO.fillingOutTOSheet(package, procces);
                
                package.Save();

                return package.GetAsByteArray();
            }

        }
        
       
        
        static void insertMainOperationRowTemplateStringWithoutValue(int destination, ExcelPackage package)
        {
            try
            {
                var worksheet = package.Workbook.Worksheets["МК"];
                var body_table_sourceRange = worksheet.Cells[$"A19:DF19"];
                var body_table_destinationRange = worksheet.Cells[$"A{destination}:DF{destination}"];
                body_table_sourceRange.Copy(body_table_destinationRange,
                       ExcelRangeCopyOptionFlags.ExcludeValues
                       );
            }
            catch (Exception ex) { Console.WriteLine(ex.ToString()); }
        }
        static void insertMainChildOperationOrEquipmentRowTemplateStringWithoutValue(int destination, ExcelPackage package)
        {
            try
            {
                var worksheet = package.Workbook.Worksheets["МК"];
                var body_table_sourceRange = worksheet.Cells[$"A20:DF20"];
                var body_table_destinationRange = worksheet.Cells[$"A{destination}:DF{destination}"];
                body_table_sourceRange.Copy(body_table_destinationRange,
                       ExcelRangeCopyOptionFlags.ExcludeValues
                       );
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
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
