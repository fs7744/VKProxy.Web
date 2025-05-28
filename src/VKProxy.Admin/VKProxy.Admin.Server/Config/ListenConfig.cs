using VKProxy.Config;

namespace VKProxy.Admin.Server.Config;

public class ListenConfigData : ListenConfig
{
    public RouteConfigData? Route { get; set; }
    public SniConfigData? Sni { get; set; }
}

public class RouteConfigData : RouteConfig
{
    public ClusterConfig? Cluster { get; set; }
}

public class SniConfigData : SniConfig
{
    public RouteConfigData? Route { get; set; }
}