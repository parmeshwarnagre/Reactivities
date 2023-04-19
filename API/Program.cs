
//when run the application this can create the kestrel server
//also read any configuration from configuration file passed to it

using Microsoft.EntityFrameworkCore;
using Persistence;

using API.Extensions;

var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline. called middleware(Http request)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();//register the endpoints
using var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;
try{
var context=services.GetRequiredService<DataContext>();
await context.Database.MigrateAsync();
await Seed.SeedData(context);
}
catch(Exception ex){
 var logger=services.GetRequiredService<ILogger<Program>>();
 logger.LogError(ex,"An error occured during migration");
}
app.Run();
