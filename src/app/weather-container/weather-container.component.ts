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

    const WindVelocity: string = `rgba(2, 176, 255, 0.1)`

    const BandFill: string = `rgba(255, 255, 255, 0)`

    const weatherNowStringOut = localStorage.getItem(`currentWeather`)

    let weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    let windDeg = weatherNowStringOutParsed.wind.deg

    let windSpeed =   Math.round(weatherNowStringOutParsed.wind.speed)

    let temp = weatherNowStringOutParsed.main.temp

    const CardinalN: string = `N`
    const CardinalS: string = `S`
    const CardinalE: string = `E`
    const CardinalW: string = `W`

    const OrddinalNE: string = `NE`
    const OrddinalSE: string = `SE`
    const OrddinalNW: string = `NW`
    const CardinalSW: string = `SW`

    const l05mph: string = `5 mph`
    const l10mph: string = `10`
    const l15mph: string = `15`
    const l20mph: string = `20`
    const l25mph: string = `25`
    const l30mph: string = `30+`



    let windDirectionRounded: string

    if (windDeg >= 0 && windDeg <= 30) {
      windDirectionRounded = CardinalN
    }

    if (windDeg >= 31 && windDeg <= 65) {
      windDirectionRounded = OrddinalNE
    }

    if (windDeg >= 66 && windDeg <= 120) {
      windDirectionRounded = CardinalE
    }

    if (windDeg >= 121 && windDeg <= 150) {
      windDirectionRounded = OrddinalSE
    }

    if (windDeg >= 151 && windDeg <= 210) {
      windDirectionRounded = CardinalS
    }

    if (windDeg >= 211 && windDeg <= 240) {
      windDirectionRounded = OrddinalNW
    }

    if (windDeg >= 241 && windDeg <= 300) {
      windDirectionRounded = CardinalW
    }

    if (windDeg >= 301 && windDeg <= 330) {
      windDirectionRounded = OrddinalNW
    }

    if (windDeg >= 331 && windDeg <= 360) {
      windDirectionRounded = CardinalN
    }


    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)
    this.renderer.setAttribute(svg, `id`, `WindInfo`)

    const InfoGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(InfoGroup, `height`, `320`)
    this.renderer.setAttribute(InfoGroup, `width`, `320`)
    this.renderer.setAttribute(InfoGroup, `id`, `InfoGroup`)

    // 6 needs to = 1 and 29 needs to equatl 100
    let windScaler195: any = 195 + (windSpeed * 3.5)
    let windScaler175: any = 175 + (windSpeed * 3.5)

    if (windSpeed != 0) {
      const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
      if (windSpeed >= 30) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,295 135,275 165,275 150,295 `)
      }
      if (windSpeed >= 6 && windSpeed <= 29) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,` + windScaler195 + ` 135,` + windScaler175 + ` 165,` + windScaler175 + ` 150,` + windScaler195)
      }

      if (windSpeed >= 1 && windSpeed <= 5) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,195 135,175 165,175 150,195 `)
      }

      this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,150,150)`)
      this.renderer.appendChild(InfoGroup, path)
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
    this.renderer.setAttribute(band5, `fill`, BandFill)
    this.renderer.setAttribute(band5, `stroke`, `gray`)


    const band4 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band4, `cx`, `150`)
    this.renderer.setAttribute(band4, `cy`, `150`)
    this.renderer.setAttribute(band4, `r`, `110`)
    this.renderer.setAttribute(band4, `id`, `circleBand4`)
    this.renderer.setAttribute(band4, `fill`, BandFill)
    this.renderer.setAttribute(band4, `stroke`, `gray`)


    const band3 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band3, `cx`, `150`)
    this.renderer.setAttribute(band3, `cy`, `150`)
    this.renderer.setAttribute(band3, `r`, `90`)
    this.renderer.setAttribute(band3, `id`, `circleBand3`)
    this.renderer.setAttribute(band3, `fill`, BandFill)
    this.renderer.setAttribute(band3, `stroke`, `gray`)


    const band2 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band2, `cx`, `150`)
    this.renderer.setAttribute(band2, `cy`, `150`)
    this.renderer.setAttribute(band2, `r`, `70`)
    this.renderer.setAttribute(band2, `id`, `circleBand25`)
    this.renderer.setAttribute(band2, `fill`, BandFill)
    this.renderer.setAttribute(band2, `stroke`, `gray`)

    const band1 = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band1, `cx`, `150`)
    this.renderer.setAttribute(band1, `cy`, `150`)
    this.renderer.setAttribute(band1, `r`, `50`)
    this.renderer.setAttribute(band1, `id`, `circleBand1`)
    this.renderer.setAttribute(band1, `fill`, BandFill)
    this.renderer.setAttribute(band1, `stroke`, `gray`)

    const textN = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textN, `id`, `CardinalN`)
    this.renderer.setAttribute(textN, `dominant-baseline`, `auto`)
    this.renderer.setAttribute(textN, `x`, `145`)
    this.renderer.setAttribute(textN, `y`, `-10`)
    textN.textContent = CardinalN

    const textS = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textS, `id`, `CardinalS`)
    this.renderer.setAttribute(textS, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textS, `x`, `145`)
    this.renderer.setAttribute(textS, `y`, `310`)
    textS.textContent = CardinalS

    const textE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textE, `id`, `CardinalE`)
    this.renderer.setAttribute(textE, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textE, `x`, `310`)
    this.renderer.setAttribute(textE, `y`, `150`)
    textE.textContent = CardinalE

    const textW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textW, `id`, `CardinalW`)
    this.renderer.setAttribute(textW, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textW, `x`, `-23`)
    this.renderer.setAttribute(textW, `y`, `150`)
    textW.textContent = CardinalW

    const Legend5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(Legend5mph, `id`, `CardinalW`)
    this.renderer.setAttribute(Legend5mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(Legend5mph, `x`, `165`)
    this.renderer.setAttribute(Legend5mph, `y`, `150`)
    this.renderer.setAttribute(Legend5mph, `font-size`, `0.75rem`)
    Legend5mph.textContent = l05mph

    const textWindVelocity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocity, `id`, `WindVelocity`)
    if (windSpeed > 0) {
      textWindVelocity.textContent = `Wind ` + windDirectionRounded + ` ` + windSpeed.toString() + ` mph`
    }

    if (windSpeed == 0) {
      textWindVelocity.textContent = `No Wind`
    }
    this.renderer.setAttribute(textWindVelocity, `dominant-baseline`, `auto`)
    this.renderer.setAttribute(textWindVelocity, `x`, `-55`)
    this.renderer.setAttribute(textWindVelocity, `y`, `-10`)

    this.renderer.appendChild(InfoGroup, textWindVelocity)

    const bandGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(bandGroup, `height`, `320`)
    this.renderer.setAttribute(bandGroup, `width`, `320`)
    this.renderer.setAttribute(bandGroup, `id`, `BandGroup`)

    const legentGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(legentGroup, `height`, `320`)
    this.renderer.setAttribute(legentGroup, `width`, `320`)
    this.renderer.setAttribute(legentGroup, `id`, `LegendGroup`)

    this.renderer.appendChild(legentGroup, Legend5mph)


    this.renderer.appendChild(bandGroup, band5)
    this.renderer.appendChild(bandGroup, band4)
    this.renderer.appendChild(bandGroup, band3)
    this.renderer.appendChild(bandGroup, band2)
    this.renderer.appendChild(bandGroup, band1)

    this.renderer.appendChild(InfoGroup, textN)
    this.renderer.appendChild(InfoGroup, textS)
    this.renderer.appendChild(InfoGroup, textE)
    this.renderer.appendChild(InfoGroup, textW)
    this.renderer.appendChild(InfoGroup, circle)


    this.renderer.appendChild(svg, bandGroup)
    this.renderer.appendChild(svg, InfoGroup)
    this.renderer.appendChild(svg, legentGroup)

    this.renderer.appendChild(this.container.nativeElement, svg)


  }

}
