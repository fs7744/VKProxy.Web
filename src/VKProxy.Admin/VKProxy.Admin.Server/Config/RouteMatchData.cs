namespace VKProxy.Admin.Server.Config;

public class RouteMatchData
{
    public List<string>? Hosts { get; set; }

    public List<string>? Paths { get; set; }

    public List<string>? Methods { get; set; }
    public string? Statement { get; set; }
}