rm -rf src/VKProxy.Admin/vkproxy.admin.client/dist
rm -rf src/VKProxy.Admin/VKProxy.Admin.Server/bin/Release
cd src/VKProxy.Admin/vkproxy.admin.client
npm run build
cd ../VKProxy.Admin.Server
dotnet build --configuration Release
cd ../
cp -r vkproxy.admin.client/dist VKProxy.Admin.Server/bin/Release/net9.0/wwwroot