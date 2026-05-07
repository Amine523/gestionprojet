import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { ApiResource } from '../model/api.model';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent {
  private apiService = new ApiService();
  expandedEndpoints: Set<string> = new Set();
  apiResources: ApiResource[] = [];

  ngOnInit() {
    this.apiResources = this.apiService.getApiResources();
  }

  toggleEndpoint(resourceName: string, index: number) {
    const key = `${resourceName}-${index}`;
    if (this.expandedEndpoints.has(key)) {
      this.expandedEndpoints.delete(key);
    } else {
      this.expandedEndpoints.add(key);
    }
  }

  isExpanded(resourceName: string, index: number): boolean {
    return this.expandedEndpoints.has(`${resourceName}-${index}`);
  }

  exportOpenApi(): void {
    this.apiService.downloadOpenApi();
  }
}
