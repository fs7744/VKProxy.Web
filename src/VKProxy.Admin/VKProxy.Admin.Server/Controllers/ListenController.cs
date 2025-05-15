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

        [HttpGet]
        public Task<IEnumerable<ListenConfig>> GetAsync([FromQuery] string? prefix)
        {
            return storage.GetListenAsync(prefix);
        }
    }
}