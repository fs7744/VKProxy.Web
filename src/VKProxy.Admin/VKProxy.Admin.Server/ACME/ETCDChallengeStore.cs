using Etcd;
using System.Text.Json;
using VKProxy.Admin.Server.Config;
using VKProxy.Storages.Etcd;

public class ETCDChallengeStore : IChallengeStore
{
    private readonly IEtcdClient client;
    private string prefix;

    public ETCDChallengeStore([FromKeyedServices(nameof(EtcdProxyConfigSource))] IEtcdClient client, AcmeConfig config)
    {
        this.client = client;
        this.prefix = string.IsNullOrWhiteSpace(config.Prefix) ? "/acme/" : config.Prefix;
    }

    public async Task<IEnumerable<AcmeChallenge>> AllAsync(string? prefix, CancellationToken cancellationToken = default)
    {
        var res = await client.GetRangeAsync($"{this.prefix}{prefix}", cancellationToken: cancellationToken);
        return res.Kvs.Select(i =>
        {
            var r = JsonSerializer.Deserialize<AcmeChallenge>(i.Value.Span);
            return r;
        });
    }

    public async Task DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        await client.DeleteAsync($"{prefix}{key}", cancellationToken: cancellationToken);
    }

    public async Task UpdateAsync(AcmeChallenge challenge, CancellationToken cancellationToken = default)
    {
        challenge.LastUpdateDate = DateTime.UtcNow.Ticks;
        await client.PutAsync($"{prefix}{challenge.Key}", JsonSerializer.Serialize(challenge));
    }
}