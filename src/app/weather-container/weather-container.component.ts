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

  /*
  * Screen size is needed to see if device is Alt
  */

  getScreenWidth: any

  element: any

  windSpeed: any

  windSpeedMax: any

  windSpeedMin: any

  windScalerFirstLast: any

  windScalerSecondThird: any

  weatherNow: object

  weatherNowString: string

  windDirectionOutputAlt: string

  weatherLocationStorage = `weatherLocation`

  currentWeatherStorage = `currentWeather`

  weatherNowStringOutParsed: object

  weatherTimeStamp: object

  lati: any

  long: any

  /*
  * for getLocation()
  */

  public lat

  public lng

  /*
  * Needed for Imperial / Metric Selection
  */

  imperialMetricChoice: string

  selectedWindSpeed: string

  selectedTemperature: string

  fromHome = `/`

  /*
  * If no location found in localstorage, go to settings.
  */

  ifNoLocationNavTo = `/settings`

  displayLocation = `/weather`

  weatherDisplay = `windInfo`

  altDisplay = `displayAlt`

  ariaDisplay = `displayAria`

  loadingDiv = `loadingDiv`

  displayLocationFlag = false

  @ViewChild('svgWindPointer') container: ElementRef;


  constructor(
    private http: HttpClient,
    public router: Router,
    private renderer: Renderer2,
  ) { }


  ngOnInit() {

    this.getScreenWidth = window.innerWidth

    this.onDisplay()

    this.getLocation()

  }

  onDisplay() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        /*
        * this.removeWeatherDisplay(), this.removeWeatherDisplayAria()
        * and removeWeatherDisplayAlt(), which prevents multiple results
        * from displaying.
        */

        if (event.url === this.displayLocation) {
          if (this.getScreenWidth >= 380) {
            this.removeWeatherDisplay()
            this.removeWeatherDisplayAria()
          }

          if (this.getScreenWidth < 380) {
            this.removeWeatherDisplayAlt()
          }
          this.getWeather()
        }
        if (event.url === this.fromHome) {
          this.getWeather()
        }
      }
    })
  }

  removeLoadingDisplay() {
    this.element = document.getElementById(this.loadingDiv)
    if (this.element) {
      this.element.remove()
    }
  }

  removeWeatherDisplay() {
    this.element = document.getElementById(this.weatherDisplay)
    if (this.element) {
      this.element.remove()
    }
  }

  removeWeatherDisplayAria() {
    this.element = document.getElementById(this.ariaDisplay)
    if (this.element) {
      this.element.remove()
    }
  }

  removeWeatherDisplayAlt() {
    this.element = document.getElementById(this.altDisplay)
    if (this.element) {
      this.element.remove()
    }
  }

  async getWeather(): Promise<void> {

    /*
    * If no location found in local storage, send to location selector.
    * The contents of weatherLocation "weatherLocation" flag if the device's
    * location will be used: "lat":"useDevice".
    *
    * If there is not "weatherLocation" visitors are sent to Settings.
    */

    if (localStorage.getItem(this.weatherLocationStorage) === null) {
      this.router.navigate([this.ifNoLocationNavTo])
    }

    try {

      const measurementChoice = this.getMeasurementChoice()

      const weatherLocationStorage = localStorage.getItem(this.weatherLocationStorage)

      const weatherLocationStorageParsed = JSON.parse(weatherLocationStorage)

      const openWeatherAddress = environment.openWeatherAddress

      /*
      * lati and long are from the device, or from the location entry
      * made on settings.
      */

      const latString = `lat=`

      if (weatherLocationStorageParsed.location.lat !== `useDevice`) {
        this.lati = weatherLocationStorageParsed.location.lat
      }

      if (weatherLocationStorageParsed.location.lat === `useDevice`) {
        if (this.lat) {
          this.lati = this.lat
        } else {
          alert(`Geolocation is not available on this device. \n\rPlease go to "Settings" and enter a location.`)
          this.lati = 0
        }
      }

      const lonString = `&lon=`

      if (weatherLocationStorageParsed.location.lng !== `useDevice`) {
        this.long = weatherLocationStorageParsed.location.lng
      }

      if (weatherLocationStorageParsed.location.lng === `useDevice`) {
        if (this.lng) {
          this.long = this.lng
        } else {
          this.long = 0
        }

      }

      const openWeatherKey: string = environment.openWeatherKey

      const unitSelecton: string = `&units=` + measurementChoice

      const resString: string = openWeatherAddress + latString + this.lati + lonString + this.long +
        unitSelecton + openWeatherKey

      await this.http.get(resString).subscribe((res) => {

        this.weatherNow = res
        this.weatherNowString = JSON.stringify(this.weatherNow)
        localStorage.setItem(this.currentWeatherStorage, this.weatherNowString)

        /*
        * Set the download time
        */

        this.weatherTimeStamp = { timestamp: new Date().getTime() }
        localStorage.setItem(`time`, JSON.stringify(this.weatherTimeStamp))

        this.removeLoadingDisplay()
        this.chartMethod()

      })

    }

    catch (error) { }

  }

  chartMethod() {
    const imperialMetricChoice = this.getMeasurementChoice()

    const downloadDate = this.getDate()

    const downloadTime = this.getTime()

    const downloadDateTime = this.getDateTime()

    if (imperialMetricChoice === `imperial`) {

      this.selectedWindSpeed = ` mph`

      this.selectedTemperature = ` f`
    }

    if (imperialMetricChoice === `metric`) {

      this.selectedWindSpeed = ` kph`

      this.selectedTemperature = ` c`
    }

    const windVelocity = `rgba(255, 255, 255, 0.125)`

    const bandFill = `rgba(255, 255, 255, 0)`

    const bandStroke = `rgba(255, 255, 255, 0.125)`

    const weatherNowStringOut = localStorage.getItem(this.currentWeatherStorage)

    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)

    const windDeg = weatherNowStringOutParsed.wind.deg

    const humidity = weatherNowStringOutParsed.main.humidity + `% humidity`

    if (imperialMetricChoice === `imperial`) {

      this.windSpeed = Math.round(weatherNowStringOutParsed.wind.speed)
    }

    if (imperialMetricChoice === `metric`) {

      /*
      * Converting meters per second to Kilometers per hour.
      * meters per second * 3600 / 1000 or meters per second * 3.6
      */

      this.windSpeed = Math.round(weatherNowStringOutParsed.wind.speed * 3.6)
    }

    const temp = Math.round(weatherNowStringOutParsed.main.temp)

    /*
    * Weather description comes out in a sub array and the brackets need to be stripped.
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

    const compass = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(compass, `height`, `440`)
    this.renderer.setAttribute(compass, `width`, `400`)
    this.renderer.setAttribute(compass, `id`, this.weatherDisplay)
    this.renderer.setAttribute(compass, `aria-hidden`, `true`)


    const infoGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(infoGroup, `height`, `360`)
    this.renderer.setAttribute(infoGroup, `width`, `360`)
    this.renderer.setAttribute(infoGroup, `id`, `infoGroup`)

    /*
    * Scalers for the length of the wind direction need to be just under 100 (35 for Imperial
    * and 50 for Metric).
    */

    if (imperialMetricChoice === `imperial`) {
      this.windScalerFirstLast = 228 + (this.windSpeed * 4)
      this.windScalerSecondThird = 208 + (this.windSpeed * 4)
      this.windSpeedMax = 35
    }

    if (imperialMetricChoice === `metric`) {
      this.windScalerFirstLast = 228 + (this.windSpeed * 2.8)
      this.windScalerSecondThird = 208 + (this.windSpeed * 2.8)
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
        this.renderer.setAttribute(path, `d`, `M 200,220 200,368 205,348 195,348 200,368`)
      }

      /*
      * Less than high.
      */

      if (this.windSpeed <= this.windSpeedMax) {
        this.renderer.setAttribute(path, `d`, `M 200,220 200,` + this.windScalerFirstLast + ` 205,` +
          this.windScalerSecondThird + ` 195,` + this.windScalerSecondThird + ` 200,` + this.windScalerFirstLast)
      }


      this.renderer.setAttribute(path, `id`, `windDirectionPath`)
      this.renderer.setAttribute(path, `transform`, `rotate(` + windDeg + `,200,220)`)
      this.renderer.appendChild(infoGroup, path)

    }

    /*
    * Bounding circle.
    */

    const circle = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(circle, `cx`, `200`)
    this.renderer.setAttribute(circle, `cy`, `220`)
    this.renderer.setAttribute(circle, `r`, `150`)
    this.renderer.setAttribute(circle, `id`, `windDirectionHolder`)
    this.renderer.setAttribute(circle, `fill`, windVelocity)
    this.renderer.setAttribute(circle, `stroke-width`, `0`)


    /*
    * MPH circles.
    */

    const band25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band25mph, `cx`, `200`)
    this.renderer.setAttribute(band25mph, `cy`, `220`)
    this.renderer.setAttribute(band25mph, `r`, `130`)
    this.renderer.setAttribute(band25mph, `id`, `band25mph`)
    this.renderer.setAttribute(band25mph, `fill`, bandFill)
    this.renderer.setAttribute(band25mph, `stroke`, bandStroke)

    const band20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20mph, `cx`, `200`)
    this.renderer.setAttribute(band20mph, `cy`, `220`)
    this.renderer.setAttribute(band20mph, `r`, `110`)
    this.renderer.setAttribute(band20mph, `id`, `band20mph`)
    this.renderer.setAttribute(band20mph, `fill`, bandFill)
    this.renderer.setAttribute(band20mph, `stroke`, bandStroke)

    const band15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band15mph, `cx`, `200`)
    this.renderer.setAttribute(band15mph, `cy`, `220`)
    this.renderer.setAttribute(band15mph, `r`, `90`)
    this.renderer.setAttribute(band15mph, `id`, `band15mph`)
    this.renderer.setAttribute(band15mph, `fill`, bandFill)
    this.renderer.setAttribute(band15mph, `stroke`, bandStroke)

    const band10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10mph, `cx`, `200`)
    this.renderer.setAttribute(band10mph, `cy`, `220`)
    this.renderer.setAttribute(band10mph, `r`, `70`)
    this.renderer.setAttribute(band10mph, `id`, `band10mph`)
    this.renderer.setAttribute(band10mph, `fill`, bandFill)
    this.renderer.setAttribute(band10mph, `stroke`, bandStroke)

    const band5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5mph, `cx`, `200`)
    this.renderer.setAttribute(band5mph, `cy`, `220`)
    this.renderer.setAttribute(band5mph, `r`, `50`)
    this.renderer.setAttribute(band5mph, `id`, `band5mph`)
    this.renderer.setAttribute(band5mph, `fill`, bandFill)
    this.renderer.setAttribute(band5mph, `stroke`, bandStroke)

    /*
    * KPH circles.
    */

    const band40kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band40kph, `cx`, `200`)
    this.renderer.setAttribute(band40kph, `cy`, `220`)
    this.renderer.setAttribute(band40kph, `r`, `125`)
    this.renderer.setAttribute(band40kph, `id`, `band40kph`)
    this.renderer.setAttribute(band40kph, `fill`, bandFill)
    this.renderer.setAttribute(band40kph, `stroke`, bandStroke)

    const band30kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band30kph, `cx`, `200`)
    this.renderer.setAttribute(band30kph, `cy`, `220`)
    this.renderer.setAttribute(band30kph, `r`, `95`)
    this.renderer.setAttribute(band30kph, `id`, `band30kph`)
    this.renderer.setAttribute(band30kph, `fill`, bandFill)
    this.renderer.setAttribute(band30kph, `stroke`, bandStroke)

    const band20kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20kph, `cx`, `200`)
    this.renderer.setAttribute(band20kph, `cy`, `220`)
    this.renderer.setAttribute(band20kph, `r`, `65`)
    this.renderer.setAttribute(band20kph, `id`, `band20kph`)
    this.renderer.setAttribute(band20kph, `fill`, bandFill)
    this.renderer.setAttribute(band20kph, `stroke`, bandStroke)

    const band10kph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10kph, `cx`, `200`)
    this.renderer.setAttribute(band10kph, `cy`, `220`)
    this.renderer.setAttribute(band10kph, `r`, `35`)
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
    this.renderer.setAttribute(textN, `y`, `60`)
    textN.textContent = cardinalN

    const textS = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textS, `id`, `cardinalS`)
    this.renderer.setAttribute(textS, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textS, `x`, `195`)
    this.renderer.setAttribute(textS, `y`, `380`)
    textS.textContent = cardinalS

    const textE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textE, `id`, `cardinalE`)
    this.renderer.setAttribute(textE, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textE, `x`, `360`)
    this.renderer.setAttribute(textE, `y`, `220`)
    textE.textContent = cardinalE

    const textW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textW, `id`, `cardinalW`)
    this.renderer.setAttribute(textW, `dominant-baseline`, `middle`)
    this.renderer.setAttribute(textW, `x`, `26`)
    this.renderer.setAttribute(textW, `y`, `220`)
    textW.textContent = cardinalW

    const textNW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNW, `id`, `ordinalNW`)
    this.renderer.setAttribute(textNW, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNW, `x`, `65`)
    this.renderer.setAttribute(textNW, `y`, `105`)
    textNW.textContent = ordinalNW

    const textSW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSW, `id`, `ordinalSW`)
    this.renderer.setAttribute(textSW, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSW, `x`, `65`)
    this.renderer.setAttribute(textSW, `y`, `335`)
    textSW.textContent = ordinalSW

    const textNE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNE, `id`, `ordinalNE`)
    this.renderer.setAttribute(textNE, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNE, `x`, `310`)
    this.renderer.setAttribute(textNE, `y`, `105`)
    textNE.textContent = ordinalNE

    const textSE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSE, `id`, `ordinalSE`)
    this.renderer.setAttribute(textSE, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSE, `x`, `310`)
    this.renderer.setAttribute(textSE, `y`, `335`)
    textSE.textContent = ordinalSE

    const textTemp = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textTemp, `id`, `textTemp`)
    this.renderer.setAttribute(textTemp, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textTemp, `x`, `20`)
    this.renderer.setAttribute(textTemp, `y`, `15`)
    textTemp.textContent = temp + this.selectedTemperature

    const textHumidity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textHumidity, `id`, `textHumidity`)
    this.renderer.setAttribute(textHumidity, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textHumidity, `x`, `70`)
    this.renderer.setAttribute(textHumidity, `y`, `15`)
    textHumidity.textContent = humidity

    const textDescription = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDescription, `id`, `textDescription`)
    this.renderer.setAttribute(textDescription, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDescription, `x`, `230`)
    this.renderer.setAttribute(textDescription, `y`, `15`)
    textDescription.textContent = description

    const textLocale = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textLocale, `id`, `textLocale`)
    this.renderer.setAttribute(textLocale, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textLocale, `x`, `20`)
    this.renderer.setAttribute(textLocale, `y`, `410`)
    textLocale.textContent = place

    const textDownloadTime = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDownloadTime, `id`, `textDownloadTime`)
    this.renderer.setAttribute(textDownloadTime, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDownloadTime, `x`, `315`)
    this.renderer.setAttribute(textDownloadTime, `y`, `410`)
    textDownloadTime.textContent = downloadTime

    const textDownloadDate = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDownloadDate, `id`, `textDownloadDate`)
    this.renderer.setAttribute(textDownloadDate, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDownloadDate, `x`, `325`)
    this.renderer.setAttribute(textDownloadDate, `y`, `430`)
    textDownloadDate.textContent = downloadDate

    if (this.windSpeed !== 0) {

      if (windDeg >= 0 && windDeg <= 30) {
        this.renderer.setAttribute(textN, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `North`
      }
      if (windDeg >= 31 && windDeg <= 60) {
        this.renderer.setAttribute(textNE, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `Northeast`
      }
      if (windDeg >= 61 && windDeg <= 120) {
        this.renderer.setAttribute(textE, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `East`
      }
      if (windDeg >= 121 && windDeg <= 10) {
        this.renderer.setAttribute(textSE, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `Southeast`
      }
      if (windDeg >= 151 && windDeg <= 210) {
        this.renderer.setAttribute(textS, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `South`
      }
      if (windDeg >= 211 && windDeg <= 240) {
        this.renderer.setAttribute(textSW, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `Southwest`
      }
      if (windDeg >= 241 && windDeg <= 300) {
        this.renderer.setAttribute(textW, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `West`
      }
      if (windDeg >= 301 && windDeg <= 330) {
        this.renderer.setAttribute(textNW, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `Northwest`
      }
      if (windDeg >= 331 && windDeg <= 360) {
        this.renderer.setAttribute(textN, `font-weight`, `bold`)
        this.windDirectionOutputAlt = `North`
      }
    }

    /*
    * SVG elements that have small viewports lke wearables.
    */

    const displayAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
    this.renderer.setAttribute(displayAlt, `height`, `150`)
    this.renderer.setAttribute(displayAlt, `width`, `150`)
    this.renderer.setAttribute(displayAlt, `id`, this.altDisplay)
    this.renderer.setAttribute(displayAlt, `aria-label`, `Current Weather for ` + place)

    const textLocaleAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textLocaleAlt, `id`, `textLocaleAlt`)
    this.renderer.setAttribute(textLocaleAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textLocaleAlt, `x`, `20`)
    this.renderer.setAttribute(textLocaleAlt, `y`, `120`)
    textLocaleAlt.textContent = place

    const textDescriptionAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDescriptionAlt, `id`, `textDescriptionAlt`)
    this.renderer.setAttribute(textDescriptionAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDescriptionAlt, `x`, `20`)
    this.renderer.setAttribute(textDescriptionAlt, `y`, `100`)
    textDescriptionAlt.textContent = description

    const textHumidityAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textHumidityAlt, `id`, `textHumidityAlt`)
    this.renderer.setAttribute(textHumidityAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textHumidityAlt, `x`, `20`)
    this.renderer.setAttribute(textHumidityAlt, `y`, `80`)
    textHumidityAlt.textContent = humidity

    const textTempAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textTempAlt, `id`, `textTempAlt`)
    this.renderer.setAttribute(textTempAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textTempAlt, `x`, `20`)
    this.renderer.setAttribute(textTempAlt, `y`, `60`)
    textTempAlt.textContent = temp + this.selectedTemperature

    const textWindVelocityAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocityAlt, `id`, `textWindVelocityAlt`)
    this.renderer.setAttribute(textWindVelocityAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textWindVelocityAlt, `x`, `20`)
    this.renderer.setAttribute(textWindVelocityAlt, `y`, `40`)
    textWindVelocityAlt.textContent = this.windSpeed + this.selectedWindSpeed

    const textwindDirectionOutputAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textwindDirectionOutputAlt, `id`, `textwindDirectionOutputAlt`)
    this.renderer.setAttribute(textwindDirectionOutputAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textwindDirectionOutputAlt, `x`, `20`)
    this.renderer.setAttribute(textwindDirectionOutputAlt, `y`, `20`)
    textwindDirectionOutputAlt.textContent = this.windDirectionOutputAlt

    const textDownloadTimeAlt = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDownloadTimeAlt, `id`, `textDownloadTimeAlt`)
    this.renderer.setAttribute(textDownloadTimeAlt, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDownloadTimeAlt, `x`, `20`)
    this.renderer.setAttribute(textDownloadTimeAlt, `y`, `140`)
    textDownloadTimeAlt.textContent = downloadDateTime

    /*
    * These are for screen aria readers
    */

    const displayAria = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
    this.renderer.setAttribute(displayAria, `height`, `1`)
    this.renderer.setAttribute(displayAria, `width`, `1`)
    this.renderer.setAttribute(displayAria, `id`, this.ariaDisplay)
    this.renderer.setAttribute(displayAria, `aria-label`, `Current Weather for ` + place)

    const textLocaleAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textLocaleAria, `id`, `textLocaleAria`)
    this.renderer.setAttribute(textLocaleAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textLocaleAria, `x`, `20`)
    this.renderer.setAttribute(textLocaleAria, `y`, `120`)
    textLocaleAria.textContent = place

    const textDescriptionAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDescriptionAria, `id`, `textDescriptionAria`)
    this.renderer.setAttribute(textDescriptionAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDescriptionAria, `x`, `20`)
    this.renderer.setAttribute(textDescriptionAria, `y`, `100`)
    textDescriptionAria.textContent = description

    const textHumidityAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textHumidityAria, `id`, `textHumidityAria`)
    this.renderer.setAttribute(textHumidityAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textHumidityAria, `x`, `20`)
    this.renderer.setAttribute(textHumidityAria, `y`, `80`)
    textHumidityAria.textContent = humidity

    const textTempAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textTempAria, `id`, `textTempAria`)
    this.renderer.setAttribute(textTempAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textTempAria, `x`, `20`)
    this.renderer.setAttribute(textTempAria, `y`, `60`)
    textTempAria.textContent = temp + this.selectedTemperature

    const textWindVelocityAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocityAria, `id`, `textWindVelocityAria`)
    this.renderer.setAttribute(textWindVelocityAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textWindVelocityAria, `x`, `20`)
    this.renderer.setAttribute(textWindVelocityAria, `y`, `40`)
    textWindVelocityAria.textContent = this.windSpeed + this.selectedWindSpeed

    const textwindDirectionOutputAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textwindDirectionOutputAria, `id`, `textwindDirectionOutputAria`)
    this.renderer.setAttribute(textwindDirectionOutputAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textwindDirectionOutputAria, `x`, `20`)
    this.renderer.setAttribute(textwindDirectionOutputAria, `y`, `20`)
    textwindDirectionOutputAria.textContent = this.windDirectionOutputAlt

    const textDownloadTimeAria = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textDownloadTimeAria, `id`, `textDownloadTimeAria`)
    this.renderer.setAttribute(textDownloadTimeAria, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textDownloadTimeAria, `x`, `20`)
    this.renderer.setAttribute(textDownloadTimeAria, `y`, `140`)
    textDownloadTimeAria.textContent = downloadDateTime

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
    this.renderer.setAttribute(textWindVelocity, `y`, `220`)

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
    this.renderer.appendChild(infoGroup, textHumidity)
    this.renderer.appendChild(infoGroup, textLocale)
    this.renderer.appendChild(infoGroup, textDownloadTime)
    this.renderer.appendChild(infoGroup, textDownloadDate)
    this.renderer.appendChild(infoGroup, circle)

    this.renderer.appendChild(compass, bandGroup)
    this.renderer.appendChild(compass, infoGroup)

    this.renderer.appendChild(displayAria, textWindVelocityAria)
    this.renderer.appendChild(displayAria, textwindDirectionOutputAria)
    this.renderer.appendChild(displayAria, textTempAria)
    this.renderer.appendChild(displayAria, textHumidityAria)
    this.renderer.appendChild(displayAria, textDescriptionAria)
    this.renderer.appendChild(displayAria, textLocaleAria)
    this.renderer.appendChild(displayAria, textDownloadTimeAria)


    this.renderer.appendChild(displayAlt, textWindVelocityAlt)
    this.renderer.appendChild(displayAlt, textwindDirectionOutputAlt)
    this.renderer.appendChild(displayAlt, textTempAlt)
    this.renderer.appendChild(displayAlt, textHumidityAlt)
    this.renderer.appendChild(displayAlt, textDescriptionAlt)
    this.renderer.appendChild(displayAlt, textLocaleAlt)
    this.renderer.appendChild(displayAlt, textDownloadTimeAlt)

    if (this.getScreenWidth >= 380) {
      this.renderer.appendChild(this.container.nativeElement, compass)

      /*
      * Below will not appear on screen but has Aria Label. Aria is told to ignore the above.
      */

      this.renderer.appendChild(this.container.nativeElement, displayAria)
    }


    if (this.getScreenWidth < 380) {
      this.renderer.appendChild(this.container.nativeElement, displayAlt)
    }

  }

  getMeasurementChoice() {

    const imperialMetricChoice = localStorage.getItem('imperialMetricChoice')

    const imperialMetricChoiceStorageParsed = JSON.parse(imperialMetricChoice)

    const measurementChoice: any = imperialMetricChoiceStorageParsed.imperialMetric.choice

    return measurementChoice

  }

  getDate() {

    const updateTime = localStorage.getItem('time')

    const updateTimetStorageParsed = JSON.parse(updateTime)

    const downloadTime: any = updateTimetStorageParsed.timestamp

    const dateOutput = new Date(downloadTime).toLocaleDateString([], { day: `numeric`, month: `short` })

    return dateOutput

  }

  getTime() {

    const updateTime = localStorage.getItem('time')

    const updateTimetStorageParsed = JSON.parse(updateTime)

    const downloadTime: any = updateTimetStorageParsed.timestamp

    const timeOutput = new Date(downloadTime).toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` })

    return timeOutput.toLowerCase()

  }

  getDateTime() {

    const updateTime = localStorage.getItem('time')

    const updateTimetStorageParsed = JSON.parse(updateTime)

    const downloadTime: any = updateTimetStorageParsed.timestamp

    const dateOutput = new Date(downloadTime).toLocaleDateString([], { day: `numeric`, month: `short` })

    const timeOutput = new Date(downloadTime).toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` })

    return dateOutput + ` ` + timeOutput.toLowerCase()

  }

  updateWeather() {
    if (this.getScreenWidth >= 380) {
      this.removeWeatherDisplay()
      this.removeWeatherDisplayAria()

    }
    if (this.getScreenWidth < 380) {
      this.removeWeatherDisplayAlt()
    }
    this.getWeather()
  }

  /*
  * This gets the latitude and longitude from the device.
  */

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          console.log(`Latitude: ` + position.coords.latitude +
            `Longitude: ` + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
        }
      },
        (error: GeolocationPositionError) => console.log(error))
    } else {
      alert(`Geolocation is not available on this device. \n\rPlease go to "Settings" and enter a location.`)
    }
  }

}
