import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService<T> {
  private TTL = 20000; // 20 seconds

  public setItem(key: string, value: T): void {
    const item = { value, expiry: new Date().getTime() + this.TTL };

    localStorage.setItem(key, JSON.stringify(item));
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public getItem(key: string): T | null {
    const item = JSON.parse(localStorage.getItem(key));

    if (item) {
      if (new Date().getTime() < item.expiry) return item.value;

      this.removeItem(key);
    }

    return null;
  }
}
