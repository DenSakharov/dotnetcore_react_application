using ClassesLibrary.Models;
using OfficeOpenXml;

namespace ExcelConstructorLibrary.RouteMap;

public class WorkSheetTO
{
    public static void fillingOutTOSheet(ExcelPackage package, Procces procces)
    {
        var worksheet = package.Workbook.Worksheets["ТО"];
        ExcelAssistant.SetCellValue(worksheet, $"E1", procces.number, true,14);
        ExcelAssistant.SetCellValue(worksheet, $"G2", procces.OrganizationCaption, true,14);
        ExcelAssistant.SetCellValue(worksheet, $"F5", procces.EquipmentType, true,14);
        ExcelAssistant.SetCellValue(worksheet, $"F6", procces.EquipmentModel, true,14);
        
        ExcelAssistant.SetCellValue(worksheet, $"D9", procces.Caption, true,14);
        
        int beginPoint = 12;
        //insertRows(12,procces.details.Count,worksheet);
        insert(worksheet.Cells[$"D12:J12"],procces.details.Count-1,worksheet);
        foreach (var detail in procces.details)
        {
            ExcelAssistant.SetCellValue(worksheet, $"D{beginPoint}", detail.Caption, true,14);
            ExcelAssistant.SetCellValue(worksheet, $"I{beginPoint}", detail.Quantity.ToString(), true,14);
            beginPoint++;
        }
    }
    static void insert(ExcelRange selectedRange, int numberOfRowsToInsert, ExcelWorksheet worksheet)
    {
        int bottomSelectedRow = selectedRange.End.Row;

        // Перемещаемся на строку ниже выбранного диапазона
        ExcelRange sourceFormatRange = worksheet.Cells[bottomSelectedRow + 1, selectedRange.Start.Column, bottomSelectedRow + 1, selectedRange.End.Column];
        ExcelRange destinationFormatRange = worksheet.Cells[bottomSelectedRow + numberOfRowsToInsert + 1, selectedRange.Start.Column, bottomSelectedRow + numberOfRowsToInsert, selectedRange.End.Column];

        // Копируем форматирование из строки ниже выбранного диапазона во все новые строки
        for (int i = 0; i < numberOfRowsToInsert; i++)
        {
            sourceFormatRange.Copy(destinationFormatRange[i, 1]);
        }

        // Вставляем строки
        worksheet.InsertRow(bottomSelectedRow + 1, numberOfRowsToInsert);
    }


    static void insertRows(int startRow, int numberOfRowsToInsert, ExcelWorksheet worksheet)
    {
        worksheet.InsertRow(startRow, numberOfRowsToInsert); 
    }
}