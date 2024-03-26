using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using netcorereactapp.Server.Services.FileServices.Interfaces;

namespace netcorereactapp.Server.Controllers.Attachment
{
    [Authorize]
    [ApiController]
    [Route("attachment")]
    public class AttachmentController:ControllerBase
    {
        private readonly IAttachmentService _attachmentService;
        public AttachmentController(IAttachmentService attachmentService)
        {
            _attachmentService = attachmentService;
        }
        [HttpDelete("{attachmentId}")]
        public async Task<bool> DeleteAttachment(string attachmentId)
        {
            return await _attachmentService.DeleteAttachment(Convert.ToInt32( attachmentId ));
        }
    }
}
