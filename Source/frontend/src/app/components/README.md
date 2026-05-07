# Composants Angular - Structure Propre

Cette documentation décrit la structure organisationnelle des composants Angular dans ce projet.

## Structure des Dossiers

```
components/
├── projets/           # Composants liés aux projets
│   ├── admin-projets.component.ts
│   ├── admin-projets.component.html
│   ├── admin-projets.component.scss
│   ├── projets-list.component.ts
│   ├── projets-list.component.html
│   └── projets-list.component.scss
├── service/           # Services partagés
│   └── projets.service.ts
├── model/             # Modèles et interfaces
│   └── projets.model.ts
├── index.ts          # Exportations centralisées
└── README.md         # Documentation
```

## Convention de Nommage

### Composants
Chaque composant doit avoir 3 fichiers séparés :

1. **`.ts`** - Logique du composant
2. **`.html`** - Template du composant  
3. **`.scss`** - Styles du composant

Le nom du fichier suit le format : `nom-composant.component.extension`

### Services
- Nom : `nom-ressource.service.ts`
- Emplacement : `service/`
- Exemple : `projets.service.ts`

### Modèles
- Nom : `nom-ressource.model.ts`
- Emplacement : `model/`
- Exemple : `projets.model.ts`

## Importations

### Dans les composants
```typescript
// Importer les services et modèles
import { ProjetsService } from '../service/projets.service';
import { Projet, ProjetFormData } from '../model/projets.model';

// Le template et les styles sont automatiquement liés
@Component({
  selector: 'app-admin-projets',
  templateUrl: './admin-projets.component.html',
  styleUrls: ['./admin-projets.component.scss']
})
```

### Importations centralisées
Utiliser le fichier `index.ts` pour exporter tous les composants, services et modèles :

```typescript
// Dans index.ts
export * from './projets/admin-projets.component';
export * from './service/projets.service';
export * from './model/projets.model';

// Utilisation dans d'autres modules
import { AdminProjetsComponent, ProjetsService } from '@app/components';
```

## Bonnes Pratiques

### 1. Séparation des Responsabilités
- **Modèle (.ts)** : Interfaces, types, structures de données
- **Service (.ts)** : Logique métier, appels API, gestion d'état
- **Composant (.ts)** : Logique de présentation, gestion des événements
- **Template (.html)** : Structure HTML, bindings
- **Styles (.scss)** : Styles spécifiques au composant

### 2. Signaux Angular
Utiliser les signaux pour la gestion réactive de l'état :

```typescript
// Signaux réactifs
searchQuery = signal('');
filterStatut = signal('');

// Propriétés calculées
filteredProjets = computed(() => {
  // Logique de filtrage
});
```

### 3. Services Réactifs
Les services doivent utiliser des signaux pour l'état partagé :

```typescript
@Injectable({ providedIn: 'root' })
export class ProjetsService {
  private _projets = signal<Projet[]>([]);
  
  projets$ = () => this._projets.asReadonly();
}
```

### 4. Validation des Formulaires
Utiliser Reactive Forms avec validation :

```typescript
projetForm = this.fb.group({
  nom: ['', Validators.required],
  description: ['', Validators.required],
  // ...
});
```

### 5. Gestion des Erreurs
Toujours inclure la gestion des erreurs dans les observables :

```typescript
this.http.get<Projet[]>(this.apiUrl).pipe(
  catchError(error => {
    console.error('Error loading projets:', error);
    return of([]);
  })
);
```

## Exemple d'Utilisation

### Créer un nouveau composant
1. Créer les 3 fichiers dans le dossier approprié
2. Implémenter la logique dans le fichier `.ts`
3. Créer le template HTML
4. Ajouter les styles SCSS
5. Exporter dans `index.ts`

### Utiliser un composant
```typescript
import { AdminProjetsComponent } from '@app/components';

@Component({
  imports: [AdminProjetsComponent],
  // ...
})
export class ParentComponent {
  // Utiliser <app-admin-projets></app-admin-projets> dans le template
}
```

## Avantages de Cette Structure

1. **Maintenabilité** : Chaque fichier a une responsabilité unique
2. **Réutilisabilité** : Les services et modèles peuvent être partagés
3. **Testabilité** : Séparation claire entre logique et présentation
4. **Scalabilité** : Structure évolutive pour de nouveaux composants
5. **Clarté** : Convention de nommage cohérente
