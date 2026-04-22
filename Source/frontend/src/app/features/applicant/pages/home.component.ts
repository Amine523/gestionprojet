import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-applicant-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <div class="applicant-home">
      <!-- Hero Section -->
      <header class="hero-section">
        <div class="hero-bg hero-bg-1"></div>
        <div class="hero-bg hero-bg-2"></div>
        
        <div class="hero-content">
          <div class="hero-badge">Career Portal v2.0</div>
          
          <h1 class="hero-title">
            ENGINEERING <span class="gradient-text">FUTURE</span>
          </h1>
          
          <p class="hero-subtitle">
            Join a world-class team of innovators. We're building the next generation of enterprise solutions and we want you to be part of the journey.
          </p>
          
          <div class="hero-actions">
            <button routerLink="/applicant/offres" class="btn btn-primary btn-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
              EXPLORE OPPORTUNITIES
            </button>
            <button routerLink="/applicant/profil" class="btn btn-outline btn-large">
              COMPLETE PROFILE
            </button>
          </div>
        </div>
      </header>

      <!-- Value Propositions Grid -->
      <div class="features-grid">
        <div class="feature-card feature-indigo">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h3 class="feature-title">Prime Roles</h3>
          <p class="feature-desc">
            Access to high-impact positions across diverse technological domains and industry sectors.
          </p>
        </div>

        <div class="feature-card feature-blue">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
          </div>
          <h3 class="feature-title">Growth Loop</h3>
          <p class="feature-desc">
            Continuous professional development with clear promotion paths and mentorship programs.
          </p>
        </div>

        <div class="feature-card feature-cyan">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 class="feature-title">Elite Culture</h3>
          <p class="feature-desc">
            Work within a dynamic, innovative environment where collaboration and quality are paramount.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applicant-home {
      padding: var(--space-xl) var(--space-lg);
    }

    .hero-section {
      background: var(--color-slate-950);
      border-radius: var(--radius-3xl);
      padding: var(--space-4xl) var(--space-lg);
      overflow: hidden;
      box-shadow: var(--shadow-3xl);
      text-align: center;
      position: relative;
      margin-bottom: var(--space-3xl);
    }

    .hero-bg {
      position: absolute;
      border-radius: 50%;
      filter: blur(150px);
      animation: pulse 4s ease-in-out infinite;
    }

    .hero-bg-1 {
      top: 0;
      right: 0;
      width: 800px;
      height: 800px;
      background: rgba(99, 102, 241, 0.2);
      margin-right: -240px;
      margin-top: -240px;
    }

    .hero-bg-2 {
      bottom: 0;
      left: 0;
      width: 600px;
      height: 600px;
      background: rgba(37, 99, 235, 0.2);
      margin-left: -160px;
      margin-bottom: -160px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }

    .hero-content {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 4px;
      backdrop-filter: blur(12px);
      margin-bottom: var(--space-2xl);
    }

    .hero-title {
      font-size: 48px;
      font-weight: var(--font-weight-black);
      color: white;
      margin: 0 0 var(--space-2xl);
      font-style: italic;
      line-height: 1;
    }

    .gradient-text {
      background: linear-gradient(to right, #818cf8, #2563eb);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      color: var(--color-slate-400);
      font-size: 20px;
      font-weight: var(--font-weight-medium);
      margin: 0 0 var(--space-3xl);
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    @media (min-width: 768px) {
      .hero-actions {
        flex-direction: row;
        justify-content: center;
      }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      padding: var(--space-lg) var(--space-2xl);
      border-radius: var(--radius-xl);
      font-weight: var(--font-weight-black);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
    }

    .btn-large {
      padding: var(--space-xl) var(--space-3xl);
    }

    .btn-primary {
      background: white;
      color: var(--color-slate-950);
      box-shadow: var(--shadow-2xl);
    }

    .btn-primary:hover {
      transform: scale(1.05);
    }

    .btn-outline {
      background: var(--color-slate-900);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .btn-outline:hover {
      background: var(--color-slate-800);
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    @media (min-width: 768px) {
      .features-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .feature-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--space-3xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-xl);
      transition: all var(--transition-base);
    }

    .feature-card:hover {
      box-shadow: var(--shadow-2xl);
    }

    .feature-card.feature-indigo:hover {
      border-color: rgba(99, 102, 241, 0.5);
    }

    .feature-card.feature-blue:hover {
      border-color: rgba(59, 130, 246, 0.5);
    }

    .feature-card.feature-cyan:hover {
      border-color: rgba(6, 182, 212, 0.5);
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2xl);
      transition: transform var(--transition-base);
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1);
    }

    .feature-indigo .feature-icon {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }

    .feature-blue .feature-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .feature-cyan .feature-icon {
      background: rgba(6, 182, 212, 0.1);
      color: #06b6d4;
    }

    .feature-title {
      font-size: 24px;
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      text-transform: uppercase;
      font-style: italic;
      margin: 0 0 var(--space-lg);
      letter-spacing: -0.5px;
    }

    .feature-desc {
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
      line-height: 1.6;
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .feature-card {
      background: var(--color-slate-900);
      border-color: var(--color-slate-800);
    }

    :host-context(.dark) .feature-title {
      color: white;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: var(--space-3xl) var(--space-md);
      }

      .hero-title {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }
    }
  `]
})
export class ApplicantHomeComponent {}
