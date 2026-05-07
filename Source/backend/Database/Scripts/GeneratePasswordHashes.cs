using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Hashs BCrypt pour les mots de passe ===");
        Console.WriteLine();
        
        // SoftPro users
        string softproHash = BCrypt.HashPassword("SoftPro");
        Console.WriteLine($"SoftPro password hash: {softproHash}");
        
        // TunisieTech users  
        string tunisietchHash = BCrypt.HashPassword("TunisieTech");
        Console.WriteLine($"TunisieTech password hash: {tunisietchHash}");
        
        // Super Admin
        string adminHash = BCrypt.HashPassword("Admin123!");
        Console.WriteLine($"Admin123! password hash: {adminHash}");
        
        Console.WriteLine();
        Console.WriteLine("Copiez ces hashes dans le script SQL.");
    }
}