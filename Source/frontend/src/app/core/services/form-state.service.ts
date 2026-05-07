import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private readonly PREFIX = 'form_draft_';

  /**
   * Saves the current state of a form to localStorage.
   * @param key Unique identifier for the form (e.g., 'qa_bugs_form')
   * @param data The form data object
   */
  saveDraft(key: string, data: any): void {
    if (!data) return;
    localStorage.setItem(this.PREFIX + key, JSON.stringify({
      timestamp: Date.now(),
      data: data
    }));
  }

  /**
   * Retrieves a saved draft from localStorage.
   * @param key Unique identifier for the form
   * @returns The saved data or null if not found
   */
  getDraft(key: string): any {
    const saved = localStorage.getItem(this.PREFIX + key);
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      // Optional: Expire drafts after 24 hours
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp > oneDay) {
        this.clearDraft(key);
        return null;
      }
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Removes a saved draft from localStorage.
   * @param key Unique identifier for the form
   */
  clearDraft(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  /**
   * Checks if a draft exists and is not empty.
   */
  hasDraft(key: string): boolean {
    const data = this.getDraft(key);
    return !!data && Object.values(data).some(v => !!v);
  }
}
