FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . ./

RUN dotnet restore EpiManager.sln

RUN dotnet publish src/Api/EpiManager.Api.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_ENVIRONMENT=Development
EXPOSE 5000

ENTRYPOINT ["dotnet", "EpiManager.Api.dll"]
