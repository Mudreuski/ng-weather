import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CurrentConditions } from '../current-conditions/current-conditions.type';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { Forecast } from '../forecasts-list/forecast.type';
import { LocationAction, LocationService } from './location.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private locationService: LocationService) {
    this.locationService.locationAction$.subscribe(location => {
        if (location.action === LocationAction.Add) {
            this.addCurrentConditions(location.zipcode);
        } else {
            this.removeCurrentConditions(location.zipcode);
        }
    });
  }

  addCurrentConditions(zipcode: string): void {
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
      .subscribe(data => this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]));
  }

  removeCurrentConditions(zipcode: string): void {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }

      return conditions;
    })
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
