using VKProxy.Config;

namespace VKProxy.Admin.Server.Config;

public class AcmeConfig
{
    public static readonly TimeSpan DefaultPeriod = TimeSpan.FromDays(1);
    public TimeSpan? Period { get; set; } = DefaultPeriod;
    public HttpClientConfig? HttpClientConfig { get; set; }

    public string Prefix { get; set; }
}