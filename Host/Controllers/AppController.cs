using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Host.Models;
using Microsoft.Extensions.Logging;

namespace Host.Controllers;

public class AppController : Controller
{
    private readonly ILogger<AppController> _logger;

    public AppController(ILogger<AppController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}