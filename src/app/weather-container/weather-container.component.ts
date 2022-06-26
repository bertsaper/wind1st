import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';

import { environment } from 'src/environments/environment'; // src\environments

import { Router } from '@angular/router';

import { HttpClient } from "@angular/common/http";

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss'],
})


export class ExploreContainerComponent implements OnInit {

  // @Input() name: string;

  weatherNow: Object

  weatherNowString: string

  weatherNowStringOutParsed: Object

  @ViewChild('svgWindPointer') container: ElementRef;

  constructor(
    private _http: HttpClient,
    public router: Router, 
    private renderer: Renderer2,
    ) { }

  async ngOnInit(): Promise<void> {

    try {

      const openWeatherAddress = environment.open_weather_address

      const latString = "lat="
      let lat = environment.lat_default

      const lonString = "&lon="
      let lon = environment.lon_default

      const openWeatherKey = environment.open_weather_key

      let resString = openWeatherAddress + latString + lat + lonString + lon + openWeatherKey

      this._http.get(resString).subscribe((res) => {
        this.weatherNow = res
        this.weatherNowString = JSON.stringify(this.weatherNow)
        localStorage.setItem(`currentWeather`, this.weatherNowString)
        this. chartMethod()
      })

    }

    catch (error) { }

  }

  chartMethod() {

    const weatherNowStringOut = localStorage.getItem(`currentWeather`)


    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)


    console.log(`current weather`, weatherNowStringOutParsed.wind.deg)

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);

    this.renderer.setAttribute(svg, `height`, `36`);
    this.renderer.setAttribute(svg, `width`, `36`);   
    this.renderer.setAttribute(svg, `id`, `windDirection`);

    const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
    this.renderer.setAttribute(path, `d`, `M 18,3 18,72 36,36 3,36 18,72`);
    this.renderer.setAttribute(path, `x`, `36`);
    this.renderer.setAttribute(path, `y`, `36`);
    this.renderer.setAttribute(path, `id`, `windDirectionPath`);   
    this.renderer.setAttribute(path, `transform`, `rotate(` + weatherNowStringOutParsed.wind.deg + `,18.5,18.5)`);
    //  this.renderer.setAttribute(path, `transform`, `rotate(270,18.5,18.5)`);

    this.renderer.appendChild(svg, path);
    this.renderer.appendChild(this.container.nativeElement, svg);


  }

}

