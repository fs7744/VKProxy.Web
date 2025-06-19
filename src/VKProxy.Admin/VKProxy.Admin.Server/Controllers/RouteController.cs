using Microsoft.AspNetCore.Mvc;
using VKProxy.Admin.Server.Config;
using VKProxy.Admin.Server.Storages;

namespace VKProxy.Admin.Server.Controllers
{
    [ApiController]
    [Route("api/route")]
    public class RouteController : ControllerBase
    {
        private readonly IStorage storage;

        public RouteController(IStorage storage)
        {
            this.storage = storage;
        }

        [HttpGet("exists")]
        public async Task<bool> ExistsAsync([FromQuery] string key)
        {
            return await storage.ExistsRouteAsync(key);
        }

        [HttpGet]
        public async Task<IEnumerable<RouteConfigData>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetRouteAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] RouteConfigData config)
        {
            var cluster = config.Cluster;
            if (cluster != null)
            {
                cluster.Key = config.ClusterId;
                await storage.UpdateClusterAsync(cluster);
            }
            await storage.UpdateRouteAsync(config);
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteRouteAsync(key);
        }
    }
}