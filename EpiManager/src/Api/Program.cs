using EpiManager.Application.Interfaces;
using EpiManager.Application.UseCases;
using EpiManager.Infrastructure.Data;
using EpiManager.Infrastructure.Repositories;
using EpiManager.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<EpiDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injection
builder.Services.AddScoped<IGuidGenerator, GuidGeneratorService>();
builder.Services.AddScoped<IEpiRepository, EpiRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

// Epi UseCases
builder.Services.AddScoped<CreateEpiUseCase>();
builder.Services.AddScoped<GetEpiByIdUseCase>();
builder.Services.AddScoped<ListEpisUseCase>();
builder.Services.AddScoped<UpdateEpiUseCase>();
builder.Services.AddScoped<PatchEpiUseCase>();
builder.Services.AddScoped<DeleteEpiUseCase>();

// Category UseCases
builder.Services.AddScoped<CreateCategoryUseCase>();
builder.Services.AddScoped<ListCategoriesUseCase>();
builder.Services.AddScoped<UpdateCategoryUseCase>();
builder.Services.AddScoped<DeleteCategoryUseCase>();

// Metrics UseCases
builder.Services.AddScoped<GetEpiMetricsUseCase>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EpiDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
