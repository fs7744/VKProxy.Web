using VKProxy.ACME;
using VKProxy.ACME.AspNetCore;

public class AcmeChallenge
{
    public string Key { get; set; }
    public string? Pem { get; set; }
    public Uri Server { get; set; }

    public string[] DomainNames { get; set; }

    public TimeSpan? RenewDaysInAdvance { get; set; } = TimeSpan.FromDays(30);

    public TimeSpan? RenewalCheckPeriod { get; set; } = TimeSpan.FromDays(1);

    public TimeSpan? Timeout { get; set; } = TimeSpan.FromMinutes(10);

    public ChallengeType AllowedChallengeTypes { get; set; } = ChallengeType.Any;

    public KeyAlgorithm KeyAlgorithm { get; set; }

    public int? KeySize { get; set; }

    public string[]? AdditionalIssuers { get; set; }

    public string? AccountKeyPem { get; set; }

    public List<string>? Contact { get; set; }

    public string? EabKeyId { get; set; }
    public string? EabKey { get; set; }
    public string? EabKeyAlg { get; set; }
    public long? LastUpdateDate { get; set; }

    internal AcmeChallengeOptions ToOptions()
    {
        var o = new AcmeChallengeOptions()
        {
            AllowedChallengeTypes = AllowedChallengeTypes,
            Server = Server,
            DomainNames = DomainNames,
            RenewDaysInAdvance = RenewDaysInAdvance,
            RenewalCheckPeriod = RenewalCheckPeriod,
            KeyAlgorithm = KeyAlgorithm,
            KeySize = KeySize,
            AdditionalIssuers = AdditionalIssuers,
        };
        if (!string.IsNullOrEmpty(AccountKeyPem))
        {
            o.Account(AccountKeyPem);
        }
        else
        {
            o.NewAccount(Contact, EabKeyId, EabKey, EabKeyAlg);
        }

        return o;
    }
}