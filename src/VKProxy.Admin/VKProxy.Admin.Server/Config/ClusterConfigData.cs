using VKProxy.Config;

namespace VKProxy.Admin.Server.Config;

public class ClusterConfigData
{
    public string Key { get; set; }

    public string? LoadBalancingPolicy { get; set; }

    public HealthCheckConfigData? HealthCheck { get; set; }

    public List<DestinationConfig>? Destinations { get; set; }

    public HttpClientConfig? HttpClientConfig { get; set; }

    public ForwarderRequestConfig? HttpRequest { get; set; }

    public IReadOnlyDictionary<string, string>? Metadata { get; set; }
}

public class HealthCheckConfigData
{
    public PassiveHealthCheckConfig? Passive { get; set; }

    public ActiveHealthCheckConfig? Active { get; set; }
}