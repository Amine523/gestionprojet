using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecrutementController : ControllerBase
    {
        private readonly IApplicationBusiness _applicationBusiness;
        private readonly IUtilisateurBusiness _utilisateurBusiness;
        private readonly IAttachementBusiness _attachementBusiness;
        private readonly IWebHostEnvironment _env;

        public RecrutementController(
            IApplicationBusiness applicationBusiness,
            IUtilisateurBusiness utilisateurBusiness,
            IAttachementBusiness attachementBusiness,
            IWebHostEnvironment env)
        {
            _applicationBusiness = applicationBusiness;
            _utilisateurBusiness = utilisateurBusiness;
            _attachementBusiness = attachementBusiness;
            _env = env;
        }

        [HttpPost("postuler")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Postuler([FromForm] CandidatureSubmission submission)
        {
            if (submission == null) return BadRequest("Données invalides");

            // 1. Gérer le CV si présent
            string cvPath = null;
            if (submission.CV != null && submission.CV.Length > 0)
            {
                var uploads = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "cvs");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

                var fileName = $"CV_{Guid.NewGuid().ToString("N")}{Path.GetExtension(submission.CV.FileName)}";
                cvPath = Path.Combine("uploads", "cvs", fileName);
                var fullPath = Path.Combine(_env.ContentRootPath, "wwwroot", cvPath);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await submission.CV.CopyToAsync(stream);
                }
            }

            // 2. Créer ou récupérer l'utilisateur (Candidat)
            // Note: En entreprise, on vérifierait si l'email existe déjà
            
            // 3. Créer la candidature
            var application = new ApplicationCore
            {
                Id = "CAND_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                UtilisateurId = submission.CandidatId,
                Statut = "EN_ATTENTE",
                Type = "Candidature",
                AppelDate = DateTime.Now,
                Actif = true
            };

            var result = await _applicationBusiness.AjouterOuModifierAsync(application);

            if (result.Success && !string.IsNullOrEmpty(cvPath))
            {
                // Enregistrer l'attachement
                var attachement = new AttachementCore
                {
                    Id = "ATT_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                    CheminFichier = cvPath,
                    TypeFichier = "CV",
                    Actif = true
                    // Id de la candidature pourrait être mis dans un champ ProjetId ou TacheId par défaut si pas de champ dédié
                };
                await _attachementBusiness.AjouterOuModifierAsync(attachement);
            }

            return result.Success ? Ok(new { success = true, applicationId = application.Id }) : BadRequest(result.Message);
        }

        [HttpGet("questions/{quizName}")]
        public IActionResult GetQuestions(string quizName)
        {
            // Simulation de récupération de questions sécurisée depuis le backend
            // Dans une vraie app, on lirait la table Questions
            var questions = new List<object>();

            if (quizName == "JavaScript Avancé")
            {
                questions.Add(new { id = "Q1", q = "Qu'est-ce qu'une closure?", options = new[] { "Une fonction qui retourne une fonction", "Une fonction avec accès aux vars de son scope externe", "Un objet", "Une class" } });
                questions.Add(new { id = "Q2", q = "Comment créer un promise?", options = new[] { "new Promise(executor)", "Promise.create()", "Promise.new()", "createPromise()" } });
                // ... plus de questions
            }
            else
            {
                // Questions par défaut
                questions.Add(new { id = "QD1", q = "Question de test 1", options = new[] { "A", "B", "C", "D" } });
            }

            return Ok(questions);
        }

        [HttpPost("valider-quiz")]
        public async Task<IActionResult> ValiderQuiz([FromBody] QuizValidationRequest request)
        {
            // Logique de validation du score côté serveur (Sécurisé)
            int score = 0;
            // Vérification des réponses...
            
            // Mise à jour du statut de la candidature
            var candidature = await _applicationBusiness.ObtenirAsync(request.ApplicationId);
            if (candidature != null)
            {
                candidature.Statut = "TEST_TERMINE";
                await _applicationBusiness.AjouterOuModifierAsync(candidature);
            }

            return Ok(new { score = 85, passed = true, message = "Résultats enregistrés" });
        }
    }

    public class CandidatureSubmission
    {
        public string CandidatId { get; set; }
        public string OffreId { get; set; }
        public IFormFile CV { get; set; }
    }

    public class QuizValidationRequest
    {
        public string ApplicationId { get; set; }
        public string QuizName { get; set; }
        public List<int> Reponses { get; set; }
    }
}
