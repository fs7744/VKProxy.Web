public interface IChallengeStore
{
    Task<IEnumerable<AcmeChallenge>> AllAsync(string? prefix, CancellationToken cancellationToken = default);

    Task DeleteAsync(string key, CancellationToken cancellationToken = default);

    Task UpdateAsync(AcmeChallenge challenge, CancellationToken cancellationToken = default);
}