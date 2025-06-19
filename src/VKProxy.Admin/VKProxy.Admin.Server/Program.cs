using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using System.Text.Json;
using VKProxy.Admin.Server;
using VKProxy.Admin.Server.Storages;
using VKProxy.Core.Hosting;
using VKProxy.Storages.Etcd;
using System.Data.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var services = builder.Services;
services.AddControllers().AddJsonOptions(i => i.JsonSerializerOptions.PropertyNamingPolicy = null);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
services.AddOpenApi();
services.UseReverseProxy();
services.UseEtcdConfigFromEnv();
services.Remove(services.First(i => i.ImplementationType == typeof(VKHostedService)));
services.AddSingleton<IStorage, EtcdStorage>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseExceptionHandler("/error").UseRouter(delegate (IRouteBuilder builder)
{
    builder.MapRoute("error", HandleError);
});
app.UseAuthorization();

app.MapControllers();
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    ServeUnknownFileTypes = true,
    FileProvider = new IndexFallbackFileProvider(app.Environment.ContentRootPath),
    DefaultContentType = "text/html",
});

app.Run();

static async Task HandleError(HttpContext context)
{
    IExceptionHandlerPathFeature exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
    ObjectResult obj;
    if (exceptionHandlerPathFeature.Error is ArgumentException ar)
    {
        obj = new ObjectResult(new { Status = 400, Error = ar.Message, Arg = ar.ParamName }) { StatusCode = 400 };
    }
    else
    {
        obj = new ObjectResult(new { Status = 500, Error = exceptionHandlerPathFeature.Error.Message }) { StatusCode = 500 };
    }

    await obj.ExecuteResultAsync(new ActionContext(context, context.GetRouteData(), new ActionDescriptor()));
}