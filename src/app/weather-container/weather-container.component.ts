/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */

import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core'

import { environment } from 'src/environments/environment'

import { NavigationEnd, Router } from '@angular/router'

import { HttpClient } from '@angular/common/http'

import { WeatherSvgService } from 'src/app/weather/services/weather-svg.service';

@Component({
  selector: 'app-weather-container',
  templateUrl: './weather-container.component.html',
  styleUrls: ['./weather-container.component.scss'],
})

export class ExploreContainerComponent implements OnInit {

    constructor(
    private http: HttpClient,
    public router: Router,
    private renderer: Renderer2,
    private WeatherSvgService: WeatherSvgService,
  ) { }

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

  useDeviceIsSet: boolean

  locationUnavailable = false

  updateFailed = false

  showPleaseWait = true

  /*
  * Needed for Imperial / Metric Selection
  */

  imperialMetricChoice: string

  selectedWindSpeed: string

  selectedTemperature: string

  fromHome = `/`

  locationSettings = `/settings`

  displayLocation = `/weather`

  weatherDisplay = `windInfo`

  altDisplay = `displayAlt`

  ariaDisplay = `displayAria`

  loadingDiv = `loadingDiv`

  updateButtonToggle = false

  @ViewChild(`svgWindPointer`) container: ElementRef;

  ngOnInit() {
    this.getLocation()

    if (localStorage.getItem(this.weatherLocationStorage) === null) {
      this.updateFailed = false
      this.updateButtonToggle = false
    }

    this.getScreenWidth = window.innerWidth

    this.onDisplay()
  }

