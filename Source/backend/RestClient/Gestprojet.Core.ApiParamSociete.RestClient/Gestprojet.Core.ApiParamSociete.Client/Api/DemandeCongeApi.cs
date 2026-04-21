using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Net.Mime;
using Gestprojet.Core.ApiParamSociete.Client.Client;
using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Core.ApiParamSociete.Client.Api
{
    public interface IDemandeCongeApiSync : IApiAccessor
    {
        List<DemandeCongeCore> DemandeCongeListeGet();
        DemandeCongeCore DemandeCongeObtenirIdIdGet(string id);
        bool DemandeCongeAjouterPost(DemandeCongeCore entity);
        bool DemandeCongeModifierPut(DemandeCongeCore entity);
        bool DemandeCongeSupprimerIdIdDelete(string id);
    }

    public interface IDemandeCongeApiAsync : IApiAccessor
    {
        System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeGetAsync(System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<DemandeCongeCore> DemandeCongeObtenirIdIdGetAsync(string id, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<bool> DemandeCongeAjouterPostAsync(DemandeCongeCore entity, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<bool> DemandeCongeModifierPutAsync(DemandeCongeCore entity, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<bool> DemandeCongeSupprimerIdIdDeleteAsync(string id, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeParSocieteIdSocieteIdGetAsync(string societeId, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
        System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeParUtilisateurIdUtilisateurIdGetAsync(string utilisateurId, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken));
    }

    public interface IDemandeCongeApi : IDemandeCongeApiSync, IDemandeCongeApiAsync { }

    public partial class DemandeCongeApi : IDemandeCongeApi
    {
        public Gestprojet.Core.ApiParamSociete.Client.Client.IAsynchronousClient AsynchronousClient { get; set; }
        public Gestprojet.Core.ApiParamSociete.Client.Client.ISynchronousClient Client { get; set; }
        public Gestprojet.Core.ApiParamSociete.Client.Client.IReadableConfiguration Configuration { get; set; }
        public Gestprojet.Core.ApiParamSociete.Client.Client.ExceptionFactory ExceptionFactory { get; set; }

        public DemandeCongeApi(Gestprojet.Core.ApiParamSociete.Client.Client.Configuration configuration)
        {
            this.Configuration = configuration;
            this.Client = new Gestprojet.Core.ApiParamSociete.Client.Client.ApiClient(this.Configuration.BasePath);
            this.AsynchronousClient = new Gestprojet.Core.ApiParamSociete.Client.Client.ApiClient(this.Configuration.BasePath);
            this.ExceptionFactory = Gestprojet.Core.ApiParamSociete.Client.Client.Configuration.DefaultExceptionFactory;
        }

        public string GetBasePath() => this.Configuration.BasePath;

        public List<DemandeCongeCore> DemandeCongeListeGet() => throw new NotImplementedException();
        public DemandeCongeCore DemandeCongeObtenirIdIdGet(string id) => throw new NotImplementedException();
        public bool DemandeCongeAjouterPost(DemandeCongeCore entity) => throw new NotImplementedException();
        public bool DemandeCongeModifierPut(DemandeCongeCore entity) => throw new NotImplementedException();
        public bool DemandeCongeSupprimerIdIdDelete(string id) => throw new NotImplementedException();

        public async System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeGetAsync(System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions();
            var response = await this.AsynchronousClient.GetAsync<List<DemandeCongeCore>>("/api/DemandesConge", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<DemandeCongeCore> DemandeCongeObtenirIdIdGetAsync(string id, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions();
            var response = await this.AsynchronousClient.GetAsync<DemandeCongeCore>($"/api/DemandesConge/{id}", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<bool> DemandeCongeAjouterPostAsync(DemandeCongeCore entity, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions { Data = entity };
            var response = await this.AsynchronousClient.PostAsync<bool>("/api/DemandesConge", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<bool> DemandeCongeModifierPutAsync(DemandeCongeCore entity, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions { Data = entity };
            var response = await this.AsynchronousClient.PutAsync<bool>("/api/DemandesConge", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<bool> DemandeCongeSupprimerIdIdDeleteAsync(string id, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions();
            var response = await this.AsynchronousClient.DeleteAsync<bool>($"/api/DemandesConge/{id}", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeParSocieteIdSocieteIdGetAsync(string societeId, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions();
            var response = await this.AsynchronousClient.GetAsync<List<DemandeCongeCore>>($"/api/DemandesConge/societe/{societeId}", options, this.Configuration, cancellationToken);
            return response.Data;
        }

        public async System.Threading.Tasks.Task<List<DemandeCongeCore>> DemandeCongeListeParUtilisateurIdUtilisateurIdGetAsync(string utilisateurId, System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            var options = new RequestOptions();
            var response = await this.AsynchronousClient.GetAsync<List<DemandeCongeCore>>($"/api/DemandesConge/utilisateur/{utilisateurId}", options, this.Configuration, cancellationToken);
            return response.Data;
        }
    }
}
