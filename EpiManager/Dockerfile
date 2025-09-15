# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia tudo (solution + src + projetos)
COPY . ./

# Restaura pacotes
RUN dotnet restore EpiManager.sln

# Build e publish apenas do projeto de entrada (Api)
RUN dotnet publish src/Api/EpiManager.Api.csproj -c Release -o out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Força ASP.NET a escutar na porta 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_ENVIRONMENT=Development
EXPOSE 5000

ENTRYPOINT ["dotnet", "EpiManager.Api.dll"]
