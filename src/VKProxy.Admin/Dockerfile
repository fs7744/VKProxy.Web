FROM a.newegg.org/docker-microsoft-mcr/dotnet/aspnet:9.0-alpine
MAINTAINER Victor.x.qu

ENV ETCD_CONNECTION_STRING=http://127.0.0.1:2379
ENV ETCD_PREFIX=/ReverseProxy/

ADD VKProxy.Admin.Server/bin/Release/net9.0 /app
WORKDIR /app
CMD ["dotnet", "VKProxy.Admin.Server.dll"]