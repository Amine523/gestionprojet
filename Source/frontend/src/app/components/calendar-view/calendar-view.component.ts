import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card border-0 shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">Calendrier d'Équipe</h2>
        <div class="btn-group">
          <button class="btn btn-outline-primary" (click)="prevMonth()"><i class="bi bi-chevron-left"></i></button>
          <button class="btn btn-light fw-bold px-4">{{ monthName }} {{ currentYear }}</button>
          <button class="btn btn-outline-primary" (click)="nextMonth()"><i class="bi bi-chevron-right"></i></button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
        <div class="calendar-day empty" *ngFor="let _ of emptyDays"></div>
        <div class="calendar-day" *ngFor="let date of daysInMonth" [class.today]="isToday(date)">
          <div class="day-number">{{ date }}</div>
          <div class="events-container">
            <div class="event-item" *ngFor="let event of getEvents(date)" [style.background-color]="event.color">
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #e2e8f0;
      border: 1px solid #e2e8f0;
    }
    .day-header {
      background: #f8fafc;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      font-size: 13px;
    }
    .calendar-day {
      background: white;
      min-height: 120px;
      padding: 10px;
      position: relative;
    }
    .calendar-day.today {
      background: #f0f9ff;
    }
    .day-number {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .events-container {
      display: flex;
      flex-column: column;
      gap: 4px;
    }
    .event-item {
      font-size: 11px;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .empty {
      background: #f1f5f9;
    }
  `]
})
export class CalendarViewComponent implements OnInit {
  private api = inject(ApiService);
  
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  
  weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  monthName = '';
  
  daysInMonth: number[] = [];
  emptyDays: number[] = [];
  
  events: any[] = [];

  ngOnInit() {
    this.generateCalendar();
    this.loadEvents();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    this.emptyDays = Array(firstDay).fill(0);
    this.daysInMonth = Array.from({length: days}, (_, i) => i + 1);
    
    const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
    this.monthName = formatter.format(new Date(this.currentYear, this.currentMonth));
  }

  loadEvents() {
    // Mock events for now, could fetch from API
    this.events = [
      { date: 15, title: 'Réunion Projet', color: '#3b82f6' },
      { date: 18, title: 'Congé - Marie', color: '#ef4444' },
      { date: 20, title: 'Deadline Tâche X', color: '#f59e0b' }
    ];
  }

  getEvents(day: number) {
    return this.events.filter(e => e.date === day);
  }

  isToday(day: number) {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }
}
