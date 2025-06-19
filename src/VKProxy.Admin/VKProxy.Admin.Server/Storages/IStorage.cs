using VKProxy.Admin.Server.Config;

namespace VKProxy.Admin.Server.Storages;

public interface IStorage
{
    Task<long> DeleteClusterAsync(string key);

    Task<long> DeleteRouteAsync(string key);

    Task<long> DeleteListenAsync(string key);

    Task<long> DeleteSniAsync(string key);

    Task<bool> ExistsClusterAsync(string key);

    Task<bool> ExistsListenAsync(string key);

    Task<bool> ExistsRouteAsync(string key);

    Task<bool> ExistsSniAsync(string key);

    Task<IEnumerable<ClusterConfigData>> GetClusterAsync(string? prefix);

    Task<IEnumerable<ListenConfigData>> GetListenAsync(string prefix);

    Task<IEnumerable<RouteConfigData>> GetRouteAsync(string? prefix);

    Task<IEnumerable<SniConfigData>> GetSniAsync(string? prefix);

    Task UpdateClusterAsync(ClusterConfigData config);

    Task UpdateListenAsync(ListenConfigData config);

    Task UpdateRouteAsync(RouteConfigData config);

    Task UpdateSniAsync(SniConfigData config);
}