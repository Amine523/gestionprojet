using Microsoft.Data.SqlClient;
using System;
using System.IO;

class Program
{
    static void Main()
    {
        string connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;";
        string sqlFile = "update_societe_schema.sql";
        
        if (!File.Exists(sqlFile))
        {
            Console.WriteLine("File not found: " + sqlFile);
            return;
        }

        string sql = File.ReadAllText(sqlFile);
        
        // Split by GO
        string[] commands = sql.Split(new[] { "\r\nGO", "\nGO", "GO\r\n", "GO\n" }, StringSplitOptions.RemoveEmptyEntries);

        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();
            foreach (var cmdText in commands)
            {
                if (string.IsNullOrWhiteSpace(cmdText)) continue;
                using (var command = new SqlCommand(cmdText, connection))
                {
                    try {
                        command.ExecuteNonQuery();
                        Console.WriteLine("Executed successfully: " + (cmdText.Length > 50 ? cmdText.Substring(0, 50) + "..." : cmdText));
                    } catch (Exception ex) {
                        Console.WriteLine("Error executing command: " + ex.Message);
                    }
                }
            }
        }
    }
}
