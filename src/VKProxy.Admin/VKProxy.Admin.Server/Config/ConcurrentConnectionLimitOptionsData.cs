namespace VKProxy.Admin.Server.Config;

public class ConcurrentConnectionLimitOptionsData
{
    public string? Policy { get; set; } // TokenBucket / Concurrency / FixedWindow / SlidingWindow
    public string? By { get; set; }  // Total / header
    public int? PermitLimit { get; set; }
    public int? QueueLimit { get; set; }
    public int? SegmentsPerWindow { get; set; }
    public int? TokensPerPeriod { get; set; }
    public string? Header { get; set; }
    public TimeSpan? Window { get; set; }
    public string? Cookie { get; set; }
}
