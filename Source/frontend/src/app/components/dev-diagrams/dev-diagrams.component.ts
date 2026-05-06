import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-diagrams',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-4" style="max-width: 1200px; margin: 0 auto; height: 100vh; overflow-y: auto;">
      <div class="mb-5">
        <h1 class="fw-bold mb-0" style="font-size: 28px; background: linear-gradient(135deg, #2196f3, #1976d2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Diagrammes d'Architecture</h1>
        <p class="text-muted" style="font-size: 14px; margin: 4px 0 0;">Schémas applicatifs, flux de données et processus CI/CD</p>
      </div>

      <div class="mb-5">
        <h2 class="fw-bold mb-4" style="font-size: 20px; color: #1e293b;"><i class="bi bi-layers me-2" style="color: #2196f3;"></i>Architecture Globale du SaaS</h2>
        <div class="card border-0 shadow-sm" style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div class="d-flex flex-column align-items-center gap-4">
            
            <div class="w-100" style="max-width: 800px; padding: 24px; border-radius: 12px; background: white; border: 2px dashed #93c5fd; position: relative;">
              <div style="position: absolute; top: -12px; left: 24px; background: white; padding: 0 12px; font-size: 12px; font-weight: 800; color: #2563eb; border: 2px solid #93c5fd; border-radius: 12px;">Client Tier (Angular)</div>
              <div class="d-flex justify-content-center gap-4 flex-wrap">
                <div class="p-3 rounded-3 shadow-sm" style="background: white; font-weight: 600; color: #334155; text-align: center; min-width: 150px; cursor: pointer; transition: transform 0.2s;" title="Interface Administrateurs">Admin UI</div>
                <div class="p-3 rounded-3 shadow-sm" style="background: white; font-weight: 600; color: #334155; text-align: center; min-width: 150px; cursor: pointer; transition: transform 0.2s;" title="Interface Développeurs & Chef">Agile UI</div>
                <div class="p-3 rounded-3 shadow-sm" style="background: white; font-weight: 600; color: #334155; text-align: center; min-width: 150px; cursor: pointer; transition: transform 0.2s;" title="Interface Recrutement & Profils">RH UI</div>
              </div>
            </div>

            <div class="d-flex flex-column align-items-center" style="color: #94a3b8; font-size: 12px; font-weight: 500; font-family: monospace;">
              <i class="bi bi-arrow-down" style="font-size: 24px;"></i>
              <span>HTTP/JSON via interceptor</span>
              <i class="bi bi-arrow-down" style="font-size: 24px;"></i>
            </div>

            <div class="w-100" style="max-width: 800px; padding: 24px; border-radius: 12px; background: #f0fdf4; border: 2px dashed #86efac; position: relative;">
              <div style="position: absolute; top: -12px; left: 24px; background: white; padding: 0 12px; font-size: 12px; font-weight: 800; color: #16a34a; border: 2px solid #86efac; border-radius: 12px;">API Gateway & Logic (.NET Core REST)</div>
              <div class="d-flex justify-content-center gap-4 flex-wrap">
                <div class="p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: white; border: 1px solid #e2e8f0;">
                   <i class="bi bi-key"></i> Auth Service
                </div>
                <div class="p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: white; border: 1px solid #e2e8f0;">
                   <i class="bi bi-people"></i> User Service
                </div>
                <div class="p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: white; border: 1px solid #e2e8f0;">
                   <i class="bi bi-list-check"></i> Task Service
                </div>
                <div class="p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: white; border: 1px solid #e2e8f0;">
                   <i class="bi bi-graph-up"></i> Calculate Service
                </div>
              </div>
            </div>

            <div class="d-flex flex-column align-items-center" style="color: #94a3b8; font-size: 12px; font-weight: 500; font-family: monospace;">
              <i class="bi bi-arrow-down" style="font-size: 24px;"></i>
              <span>Entity Framework Core / Dapper ORM</span>
              <i class="bi bi-arrow-down" style="font-size: 24px;"></i>
            </div>

            <div class="w-100" style="max-width: 800px; padding: 24px; border-radius: 12px; background: #fef2f2; border: 2px dashed #fca5a5; position: relative;">
              <div style="position: absolute; top: -12px; left: 24px; background: white; padding: 0 12px; font-size: 12px; font-weight: 800; color: #dc2626; border: 2px solid #fca5a5; border-radius: 12px;">Data Layer</div>
              <div class="d-flex justify-content-center">
                <div class="p-4 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style="background: white; min-width: 300px; font-size: 18px;" title="Base SQL Server Relationnelle">
                   <i class="bi bi-database me-2"></i> SQL Server
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="mb-5">
        <h2 class="fw-bold mb-4" style="font-size: 20px; color: #1e293b;"><i class="bi bi-arrow-repeat me-2" style="color: #2196f3;"></i>Workflow Git & Intégration (Agile)</h2>
        <div class="card border-0 shadow-sm" style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            
            <div class="flex-grow-1 p-4 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style="min-width: 120px; background: white; border: 1px solid #e2e8f0; transition: transform 0.3s, border-color 0.3s; cursor: pointer;">
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #f1f5f9; color: #475569;"><i class="bi bi-bug"></i></div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">1. Backlog & Jira</div>
            </div>
            
            <i class="bi bi-arrow-right" style="color: #cbd5e1; font-size: 32px; flex-shrink: 0;"></i>
            
            <div class="flex-grow-1 p-4 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style="min-width: 120px; background: white; border: 1px solid #e2e8f0; transition: transform 0.3s, border-color 0.3s; cursor: pointer;">
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #f1f5f9; color: #475569;"><i class="bi bi-code"></i></div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">2. Feature Branch</div>
            </div>

            <i class="bi bi-arrow-right" style="color: #cbd5e1; font-size: 32px; flex-shrink: 0;"></i>

            <div class="flex-grow-1 p-4 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style="min-width: 120px; background: white; border: 2px solid #2196f3; box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2); transition: transform 0.3s, border-color 0.3s; cursor: pointer;">
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #2196f3; color: white;"><i class="bi bi-git-merge"></i></div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">3. Pull Request (PR)</div>
            </div>

            <i class="bi bi-arrow-right" style="color: #cbd5e1; font-size: 32px; flex-shrink: 0;"></i>

            <div class="flex-grow-1 p-4 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style="min-width: 120px; background: white; border: 1px solid #e2e8f0; transition: transform 0.3s, border-color 0.3s; cursor: pointer;">
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #f1f5f9; color: #475569;"><i class="bi bi-check-circle"></i></div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">4. QA & Tests</div>
            </div>

            <i class="bi bi-arrow-right" style="color: #cbd5e1; font-size: 32px; flex-shrink: 0;"></i>

            <div class="flex-grow-1 p-4 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center" style="min-width: 120px; background: white; border: 1px solid #e2e8f0; transition: transform 0.3s, border-color 0.3s; cursor: pointer;">
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #f1f5f9; color: #475569;"><i class="bi bi-rocket"></i></div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">5. Deploy (Prod)</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class DevDiagramsComponent {

}
