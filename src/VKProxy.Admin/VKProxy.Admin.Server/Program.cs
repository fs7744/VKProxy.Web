using System.Text.Json;
using VKProxy.Admin.Server.Storages;
using VKProxy.Core.Hosting;
using VKProxy.Storages.Etcd;

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

app.UseAuthorization();

app.MapControllers();

app.Run();