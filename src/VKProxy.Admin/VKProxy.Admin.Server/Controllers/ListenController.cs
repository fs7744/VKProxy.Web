using Microsoft.AspNetCore.Mvc;
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
            return await storage.ExistsAsync(key);
        }

        [HttpGet]
        public async Task<IEnumerable<ListenConfig>> GetAsync([FromQuery] string? prefix)
        {
            return await storage.GetListenAsync(prefix);
        }

        [HttpPost]
        public async Task UpdateAsync([FromBody] ListenConfig config)
        {
            await storage.UpdateListenAsync(config);
        }

        [HttpDelete]
        public async Task<long> DeleteAsync([FromQuery] string key)
        {
            return await storage.DeleteListenAsync(key);
        }
    }
}