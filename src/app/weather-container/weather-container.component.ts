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
  windSpeed: any
  windSpeedMax: any
  windSpeedMin: any
  windScalerFirstLast: any
  windScalerSecondThird: any

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

  weatherDisplay = `windInfo`

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


    if (imperialMetricChoice === `imperial`) {
      this.selectedWindSpeed = ` MPH`
      this.selectedTemperature = ` F`
    }

    if (imperialMetricChoice === `metric`) {
      this.selectedWindSpeed = ` KPH`
      this.selectedTemperature = ` C`
    }

    const windVelocity = `rgba(255, 2555, 255, .125)`

    const bandFill = `rgba(255, 255, 255, 0.1)`

    const bandStroke = `rgba(0, 0, 0, 0.125)`

    const weatherNowStringOut = localStorage.getItem(this.currentWeatherStorage)

    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    const windDeg = weatherNowStringOutParsed.wind.deg

    if (imperialMetricChoice === `imperial`) {

      this.windSpeed = Math.round(weatherNowStringOutParsed.wind.speed)
    }

    if (imperialMetricChoice === `metric`) {

      /*
      * Converting meters per second to Kilometers per hour.
      */

      this.windSpeed = Math.round(((weatherNowStringOutParsed.wind.speed * 3600) / 1000))
    }

    const temp = Math.round(weatherNowStringOutParsed.main.temp)

    /*
    * Weather description comes out in a sub array and the brackets need to be striped.
    */

    const getWeatherDescription = weatherNowStringOutParsed.weather

    const weatherDescString = JSON.stringify(getWeatherDescription)

    const weatherDescriptionPreParsed = weatherDescString.slice(1, -1)

    const weatherDescriptionParsed = JSON.parse(weatherDescriptionPreParsed)

    const description = weatherDescriptionParsed.description

    const place = weatherNowStringOutParsed.name

    const cardinalN = `N`
    const cardinalS = `S`
    const cardinalE = `E`
    const cardinalW = `W`

    const ordinalNE = `NE`
    const ordinalSE = `SE`
    const ordinalNW = `NW`
    const ordinalSW = `SW`

    /*
   * Build the svg.
   */

    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `400`)
    this.renderer.setAttribute(svg, `width`, `400`)
    this.renderer.setAttribute(svg, `id`, this.weatherDisplay)

    const infoGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(infoGroup, `height`, `360`)
    this.renderer.setAttribute(infoGroup, `width`, `360`)
    this.renderer.setAttribute(infoGroup, `x`, `100`)
    this.renderer.setAttribute(infoGroup, `y`, `100`)
    this.renderer.setAttribute(infoGroup, `id`, `infoGroup`)

    /*
    * Scalers for the length of the wind direction arrow 29 needs to be just under 100
    */

    if (imperialMetricChoice === `imperial`) {
      this.windScalerFirstLast = 228 + (this.windSpeed * 4)
      this.windScalerSecondThird = 208 + (this.windSpeed * 4)
      this.windSpeedMin = 5
      this.windSpeedMax = 30
    }

    if (imperialMetricChoice === `metric`) {
      this.windScalerFirstLast = 228 + (this.windSpeed * 2.45)
      this.windScalerSecondThird = 208 + (this.windSpeed * 2.45)
      this.windSpeedMin = 7.5
      this.windSpeedMax = 50

    }

    if (this.windSpeed !== 0) {

      const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
      /*
      * Direction arrow. The four number group describes the line and
      * the three two number groups are the points of the arrow,
      */
      /*
      * High wind.
      */
      if (this.windSpeed >= this.windSpeedMax) {
        this.renderer.setAttribute(path, `d`, `M 200,200 200,352 205,332 195,332 200,352`)
      }
      /*
      * Less than high.
      */
      if (this.windSpeed <= this.windSpeedMax) {
        this.renderer.setAttribute(path, `d`, `M 200,200 200,` + this.windScalerFirstLast + ` 205,` + this.windScalerSecondThird +
          ` 195,` + this.windScalerSecondThird + ` 200,` + this.windScalerFirstLast)
      }


      this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,200,200)`)
      this.renderer.appendChild(infoGroup, path)

    }
    /*
    * Bounding circle.
    */

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `200`)
    this.renderer.setAttribute(circle, `cy`, `200`)
    this.renderer.setAttribute(circle, `r`, `150`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, windVelocity)

    /*
    * MPH circles.
    */

    const band25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band25mph, `cx`, `200`)
    this.renderer.setAttribute(band25mph, `cy`, `200`)
    this.renderer.setAttribute(band25mph, `r`, `130`)
    this.renderer.setAttribute(band25mph, `id`, `band25mph`)
    this.renderer.setAttribute(band25mph, `fill`, bandFill)
    this.renderer.setAttribute(band25mph, `stroke`, bandStroke)

    const band20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20mph, `cx`, `200`)
    this.renderer.setAttribute(band20mph, `cy`, `200`)
    this.renderer.setAttribute(band20mph, `r`, `110`)
    this.renderer.setAttribute(band20mph, `id`, `band20mph`)
    this.renderer.setAttribute(band20mph, `fill`, bandFill)
    this.renderer.setAttribute(band20mph, `stroke`, bandStroke)

    const band15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band15mph, `cx`, `200`)
    this.renderer.setAttribute(band15mph, `cy`, `200`)
    this.renderer.setAttribute(band15mph, `r`, `90`)
    this.renderer.setAttribute(band15mph, `id`, `band15mph`)
    this.renderer.setAttribute(band15mph, `fill`, bandFill)
    this.renderer.setAttribute(band15mph, `stroke`, bandStroke)

    const band10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10mph, `cx`, `200`)
    this.renderer.setAttribute(band10mph, `cy`, `200`)
    this.renderer.setAttribute(band10mph, `r`, `70`)
    this.renderer.setAttribute(band10mph, `id`, `band10mph`)
    this.renderer.setAttribute(band10mph, `fill`, bandFill)
    this.renderer.setAttribute(band10mph, `stroke`, bandStroke)

    const band5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5mph, `cx`, `200`)
    this.renderer.setAttribute(band5mph, `cy`, `200`)
    this.renderer.setAttribute(band5mph, `r`, `50`)
    this.renderer.setAttribute(band5mph, `id`, `band5mph`)
    this.renderer.setAttribute(band5mph, `fill`, bandFill)
    this.renderer.setAttribute(band5mph, `stroke`, bandStroke)

    /*
    * KPH circles.
    */



    const band40kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band40kph, `cx`, `200`)
    this.renderer.setAttribute(band40kph, `cy`, `200`)
    this.renderer.setAttribute(band40kph, `r`, `125`)
    this.renderer.setAttribute(band40kph, `id`, `band40kph`)
    this.renderer.setAttribute(band40kph, `fill`, bandFill)
    this.renderer.setAttribute(band40kph, `stroke`, bandStroke)


    const band30kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band30kph, `cx`, `200`)
    this.renderer.setAttribute(band30kph, `cy`, `200`)
    this.renderer.setAttribute(band30kph, `r`, `100`)
    this.renderer.setAttribute(band30kph, `id`, `band30kph`)
    this.renderer.setAttribute(band30kph, `fill`, bandFill)
    this.renderer.setAttribute(band30kph, `stroke`, bandStroke)


    const band20kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20kph, `cx`, `200`)
    this.renderer.setAttribute(band20kph, `cy`, `200`)
    this.renderer.setAttribute(band20kph, `r`, `75`)
    this.renderer.setAttribute(band20kph, `id`, `band20kph`)
    this.renderer.setAttribute(band20kph, `fill`, bandFill)
    this.renderer.setAttribute(band20kph, `stroke`, bandStroke)

    const band10kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10kph, `cx`, `200`)
    this.renderer.setAttribute(band10kph, `cy`, `200`)
    this.renderer.setAttribute(band10kph, `r`, `50`)
    this.renderer.setAttribute(band10kph, `id`, `band10kph`)
    this.renderer.setAttribute(band10kph, `fill`, bandFill)
    this.renderer.setAttribute(band10kph, `stroke`, bandStroke)


    /*
    * Eight legends on the compass.
    */

    const textN = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textN, `id`, `cardinalN`)
    this.renderer.setAttribute(textN, `dominant-baseline`, `auto`)
    this.renderer.setAttribute(textN, `x`, `195`)
    this.renderer.setAttribute(textN, `y`, `40`)
    textN.textContent = cardinalN

    const textS = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textS, `id`, `cardinalS`)
    this.renderer.setAttribute(textS, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textS, `x`, `195`)
    this.renderer.setAttribute(textS, `y`, `360`)
    textS.textContent = cardinalS

    const textE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textE, `id`, `cardinalE`)
    this.renderer.setAttribute(textE, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textE, `x`, `360`)
    this.renderer.setAttribute(textE, `y`, `200`)
    textE.textContent = cardinalE

    const textW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textW, `id`, `cardinalW`)
    this.renderer.setAttribute(textW, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textW, `x`, `27`)
    this.renderer.setAttribute(textW, `y`, `200`)
    textW.textContent = cardinalW

    const textNW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNW, `id`, `ordinalNW`)
    this.renderer.setAttribute(textNW, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNW, `x`, `65`)
    this.renderer.setAttribute(textNW, `y`, `85`)
    textNW.textContent = ordinalNW

    const textSW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSW, `id`, `ordinalSW`)
    this.renderer.setAttribute(textSW, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSW, `x`, `65`)
    this.renderer.setAttribute(textSW, `y`, `315`)
    textSW.textContent = ordinalSW

    const textNE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNE, `id`, `ordinalNE`)
    this.renderer.setAttribute(textNE, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNE, `x`, `310`) 
    this.renderer.setAttribute(textNE, `y`, `85`)
    textNE.textContent = ordinalNE

    const textSE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSE, `id`, `ordinalSE`)
    this.renderer.setAttribute(textSE, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSE, `x`, `310`) 
    this.renderer.setAttribute(textSE, `y`, `315`)
    textSE.textContent = ordinalSE

    const textTemp = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textTemp, `id`, `textTemp`)
    this.renderer.setAttribute(textTemp, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textTemp, `x`, `20`)
    this.renderer.setAttribute(textTemp, `y`, `20`)
    textTemp.textContent = temp + this.selectedTemperature

    const textDescription = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDescription, `id`, `textDescription`)
    this.renderer.setAttribute(textDescription, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDescription, `x`, `20`)
    this.renderer.setAttribute(textDescription, `y`, `40`)
    textDescription.textContent = description

    const textLocale = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textLocale, `id`, `textLocale`)
    this.renderer.setAttribute(textLocale, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textLocale, `x`, `20`)
    this.renderer.setAttribute(textLocale, `y`, `380`)
    textLocale.textContent = place

    if (this.windSpeed !== 0) {

      if (windDeg >= 0 && windDeg <= 30) {
        this.renderer.setAttribute(textN, `fill`, `red`)
      }
      if (windDeg >= 31 && windDeg <= 60) {
        this.renderer.setAttribute(textNE, `fill`, `red`)
      }
      if (windDeg >= 61 && windDeg <= 120) {
        this.renderer.setAttribute(textE, `fill`, `red`)
      }
      if (windDeg >= 121 && windDeg <= 10) {
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

    const textWindVelocity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocity, `id`, `textWindVelocity`)

    if (this.windSpeed > 0) {
      textWindVelocity.textContent = this.windSpeed + this.selectedWindSpeed
    }
    if (this.windSpeed === 0) {
      textWindVelocity.textContent = `No Wind`
    }
    this.renderer.setAttribute(textWindVelocity, `dominant-baseline`, `baseline`)

    if (windDeg <= 170) {
      this.renderer.setAttribute(textWindVelocity, `x`, `215`)
    }
    if (windDeg >= 169) {

      if (this.windSpeed <= 10) {
        this.renderer.setAttribute(textWindVelocity, `x`, `135`)
      }
      if (this.windSpeed > 10) {
        this.renderer.setAttribute(textWindVelocity, `x`, `132`)
      }
    }
    this.renderer.setAttribute(textWindVelocity, `y`, `200`)




    this.renderer.appendChild(infoGroup, textWindVelocity)

    const bandGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(bandGroup, `height`, `360`)
    this.renderer.setAttribute(bandGroup, `width`, `360`)
    this.renderer.setAttribute(bandGroup, `id`, `bandGroup`)

    if (imperialMetricChoice === `imperial`) {
      this.renderer.appendChild(bandGroup, band25mph)

      this.renderer.appendChild(bandGroup, band25mph)

      this.renderer.appendChild(bandGroup, band20mph)

      this.renderer.appendChild(bandGroup, band15mph)

      this.renderer.appendChild(bandGroup, band10mph)

      this.renderer.appendChild(bandGroup, band5mph)
    }

    if (imperialMetricChoice === `metric`) {

      this.renderer.appendChild(bandGroup, band40kph)

      this.renderer.appendChild(bandGroup, band30kph)

      this.renderer.appendChild(bandGroup, band20kph)

      this.renderer.appendChild(bandGroup, band10kph)
    }

    this.renderer.appendChild(infoGroup, textN)
    this.renderer.appendChild(infoGroup, textS)
    this.renderer.appendChild(infoGroup, textE)
    this.renderer.appendChild(infoGroup, textW)
    this.renderer.appendChild(infoGroup, textNW)
    this.renderer.appendChild(infoGroup, textSW)
    this.renderer.appendChild(infoGroup, textNE)
    this.renderer.appendChild(infoGroup, textSE)
    this.renderer.appendChild(infoGroup, textTemp)
    this.renderer.appendChild(infoGroup, textDescription)
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


