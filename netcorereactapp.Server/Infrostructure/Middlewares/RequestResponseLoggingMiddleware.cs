using System.Text;

namespace netcorereactapp.Server.Infrostructure.Middlewares
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<RequestLoggingMiddleware>();
        }
        public async Task Invoke(HttpContext context)
        {
            var originalBodyStream = context.Request.Body; // Store the original request body stream
            var requestBody = string.Empty;

            try
            {

                LogRequestInformation(context);
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log errors
                _logger.LogError(ex, "An error occurred during request processing.");
                Console.WriteLine(ex);
            }
            finally
            {
                // Restore the position of the request body stream
                context.Request.Body = originalBodyStream;

                // Log response information
                LogResponseInformation(context, originalBodyStream);
            }
        }

        private void LogRequestInformation(HttpContext context)
        {
            _logger.LogInformation($"Request {context.Request?.Method} {context.Request?.Path.Value} => {context.Response?.StatusCode}");
            Console.WriteLine($"Request {context.Request?.Method} {context.Request?.Path.Value} => {context.Response?.StatusCode}");

            // Логирование другой информации о запросе, если необходимо
        }

        private void LogResponseInformation(HttpContext context, Stream originalBodyStream)
        {
            _logger.LogInformation($"Response {context.Response?.StatusCode}");
            Console.WriteLine($"Response {context.Response?.StatusCode}");

            if (context.Response.Body is MemoryStream responseBody)
            {
                responseBody.Seek(0, SeekOrigin.Begin);
                var responseBodyText = new StreamReader(responseBody).ReadToEnd();
                Console.WriteLine($"Response Body: {responseBodyText}");

                responseBody.Seek(0, SeekOrigin.Begin);
                responseBody.CopyToAsync(originalBodyStream);
            }
        }
    }
}
