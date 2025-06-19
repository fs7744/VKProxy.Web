using Microsoft.AspNetCore.Mvc;
using VKProxy.HttpRoutingStatement;

namespace VKProxy.Admin.Server.Controllers;

[ApiController]
[Route("api/statement")]
public class StatementController : ControllerBase
{
    [HttpPost]
    public async Task<object> CheckAsync([FromBody] StatementCheck data)
    {
        try
        {
            HttpRoutingStatementParser.ConvertToFunc(data.Statement);
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