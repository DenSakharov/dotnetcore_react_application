using System.Drawing;
using OfficeOpenXml;

namespace ExcelConstructorLibrary.RouteMap
{
    static class ExcelAssistant
    {
        public static void SetCellValue(ExcelWorksheet worksheet, string cor, string value, bool bold, int fontSize = 9)
        {
            var cell = worksheet.Cells[cor];
            // Устанавливаем значение ячейки
            cell.Value = value;
            // Получаем объект стиля ячейки
            var style = cell.Style;
            // Устанавливаем свойства шрифта
            style.Font.Name = "GOST Common"; // Название шрифта
            style.Font.Size = fontSize; // Размер шрифта
            style.Font.Bold = bold; // Жирный шрифт
            style.Font.Italic = true; // Курсив
        }
        public static float GetWidthString(string value)
        {
            string text = value;

            // Предположим, что у вас есть объект шрифта
            Font font = new Font("GOST Common", 9);

            // Создаем временный объект Graphics для определения ширины текста
            using (Graphics graphics = Graphics.FromImage(new Bitmap(1, 1)))
            {
                // Получаем размеры текста в пикселях
                SizeF textSize = graphics.MeasureString(text, font);

                // Ширина текста в пикселях
                float widthInPixels = textSize.Width;

                //Console.WriteLine($"Ширина текста в пикселях: {widthInPixels}");
                return widthInPixels;
            }
        }
        public static double GetCellsWidth(ExcelWorksheet worksheet, string rangeAddress)
        {
            // Получаем объект диапазона ячеек
            ExcelRangeBase range = worksheet.Cells[rangeAddress];

            // Инициализируем переменную для суммы ширины ячеек
            double totalWidth = 0;

            // Проходимся по каждой ячейке в диапазоне и добавляем ее ширину к сумме
            foreach (ExcelRangeBase cell in range)
            {
                double cellWidth = worksheet.Column(cell.Start.Column).Width;
                totalWidth += cellWidth;
            }

            return totalWidth;
        }
       
        public static (int, int) IncrementRow(int currentRow, int count, ExcelPackage package)
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
        public static void insertTemplateTable(int destinationStart, int destinationEnd, ExcelPackage package)
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
        public static List<List<string>> SplitStringToFitCell(string value, double cellWidth)
        {
            List<List<string>> result_lst = new List<List<string>>();
            List<string> parts = new List<string>();
            string[] words = value.Split(' '); // Разбиваем строку на отдельные слова

            string currentLine = "";
            foreach (string word in words)
            {
                string testLine = currentLine.Length == 0 ? word : currentLine + " " + word;

                // Получаем ширину текущей строки
                var width = ExcelAssistant.GetWidthString(testLine);

                // Если текущая строка превышает ширину ячейки, добавляем текущую строку в список и начинаем новую
                if (width > cellWidth)
                {
                    parts.Add(currentLine);
                    currentLine = word;
                    result_lst.Add(parts);
                    parts = new List<string>();
                }
                else
                {
                    currentLine = testLine;
                }
            }

            // Добавляем оставшуюся часть строки в список
            parts.Add(currentLine);
            result_lst.Add(parts);

            return result_lst;
        }
    }
}
