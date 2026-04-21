<%@ Application Language="C#" %>
<script runat="server">
    void Application_Start(object sender, EventArgs e) 
    {
        try {
            // Force load assemblies to ensure Web API can find the controllers
            System.Reflection.Assembly.Load("System.Web.Http.OData");
            System.Reflection.Assembly.Load("NuGet.Server");
            
            // Found via reflection: Start() is parameterless
            NuGet.Server.App_Start.NuGetODataConfig.Start();
        } catch (Exception) {
            // Ignore failure to let the app start
        }
    }
</script>
