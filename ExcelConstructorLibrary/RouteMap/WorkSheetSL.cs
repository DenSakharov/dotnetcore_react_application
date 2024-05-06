using ClassesLibrary.Models;
using OfficeOpenXml;

namespace ExcelConstructorLibrary.RouteMap;

public class WorkSheetSL
{
    public static void fillingOutApprovalSheet(ExcelPackage package, Procces procces)
    {
        var worksheet = package.Workbook.Worksheets["СЛ"];
        ExcelAssistant.SetCellValue(worksheet, $"C2", "ТО."+procces.number, true,14);
        ExcelAssistant.SetCellValue(worksheet, $"C3", procces.Caption, true,14);
        ExcelAssistant.SetCellValue(worksheet, $"C4", procces.OrganizationCaption, true,14);

        int beginPoint = 13;
        foreach (var operation in procces.Operations)
        {
            if (beginPoint == 24)
            {
                beginPoint = 31;
            }
            ExcelAssistant.SetCellValue(worksheet, $"A{beginPoint}", operation.number, true,14);
            ExcelAssistant.SetCellValue(worksheet, $"B{beginPoint}", operation.Caption, true,14);
            ExcelAssistant.SetCellValue(worksheet, $"D{beginPoint}", operation.responsibleGroup, true,14);
            beginPoint++;
        }
        beginPoint++;
    }
}