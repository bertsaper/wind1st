/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */

import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core'

import { environment } from 'src/environments/environment'

import { NavigationEnd, Router } from '@angular/router'

import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss'],
})

export class ExploreContainerComponent implements OnInit {

  element: any

  weatherNow: object

  weatherNowString: string

  weatherLocationStorage = `weatherLocation`

  currentWeatherStorage = `currentWeather`

  weatherNowStringOutParsed: object

  /*
  * Needed for Imperial / Metric Selection
  */

  imperialMetricChoice: string

  selectedWindSpeed: string

  selectedTemperature: string


  lat: number

  lng: number

  fromHome = `/`

  /*
  * If no location found in localstorage, ifNoLocationNavTo
  * and displayLocation are needed for routing.
  */

  ifNoLocationNavTo = `tabs/tab2`

  displayLocation = `/tabs/tab1`

  weatherDisplay = `Wind Info`

  displayLocationFlag = false



  @ViewChild('svgWindPointer') container: ElementRef;

  constructor(
    private http: HttpClient,
    public router: Router,
    private renderer: Renderer2,
  ) { }


  ngOnInit() {

    this.onDisplay()
  }

  onDisplay() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

          /*
          * this.removeElement() prevents multiple results from displaying
          */

        if (event.url === this.displayLocation) {
          this.removeElement()
          // console.log(`Display true`)
          this.getWeather()
        }
        if (event.url === this.fromHome) {
          //  this.removeElement()
          // console.log(`from home`)
          this.getWeather()
        }
      }
    })
  }

  removeElement() {
    this.element = document.getElementById(this.weatherDisplay)
    if (this.element) {
      this.element.remove()
    }
  }

  async getWeather(): Promise<void> {

    /*
    * If no location found, send to location selector
    */

    if (localStorage.getItem(this.weatherLocationStorage) === null) {
      this.router.navigate([this.ifNoLocationNavTo])
    }

    try {

      const measurementChoice = this.getMeasurementChoiceMethod()

      const weatherLocationStorage = localStorage.getItem(this.weatherLocationStorage)

      const weatherLocationStorageParsed = JSON.parse(weatherLocationStorage)

      const openWeatherAddress = environment.open_weather_address

      const latString = `lat=`
      const lati: any = weatherLocationStorageParsed.location.lat

      const lonString = `&lon=`
      const long: any = weatherLocationStorageParsed.location.lng

      const openWeatherKey: string = environment.open_weather_key

      const unitSelecton: string = `&units=` + measurementChoice

      const resString: string = openWeatherAddress + latString + lati + lonString + long +
       unitSelecton + openWeatherKey

      await this.http.get(resString).subscribe((res) => {

        this.weatherNow = res
        this.weatherNowString = JSON.stringify(this.weatherNow)
        localStorage.setItem(this.currentWeatherStorage, this.weatherNowString)

        this.chartMethod()

      })

    }

    catch (error) { }

  }

  chartMethod() {

    const imperialMetricChoice = this.getMeasurementChoiceMethod()


    if (imperialMetricChoice == `imperial`) {
      this.selectedWindSpeed = ` MPH`
      this.selectedTemperature = ` F`
    }

    if (imperialMetricChoice == `metric`) {
      this.selectedWindSpeed = ` MPS`
      this.selectedTemperature = ` C`
    }

    const windVelocity = `rgba(255, 2555, 255, .125)`

    const bandFill = `rgba(255, 255, 255, 0.1)`

    const bandStroke = `rgba(0, 0, 0, 0.125)`

    const weatherNowStringOut = localStorage.getItem(this.currentWeatherStorage)

    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    const windDeg = weatherNowStringOutParsed.wind.deg

    const windSpeed = Math.round(weatherNowStringOutParsed.wind.speed)

    const temp = Math.round(weatherNowStringOutParsed.main.temp)

    const place = weatherNowStringOutParsed.name

    const cardinalN = `N`
    const cardinalS = `S`
    const cardinalE = `E`
    const cardinalW = `W`

    const ordinalNE = `NE`
    const ordinalSE = `SE`
    const ordinalNW = `NW`
    const ordinalSW = `SW`

    // const label05mph: string = `5 mph`
    // const label10mph: string = `10 mph`
    // const label15mph: string = `15 mph`
    // const label20mph: string = `20 mph`
    // const label25mph: string = `25 mph`
    // const label30mph: string = `30+ mph`

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)
    this.renderer.setAttribute(svg, `id`, this.weatherDisplay)

    const infoGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(infoGroup, `height`, `320`)
    this.renderer.setAttribute(infoGroup, `width`, `320`)
    this.renderer.setAttribute(infoGroup, `id`, `infoGroup`)

    /*
    * Scalers for the length of the wind direction arrow 29 needs to be just under 100
    */
    const windScalerFirstLast: any = 178 + (windSpeed * 4)
    const windScalerSecondThird: any = 158 + (windSpeed * 4)

    if (windSpeed !== 0) {
      const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)

      if (windSpeed >= 30) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,298 145,278 155,278 150,298 `)
      }
      if (windSpeed >= 6 && windSpeed <= 29) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,` + windScalerFirstLast + ` 155,` + windScalerSecondThird +
          ` 145,` + windScalerSecondThird + ` 150,` + windScalerFirstLast)
      }
      if (windSpeed >= 1 && windSpeed <= 5) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,198 145,178 155,178 150,198 `)
      }

      this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,150,150)`)
      this.renderer.appendChild(infoGroup, path)

    }

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `150`)
    this.renderer.setAttribute(circle, `cy`, `150`)
    this.renderer.setAttribute(circle, `r`, `150`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, windVelocity)

    const band25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band25mph, `cx`, `150`)
    this.renderer.setAttribute(band25mph, `cy`, `150`)
    this.renderer.setAttribute(band25mph, `r`, `130`)
    this.renderer.setAttribute(band25mph, `id`, `band25mph`)
    this.renderer.setAttribute(band25mph, `fill`, bandFill)
    this.renderer.setAttribute(band25mph, `stroke`, bandStroke)

    const band20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20mph, `cx`, `150`)
    this.renderer.setAttribute(band20mph, `cy`, `150`)
    this.renderer.setAttribute(band20mph, `r`, `110`)
    this.renderer.setAttribute(band20mph, `id`, `band20mph`)
    this.renderer.setAttribute(band20mph, `fill`, bandFill)
    this.renderer.setAttribute(band20mph, `stroke`, bandStroke)

    const band15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band15mph, `cx`, `150`)
    this.renderer.setAttribute(band15mph, `cy`, `150`)
    this.renderer.setAttribute(band15mph, `r`, `90`)
    this.renderer.setAttribute(band15mph, `id`, `band15mph`)
    this.renderer.setAttribute(band15mph, `fill`, bandFill)
    this.renderer.setAttribute(band15mph, `stroke`, bandStroke)

    const band10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10mph, `cx`, `150`)
    this.renderer.setAttribute(band10mph, `cy`, `150`)
    this.renderer.setAttribute(band10mph, `r`, `70`)
    this.renderer.setAttribute(band10mph, `id`, `band10mph`)
    this.renderer.setAttribute(band10mph, `fill`, bandFill)
    this.renderer.setAttribute(band10mph, `stroke`, bandStroke)

    const band5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5mph, `cx`, `150`)
    this.renderer.setAttribute(band5mph, `cy`, `150`)
    this.renderer.setAttribute(band5mph, `r`, `50`)
    this.renderer.setAttribute(band5mph, `id`, `band5mph`)
    this.renderer.setAttribute(band5mph, `fill`, bandFill)
    this.renderer.setAttribute(band5mph, `stroke`, bandStroke)

    /*
    * Eight legends n the compass
    */
  
    const textN = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textN, `id`, `cardinalN`)
    this.renderer.setAttribute(textN, `dominant-baseline`, `auto`)
    this.renderer.setAttribute(textN, `x`, `145`)
    this.renderer.setAttribute(textN, `y`, `-10`)
    textN.textContent = cardinalN

    const textS = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textS, `id`, `cardinalS`)
    this.renderer.setAttribute(textS, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textS, `x`, `145`)
    this.renderer.setAttribute(textS, `y`, `310`)
    textS.textContent = cardinalS

    const textE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textE, `id`, `cardinalE`)
    this.renderer.setAttribute(textE, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textE, `x`, `310`)
    this.renderer.setAttribute(textE, `y`, `150`)
    textE.textContent = cardinalE

    const textW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textW, `id`, `cardinalW`)
    this.renderer.setAttribute(textW, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textW, `x`, `-25`)
    this.renderer.setAttribute(textW, `y`, `150`)
    textW.textContent = cardinalW

    const textNW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNW, `id`, `ordinalNW`)
    this.renderer.setAttribute(textNW, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNW, `x`, `15`)
    this.renderer.setAttribute(textNW, `y`, `35`)
    textNW.textContent = ordinalNW

    const textSW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSW, `id`, `ordinalSW`)
    this.renderer.setAttribute(textSW, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSW, `x`, `15`)
    this.renderer.setAttribute(textSW, `y`, `265`)
    textSW.textContent = ordinalSW

    const textNE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNE, `id`, `ordinalNE`)
    this.renderer.setAttribute(textNE, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNE, `x`, `260`)
    this.renderer.setAttribute(textNE, `y`, `35`)
    textNE.textContent = ordinalNE

    const textSE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSE, `id`, `ordinalSE`)
    this.renderer.setAttribute(textSE, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSE, `x`, `260`)
    this.renderer.setAttribute(textSE, `y`, `265`)
    textSE.textContent = ordinalSE

    const textTemp = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textTemp, `id`, `textTemp`)
    this.renderer.setAttribute(textTemp, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textTemp, `x`, `-30`)
    this.renderer.setAttribute(textTemp, `y`, `-30`)
    textTemp.textContent = temp + this.selectedTemperature

    const textLocale = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textLocale, `id`, `textLocale`)
    this.renderer.setAttribute(textLocale, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textLocale, `x`, `-50`)
    this.renderer.setAttribute(textLocale, `y`, `350`)
    textLocale.textContent = place

    if (windSpeed !== 0) {

      if (windDeg >= 0 && windDeg <= 30) {
        this.renderer.setAttribute(textN, `fill`, `red`)
      }
      if (windDeg >= 31 && windDeg <= 60) {
        this.renderer.setAttribute(textNE, `fill`, `red`)
      }
      if (windDeg >= 61 && windDeg <= 120) {
        this.renderer.setAttribute(textE, `fill`, `red`)
      }
      if (windDeg >= 121 && windDeg <= 150) {
        this.renderer.setAttribute(textSE, `fill`, `red`)
      }
      if (windDeg >= 151 && windDeg <= 210) {
        this.renderer.setAttribute(textS, `fill`, `red`)
      }
      if (windDeg >= 211 && windDeg <= 240) {
        this.renderer.setAttribute(textSW, `fill`, `red`)
      }
      if (windDeg >= 241 && windDeg <= 300) {
        this.renderer.setAttribute(textW, `fill`, `red`)
      }
      if (windDeg >= 301 && windDeg <= 330) {
        this.renderer.setAttribute(textNW, `fill`, `red`)
      }
      if (windDeg >= 331 && windDeg <= 360) {
        this.renderer.setAttribute(textN, `fill`, `red`)
      }
    }

    const legend5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend5mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend5mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend5mph, `x`, `165`)
    this.renderer.setAttribute(legend5mph, `y`, `150`)
    this.renderer.setAttribute(legend5mph, `font-size`, `0.75rem`)

    const legend10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend10mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend10mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend10mph, `x`, `165`)
    this.renderer.setAttribute(legend10mph, `y`, `150`)
    this.renderer.setAttribute(legend10mph, `font-size`, `0.75rem`)

    const legend15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend15mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend15mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend15mph, `x`, `195`)
    this.renderer.setAttribute(legend15mph, `y`, `150`)
    this.renderer.setAttribute(legend15mph, `font-size`, `0.75rem`)

    const legend20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend20mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend20mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend20mph, `x`, `165`)
    this.renderer.setAttribute(legend20mph, `y`, `150`)
    this.renderer.setAttribute(legend20mph, `font-size`, `0.75rem`)

    const legend25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend25mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend25mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend25mph, `x`, `165`)
    this.renderer.setAttribute(legend25mph, `y`, `150`)
    this.renderer.setAttribute(legend25mph, `font-size`, `0.75rem`)

    const legend30mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(legend30mph, `id`, `cardinalW`)
    this.renderer.setAttribute(legend30mph, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(legend30mph, `x`, `165`)
    this.renderer.setAttribute(legend30mph, `y`, `150`)
    this.renderer.setAttribute(legend30mph, `font-size`, `0.75rem`)

    const textWindVelocity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocity, `id`, `windVelocity`)

    if (windSpeed > 0) {
      textWindVelocity.textContent = windSpeed.toString() + this.selectedWindSpeed
    }
    if (windSpeed === 0) {
      textWindVelocity.textContent = `No Wind`
    }
    this.renderer.setAttribute(textWindVelocity, `dominant-baseline`, `baseline`)

    if (windDeg <= 170) {
      this.renderer.setAttribute(textWindVelocity, `x`, `155`)
    }
    if (windDeg >= 169) {

      if (windSpeed < 10) {
        this.renderer.setAttribute(textWindVelocity, `x`, `95`)
      }
      if (windSpeed > 10) {
        this.renderer.setAttribute(textWindVelocity, `x`, `92`)
      }
    }
    this.renderer.setAttribute(textWindVelocity, `y`, `150`)

    this.renderer.appendChild(infoGroup, textWindVelocity)

    const bandGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(bandGroup, `height`, `320`)
    this.renderer.setAttribute(bandGroup, `width`, `320`)
    this.renderer.setAttribute(bandGroup, `id`, `BandGroup`)

    const legendGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(legendGroup, `height`, `320`)
    this.renderer.setAttribute(legendGroup, `width`, `320`)
    this.renderer.setAttribute(legendGroup, `id`, `legendGroup`)

    this.renderer.appendChild(legendGroup, legend30mph)
    this.renderer.appendChild(bandGroup, band25mph)

    this.renderer.appendChild(legendGroup, legend25mph)
    this.renderer.appendChild(bandGroup, band25mph)

    this.renderer.appendChild(legendGroup, legend20mph)
    this.renderer.appendChild(bandGroup, band20mph)

    this.renderer.appendChild(legendGroup, legend15mph)
    this.renderer.appendChild(bandGroup, band15mph)

    this.renderer.appendChild(legendGroup, legend10mph)
    this.renderer.appendChild(bandGroup, band10mph)

    this.renderer.appendChild(legendGroup, legend5mph)
    this.renderer.appendChild(bandGroup, band5mph)

    this.renderer.appendChild(infoGroup, textN)
    this.renderer.appendChild(infoGroup, textS)
    this.renderer.appendChild(infoGroup, textE)
    this.renderer.appendChild(infoGroup, textW)
    this.renderer.appendChild(infoGroup, textNW)
    this.renderer.appendChild(infoGroup, textSW)
    this.renderer.appendChild(infoGroup, textNE)
    this.renderer.appendChild(infoGroup, textSE)
    this.renderer.appendChild(infoGroup, textTemp)
    this.renderer.appendChild(infoGroup, textLocale)

    this.renderer.appendChild(infoGroup, circle)

    this.renderer.appendChild(svg, bandGroup)
    this.renderer.appendChild(svg, infoGroup)

    this.renderer.appendChild(this.container.nativeElement, svg)
  }

  getMeasurementChoiceMethod() {

    const imperialMetricChoice = localStorage.getItem('imperialMetricChoice')

    const imperialMetricChoiceStorageParsed = JSON.parse(imperialMetricChoice)

    const measurementChoice: any = imperialMetricChoiceStorageParsed.imperialMetric.choice

    return measurementChoice

  }

}


