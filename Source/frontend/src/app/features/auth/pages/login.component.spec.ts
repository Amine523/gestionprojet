import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { ApiService } from '@core/services/api.service';
import { RouterModule } from '@angular/router';

describe('LoginComponent Input Validation', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['login', 'setToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        LoginComponent // Standalone component
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email format correctly', () => {
    const email = component.loginForm.controls['email'];
    
    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('test@example.com');
    expect(email.hasError('email')).toBeFalsy();
  });

  it('should require password', () => {
    const password = component.loginForm.controls['password'];
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('123456');
    expect(password.hasError('required')).toBeFalsy();
  });

  it('should call login service when form is valid', () => {
    apiServiceSpy.login.and.returnValue(of({ token: 'mock-token', utilisateur: { typeUtilisateurId: 'T001' } }));
    
    component.loginForm.controls['email'].setValue('admin@test.com');
    component.loginForm.controls['password'].setValue('password');
    
    component.onSubmit();
    
    expect(apiServiceSpy.login).toHaveBeenCalledWith('admin@test.com', 'password');
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should show error message on login failure', () => {
    apiServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    
    component.loginForm.controls['email'].setValue('wrong@test.com');
    component.loginForm.controls['password'].setValue('wrong');
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid credentials');
  });
});
