import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bootstrap-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex" id="wrapper">
      <!-- Sidebar -->
      <div class="bg-white border-end" id="sidebar-wrapper">
        <div class="sidebar-heading border-bottom py-3 px-4">
          <h4 class="m-0 fw-bold text-primary">
            <i class="bi bi-grid-fill me-2"></i>NADHEMNI
          </h4>
        </div>
        <div class="list-group list-group-flush">
          <a routerLink="/dashboard" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </a>
          <a routerLink="/projects" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-folder me-2"></i> Projets
          </a>
          <a routerLink="/tasks" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-check2-square me-2"></i> Tâches
          </a>
          <a routerLink="/team" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-people me-2"></i> Équipe
          </a>
          <a routerLink="/reports" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-file-earmark-bar-graph me-2"></i> Rapports
          </a>
          <a routerLink="/settings" class="list-group-item list-group-item-action border-0 py-3">
            <i class="bi bi-gear me-2"></i> Paramètres
          </a>
        </div>
      </div>

      <!-- Page Content -->
      <div id="page-content-wrapper" class="w-100">
        <!-- Top Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
          <div class="container-fluid">
            <button class="btn btn-primary" id="sidebarToggle">
              <i class="bi bi-list"></i>
            </button>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto align-items-center">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="javascript:void(0)" id="notificationDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-bell fs-5"></i>
                    <span class="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger">
                      3
                    </span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="javascript:void(0)">Notification 1</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0)">Notification 2</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0)">Notification 3</a></li>
                  </ul>
                </li>
                <li class="nav-item dropdown ms-3">
                  <a class="nav-link dropdown-toggle d-flex align-items-center" href="javascript:void(0)" id="userDropdown" role="button" data-bs-toggle="dropdown">
                    <img src="https://via.placeholder.com/40" class="rounded-circle me-2" alt="User">
                    <span class="fw-semibold">{{userName}}</span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="javascript:void(0)"><i class="bi bi-person me-2"></i> Profil</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0)"><i class="bi bi-gear me-2"></i> Paramètres</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0)"><i class="bi bi-box-arrow-right me-2"></i> Déconnexion</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <div class="container-fluid p-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #wrapper {
      display: flex;
      min-height: 100vh;
    }

    #sidebar-wrapper {
      min-width: 250px;
      max-width: 250px;
      width: 250px;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      transition: all 0.3s ease;
    }

    #sidebar-wrapper .sidebar-heading {
      padding: 1.5rem 1rem;
      font-size: 1.2rem;
    }

    #sidebar-wrapper .list-group-item {
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s ease;
    }

    #sidebar-wrapper .list-group-item:hover,
    #sidebar-wrapper .list-group-item.active {
      background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
      color: #0284c7;
      border-left: 3px solid #0284c7;
    }

    #sidebar-wrapper .list-group-item i {
      font-size: 1.1rem;
    }

    #page-content-wrapper {
      margin-left: 250px;
      transition: all 0.3s ease;
    }

    #page-content-wrapper.toggled {
      margin-left: 0;
    }

    @media (max-width: 768px) {
      #sidebar-wrapper {
        margin-left: -250px;
      }

      #page-content-wrapper {
        margin-left: 0;
      }

      #sidebar-wrapper.toggled {
        margin-left: 0;
      }
    }

    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .dropdown-toggle::after {
      display: none;
    }
  `]
})
export class BootstrapLayoutComponent {
  @Input() userName = 'Utilisateur';
}
