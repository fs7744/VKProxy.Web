using Lmzzz.AspNetCoreTemplate;
using Microsoft.AspNetCore.Mvc;

namespace VKProxy.Admin.Server.Controllers;

[ApiController]
[Route("api/statement")]
public class StatementController : ControllerBase
{
    private readonly ITemplateEngineFactory engineFactory;

    public StatementController(ITemplateEngineFactory engineFactory)
    {
        this.engineFactory = engineFactory;
    }

    [HttpPost]
    public async Task<object> CheckAsync([FromBody] StatementCheck data)
    {
        try
        {
            engineFactory.ConvertRouteFunction(data.Statement);
            return null;
        }
        catch (Exception ex)
        {
            return this.BadRequest(new { Error = ex.Message });
        }
    }
}

public class StatementCheck
{
    public string Statement { get; set; }
}