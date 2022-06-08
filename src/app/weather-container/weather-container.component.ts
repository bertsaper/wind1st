import { Component, OnInit, Input } from '@angular/core';

import { environment } from 'src/environments/environment'; // src\environments

import { Router } from '@angular/router';

import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  weatherNow: Object;

  constructor(private _http: HttpClient,
    public router: Router,)  { }

  async ngOnInit(): Promise<void> {

    const openWeatherAddress = environment.open_weather_address

    const latString = "lat="
    let lat = environment.lat_default

    const lonString = "&lon="
    let lon = environment.lon_default

    const openWeatherKey = environment.open_weather_key
  
    let resString = openWeatherAddress + latString + lat + lonString + lon + openWeatherKey

    this._http.get(resString).subscribe((res) => {
      this.weatherNow = res
      console.log(res)
    })

  }

}
