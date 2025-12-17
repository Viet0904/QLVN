using QLVN_Domain.Interfaces;
using QLVN_Infrastructure; // Chứa DbContext
using QLVN_Infrastructure.Repositories;
using QLVN_Application.Interfaces;
using QLVN_Application.Services;
using QLVN_Application.Mappings;
using Microsoft.EntityFrameworkCore;




var builder = WebApplication.CreateBuilder(args);

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

app.UseAuthorization();

app.MapControllers();

app.Run();
