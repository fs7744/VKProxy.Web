using Etcd;
using System.Text.Json;
using VKProxy.Config;
using VKProxy.Storages.Etcd;

namespace VKProxy.Admin.Server.Storages;

public class EtcdStorage : IStorage
{
    private readonly IEtcdClient client;
    private readonly EtcdProxyConfigSourceOptions options;

    public EtcdStorage([FromKeyedServices(nameof(EtcdProxyConfigSource))] IEtcdClient client, EtcdProxyConfigSourceOptions options)
    {
        this.client = client;
        this.options = options;
    }

    public async Task<IEnumerable<ListenConfig>> GetListenAsync(string prefix)
    {
        var res = await client.GetRangeAsync($"{options.Prefix}listen/{prefix}");
        return res.Kvs.Select(i =>
        {
            var r = JsonSerializer.Deserialize<ListenConfig>(i.Value.Span);
            r.Key = i.Key.ToStrUtf8().Substring(options.Prefix.Length + 7);
            return r;
        });
    }
}