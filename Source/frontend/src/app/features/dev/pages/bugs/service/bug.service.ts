import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Bug } from '../model/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(private api: ApiService) {}

  getTaches(): Observable<any> {
    return this.api.getTaches();
  }

  getCurrentUser() {
    return this.api.getCurrentUser();
  }

  getCurrentSocieteId(): string {
    return this.api.getCurrentSocieteId();
  }
}
