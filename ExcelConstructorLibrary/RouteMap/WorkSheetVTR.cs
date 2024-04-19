using ClassesLibrary.Models;
using OfficeOpenXml;

namespace ExcelConstructorLibrary.RouteMap
{
    static class WorkSheetVTR
    {
        public static void OperationalLaborIntensitySheet(ExcelPackage package, Procces procces)
        {
            var worksheet = package.Workbook.Worksheets["ВТР"];
            ExcelAssistant.SetCellValue(worksheet, $"AR11", procces.Caption, true, 12);
        }
    }
}
