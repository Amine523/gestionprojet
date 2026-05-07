import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsService } from '../service/diagrams.service';
import { ArchitectureLayer, WorkflowStep } from '../model/diagrams.model';

@Component({
  selector: 'app-diagrams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss']
})
export class DiagramsComponent implements OnInit {
  private diagramsService = new DiagramsService();
  
  architectureLayers: ArchitectureLayer[] = [];
  workflowSteps: WorkflowStep[] = [];

  ngOnInit() {
    this.architectureLayers = this.diagramsService.getArchitectureLayers();
    this.workflowSteps = this.diagramsService.getWorkflowSteps();
  }
}
