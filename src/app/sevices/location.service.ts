import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export const LOCATIONS : string = "locations";

export interface Location {
  zipcode: string;
  action: LocationAction;
}

export enum LocationAction {
    Add = 'add',
    Remove = 'remove'
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations : Array<string> = [];

  private locationAction$$ = new ReplaySubject<Location>();
  public locationAction$ = this.locationAction$$.asObservable();

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);

    for (let loc of this.locations) this.locationAction$$.next({ zipcode: loc, action: LocationAction.Add });
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.locationAction$$.next({ zipcode, action: LocationAction.Add });
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);

    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locationAction$$.next({ zipcode, action: LocationAction.Remove });
    }
  }
}
