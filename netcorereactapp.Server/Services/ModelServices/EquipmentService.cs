using ClassesLibrary.Models;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class EquipmentService: IEquipmentService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<EquipmentService> _logger;
        public EquipmentService(ApplicationContext dbContext,
            ILogger<EquipmentService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;   
        }
        public async Task<bool> Add(int operationId,string captionEquipment)
        {
            using (var tr=await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var operation=await _dbContext.Operations
                        .Include(operation=>operation.Equipments)
                        .FirstOrDefaultAsync(operation=>operation.Id==operationId);
                    if(operation != null)
                    {
                        operation.Equipments.Add(new Equipment()
                        {
                            Caption = captionEquipment,
                            DateOfCreture = DateTime.UtcNow,
                        });
                        await _dbContext.SaveChangesAsync();
                        await tr.CommitAsync();
                        return true;
                    }
                    return false;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
        public async Task<bool> Delete(int id)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                   var res=await _dbContext.Equipments.FindAsync(id);
                    _dbContext.Equipments.Remove(res);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
    }
}
