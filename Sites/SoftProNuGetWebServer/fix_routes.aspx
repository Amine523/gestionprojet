<%@ Page Language="C#" %>
    <%@ Import Namespace="System.Reflection" %>

        <script runat="server">
            void Page_Load(object sender, EventArgs e) {
                try {
                    Response.Write("<h2>Contrôleurs et Assemblages</h2>");

                    foreach(Assembly ass in AppDomain.CurrentDomain.GetAssemblies()) {
                string name = ass.FullName;
                        if (!name.Contains("NuGet.Server") && !name.Contains("SoftPro")) continue;

                        Response.Write("<b>Assemblage trouvé :</b> " + name + "<br/>");
                        try {
                            foreach(Type t in ass.GetTypes()) {
                                if (t.Name.EndsWith("Controller") && !t.IsAbstract) {
                                    Response.Write("- Contrôleur : <span style='color:green'>" + t.FullName + "</span><br/>");
                                }
                            }
                        } catch (ReflectionTypeLoadException rtle) {
                            Response.Write("<span style='color:red'>Erreur de chargement types : " + rtle.Message + "</span><br/>");
                            foreach(Exception ex in rtle.LoaderExceptions) {
                                Response.Write("&nbsp;&nbsp; - Erreur : " + ex.Message + "<br/>");
                            }
                        }
                    }
                } catch (Exception ex) {
                    Response.Write("<div style='color:red'>" + ex.ToString() + "</div>");
                }
            }
        </script>