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

    let Band5Fill = `rgba(255, 0, 0, 0.1)`

    const CardinalN = `N`

    const weatherNowStringOut = localStorage.getItem(`currentWeather`)

    let weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    let windDeg = weatherNowStringOutParsed.wind.deg
    let windSpeed =  Math.round(weatherNowStringOutParsed.wind.speed)
    let currentTemp = weatherNowStringOutParsed.main.temp

    console.log(`current wind direction`, windDeg)
    console.log(`current wind speed`, windSpeed)
    console.log(`current temp`, currentTemp)

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)  
    this.renderer.setAttribute(svg, `id`, `windDirection`)
    if (windSpeed != 0) {
    const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
    // this.renderer.setAttribute(path, `d`, `M 150,150 150,295 135,275 165,275 150,295 `)
     this.renderer.setAttribute(path, `d`, `M 150,150 150,275 135,255 165,255 150,275 `) // band 5 arrow
    // this.renderer.setAttribute(path, `d`, `M 150,150 150,255 135,235 165,235 150,255 `)  
    // this.renderer.setAttribute(path, `d`, `M 150,150 150,235 135,215 165,215 150,235 `) 
    //   this.renderer.setAttribute(path, `d`, `M 150,150 150,215 135,195 165,195 150,215 `) 

     this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,150,150)`)
      this.renderer.appendChild(svg, path)
    }

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `150`)
    this.renderer.setAttribute(circle, `cy`, `150`)
    this.renderer.setAttribute(circle, `r`, `160`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, WindVelocity )

    const band5 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5, `cx`, `150`)
    this.renderer.setAttribute(band5, `cy`, `150`)
    this.renderer.setAttribute(band5, `r`, `130`)
    this.renderer.setAttribute(band5, `id`, `circleBand5`)
    this.renderer.setAttribute(band5, `fill`, Band5Fill )
    
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

  

    this.renderer.appendChild(svg, band5)    
    this.renderer.appendChild(svg, textN)
    this.renderer.appendChild(svg, textS)
    this.renderer.appendChild(svg, textE)
    this.renderer.appendChild(svg, textW)
    this.renderer.appendChild(svg, circle)
    this.renderer.appendChild(this.container.nativeElement, svg)
    

  }

}

