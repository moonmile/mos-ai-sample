# Use the official .NET 9.0 runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8000
EXPOSE 8001

# Use the SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["aspnet-minimal-sample.csproj", "."]
RUN dotnet restore "./aspnet-minimal-sample.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "aspnet-minimal-sample.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "aspnet-minimal-sample.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "aspnet-minimal-sample.dll"]
