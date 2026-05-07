using System;
using Newtonsoft.Json;
using Gestprojet.Core.ApiParamSociete.Client.Model;

public class TestTacheAssignationCore
{
    public static void Main()
    {
        // Test JSON that the frontend sends
        string json = @"{
            ""id"": null,
            ""tacheId"": ""TSK001"",
            ""utilisateurId"": ""USR001"",
            ""actif"": true
        }";
        
        try
        {
            var obj = JsonConvert.DeserializeObject<TacheAssignationCore>(json);
            
            Console.WriteLine("Deserialization successful!");
            Console.WriteLine($"Id: {obj.Id}");
            Console.WriteLine($"TacheId: {obj.TacheId}");
            Console.WriteLine($"UtilisateurId: {obj.UtilisateurId}");
            Console.WriteLine($"Actif: {obj.Actif}");
            
            // Verify values
            if (obj.Id == null && obj.TacheId == "TSK001" && obj.UtilisateurId == "USR001" && obj.Actif == true)
            {
                Console.WriteLine("All values are correct!");
            }
            else
            {
                Console.WriteLine("ERROR: Some values are incorrect!");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Deserialization failed: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }
}