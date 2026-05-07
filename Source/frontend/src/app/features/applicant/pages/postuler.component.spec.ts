import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ApplicantPostulerComponent } from './postuler.component';
import { ApiService } from '@core/services/api.service';
import { RouterModule } from '@angular/router';

describe('ApplicantPostulerComponent Form Validation', () => {
  let component: ApplicantPostulerComponent;
  let fixture: ComponentFixture<ApplicantPostulerComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getOffreEmploiTemp', 'login', 'registerCandidate', 'postulerForm', 'setToken']);
    apiServiceSpy.getOffreEmploiTemp.and.returnValue({ id: 'OFFRE1', titre: 'Dev' });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        RouterModule.forRoot([]),
        ApplicantPostulerComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantPostulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate email format', () => {
    const email = component.applyForm.controls['email'];
    email.setValue('invalid');
    expect(email.valid).toBeFalsy();
    email.setValue('valid@test.com');
    expect(email.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const password = component.applyForm.controls['password'];
    password.setValue('123');
    expect(password.hasError('minlength')).toBeTruthy();
    password.setValue('123456');
    expect(password.hasError('minlength')).toBeFalsy();
  });

  it('should validate telephone pattern', () => {
    const tel = component.applyForm.controls['telephone'];
    tel.setValue('abc');
    expect(tel.hasError('pattern')).toBeTruthy();
    tel.setValue('+216 12345678');
    expect(tel.hasError('pattern')).toBeFalsy();
  });

  it('should disable submit button when form is invalid', () => {
    component.applyForm.controls['email'].setValue('');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.btn-submit');
    expect(btn.disabled).toBeTruthy();
  });
});
