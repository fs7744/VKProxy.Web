using VKProxy.ACME.AspNetCore;
using VKProxy.Admin.Server.Config;

public class AcmeJob : IAsyncDisposable
{
    private readonly PeriodicTimer timer;
    private readonly Task timerTask;
    private readonly ILogger<AcmeJob> logger;
    private readonly IHttpChallengeResponseStore httpStore;
    private readonly IChallengeStore store;

    public AcmeJob(AcmeConfig config, ILogger<AcmeJob> logger, IHttpChallengeResponseStore httpStore, IChallengeStore store)
    {
        timer = new PeriodicTimer(config.Period.GetValueOrDefault(AcmeConfig.DefaultPeriod));
        this.logger = logger;
        this.httpStore = httpStore;
        this.store = store;
        timerTask = Task.Run(async () =>
        {
            try
            {
                await Init();
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

    private async Task Init()
    {
        foreach (var item in await store.AllAsync(string.Empty))
        {
        }
    }

    private async Task Do()
    {
        logger.LogError(DateTime.Now.ToString());
    }
}