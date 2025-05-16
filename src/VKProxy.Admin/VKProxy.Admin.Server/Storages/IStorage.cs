using VKProxy.Config;

namespace VKProxy.Admin.Server.Storages;

public interface IStorage
{
    Task<long> DeleteListenAsync(string key);

    Task<IEnumerable<ListenConfig>> GetListenAsync(string prefix);

    Task UpdateListenAsync(ListenConfig config);
}