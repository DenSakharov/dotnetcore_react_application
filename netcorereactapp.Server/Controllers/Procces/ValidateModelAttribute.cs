using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace netcorereactapp.Server.Controllers.ProccesController
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                Console.WriteLine($"ValidateModelAttribute OnActionExecuting :\n{context.ModelState}");
                context.Result = new BadRequestObjectResult(context.ModelState);
            }
        }
    }
}
