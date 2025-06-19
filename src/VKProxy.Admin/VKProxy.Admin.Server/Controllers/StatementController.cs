using Microsoft.AspNetCore.Mvc;
using VKProxy.HttpRoutingStatement;

namespace VKProxy.Admin.Server.Controllers;

[ApiController]
[Route("api/statement")]
public class StatementController : ControllerBase
{
    [HttpPost]
    public async Task CheckAsync([FromBody] StatementCheck data)
    {
        try
        {
            HttpRoutingStatementParser.ConvertToFunc(data.Statement);
        }
        catch (Exception ex)
        {
            throw new ArgumentException(ex.Message, "Statement");
        }
    }
}

public class StatementCheck
{
    public string Statement { get; set; }
}