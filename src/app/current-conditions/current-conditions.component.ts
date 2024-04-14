import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';

import { WeatherService } from '../sevices/weather.service';
import { LocationService } from '../sevices/location.service';
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode: string){
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(zipcode: string){
    this.locationService.removeLocation(zipcode);
  }
}
