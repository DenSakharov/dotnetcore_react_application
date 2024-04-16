using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.ModelServices.Interfaces;

namespace netcorereactapp.Server.Controllers.Equipment
{
    [Authorize]
    [ApiController]
    [Route("equipment")]
    public class EquipmentController:ControllerBase
    {
        private readonly IEquipmentService _equipmentService;
        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }
        [HttpPost("{parentId}")]
        public async Task<bool> Add(int parentId,[FromBody]A a)
        {
            return await _equipmentService.Add(parentId, a.caption);
        }
        [HttpDelete("{id}")]
        public async Task<bool> Delete(int id)
        {
            return await _equipmentService.Delete(id);
        }
    }
    public class A
    {
        public string caption { get; set; }
    }
}
