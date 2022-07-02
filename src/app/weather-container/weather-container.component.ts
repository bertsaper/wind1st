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
        this.chartMethod()
      })

    }

    catch (error) { }

  }

  chartMethod() {

    let WindVelocity = `rgba(255, 255, 255, 0.1)`

    let Band5Fill = `rgba(200, 0, 200, 0.1)`

    let Band4Fill = `rgba(150, 150, 150, 0.1)`

    let Band3Fill = `rgba(100, 100, 100, 0.1)`

    let Band2Fill = `rgba(50, 50, 50, 0.1)`

    let Band1Fill = `rgba(0, 0, 0, 0.1)`

    const CardinalN = `N`

    const weatherNowStringOut = localStorage.getItem(`currentWeather`)

    let weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    let windDeg = weatherNowStringOutParsed.wind.deg
    let windSpeed = Math.round(weatherNowStringOutParsed.wind.speed)

    let temp = weatherNowStringOutParsed.main.temp

    console.log(`current wind direction`, windDeg)
    console.log(`current wind speed`, windSpeed)
    console.log(`current temp`, temp)

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)
    this.renderer.setAttribute(svg, `id`, `windDirection`)
    if (windSpeed != 0) {
      const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
      if (windSpeed > 30) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,295 135,275 165,275 150,295 `)
      }
      if (windSpeed >= 21 && windSpeed <= 30) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,275 135,255 165,255 150,275 `)
      }
      if (windSpeed >= 16 && windSpeed <= 20) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,255 135,235 165,235 150,255 `)
      }
      if (windSpeed >= 11 && windSpeed <= 15) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,235 135,215 165,215 150,235 `)
      }
      if (windSpeed >= 6 && windSpeed <= 10) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,215 135,195 165,195 150,215 `)
      }
      if (windSpeed >= 1 && windSpeed <= 5) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,195 135,175 165,175 150,195 `)
      }

      this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,150,150)`)
      this.renderer.appendChild(svg, path)
    }

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `150`)
    this.renderer.setAttribute(circle, `cy`, `150`)
    this.renderer.setAttribute(circle, `r`, `150`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, WindVelocity)

    const band5 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5, `cx`, `150`)
    this.renderer.setAttribute(band5, `cy`, `150`)
    this.renderer.setAttribute(band5, `r`, `130`)
    this.renderer.setAttribute(band5, `id`, `circleBand5`)
    this.renderer.setAttribute(band5, `fill`, Band5Fill)

    const band4 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band4, `cx`, `150`)
    this.renderer.setAttribute(band4, `cy`, `150`)
    this.renderer.setAttribute(band4, `r`, `110`)
    this.renderer.setAttribute(band4, `id`, `circleBand5`)
    this.renderer.setAttribute(band4, `fill`, Band4Fill)

    const band3 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band3, `cx`, `150`)
    this.renderer.setAttribute(band3, `cy`, `150`)
    this.renderer.setAttribute(band3, `r`, `90`)
    this.renderer.setAttribute(band3, `id`, `circleBand5`)
    this.renderer.setAttribute(band3, `fill`, Band3Fill)

    const band2 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band2, `cx`, `150`)
    this.renderer.setAttribute(band2, `cy`, `150`)
    this.renderer.setAttribute(band2, `r`, `70`)
    this.renderer.setAttribute(band2, `id`, `circleBand5`)
    this.renderer.setAttribute(band2, `fill`, Band2Fill)

    const band1 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band1, `cx`, `150`)
    this.renderer.setAttribute(band1, `cy`, `150`)
    this.renderer.setAttribute(band1, `r`, `50`)
    this.renderer.setAttribute(band1, `id`, `circleBand5`)
    this.renderer.setAttribute(band1, `fill`, Band1Fill)

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


    const textWindVelocity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocity, `id`, `WindVelocity`)
    if (windSpeed > 0) {
      textWindVelocity.textContent = `Wind Speed ` + windSpeed.toString() + ` mph`
    }

    if (windSpeed == 0) {
      textWindVelocity.textContent = `No Wind`
    }


    this.renderer.appendChild(svg, band5)
    this.renderer.appendChild(svg, band4)
    this.renderer.appendChild(svg, band3)
    this.renderer.appendChild(svg, band2)
    this.renderer.appendChild(svg, band1)

    this.renderer.appendChild(svg, textN)
    this.renderer.appendChild(svg, textS)
    this.renderer.appendChild(svg, textE)
    this.renderer.appendChild(svg, textW)
    this.renderer.appendChild(svg, circle)
    this.renderer.appendChild(svg, textWindVelocity)
    this.renderer.appendChild(this.container.nativeElement, svg)


  }

}

