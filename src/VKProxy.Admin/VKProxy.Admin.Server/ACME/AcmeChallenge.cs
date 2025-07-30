using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using VKProxy.ACME;
using VKProxy.ACME.AspNetCore;
using System.Text.Json.Serialization;
using VKProxy.Admin.Server.Storages;

public class AcmeChallenge
{
    internal static readonly TimeSpan DefaultTimeout = TimeSpan.FromMinutes(10);
    public string Key { get; set; }
    public string? Pem { get; set; }
    public string? PemKey { get; set; }
    public Uri Server { get; set; }

    public string[] DomainNames { get; set; }

    public TimeSpan? RenewDaysInAdvance { get; set; } = TimeSpan.FromDays(30);

    public TimeSpan? Timeout { get; set; } = DefaultTimeout;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ChallengeType AllowedChallengeTypes { get; set; } = ChallengeType.Any;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public KeyAlgorithm KeyAlgorithm { get; set; }

    public int? KeySize { get; set; }

    public string[]? AdditionalIssuers { get; set; }

    public string? AccountKeyPem { get; set; }

    public List<string>? Contact { get; set; }

    public string? EabKeyId { get; set; }
    public string? EabKey { get; set; }
    public string? EabKeyAlg { get; set; }
    public long? LastUpdateDate { get; set; }
    public string? SniKey { get; set; }

    internal AcmeChallengeOptions ToOptions()
    {
        var o = new AcmeChallengeOptions()
        {
            AllowedChallengeTypes = AllowedChallengeTypes,
            Server = Server,
            DomainNames = DomainNames,
            RenewDaysInAdvance = RenewDaysInAdvance,
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

    public static (string, string) ExportPem(X509Certificate2 cert)
    {
        string text = cert.ExportCertificatePem();
        if (cert.HasPrivateKey)
        {
            AsymmetricAlgorithm asymmetricAlgorithm = cert.GetRSAPrivateKey();
            if (asymmetricAlgorithm == null)
            {
                asymmetricAlgorithm = cert.GetECDsaPrivateKey();
            }

            if (asymmetricAlgorithm == null)
            {
                asymmetricAlgorithm = cert.GetDSAPrivateKey();
            }

            if (asymmetricAlgorithm == null)
            {
                asymmetricAlgorithm = cert.GetECDiffieHellmanPrivateKey();
            }

            if (asymmetricAlgorithm != null)
            {
                string value = asymmetricAlgorithm.ExportSubjectPublicKeyInfoPem();
                string value2 = asymmetricAlgorithm.ExportPkcs8PrivateKeyPem();
                return (text, $"{value}{Environment.NewLine}{value2}");
            }
        }

        return (text, null);
    }

    public X509Certificate2? ToCertificate()
    {
        if (Pem == null)
        {
            return null;
        }
        else if (PemKey == null)
        {
            return X509Certificate2.CreateFromPem(Pem);
        }
        else
            return X509Certificate2.CreateFromPem(Pem, PemKey);
    }

    public bool IsNeedRenew()
    {
        if (!RenewDaysInAdvance.HasValue)
            return false;

        var cert = ToCertificate();
        if (cert == null || cert.NotAfter <= DateTimeOffset.Now.DateTime + RenewDaysInAdvance.Value)
            return true;
        cert?.Dispose();

        return false;
    }

    internal async Task Renew(IChallengeStore store, IAcmeStateIniter initer, IStorage storage)
    {
        using var ts = new CancellationTokenSource(Timeout.GetValueOrDefault(DefaultTimeout));
        var t = ts.Token;
        var cert = await initer.CreateCertificateAsync(ToOptions(), t);
        var (c, p) = ExportPem(cert);
        Pem = c;
        PemKey = p;
        await store.UpdateAsync(this, t);
        if (!string.IsNullOrWhiteSpace(SniKey))
        {
            var sni = (await storage.GetSniAsync(SniKey)).FirstOrDefault();
            if (sni != null)
            {
                if (sni.Certificate != null)
                {
                    sni.Certificate = new VKProxy.Core.Config.CertificateConfig()
                    {
                        PEM = Pem,
                        PEMKey = PemKey
                    };
                    await storage.UpdateSniAsync(sni);
                }
            }
        }
    }
}