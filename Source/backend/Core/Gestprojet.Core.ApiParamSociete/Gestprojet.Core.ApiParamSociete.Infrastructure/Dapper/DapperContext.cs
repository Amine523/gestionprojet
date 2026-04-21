using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper
{
    public class DapperContext
    {
        private readonly string _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            // This must match the key in appsettings.json
            _connectionString = configuration.GetConnectionString("GestionProjetDB");

            // Add validation
            if (string.IsNullOrEmpty(_connectionString))
            {
                throw new InvalidOperationException("Connection string 'GestionProjetDB' not found or is empty in appsettings.json");
            }
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}