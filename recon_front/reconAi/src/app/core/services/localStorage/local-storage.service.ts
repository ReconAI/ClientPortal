import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly tokenKey = 'RAIAuth';
  constructor() {}

  /**
   * @param key  Key which is used to place to local storage.
   * @param value Value you wanna place by key to local storage.
   * @returns The status if the value is put by key field.
   */
  public putToLocalStorage(key: string, value: any): boolean {
    try {
      const jsonValue: string = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch {
      return false;
    }

    return true;
  }

  public setAuthToken(token): boolean {
    return this.putToLocalStorage(this.tokenKey, token);
  }

  public removeAuthToken(): boolean {
    try {
      localStorage.removeItem(this.tokenKey);
      return true;
    } catch {
      return false;
    }
  }

  public getAuthToken(): string | null {
    try {
      return JSON.parse(localStorage.getItem(this.tokenKey));
    } catch {
      return null;
    }
  }
}
