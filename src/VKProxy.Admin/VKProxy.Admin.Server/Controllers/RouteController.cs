using Microsoft.AspNetCore.Mvc;
using VKProxy.Admin.Server.Storages;
using VKProxy.Config;

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
        public async Task<IEnumerable<RouteConfig>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetRouteAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] RouteConfig config)
        {
            await storage.UpdateRouteAsync(config);
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteRouteAsync(key);
        }
    }
}