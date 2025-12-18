using QLVN_Domain.Interfaces;
using QLVN_Infrastructure; // Chứa DbContext
using QLVN_Infrastructure.Repositories;
using QLVN_Application.Interfaces;
using QLVN_Application.Services;
using QLVN_Application.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBlazorOrigin",
        policy => policy
            // Cho phép các Port của Blazor truy cập (Lấy từ launchSettings của Blazor)
            .WithOrigins("https://localhost:7096", "http://localhost:5273")
            .AllowAnyMethod() // Cho phép GET, POST, PUT, DELETE...
            .AllowAnyHeader()); // Cho phép gửi Token header
});
// Cấu hình JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!))
    };
});


// 1. Kết nối DB
builder.Services.AddDbContext<QlvnDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// 2. Đăng ký Repository & UnitOfWork
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddScoped<IUserService, UserService>();

// 3. Đăng ký Application Services
builder.Services.AddScoped<DvsdService, DvsdService>();

// 4. Đăng ký AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. KÍCH HOẠT CORS
app.UseCors("AllowBlazorOrigin");

app.UseAuthentication(); // Xác thực
app.UseAuthorization();

app.MapControllers();

app.Run();
