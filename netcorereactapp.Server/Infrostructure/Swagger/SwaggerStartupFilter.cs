namespace netcorereactapp.Server.Infrostructure.Swagger
{
    public class SwaggerStartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
        {
            return app =>
            {
                ///Swagger Midlleware
                app.UseSwagger();
                /// добавление страницы https://localhost:7119/swagger/index.html
                app.UseSwaggerUI();

                //соблюдение последовательностей middleware
                next(app);
            };
        }
    }
}
