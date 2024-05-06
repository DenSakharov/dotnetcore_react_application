using ClassesLibrary.Models;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using OfficeOpenXml;

namespace ExcelConstructorLibrary.RouteMap
{
    static class WorkSheetVTR
    {
        public static void OperationalLaborIntensitySheet(ExcelPackage package, Procces procces)
        {
            var worksheet = package.Workbook.Worksheets["ВТР"];
            ExcelAssistant.SetCellValue(worksheet, $"C3", procces.number, true,14);
            ExcelAssistant.SetCellValue(worksheet, $"E4", procces.OrganizationCaption, true,14);

            int beginPoint = 7;
            foreach (var operation in procces.Operations)
            {
                insertOperationRowTemplateStringWithoutValue(beginPoint, package);
                ExcelAssistant.SetCellValue(worksheet, $"A{beginPoint}", operation.number, true,14);
                ExcelAssistant.SetCellValue(worksheet, $"B{beginPoint}", operation.Caption, true,14);
                ExcelAssistant.SetCellValue(worksheet, $"H{beginPoint}", operation.laborCost, true,14);
                beginPoint++;
            }
            beginPoint++;
            cutFooterSheet(beginPoint, package,procces);
        }
        static void insertOperationRowTemplateStringWithoutValue(int destination, ExcelPackage package)
        {
            try
            {
                var worksheet = package.Workbook.Worksheets["ВТР"];
                var body_table_sourceRange = worksheet.Cells[$"A7:J7"];
                var body_table_destinationRange = worksheet.Cells[$"A{destination}:J{destination}"];
                body_table_sourceRange.Copy(body_table_destinationRange,
                    ExcelRangeCopyOptionFlags.ExcludeValues
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
        static void cutFooterSheet(int destination, ExcelPackage package, Procces procces=null)
        {
            try
            {
                var worksheet = package.Workbook.Worksheets["ВТР"];
                var body_table_sourceRange = worksheet.Cells[$"L17:U30"];
                var body_table_destinationRange = worksheet.Cells[$"A{destination}:J{destination+13}"];
        
                // Копируем содержимое из исходного диапазона в целевой
                body_table_sourceRange.Copy(body_table_destinationRange);

                // Очищаем содержимое исходного диапазона
                body_table_sourceRange.Clear();
                
                ExcelAssistant.SetCellValue(worksheet, $"C{destination+2}", procces.number, true,14);
                ExcelAssistant.SetCellValue(worksheet, $"E{destination+3}", procces.OrganizationCaption, true,14);

                var commonLaborCost = getCommonLaborCost(procces.Operations);
                
                ExcelAssistant.SetCellValue(worksheet, $"C{destination+6}", procces.number, true,14);
                ExcelAssistant.SetCellValue(worksheet, $"H{destination+6}", commonLaborCost.ToString(), true,14);
                ExcelAssistant.SetCellValue(worksheet, $"H{destination+7}", commonLaborCost.ToString(), true,14);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        static int getCommonLaborCost(List<Operation> list)
        {
            int res = 0;
            foreach (var operation in list)
            {
                res+=Convert.ToInt32(operation.laborCost);
            }
            return res;
        }
    }
}
