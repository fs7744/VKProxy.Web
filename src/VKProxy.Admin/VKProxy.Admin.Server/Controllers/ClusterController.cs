using Microsoft.AspNetCore.Mvc;
using VKProxy.Admin.Server.Config;
using VKProxy.Admin.Server.Storages;

namespace VKProxy.Admin.Server.Controllers
{
    [ApiController]
    [Route("api/cluster")]
    public class ClusterController : ControllerBase
    {
        private readonly IStorage storage;

        public ClusterController(IStorage storage)
        {
            this.storage = storage;
        }

        [HttpGet("exists")]
        public async Task<bool> ExistsAsync([FromQuery] string key)
        {
            return await storage.ExistsClusterAsync(key);
        }

        [HttpGet]
        public async Task<IEnumerable<ClusterConfigData>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetClusterAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] ClusterConfigData config)
        {
            await storage.UpdateClusterAsync(config);
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteClusterAsync(key);
        }
    }
}