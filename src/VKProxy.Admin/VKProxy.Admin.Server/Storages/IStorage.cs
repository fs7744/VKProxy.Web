using VKProxy.Config;

namespace VKProxy.Admin.Server.Storages;

public interface IStorage
{
    Task<IEnumerable<ListenConfig>> GetListenAsync(string prefix);
}