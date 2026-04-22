import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `

    <div class="space-y-12 animate-in pb-20">
      @if (showQuiz && selectedCandidature) {
        <div class="max-w-3xl mx-auto space-y-8 animate-in">
          <header class="bg-slate-900 rounded-[50px] p-12 overflow-hidden shadow-2xl border border-white/5 relative">
            <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl -mr-20 -mt-20"></div>
            <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div class="text-center md:text-left">
                 <div class="flex items-center gap-4 mb-4 justify-center md:justify-start">
                   <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                     <i class="bi bi-cpu text-2xl"></i>
                   </div>
                   <span class="text-[10px] font-black uppercase tracking-[4px] text-indigo-400 italic">Neural Validation</span>
                 </div>
                 <h2 class="text-3xl font-black text-white tracking-tighter uppercase italic">{{selectedCandidature.quiz}}</h2>
                 <p class="text-slate-400 font-bold text-sm mt-2">Mission: {{selectedCandidature.offreTitre}}</p>
               </div>
               <div class="flex flex-col items-center gap-2">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buffer Sync</div>
                 <div class="text-4xl font-black text-indigo-500 italic tracking-tighter">{{currentQuestion + 1}} / {{quizQuestions.length}}</div>
               </div>
            </div>
            <div class="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" [style.width.%]="progressPercent"></div>
            </div>
          </header>

          <div class="bg-white dark:bg-slate-900 rounded-[50px] p-12 shadow-3xl border border-slate-100 dark:border-slate-800 space-y-10">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white leading-tight italic">{{quizQuestions[currentQuestion].q}}</h3>
            
            <div class="grid grid-cols-1 gap-6">
              @for (opt of quizQuestions[currentQuestion].options; track opt; let i = $index) {
                <button (click)="answerQuestion(i)" 
                        class="p-8 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-600 hover:text-white border-2 border-transparent hover:border-indigo-400/30 rounded-3xl text-left font-black text-sm uppercase tracking-widest transition-all group flex items-center gap-6">
                   <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 group-hover:bg-indigo-500/50 flex items-center justify-center text-indigo-600 group-hover:text-white font-black">
                     {{getLetter(i)}}
                   </div>
                   {{opt}}
                </button>
              }
            </div>
          </div>
        </div>
      } @else if (showResult) {
        <div class="max-w-2xl mx-auto text-center space-y-12 animate-in py-20">
          <div class="relative inline-block">
             <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-20"></div>
             <div class="w-32 h-32 rounded-[40px] bg-white dark:bg-slate-900 shadow-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto relative z-10">
                <i class="bi" [class.bi-check2-all]="score >= passingScore" [class.bi-slash-circle]="score < passingScore" 
                   [class.text-emerald-500]="score >= passingScore" [class.text-amber-500]="score < passingScore" class="text-6xl"></i>
             </div>
          </div>

          <div class="space-y-4">
            <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Synthesis Complete</h1>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Validation score: <span class="text-indigo-500 font-black">{{score}}/{{quizQuestions.length}} ({{scorePercent}}%)</span></p>
          </div>

          <p class="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed italic">
            {{ score >= passingScore ? 'Exceptional alignment detected. Your operational data has been transmitted to the Human Capital department.' : 'Mission evaluation logged. Your skill matrix has been archived for future opportunities.' }}
          </p>

          <button (click)="closeTest()" class="h-16 px-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all">
            RETURN TO COMMAND CENTER
          </button>
        </div>
      } @else {
        <!-- Profile Header -->
        <header class="relative bg-slate-900 rounded-[50px] p-12 overflow-hidden shadow-2xl border border-white/5">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-[120px] -mr-48 -mt-48"></div>
          
          <div class="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div class="flex flex-col md:flex-row items-center gap-8">
               <div class="w-28 h-28 rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                 <i class="bi bi-person-bounding-box text-5xl text-white"></i>
               </div>
               <div class="text-center md:text-left space-y-2">
                 <span class="text-[10px] font-black uppercase tracking-[6px] text-indigo-400 italic">Candidate Portal</span>
                 <h1 class="text-5xl font-black text-white tracking-tighter leading-none uppercase italic">{{userName}}</h1>
                 <p class="text-slate-400 font-bold text-sm tracking-widest uppercase">{{userEmail}}</p>
               </div>
            </div>

            <div class="flex gap-4">
               <div class="px-8 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center">
                 <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Missions Engaged</div>
                 <div class="text-2xl font-black text-white italic tracking-tighter">{{myCandidatures.length}}</div>
               </div>
            </div>
          </div>
        </header>

        <section class="space-y-8">
          <div class="flex items-center justify-between px-6">
             <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase underline decoration-indigo-500 decoration-4">Mission Queue</h3>
             <button routerLink="/applicant/offres" class="h-12 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">New Deployment</button>
          </div>
          
          @if (myCandidatures.length === 0) {
            <div class="bg-white dark:bg-slate-900 rounded-[50px] p-24 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-8">
               <i class="bi bi-rocket text-[80px] text-slate-200"></i>
               <div class="space-y-2">
                 <p class="text-xl font-black uppercase tracking-widest text-slate-400 italic">No Active Deployments</p>
                 <p class="text-sm font-bold text-slate-500">Initiate your career trajectory by exploring available missions.</p>
               </div>
               <button routerLink="/applicant/offres" class="h-16 px-12 bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">SCAN FOR OPPORTUNITIES</button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              @for (cand of myCandidatures; track cand.id) {
                <div class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div class="flex justify-between items-start mb-8">
                    <div>
                      <h4 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-tight">{{ cand.offreTitre || cand.poste }}</h4>
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                        <i class="bi bi-building"></i>
                        {{ cand.societe || 'Core Entity' }}
                      </p>
                    </div>
                    <span [ngClass]="getStatusClass(cand.statut)" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px]">
                      {{ formatStatut(cand.statut) }}
                    </span>
                  </div>

                  <div class="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div class="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                       <i class="bi bi-calendar-check text-indigo-500"></i>
                       Engaged: {{ cand.dateCandidature | date:'dd MMM, yyyy' }}
                    </div>

                    @if (cand.statut === 'Test_autorise' && cand.quiz) {
                      <div class="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/20 space-y-4">
                        <p class="text-[11px] font-bold text-indigo-600 italic leading-relaxed">Neural Assessment Required: Your candidacy has been green-lit for technical validation.</p>
                        <button (click)="startTest(cand)" class="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                          <i class="bi bi-play-circle-fill text-lg"></i>
                          INITIATE VALIDATION
                        </button>
                      </div>
                    } @else if (cand.statut === 'Test_termine') {
                      <div class="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <i class="bi bi-clipboard2-check text-xl"></i>
                        </div>
                        <div>
                          <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Assessment Finalized</p>
                          <p class="text-sm font-black text-slate-900 dark:text-white italic">{{cand.quizScore}} / {{cand.quizTotal}} Yield</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>
  `
})
export class ApplicantProfilComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  userName = '';
  userEmail = '';
  myCandidatures: any[] = [];
  
  showQuiz = false;
  showResult = false;
  selectedCandidature: any = null;
  quizQuestions: any[] = [];
  currentQuestion = 0;
  score = 0;
  passingScore = 10;

  get progressPercent() { return (this.currentQuestion / this.quizQuestions.length) * 100; }
  get scorePercent() { return Math.round((this.score / this.quizQuestions.length) * 100); }

  getLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = user.nom;
      this.userEmail = user.email;
      this.loadCandidatures(user.id);
    } else {
      this.router.navigate(['/applicant/postuler']);
    }
  }

  loadCandidatures(userId: string) {
    this.api.getCandidaturesByCandidat(userId).subscribe((data: any) => {
      this.myCandidatures = data;
    });
  }

  getStatusClass(statut: string) {
    switch (statut) {
      case 'En_attente': return 'bg-waiting';
      case 'Test_autorise': return 'bg-test';
      case 'Test_termine': return 'bg-success';
      case 'Accepte': return 'bg-success';
      case 'Refuse': return 'bg-default';
      default: return 'bg-default';
    }
  }

  formatStatut(statut: string) {
    return statut?.replace('_', ' ');
  }

  startTest(cand: any) {
    this.selectedCandidature = cand;
    this.quizQuestions = this.getQuizQuestions(cand.quiz);
    this.currentQuestion = 0;
    this.score = 0;
    this.showQuiz = true;
  }

  answerQuestion(index: number) {
    if (index === this.quizQuestions[this.currentQuestion].correct) {
      this.score++;
    }

    if (this.currentQuestion < this.quizQuestions.length - 1) {
      this.currentQuestion++;
    } else {
      this.finishTest();
    }
  }

  finishTest() {
    this.showQuiz = false;
    this.showResult = true;
    
    // Update status in API
    this.api.updateCandidatureStatus(this.selectedCandidature.id, 'Test_termine', this.score, this.quizQuestions.length)
      .subscribe(() => {
        this.loadCandidatures(this.api.getCurrentUser().id);
      });
  }

  closeTest() {
    this.showResult = false;
    this.selectedCandidature = null;
  }

  getQuizQuestions(quizTitre: string): any[] {
    // Logic for quiz questions... 
    // (Simplified for brevity, usually should be in a service)
    return [
      { q: 'Question 1', options: ['A', 'B', 'C', 'D'], correct: 0 },
      { q: 'Question 2', options: ['A', 'B', 'C', 'D'], correct: 1 },
      // ... more questions
    ];
  }
}
