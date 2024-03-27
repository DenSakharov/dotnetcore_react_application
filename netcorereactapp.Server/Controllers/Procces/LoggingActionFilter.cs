using Microsoft.AspNetCore.Mvc.Filters;

namespace netcorereactapp.Server.Controllers.ProccesController
{
    public class LoggingActionFilter : IActionFilter
    {
        private readonly ILogger _logger;

        public LoggingActionFilter(ILogger<LoggingActionFilter> logger)
        {
            _logger = logger;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Логирование того, что происходит перед выполнением метода действия контроллера
            _logger.LogInformation("Executing action {Action} on controller {Controller}",
                context.ActionDescriptor.DisplayName, context.Controller.GetType().Name);
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Логирование того, что происходит после выполнения метода действия контроллера
            _logger.LogInformation("Executed action {Action} on controller {Controller}",
                context.ActionDescriptor.DisplayName, context.Controller.GetType().Name);
        }
    }
}
