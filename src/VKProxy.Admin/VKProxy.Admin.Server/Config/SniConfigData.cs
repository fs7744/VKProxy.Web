using Microsoft.AspNetCore.Server.Kestrel.Https;
using System.Security.Authentication;
using VKProxy.Core.Config;

namespace VKProxy.Admin.Server.Config;

public class SniConfigData
{
    public string Key { get; set; }
    public int Order { get; set; }
    public string[]? Host { get; set; }
    public CertificateConfig? Certificate { get; set; }
    public bool Passthrough { get; set; }

    public TimeSpan HandshakeTimeout { get; set; } = TimeSpan.FromSeconds(10);

    public SslProtocols? Protocols { get; set; }
    public bool? CheckCertificateRevocation { get; set; }
    public ClientCertificateMode? ClientCertificateMode { get; set; }

    public string? RouteId { get; set; }
    public RouteConfigData? Route { get; set; }
}