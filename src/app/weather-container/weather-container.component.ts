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

      const returnImperial = "&units=imperial"

      let resString = openWeatherAddress + latString + lat + lonString + lon + returnImperial + openWeatherKey

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

    let WindVelocity = `rgba(0, 255, 0, 0.1)`

    const CardinalN = `N`

    const weatherNowStringOut = localStorage.getItem(`currentWeather`)

    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    console.log(`current wind`, weatherNowStringOutParsed.wind.deg)
    console.log(`current temp`, weatherNowStringOutParsed.main.temp)

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)  
    this.renderer.setAttribute(svg, `id`, `windDirection`)

    const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
    this.renderer.setAttribute(path, `d`, `M 150,150 150,300 135,282 165.2,282 150,300`)
    this.renderer.setAttribute(path, `x`, `36`)
    this.renderer.setAttribute(path, `y`, `36`)
    this.renderer.setAttribute(path, `id`, `windDirectionPath`)
    this.renderer.setAttribute(path, `transform`, `rotate(` + weatherNowStringOutParsed.wind.deg + `,150,150)`)
    //  this.renderer.setAttribute(path, `transform`, `rotate(90,150,150)`);

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `150`)
    this.renderer.setAttribute(circle, `cy`, `150`)
    this.renderer.setAttribute(circle, `r`, `160`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, WindVelocity )
    
    const textN = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textN, `id`, `CardinalN`)
    textN.textContent = `N`

    const textS = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textS, `id`, `CardinalS`)
    textS.textContent = `S`

    const textE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textE, `id`, `CardinalE`)
    textE.textContent = `E` 
    
    const textW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textW, `id`, `CardinalW`)
    textW.textContent = `W`      

    this.renderer.appendChild(svg, path)
    this.renderer.appendChild(svg, circle)
    this.renderer.appendChild(svg, textN)
    this.renderer.appendChild(svg, textS)
    this.renderer.appendChild(svg, textE)
    this.renderer.appendChild(svg, textW)

    this.renderer.appendChild(this.container.nativeElement, svg)
    

  }

}

