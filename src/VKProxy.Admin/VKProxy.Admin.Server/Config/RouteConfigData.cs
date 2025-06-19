namespace VKProxy.Admin.Server.Config;

public class RouteConfigData
{
    public int Order { get; set; }
    public string Key { get; set; }

    public string? ClusterId { get; set; }
    public ClusterConfigData? Cluster { get; set; }

    public TimeSpan Timeout { get; set; }

    public int UdpResponses { get; set; }
    public RouteMatchData? Match { get; set; }

    public List<Dictionary<string, string>>? Transforms { get; set; }

    public Dictionary<string, string>? Metadata { get; set; }

    public ConcurrentConnectionLimitOptionsData? Limit { get; set; }
}