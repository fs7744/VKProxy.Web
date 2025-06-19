using VKProxy.Config;

namespace VKProxy.Admin.Server.Config;

public class ListenConfigData
{
    public string Key { get; set; }

    public GatewayProtocols Protocols { get; set; }

    public string[]? Address { get; set; }

    public bool UseSni { get; set; }
    public string? SniId { get; set; }

    public string? RouteId { get; set; }

    public RouteConfigData? Route { get; set; }
    public SniConfigData? Sni { get; set; }
}