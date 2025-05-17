using Microsoft.AspNetCore.Mvc;
using VKProxy.Admin.Server.Storages;
using VKProxy.Config;

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
        public async Task<IEnumerable<SniConfig>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetSniAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] SniConfig config)
        {
            await storage.UpdateSniAsync(config);
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteSniAsync(key);
        }
    }
}