using Microsoft.AspNetCore.Mvc;
using VKProxy.Admin.Server.Config;
using VKProxy.Admin.Server.Storages;

namespace VKProxy.Admin.Server.Controllers
{
    [ApiController]
    [Route("api/sni")]
    public class SniController : ControllerBase
    {
        private readonly IStorage storage;

        public SniController(IStorage storage)
        {
            this.storage = storage;
        }

        [HttpGet("exists")]
        public async Task<bool> ExistsAsync([FromQuery] string key)
        {
            return await storage.ExistsSniAsync(key);
        }

        [HttpGet]
        public async Task<IEnumerable<SniConfigData>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetSniAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] SniConfigData config)
        {
            if (config.Route != null)
            {
                config.Route.Key = config.RouteId;
                await UpdateRoute(config.Route);
            }
            await storage.UpdateSniAsync(config);

            async Task UpdateRoute(RouteConfigData route)
            {
                var cluster = route.Cluster;
                if (cluster != null)
                {
                    cluster.Key = route.ClusterId;
                    await storage.UpdateClusterAsync(cluster);
                }
                await storage.UpdateRouteAsync(config.Route);
            }
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteSniAsync(key);
        }
    }
}