  onDisplay() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === this.displayLocation) {
          if (this.getScreenWidth >= 380) {
            this.removeWeatherDisplay()
            this.removeWeatherDisplayAria()
          }

          if (this.getScreenWidth < 380) {
            this.removeWeatherDisplayAlt()
          }
          this.updateButtonToggle = false

          setTimeout(() => { this.getWeather() }, 2250)
        }

        if (event.url === this.fromHome) {
          this.router.navigate([this.locationSettings])
        }

        if (event.url === this.locationSettings) {
          this.updateButtonToggle = false
        }

      }
    })
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
    this.updateButtonToggle = false
    this.updateFailed = false

    try {
      const measurementChoice = this.getMeasurementChoice()
      const weatherLocationStorage = localStorage.getItem(this.weatherLocationStorage)
      const weatherLocationStorageParsed = JSON.parse(weatherLocationStorage)
      const openWeatherAddress = environment.openWeatherAddress

      const latString = `lat=`
      const lonString = `&lon=`

      if (weatherLocationStorageParsed.location.lat !== `useDevice`) {
        this.lati = weatherLocationStorageParsed.location.lat
        this.long = weatherLocationStorageParsed.location.lng
        this.useDeviceIsSet = false
      }

      if (weatherLocationStorageParsed.location.lat === `useDevice`) {
        this.useDeviceIsSet = true

        if (this.lng !== `undefined`) {
          this.long = this.lng
        }

        if (this.lat !== `undefined`) {
          this.lati = this.lat
        }
      }

      const openWeatherKey: string = environment.openWeatherKey
      const unitSelecton: string = `&units=` + measurementChoice
      const resString: string = openWeatherAddress + latString + this.lati + lonString + this.long +
        unitSelecton + openWeatherKey

      this.http.get(resString).subscribe({
        next: (res) => { this.weatherNow = res },
        error: (err) => {
          this.updateFailed = true
          this.updateButtonToggle = true
        },
        complete: () => {
          this.weatherNowString = JSON.stringify(this.weatherNow)
          localStorage.setItem(this.currentWeatherStorage, this.weatherNowString)
          this.weatherTimeStamp = { timestamp: new Date().getTime() }
          localStorage.setItem(`time`, JSON.stringify(this.weatherTimeStamp))
          this.chartMethod()
        }
      })
    } catch (error) {
      this.router.navigate([this.locationSettings])
    }
  }

  chartMethod() {
    
    this.showPleaseWait = false

    const imperialMetricChoice = this.getMeasurementChoice();
    const downloadDate = this.getDate();
    const downloadTime = this.getTime();
    const downloadDateTime = this.getDateTime();

    if (imperialMetricChoice === 'imperial') {
      this.selectedWindSpeed = ' mph';
      this.selectedTemperature = ' f';
    }
    if (imperialMetricChoice === 'metric') {
      this.selectedWindSpeed = ' kph';
      this.selectedTemperature = ' c';
    }

    const weatherNowStringOut = localStorage.getItem(this.currentWeatherStorage);
    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut);

    this.windSpeed = imperialMetricChoice === 'imperial'
      ? Math.round(weatherNowStringOutParsed.wind.speed)
      : Math.round(weatherNowStringOutParsed.wind.speed * 3.6);

    this.windDirectionOutputAlt = this.WeatherSvgService.getWindDirection(
      weatherNowStringOutParsed.wind.deg
    );

    this.WeatherSvgService.buildWeatherSvg(
      this.container.nativeElement,
      weatherNowStringOutParsed,
      imperialMetricChoice,
      this.selectedWindSpeed,
      this.selectedTemperature,
      downloadDate,
      downloadTime,
      downloadDateTime,
      this.getScreenWidth,
      this.weatherDisplay,
      this.altDisplay,
      this.ariaDisplay,
      this.locationSettings
    );
    

  }

  getMeasurementChoice() {
    const imperialMetricChoice = localStorage.getItem(`imperialMetricChoice`)
    const imperialMetricChoiceStorageParsed = JSON.parse(imperialMetricChoice)
    const measurementChoice: any = imperialMetricChoiceStorageParsed.imperialMetric.choice
    return measurementChoice
  }

  getDate() {
    const updateTime = localStorage.getItem(`time`)
    const updateTimetStorageParsed = JSON.parse(updateTime)
    const downloadTime: any = updateTimetStorageParsed.timestamp
    const dateOutput = new Date(downloadTime).toLocaleDateString([], { day: `numeric`, month: `short` })
    return dateOutput
  }

  getTime() {
    const updateTime = localStorage.getItem(`time`)
    const updateTimetStorageParsed = JSON.parse(updateTime)
    const downloadTime: any = updateTimetStorageParsed.timestamp
    const timeOutput = new Date(downloadTime).toLocaleTimeString([], { hour: `numeric`, minute: `2-digit` })
    return timeOutput.toLowerCase()
  }

  getDateTime() {
    const updateTime = localStorage.getItem(`time`)
    const updateTimetStorageParsed = JSON.parse(updateTime)
    const downloadTime: any = updateTimetStorageParsed.timestamp
    const dateOutput = new Date(downloadTime).toLocaleDateString([], { day: `numeric`, month: `short` })
    const timeOutput = new Date(downloadTime).toLocaleTimeString([], { hour: `numeric`, minute: `2-digit` })
    return dateOutput + ` ` + timeOutput.toLowerCase()
  }

  updateWeather() {

    this.updateFailed = false
    this.updateButtonToggle = false
    this.getLocation()

    if (this.getScreenWidth >= 380) {
      this.removeWeatherDisplay()
      this.removeWeatherDisplayAria()
    }

    if (this.getScreenWidth < 380) {
      this.removeWeatherDisplayAlt()
    }

    if (this.useDeviceIsSet && !this.locationUnavailable) {
      setTimeout(() => { this.getWeather() }, 2250)
    }

    if (!this.useDeviceIsSet) {
      this.getWeather()
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude
        }
      },
        (error: GeolocationPositionError) => {
          if (!this.locationUnavailable) {
            alert(`Device location is not available.\n\rPlease enable or enter a location.`)
            this.locationUnavailable = true
          }
        })
    }
  }
}