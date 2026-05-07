import { test, expect } from '@playwright/test';

test.describe('Platform Input Validation Hardening Tests', () => {
  
  test('Super Admin: Company Registration Form Validation', async ({ page }) => {
    await page.goto('/super-admin/societes');
    await page.click('button:has-text("Nouvelle Société")');
    
    const emailInput = page.locator('input[name="email"]');
    const telInput = page.locator('input[name="telephone"]');
    
    // Test Invalid Email
    await emailInput.fill('invalid-email');
    await expect(emailInput).toHaveJSProperty('validity.typeMismatch', true);
    
    // Test Invalid Phone (Pattern)
    await telInput.fill('abc');
    await expect(telInput).toHaveJSProperty('validity.patternMismatch', true);
    
    // Test Required Fields
    const nomInput = page.locator('input[name="nom"]');
    await nomInput.fill('');
    await expect(nomInput).toHaveJSProperty('validity.valueMissing', true);
  });

  test('Admin: Employee Form Validation (Reactive)', async ({ page }) => {
    await page.goto('/admin/employes');
    await page.click('button:has-text("Intégrer un Talent")');
    
    const nomInput = page.locator('input[formcontrolname="nom"]');
    const emailInput = page.locator('input[formcontrolname="email"]');
    const passwordInput = page.locator('input[formcontrolname="password"]');
    
    // Trigger validation
    await nomInput.focus();
    await emailInput.focus();
    await nomInput.focus(); // Blur email
    
    await expect(page.locator('.error-msg:has-text("Ce champ est obligatoire")')).toBeVisible();
    
    // Test email format
    await emailInput.fill('not-an-email');
    await expect(page.locator('.error-msg:has-text("Format d\'email invalide")')).toBeVisible();
    
    // Test password minlength
    await passwordInput.fill('short');
    await expect(page.locator('.error-msg:has-text("Minimum 8 caractères requis")')).toBeVisible();
  });

  test('Admin: Project Date Constraints (Reactive)', async ({ page }) => {
    await page.goto('/admin/projets');
    await page.click('button:has-text("Nouvelle Mission")');
    
    const startDateInput = page.locator('input[formcontrolname="dateDebut"]');
    const endDateInput = page.locator('input[formcontrolname="dateFin"]');
    
    // Set invalid range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    await startDateInput.fill(tomorrowStr);
    await endDateInput.fill(todayStr);
    
    // Check custom dateRange error message
    await expect(page.locator('text=La date de fin doit être après la date de début')).toBeVisible();
    
    // Check form submission disabled
    const saveBtn = page.locator('button:has-text("EXÉCUTER LANCEMENT")');
    await expect(saveBtn).toBeDisabled();
  });

  test('Admin: System Nexus (Parameters) Validation', async ({ page }) => {
    await page.goto('/admin/parametres');
    
    const emailInput = page.locator('input[formcontrolname="email"]');
    const telInput = page.locator('input[formcontrolname="telephone"]');
    
    await emailInput.fill('nexus-broken');
    await expect(page.locator('.error-msg:has-text("Format d\'email invalide")')).toBeVisible();
    
    await telInput.fill('123'); // Too short for pattern
    await expect(page.locator('.error-msg:has-text("Format invalide")')).toBeVisible();
    
    const saveBtn = page.locator('button:has-text("Commit Global Changes")');
    await expect(saveBtn).toBeDisabled();
  });

  test('RH: Leave Adjustment Validation (Reactive)', async ({ page }) => {
    await page.goto('/rh/conges');
    await page.click('button:has-text("Crédits Congés")');
    
    // Open adjustment for first employee
    await page.click('button[title="Ajuster"] >> n=0');
    
    const adjustmentInput = page.locator('input[formcontrolname="soldeAjustement"]');
    
    // Test range [-50, 50]
    await adjustmentInput.fill('100');
    await expect(page.locator('.error-msg:has-text("Valeur maximum : 50")')).toBeVisible();
    
    await adjustmentInput.fill('-60');
    await expect(page.locator('.error-msg:has-text("Valeur minimum : -50")')).toBeVisible();
    
    const saveBtn = page.locator('button:has-text("Enregistrer")');
    await expect(saveBtn).toBeDisabled();
  });

  test('Super Admin: SaaS Society Deployment Validation', async ({ page }) => {
    await page.goto('/super-admin/societes');
    await page.click('button:has-text("Nouvelle Société")');
    
    const nomInput = page.locator('input[formcontrolname="nom"]');
    const emailInput = page.locator('input[formcontrolname="email"]');
    const telInput = page.locator('input[formcontrolname="telephoneContact"]');
    
    await nomInput.fill('A'); // Too short
    await expect(page.locator('.error-msg:has-text("Minimum 2 caractères requis")')).toBeVisible();
    
    await emailInput.fill('invalid-saas');
    await expect(page.locator('.error-msg:has-text("Format d\'email invalide")')).toBeVisible();
    
    await telInput.fill('abc');
    await expect(page.locator('.error-msg:has-text("Format invalide")')).toBeVisible();
    
    const deployBtn = page.locator('button:has-text("INITIER DÉPLOIEMENT")');
    await expect(deployBtn).toBeDisabled();
  });

  test('Chef: Project Management Validation', async ({ page }) => {
    await page.goto('/chef/projets');
    await page.click('button:has-text("Nouveau Projet")');
    
    const nomInput = page.locator('input[formcontrolname="nom"]');
    const progInput = page.locator('input[formcontrolname="progression"]');
    
    await nomInput.fill('Ph'); // Too short (min 3)
    await expect(page.locator('.error-msg:has-text("Minimum 3 caractères requis")')).toBeVisible();
    
    await progInput.fill('150');
    await expect(page.locator('.error-msg:has-text("Valeur maximum : 100")')).toBeVisible();
    
    const saveBtn = page.locator('button:has-text("Confirmer")');
    await expect(saveBtn).toBeDisabled();
  });

});
