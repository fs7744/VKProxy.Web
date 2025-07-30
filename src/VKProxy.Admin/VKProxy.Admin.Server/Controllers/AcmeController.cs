using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using VKProxy.ACME;
using VKProxy.ACME.AspNetCore;
using VKProxy.Admin.Server.Storages;

namespace VKProxy.Admin.Server.Controllers;

[ApiController]
[Route("api/acme")]
public class AcmeController : ControllerBase
{
    private readonly IChallengeStore store;
    private readonly IAcmeStateIniter initer;
    private readonly IServiceProvider serviceProvider;
    private readonly IStorage storage;

    public AcmeController(IChallengeStore store, IAcmeStateIniter initer, IServiceProvider serviceProvider, IStorage storage)
    {
        this.store = store;
        this.initer = initer;
        this.serviceProvider = serviceProvider;
        this.storage = storage;
    }

    [HttpGet]
    public async Task<IEnumerable<AcmeChallenge>> GetAsync([FromQuery] string? prefix)
    {
        return await store.AllAsync(prefix ?? string.Empty);
    }

    [HttpPost]
    public async Task<AcmeChallenge> GetAsync([FromBody, Required] AcmeChallenge challenge)
    {
        using var ts = new CancellationTokenSource(challenge.Timeout.GetValueOrDefault(AcmeChallenge.DefaultTimeout));
        var t = ts.Token;
        if (string.IsNullOrWhiteSpace(challenge.AccountKeyPem))
        {
            var acme = serviceProvider.GetRequiredService<IAcmeContext>();
            await acme.InitAsync(challenge.Server, t);
            var key = challenge.KeyAlgorithm.NewKey(challenge.KeySize);
            await acme.NewAccountAsync(challenge.Contact, true, key, challenge.EabKeyId, challenge.EabKey, challenge.EabKeyAlg, t);
            challenge.AccountKeyPem = key.ToPem();
        }
        var cert = await initer.CreateCertificateAsync(challenge.ToOptions(), t);
        await challenge.Renew(store, initer, storage);
        return challenge;
    }

    [HttpDelete]
    public async Task DeleteAsync([FromQuery] string? key)
    {
        await store.DeleteAsync(key);
    }
}