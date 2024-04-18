using Oper = ClassesLibrary.Models.Operation;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClassesLibrary.Models;
using System.Text.RegularExpressions;
using System.Drawing;
using Color = System.Drawing.Color;
using ClassesLibrary.Services;
using ClassesLibrary.DataTransferObjects;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using netcorereactapp.Server.Services.Supporting.Interfaces;
namespace netcorereactapp.Server.Controllers.Supporting
{
    [Authorize]
    [ApiController]
    [Route("supporting")]
    public class SupportingController: ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<SupportingController> _logger;
        private readonly ISupportingService _supportingService;
        public SupportingController(ApplicationContext dbContext, ILogger<SupportingController> logger,
            ISupportingService supportingService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _supportingService = supportingService;

        }
        //private readonly string path_excel_template = "C:\\Uploads\\templates.xlsx";
        [HttpGet("template_operations")]
        public async Task<List<OperationDTO>> GetTemplateOpertionsList()
        {
            var lst = _supportingService.ReadExcelToGetTemplateOperations( "операции");
            //ReadExcel(path_excel_template, "оборудование");
            return lst;
        }
        [HttpGet("template_equipments")]
        public async Task<List<EquipmentDTO>> GetTemplateEquipmentList()
        {
            var lst = _supportingService.ReadExcelToGetTemplateEquipments("оборудование");
            return lst;
        }
        [HttpPost("createroutemap")]
        public async Task CreateRoutMApTemplate()
        {
            var v = _supportingService.CreateRouteMapTemplate();
        }
    }
}
