using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using QLVN_Blazor.Services;
using QLVN_Blazor;
using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using QLVN_Blazor.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<UserApiClient>();
await builder.Build().RunAsync();
