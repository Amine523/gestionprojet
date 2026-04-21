using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public class EvaluationService
    {
        private readonly OllamaService _ollamaService;

        public EvaluationService(OllamaService ollamaService)
        {
            _ollamaService = ollamaService;
        }

        public async Task<EvaluationResponseDTO> EvaluateAsync(EvaluationRequestDTO request)
        {
            // Use AI if requested
            if (request.UseAI)
            {
                return await EvaluateWithAIAsync(request);
            }
            
            // Deterministic evaluation based on role
            switch (request.Role.ToLower())
            {
                case "candidate":
                    return EvaluateCandidate(request);
                case "developer":
                case "testeur":
                    return EvaluateDeveloper(request);
                case "employee":
                    return EvaluateEmployee(request);
                default:
                    return EvaluateCandidate(request); // Default to candidate evaluation
            }
        }

        private EvaluationResponseDTO EvaluateCandidate(EvaluationRequestDTO request)
        {
            var data = request.Data;
            var response = new EvaluationResponseDTO();
            
            // Candidate scoring: Test results (40%), Skills relevance (30%), Experience (30%)
            var testScore = ConvertTo20(data.TestResults) * 0.40m;
            var skillsScore = EvaluateSkills(data.Skills) * 0.30m;
            var experienceScore = ConvertExperienceTo20(data.Experience) * 0.30m;
            
            response.ScoreSur20 = testScore + skillsScore + experienceScore;
            response.ScoreSur20 = Math.Round(response.ScoreSur20, 2);
            
            response.Details.Technique = ConvertTo20(data.TechnicalScore);
            response.Details.Productivite = ConvertTo20(data.TestResults);
            response.Details.Discipline = ConvertExperienceTo20(data.Experience);
            response.Details.Qualite = EvaluateSkills(data.Skills);
            
            // Generate feedback
            response.Mention = GetMention(response.ScoreSur20);
            response.Decision = GetDecision(response.ScoreSur20, "candidate");
            response.RiskLevel = GetRiskLevel(response.ScoreSur20);
            
            response.Feedback = GenerateCandidateFeedback(response.ScoreSur20, data);
            response.Strengths = IdentifyCandidateStrengths(data, response.ScoreSur20);
            response.Weaknesses = IdentifyCandidateWeaknesses(data, response.ScoreSur20);
            response.Ameliorations = GenerateCandidateImprovements(data, response.ScoreSur20);
            
            return response;
        }

        private EvaluationResponseDTO EvaluateDeveloper(EvaluationRequestDTO request)
        {
            var data = request.Data;
            var response = new EvaluationResponseDTO();
            
            // Developer scoring: Tasks completion (30%), Code quality (25%), Bugs (15%), Deadlines (20%), Communication (10%)
            var tasksScore = CalculateTasksScore(data.TasksCompleted, data.TasksDelayed) * 0.30m;
            var codeQualityScore = ConvertTo20(data.CodeQuality) * 0.25m;
            var bugsScore = CalculateBugsScore(data.BugCount) * 0.15m;
            var deadlinesScore = CalculateDeadlinesScore(data.TasksCompleted, data.TasksDelayed) * 0.20m;
            var communicationScore = ConvertTo20(data.CommunicationScore) * 0.10m;
            
            response.ScoreSur20 = tasksScore + codeQualityScore + bugsScore + deadlinesScore + communicationScore;
            response.ScoreSur20 = Math.Round(response.ScoreSur20, 2);
            
            response.Details.Technique = ConvertTo20(data.TechnicalScore);
            response.Details.Productivite = CalculateTasksScore(data.TasksCompleted, data.TasksDelayed);
            response.Details.Discipline = CalculateDeadlinesScore(data.TasksCompleted, data.TasksDelayed);
            response.Details.Qualite = ConvertTo20(data.CodeQuality);
            
            response.Mention = GetMention(response.ScoreSur20);
            response.Decision = GetDecision(response.ScoreSur20, "developer");
            response.RiskLevel = GetRiskLevel(response.ScoreSur20);
            
            response.Feedback = GenerateDeveloperFeedback(response.ScoreSur20, data);
            response.Strengths = IdentifyDeveloperStrengths(data, response.ScoreSur20);
            response.Weaknesses = IdentifyDeveloperWeaknesses(data, response.ScoreSur20);
            response.Ameliorations = GenerateDeveloperImprovements(data, response.ScoreSur20);
            
            return response;
        }

        private EvaluationResponseDTO EvaluateEmployee(EvaluationRequestDTO request)
        {
            var data = request.Data;
            var response = new EvaluationResponseDTO();
            
            // Employee (RH) scoring: Attendance (40%), Absences (30%), Discipline (30%)
            var attendanceScore = ConvertTo20(data.AttendanceRate) * 0.40m;
            var absencesScore = CalculateAbsencesScore(data.AbsenceDays) * 0.30m;
            var disciplineScore = ConvertTo20(data.CommunicationScore) * 0.30m;
            
            response.ScoreSur20 = attendanceScore + absencesScore + disciplineScore;
            response.ScoreSur20 = Math.Round(response.ScoreSur20, 2);
            
            response.Details.Technique = ConvertTo20(data.TechnicalScore);
            response.Details.Productivite = ConvertTo20(data.ProjectProgress);
            response.Details.Discipline = ConvertTo20(data.AttendanceRate);
            response.Details.Qualite = CalculateAbsencesScore(data.AbsenceDays);
            
            response.Mention = GetMention(response.ScoreSur20);
            response.Decision = GetDecision(response.ScoreSur20, "employee");
            response.RiskLevel = GetRiskLevel(response.ScoreSur20);
            
            response.Feedback = GenerateEmployeeFeedback(response.ScoreSur20, data);
            response.Strengths = IdentifyEmployeeStrengths(data, response.ScoreSur20);
            response.Weaknesses = IdentifyEmployeeWeaknesses(data, response.ScoreSur20);
            response.Ameliorations = GenerateEmployeeImprovements(data, response.ScoreSur20);
            
            return response;
        }

        private async Task<EvaluationResponseDTO> EvaluateWithAIAsync(EvaluationRequestDTO request)
        {
            try
            {
                // Check if Ollama is available
                var isAvailable = await _ollamaService.IsAvailableAsync();
                
                if (!isAvailable)
                {
                    // Fallback to deterministic evaluation with AI note
                    var response = await EvaluateAsync(request);
                    response.Feedback += " [IA non disponible - Évaluation déterministe utilisée]";
                    response.Ameliorations.Add("Démarrer le service Ollama pour activer l'évaluation IA");
                    return response;
                }

                // Convert data to JSON for AI processing
                var jsonData = JsonSerializer.Serialize(request.Data);
                
                // Call Ollama for AI evaluation
                var aiResponse = await _ollamaService.GenerateEvaluationAsync(request);

                if (string.IsNullOrEmpty(aiResponse))
                {
                    // Fallback if AI fails
                    var response = await EvaluateAsync(request);
                    response.Feedback += " [Échec de l'IA - Évaluation déterministe utilisée]";
                    return response;
                }

                // Parse AI response
                try
                {
                    var aiEvaluation = JsonSerializer.Deserialize<EvaluationResponseDTO>(aiResponse);
                    if (aiEvaluation != null)
                    {
                        aiEvaluation.EvaluationDate = DateTime.UtcNow;
                        aiEvaluation.Feedback += " [Évaluation IA générée par Ollama]";
                        return aiEvaluation;
                    }
                }
                catch (JsonException)
                {
                    // If AI response is not valid JSON, fallback
                }

                // Fallback to deterministic evaluation
                var fallbackResponse = await EvaluateAsync(request);
                fallbackResponse.Feedback += " [Réponse IA invalide - Évaluation déterministe utilisée]";
                return fallbackResponse;
            }
            catch (Exception)
            {
                // Fallback to deterministic evaluation on any error
                var response = await EvaluateAsync(request);
                response.Feedback += " [Erreur IA - Évaluation déterministe utilisée]";
                return response;
            }
        }

        // Helper methods for scoring
        private decimal ConvertTo20(decimal value)
        {
            return (value / 100) * 20;
        }

        private decimal ConvertExperienceTo20(int years)
        {
            if (years == 0) return 5;
            if (years <= 1) return 8;
            if (years <= 3) return 12;
            if (years <= 5) return 15;
            if (years <= 10) return 17;
            return 20;
        }

        private decimal EvaluateSkills(List<string> skills)
        {
            if (skills == null || skills.Count == 0) return 5;
            if (skills.Count <= 2) return 8;
            if (skills.Count <= 4) return 12;
            if (skills.Count <= 6) return 15;
            if (skills.Count <= 8) return 17;
            return 20;
        }

        private decimal CalculateTasksScore(int completed, int delayed)
        {
            int total = completed + delayed;
            if (total == 0) return 10;
            decimal completionRate = (decimal)completed / total;
            return completionRate * 20;
        }

        private decimal CalculateDeadlinesScore(int completed, int delayed)
        {
            int total = completed + delayed;
            if (total == 0) return 10;
            decimal onTimeRate = (decimal)completed / total;
            return onTimeRate * 20;
        }

        private decimal CalculateBugsScore(int bugCount)
        {
            if (bugCount == 0) return 20;
            if (bugCount <= 2) return 17;
            if (bugCount <= 5) return 14;
            if (bugCount <= 10) return 10;
            if (bugCount <= 20) return 7;
            return 5;
        }

        private decimal CalculateAbsencesScore(int absenceDays)
        {
            if (absenceDays == 0) return 20;
            if (absenceDays <= 2) return 18;
            if (absenceDays <= 5) return 15;
            if (absenceDays <= 10) return 12;
            if (absenceDays <= 15) return 8;
            return 5;
        }

        // Helper methods for feedback generation
        private string GetMention(decimal score)
        {
            if (score >= 16) return "Excellent";
            if (score >= 14) return "Très Bien";
            if (score >= 12) return "Bien";
            if (score >= 10) return "Passable";
            return "Insuffisant";
        }

        private string GetDecision(decimal score, string role)
        {
            if (score >= 16)
            {
                return role == "candidate" ? "Recruter" : "Promouvoir";
            }
            if (score >= 12)
            {
                return role == "candidate" ? "Surveiller" : "Valider";
            }
            return role == "candidate" ? "Rejeter" : "Alerte";
        }

        private string GetRiskLevel(decimal score)
        {
            if (score >= 16) return "Faible";
            if (score >= 12) return "Moyen";
            return "Élevé";
        }

        private string GenerateCandidateFeedback(decimal score, EvaluationDataDTO data)
        {
            if (score >= 16)
            {
                return $"Candidat exceptionnel avec {data.TestResults}% aux tests, {data.Experience} ans d'expérience et {data.Skills?.Count ?? 0} compétences clés.";
            }
            if (score >= 12)
            {
                return $"Candidat prometteur avec de bons résultats aux tests ({data.TestResults}%) et une expérience pertinente de {data.Experience} ans.";
            }
            if (score >= 10)
            {
                return $"Candidat acceptable mais nécessitant un accompagnement. Résultats aux tests: {data.TestResults}%, Expérience: {data.Experience} ans.";
            }
            return $"Candidat ne répondant pas aux critères minimaux. Résultats insuffisants: {data.TestResults}%, Expérience limitée: {data.Experience} ans.";
        }

        private List<string> IdentifyCandidateStrengths(EvaluationDataDTO data, decimal score)
        {
            var strengths = new List<string>();
            
            if (data.TestResults >= 70) strengths.Add("Excellents résultats aux tests techniques");
            if (data.Experience >= 3) strengths.Add($"Expérience solide ({data.Experience} ans)");
            if (data.Skills != null && data.Skills.Count >= 5) strengths.Add($"Large palette de compétences ({data.Skills.Count} compétences)");
            if (data.TechnicalScore >= 70) strengths.Add("Bonne maîtrise technique");
            
            return strengths;
        }

        private List<string> IdentifyCandidateWeaknesses(EvaluationDataDTO data, decimal score)
        {
            var weaknesses = new List<string>();
            
            if (data.TestResults < 50) weaknesses.Add("Résultats aux tests insuffisants");
            if (data.Experience < 2) weaknesses.Add("Expérience professionnelle limitée");
            if (data.Skills == null || data.Skills.Count < 3) weaknesses.Add("Compétences techniques limitées");
            if (data.TechnicalScore < 50) weaknesses.Add("Niveau technique à améliorer");
            
            return weaknesses;
        }

        private List<string> GenerateCandidateImprovements(EvaluationDataDTO data, decimal score)
        {
            var improvements = new List<string>();
            
            if (data.TestResults < 70) improvements.Add("Renforcer les compétences techniques par la formation");
            if (data.Experience < 3) improvements.Add("Acquérir plus d'expérience pratique");
            if (data.Skills == null || data.Skills.Count < 5) improvements.Add("Élargir le spectre de compétences");
            if (data.TechnicalScore < 70) improvements.Add("Suivre des cours de perfectionnement technique");
            
            return improvements;
        }

        private string GenerateDeveloperFeedback(decimal score, EvaluationDataDTO data)
        {
            if (score >= 16)
            {
                return $"Développeur excellent avec {data.TasksCompleted} tâches complétées, code qualité {data.CodeQuality}%, et seulement {data.BugCount} bugs.";
            }
            if (score >= 12)
            {
                return $"Développeur compétent avec une bonne productivité ({data.TasksCompleted} tâches) et une qualité de code acceptable.";
            }
            if (score >= 10)
            {
                return $"Développeur performant mais avec des axes d'amélioration sur la qualité ({data.BugCount} bugs) et le respect des délais.";
            }
            return $"Développeur nécessitant un accompagnement renforcé. Performance insuffisante: {data.TasksCompleted} tâches, {data.BugCount} bugs.";
        }

        private List<string> IdentifyDeveloperStrengths(EvaluationDataDTO data, decimal score)
        {
            var strengths = new List<string>();
            
            if (data.TasksCompleted >= 20) strengths.Add($"Haute productivité ({data.TasksCompleted} tâches)");
            if (data.CodeQuality >= 70) strengths.Add("Code de bonne qualité");
            if (data.BugCount <= 5) strengths.Add("Peu de bugs dans le code");
            if (data.CommunicationScore >= 70) strengths.Add("Bonne communication");
            if (data.ProjectProgress >= 80) strengths.Add("Progrès significatif sur les projets");
            
            return strengths;
        }

        private List<string> IdentifyDeveloperWeaknesses(EvaluationDataDTO data, decimal score)
        {
            var weaknesses = new List<string>();
            
            if (data.TasksDelayed > data.TasksCompleted / 2) weaknesses.Add("Respect des délais à améliorer");
            if (data.BugCount > 10) weaknesses.Add("Trop de bugs dans le code");
            if (data.CodeQuality < 50) weaknesses.Add("Qualité du code insuffisante");
            if (data.CommunicationScore < 50) weaknesses.Add("Communication à améliorer");
            
            return weaknesses;
        }

        private List<string> GenerateDeveloperImprovements(EvaluationDataDTO data, decimal score)
        {
            var improvements = new List<string>();
            
            if (data.CodeQuality < 70) improvements.Add("Améliorer la qualité du code par des revues de code");
            if (data.BugCount > 5) improvements.Add("Renforcer les tests unitaires pour réduire les bugs");
            if (data.CommunicationScore < 70) improvements.Add("Améliorer la communication avec l'équipe");
            if (data.TasksDelayed > 0) improvements.Add("Mieux gérer le temps et respecter les délais");
            
            return improvements;
        }

        private string GenerateEmployeeFeedback(decimal score, EvaluationDataDTO data)
        {
            if (score >= 16)
            {
                return $"Employé modèle avec un taux de présence de {data.AttendanceRate}%, seulement {data.AbsenceDays} jours d'absence, et une excellente discipline.";
            }
            if (score >= 12)
            {
                return $"Employé fiable avec une bonne assiduité ({data.AttendanceRate}%) et un comportement professionnel satisfaisant.";
            }
            if (score >= 10)
            {
                return $"Employé correct mais nécessitant un suivi sur la présence ({data.AbsenceDays} absences) et la discipline.";
            }
            return $"Employé nécessitant un accompagnement renforcé. Assiduité insuffisante: {data.AttendanceRate}%, {data.AbsenceDays} absences.";
        }

        private List<string> IdentifyEmployeeStrengths(EvaluationDataDTO data, decimal score)
        {
            var strengths = new List<string>();
            
            if (data.AttendanceRate >= 90) strengths.Add($"Excellente assiduité ({data.AttendanceRate}%)");
            if (data.AbsenceDays <= 2) strengths.Add("Très peu d'absences");
            if (data.CommunicationScore >= 70) strengths.Add("Bonne communication");
            if (data.ProjectProgress >= 80) strengths.Add("Bonne progression sur les projets");
            
            return strengths;
        }

        private List<string> IdentifyEmployeeWeaknesses(EvaluationDataDTO data, decimal score)
        {
            var weaknesses = new List<string>();
            
            if (data.AttendanceRate < 80) weaknesses.Add("Taux de présence insuffisante");
            if (data.AbsenceDays > 10) weaknesses.Add("Nombre d'absences élevé");
            if (data.CommunicationScore < 50) weaknesses.Add("Communication à améliorer");
            
            return weaknesses;
        }

        private List<string> GenerateEmployeeImprovements(EvaluationDataDTO data, decimal score)
        {
            var improvements = new List<string>();
            
            if (data.AttendanceRate < 90) improvements.Add("Améliorer la ponctualité et l'assiduité");
            if (data.AbsenceDays > 5) improvements.Add("Réduire les absences injustifiées");
            if (data.CommunicationScore < 70) improvements.Add("Renforcer la communication avec l'équipe");
            if (data.ProjectProgress < 80) improvements.Add("Accélérer la progression sur les projets");
            
            return improvements;
        }
    }
}
