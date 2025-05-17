using Etcd;
using Google.Protobuf;
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

    public async Task<long> DeleteListenAsync(string key)
    {
        var r = await client.DeleteAsync($"{options.Prefix}listen/{key}");
        return r.Deleted;
    }

    public async Task<bool> ExistsAsync(string key)
    {
        var r = await client.RangeAsync(new Etcdserverpb.RangeRequest()
        {
            CountOnly = true,
            Key = ByteString.CopyFromUtf8($"{options.Prefix}listen/{key}")
        });
        return r.Count > 0;
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

    public async Task UpdateListenAsync(ListenConfig config)
    {
        await client.PutAsync($"{options.Prefix}listen/{config.Key}", JsonSerializer.Serialize(config));
    }
}