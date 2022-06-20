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

  @Input() name: string;

  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;


  doughnutChart: any

  weatherNow: Object

  weatherNowString: string


  weatherNowStringOutParsed: Object

  @ViewChild('svgContainer') container: ElementRef;

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

    let windDriectionNow  = weatherNowStringOutParsed.wind.deg 


    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.renderer.setAttribute(path, 'd', 'M0 50 L100 0 L100 100 Z');
    this.renderer.setAttribute(path, 'fill', 'pink');
    this.renderer.setAttribute(path, 'transform', 'rotate('+ windDriectionNow +',50,50)');
    this.renderer.appendChild(svg, path);
    this.renderer.appendChild(this.container.nativeElement, svg);




  }

}

