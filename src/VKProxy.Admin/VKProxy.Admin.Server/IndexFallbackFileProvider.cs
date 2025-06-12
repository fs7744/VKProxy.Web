using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Primitives;

namespace VKProxy.Admin.Server;

public class IndexFallbackFileProvider : IFileProvider
{
    private readonly PhysicalFileProvider file;

    public IndexFallbackFileProvider(string contentRootPath)
    {
        file = new PhysicalFileProvider(Path.Combine(contentRootPath, "wwwroot"));
    }

    public IDirectoryContents GetDirectoryContents(string subpath)
    {
        return file.GetDirectoryContents(subpath);
    }

    public IFileInfo GetFileInfo(string subpath)
    {
        var r = file.GetFileInfo(subpath);
        if (!r.Exists && !(subpath.EndsWith(".js", StringComparison.OrdinalIgnoreCase)
            || subpath.EndsWith(".css", StringComparison.OrdinalIgnoreCase)
            || subpath.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
            || subpath.EndsWith(".ico", StringComparison.OrdinalIgnoreCase)))
        {
            r = file.GetFileInfo("/index.html");
        }
        return r;
    }

    public IChangeToken Watch(string filter)
    {
        return file.Watch(filter);
    }
}