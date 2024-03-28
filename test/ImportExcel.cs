using OfficeOpenXml;
using System.Text;
using ClassesLibrary.Models;
using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Services;
namespace netcore.console
{
    public static class ImportExcel
    {
        static List<string> exeptions_word = new List<string>
        {
            "РМ","Цех","Уч.","Опер.","Код,наименование операции","Обозначение документа"

        };
        public static async Task<(Procces, List<Operation>)> get_values_from_excel_file(string path)
        {
            string name = Path.GetFileNameWithoutExtension(path);

            List<string> list_of_finded_str_value = new List<string>();
            List<StringHierarchyOperations> list_of_finded_str = new List<StringHierarchyOperations>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(path))
            {
                foreach (var worksheet in package.Workbook.Worksheets)
                {
                    if (string.Equals(worksheet.Name, "МК", StringComparison.CurrentCultureIgnoreCase))
                    {
                        int rowCount = worksheet.Dimension.Rows;
                        int colCount = worksheet.Dimension.Columns;
                        for (int row = 1; row <= rowCount; row++)
                        {
                            var s = worksheet.Cells[row, 1].Text;

                            if (string.Equals(s, "А", StringComparison.CurrentCultureIgnoreCase))
                            {
                                StringBuilder sb = new StringBuilder();
                                for (int col = 1; col <= colCount; col++)
                                {
                                    if (
                                        !string.IsNullOrEmpty(worksheet.Cells[row, col].Text.Trim())
                                        )
                                    {
                                        sb.Append(worksheet.Cells[row, col].Text + "_");
                                    }
                                }
                                if (!exeptions_word.Any(exception => sb.ToString().Contains(exception)))
                                {
                                    list_of_finded_str_value.Add(sb.ToString());
                                    list_of_finded_str.Add(new StringHierarchyOperations
                                    {
                                        StepMessageInformation = sb.ToString(),
                                    });
                                }
                                //Console.WriteLine(sb.ToString() );
                            }
                            //Console.WriteLine($"Value of s: '{s}'");
                            if (string.Equals(s, "О", StringComparison.CurrentCultureIgnoreCase))
                            {
                                StringBuilder sb = new StringBuilder();
                                int count = 0;
                                bool child_oper = false;
                                for (int col = 1; col <= colCount; col++)
                                {
                                    if (
                                        !string.IsNullOrEmpty(worksheet.Cells[row, col].Text.Trim())
                                        )
                                    {
                                        if (count == 2)
                                        {
                                            child_oper = char.IsLetter(worksheet.Cells[row, col].Text[0])
                                                &&
                                                worksheet.Cells[row, col].Text[1] == ')';
                                        }
                                        sb.Append(worksheet.Cells[row, col].Text + "_");
                                        count++;
                                    }
                                }
                                if (!child_oper)
                                {
                                    list_of_finded_str.Last().Hierarchy.Add(new StringHierarchyOperations
                                    {
                                        StepMessageInformation = sb.ToString(),
                                    });
                                }
                                else
                                {
                                    list_of_finded_str.Last().Hierarchy.Last().Hierarchy.Add(new StringHierarchyOperations
                                    {
                                        StepMessageInformation = sb.ToString(),
                                    });
                                }
                                //Console.WriteLine(sb.ToString() );
                            }
                        }
                    }
                    if (string.Equals(worksheet.Name, "ТО", StringComparison.CurrentCultureIgnoreCase))
                    {

                        int rowCount = worksheet.Dimension.Rows;
                        int colCount = worksheet.Dimension.Columns;
                        for (int row = 1; row <= rowCount; row++)
                        {
                           /* for (int col = 1; col <= colCount; col++)
                            {
                                var s = worksheet.Cells[row, col].Text;
                                Console.WriteLine($"{row} : {col} - {s}\n");
                            }*/
                        }

                    }
                }
            }
            //show_objects_in_Console(list_of_finded_str,"");
            return await generate_procces_with_orders(list_of_finded_str, name);
        }
        public static async Task<(Procces, List<Operation>)> generate_procces_with_orders(List<StringHierarchyOperations> list_of_finded_str_value, string name)
        {
            var procces = new Procces();
            procces.Caption = name;
            procces.DateOfCreture = DateTime.UtcNow;
            var operations = new List<Operation>();
            var collection = generate_proccesOperations_test(list_of_finded_str_value, procces);
            operations.AddRange(collection);
            //procces.Operations = operations;
            return (procces, operations);
        }
        static void show_objects_in_Console(List<StringHierarchyOperations> list, string tab)
        {
            foreach (var elem in list)
            {
                Console.WriteLine(tab + "StepMessageInformation ->" + elem.StepMessageInformation);
                if (elem.Hierarchy != null && elem.Hierarchy.Any())
                {
                    show_objects_in_Console(elem.Hierarchy.ToList(), "-");
                }
            }
        }
        static List<Operation> generate_proccesOperations_test(List<StringHierarchyOperations> list, Procces procces)
        {
            List<Operation> _list = new List<Operation>();
            foreach (var elem in list)
            {
                var oper = new Operation();
                oper.DateOfCreture = procces.DateOfCreture;
                string[] words = elem.StepMessageInformation.Split('_');
                try
                {
                    oper.Caption = words[3] + " " + words[4];
                }
                catch
                {
                    oper.Caption = words[2];
                }
                if (elem.Hierarchy != null && elem.Hierarchy.Any())
                {
                    oper.ChildsOperations = generate_proccesOperations_test(elem.Hierarchy.ToList(), procces);
                }
                _list.Add(oper);
            }
            return _list;
        }

        public static async Task<ProccesDTO> generate_procces_with_ordersDTO(Procces procces)
        {
            var proccesDTO = new ProccesDTO();
            proccesDTO.Id = procces.Id;
            proccesDTO.DateOfCreture = procces.DateOfCreture;
            proccesDTO.Caption = procces.Caption;
            proccesDTO.Operations = MapService.MapChildOperations(procces.Operations);
            return proccesDTO;
        }
    }
    public class StringHierarchyOperations
    {
        public string StepMessageInformation { get; set; }
        public ICollection<StringHierarchyOperations>? Hierarchy { get; set; } = new List<StringHierarchyOperations>();
    }
}
