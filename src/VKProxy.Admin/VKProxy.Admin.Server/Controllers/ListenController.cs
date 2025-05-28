using Etcdserverpb;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using VKProxy.Admin.Server.Config;
using VKProxy.Admin.Server.Storages;
using VKProxy.Config;

namespace VKProxy.Admin.Server.Controllers
{
    [ApiController]
    [Route("api/listen")]
    public class ListenController : ControllerBase
    {
        private readonly IStorage storage;

        public ListenController(IStorage storage)
        {
            this.storage = storage;
        }

        [HttpGet("exists")]
        public async Task<bool> ExistsAsync([FromQuery] string key)
        {
            return await storage.ExistsListenAsync(key);
        }

        [HttpGet]
        public async Task<IEnumerable<ListenConfig>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetListenAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] ListenConfigData config)
        {
            if (config.Route != null)
            {
                config.Route.Key = config.RouteId;
                await UpdateRoute(config.Route);
            }
            if (config.Sni != null)
            {
                if (config.Sni.Route != null)
                {
                    config.Sni.Route.Key = config.Sni.RouteId;
                    await UpdateRoute(config.Sni.Route);
                }
                config.Sni.Key = config.SniId;
                await storage.UpdateSniAsync(config.Sni);
            }
            await storage.UpdateListenAsync(config);

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
            return await storage.DeleteListenAsync(key);
        }
    }
}