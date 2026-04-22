import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="p-10">
      <div class="grid grid-cols-7 gap-2">
        @for (day of weekDays; track day) {
          <div class="text-center font-bold">{{ day }}</div>
        }
        @for (_ of emptyDays; track _) {
          <div class="h-20 bg-slate-100 rounded"></div>
        }
        @for (date of daysInMonth; track date) {
          <div class="h-20 border rounded p-2" [class.bg-indigo-500]="isToday(date)">
            {{ date }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { @apply block; }
    .animate-in { animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CalendarViewComponent implements OnInit {
  private api = inject(ApiService);
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthName = '';
  daysInMonth: number[] = [];
  emptyDays: number[] = [];
  events: any[] = [];

  ngOnInit() { this.generateCalendar(); this.loadEvents(); }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.emptyDays = Array(firstDay).fill(0);
    this.daysInMonth = Array.from({length: days}, (_, i) => i + 1);
    this.monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(this.currentYear, this.currentMonth));
  }

  loadEvents() {
    this.events = [
      { date: 15, title: 'Project Sync', color: '#3b82f6' },
      { date: 18, title: 'Marie OOO', color: '#f43f5e' },
      { date: 20, title: 'Alpha Zero Deadline', color: '#f59e0b' },
      { date: 25, title: 'Client Briefing', color: '#3b82f6' }
    ];
  }

  getEvents(day: number) { return this.events.filter(e => e.date === day); }
  isToday(day: number) {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
  }

  prevMonth() { this.changeMonth(-1); }
  nextMonth() { this.changeMonth(1); }
  private changeMonth(delta: number) {
    this.currentMonth += delta;
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    else if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    this.generateCalendar();
  }
}
