using VKProxy.ACME.AspNetCore;
using VKProxy.Admin.Server.Config;
using VKProxy.Admin.Server.Storages;

public class AcmeJob : IAsyncDisposable
{
    private readonly PeriodicTimer timer;
    private readonly Task timerTask;
    private readonly ILogger<AcmeJob> logger;
    private readonly IChallengeStore store;
    private readonly IAcmeStateIniter initer;
    private readonly IStorage storage;

    public AcmeJob(AcmeConfig config, ILogger<AcmeJob> logger, IChallengeStore store, IAcmeStateIniter initer, IStorage storage)
    {
        timer = new PeriodicTimer(config.Period.GetValueOrDefault(AcmeConfig.DefaultPeriod));
        this.logger = logger;
        this.store = store;
        this.initer = initer;
        this.storage = storage;
        timerTask = Task.Run(async () =>
        {
            try
            {
                await Do();
            }
            catch (Exception ex)
            {
                this.logger.LogCritical(ex, "Error while init AcmeJob.");
            }

            while (await timer.WaitForNextTickAsync())
            {
                try
                {
                    await Do();
                }
                catch (Exception ex)
                {
                    this.logger.LogCritical(ex, "Error while evicting AcmeJob.");
                }
            }
        });
    }

    public async ValueTask DisposeAsync()
    {
        timer.Dispose();
        await timerTask;
    }

    private async Task Do()
    {
        var tasks = (await store.AllAsync(string.Empty))
            .Select(async i =>
            {
                try
                {
                    if (i.IsNeedRenew())
                    {
                        await i.Renew(store, initer, storage);
                        logger.LogInformation("Renew certificate for {Key} Done.", i.Key);
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Renew certificate for {i.Key} Failed");
                }
            }).ToArray();
        await Task.WhenAll(tasks);
    }
}