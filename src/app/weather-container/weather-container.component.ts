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

    let windSpeed = Math.round(weatherNowStringOutParsed.wind.speed)

    let temp = weatherNowStringOutParsed.main.temp

    const CardinalN: string = `N`
    const CardinalS: string = `S`
    const CardinalE: string = `E`
    const CardinalW: string = `W`

    const OrdinalNE: string = `NE`
    const OrdinalSE: string = `SE`
    const OrdinalNW: string = `NW`
    const OrdinalSW: string = `SW`

    const label05mph: string = `5 mph`
    const label10mph: string = `10 mph`
    const label15mph: string = `15 mph`
    const label20mph: string = `20 mph`
    const label25mph: string = `25 mph`
    const label30mph: string = `30+ mph`



    // let windDirectionRounded: string

    // if (windDeg >= 0 && windDeg <= 30) {
    //   windDirectionRounded = CardinalN
    // }

    // if (windDeg >= 31 && windDeg <= 60) {
    //   windDirectionRounded = OrdinalNE
    // }

    // if (windDeg >= 61 && windDeg <= 120) {
    //   windDirectionRounded = CardinalE
    // }

    // if (windDeg >= 121 && windDeg <= 150) {
    //   windDirectionRounded = OrdinalSE
    // }

    // if (windDeg >= 151 && windDeg <= 210) {
    //   windDirectionRounded = CardinalS
    // }

    // if (windDeg >= 211 && windDeg <= 240) {
    //   windDirectionRounded = OrdinalSW
    // }

    // if (windDeg >= 241 && windDeg <= 300) {
    //   windDirectionRounded = CardinalW
    // }

    // if (windDeg >= 301 && windDeg <= 330) {
    //   windDirectionRounded = OrdinalNW
    // }

    // if (windDeg >= 331 && windDeg <= 360) {
    //   windDirectionRounded = CardinalN
    // }


    const svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    this.renderer.setAttribute(svg, `height`, `320`)
    this.renderer.setAttribute(svg, `width`, `320`)
    this.renderer.setAttribute(svg, `id`, `WindInfo`)

    const InfoGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
    this.renderer.setAttribute(InfoGroup, `height`, `320`)
    this.renderer.setAttribute(InfoGroup, `width`, `320`)
    this.renderer.setAttribute(InfoGroup, `id`, `InfoGroup`)

    // 29 needs to be just unerd 100
    let windScalerFirstLast: any = 178 + (windSpeed * 4)
    let windScalerSecondThird: any = 158 + (windSpeed * 4)

    if (windSpeed != 0) {
      const path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`)
      if (windSpeed >= 30) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,298 145,278 155,278 150,298 `)
      }

      if (windSpeed >= 6 && windSpeed <= 29) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,` + windScalerFirstLast + ` 155,` + windScalerSecondThird + ` 145,` + windScalerSecondThird + ` 150,` + windScalerFirstLast)
      }

      if (windSpeed >= 1 && windSpeed <= 5) {
        this.renderer.setAttribute(path, `d`, `M 150,150 150,198 145,178 155,178 150,198 `)
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

    const band25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band25mph, `cx`, `150`)
    this.renderer.setAttribute(band25mph, `cy`, `150`)
    this.renderer.setAttribute(band25mph, `r`, `130`)
    this.renderer.setAttribute(band25mph, `id`, `band25mph`)
    this.renderer.setAttribute(band25mph, `fill`, BandFill)
    this.renderer.setAttribute(band25mph, `stroke`, `gray`)


    const band20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band20mph, `cx`, `150`)
    this.renderer.setAttribute(band20mph, `cy`, `150`)
    this.renderer.setAttribute(band20mph, `r`, `110`)
    this.renderer.setAttribute(band20mph, `id`, `band20mph`)
    this.renderer.setAttribute(band20mph, `fill`, BandFill)
    this.renderer.setAttribute(band20mph, `stroke`, `gray`)


    const band15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band15mph, `cx`, `150`)
    this.renderer.setAttribute(band15mph, `cy`, `150`)
    this.renderer.setAttribute(band15mph, `r`, `90`)
    this.renderer.setAttribute(band15mph, `id`, `band15mph`)
    this.renderer.setAttribute(band15mph, `fill`, BandFill)
    this.renderer.setAttribute(band15mph, `stroke`, `gray`)


    const band10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band10mph, `cx`, `150`)
    this.renderer.setAttribute(band10mph, `cy`, `150`)
    this.renderer.setAttribute(band10mph, `r`, `70`)
    this.renderer.setAttribute(band10mph, `id`, `band10mph`)
    this.renderer.setAttribute(band10mph, `fill`, BandFill)
    this.renderer.setAttribute(band10mph, `stroke`, `gray`)

    const band5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `circle`)
    this.renderer.setAttribute(band5mph, `cx`, `150`)
    this.renderer.setAttribute(band5mph, `cy`, `150`)
    this.renderer.setAttribute(band5mph, `r`, `50`)
    this.renderer.setAttribute(band5mph, `id`, `band5mph`)
    this.renderer.setAttribute(band5mph, `fill`, BandFill)
    this.renderer.setAttribute(band5mph, `stroke`, `gray`)

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
    this.renderer.setAttribute(textW, `x`, `-25`)
    this.renderer.setAttribute(textW, `y`, `150`)
    textW.textContent = CardinalW

    const textNW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNW, `id`, `OrdinalNW`)
    this.renderer.setAttribute(textNW, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNW, `x`, `15`)
    this.renderer.setAttribute(textNW, `y`, `35`)    
    textNW.textContent = OrdinalNW

    const textSW = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSW, `id`, `OrdinalSW`)
    this.renderer.setAttribute(textSW, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSW, `x`, `15`)
    this.renderer.setAttribute(textSW, `y`, `265`)    
    textSW.textContent = OrdinalSW  

    const textNE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textNE, `id`, `OrdinalNE`)
    this.renderer.setAttribute(textNE, `dominant-baseline`, `baseline`)
    this.renderer.setAttribute(textNE, `x`, `260`)
    this.renderer.setAttribute(textNE, `y`, `35`)    
    textNE.textContent = OrdinalNE

    const textSE = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textSE, `id`, `OrdinalSE`)
    this.renderer.setAttribute(textSE, `dominant-baseline`, `hanging`)
    this.renderer.setAttribute(textSE, `x`, `260`)
    this.renderer.setAttribute(textSE, `y`, `265`) 
  
    textSE.textContent = OrdinalSE  
    
    
    // let windDirectionRounded: string

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
      this.renderer.setAttribute(textW, `fill`, `red`)
    }




    /*
        const Legend5mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend5mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend5mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend5mph, `x`, `165`)
        this.renderer.setAttribute(Legend5mph, `y`, `150`)
        this.renderer.setAttribute(Legend5mph, `font-size`, `0.75rem`)
        Legend5mph.textContent = label05mph
    
        const Legend10mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend10mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend10mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend10mph, `x`, `165`)
        this.renderer.setAttribute(Legend10mph, `y`, `150`)
        this.renderer.setAttribute(Legend10mph, `font-size`, `0.75rem`)
        Legend10mph.textContent = label10mph
    
        const Legend15mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend15mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend15mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend15mph, `x`, `195`)
        this.renderer.setAttribute(Legend15mph, `y`, `150`)
        this.renderer.setAttribute(Legend15mph, `font-size`, `0.75rem`)
        Legend15mph.textContent = label15mph
    
        const Legend20mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend20mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend20mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend20mph, `x`, `165`)
        this.renderer.setAttribute(Legend20mph, `y`, `150`)
        this.renderer.setAttribute(Legend20mph, `font-size`, `0.75rem`)
        Legend20mph.textContent = label20mph
    
        const Legend25mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend25mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend25mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend25mph, `x`, `165`)
        this.renderer.setAttribute(Legend25mph, `y`, `150`)
        this.renderer.setAttribute(Legend25mph, `font-size`, `0.75rem`)
        Legend25mph.textContent = label25mph
    
        const Legend30mph = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
        this.renderer.setAttribute(Legend30mph, `id`, `CardinalW`)
        this.renderer.setAttribute(Legend30mph, `dominant-baseline`, `middle`)
        this.renderer.setAttribute(Legend30mph, `x`, `165`)
        this.renderer.setAttribute(Legend30mph, `y`, `150`)
        this.renderer.setAttribute(Legend30mph, `font-size`, `0.75rem`)
        Legend30mph.textContent = label30mph    
    */


    let textWindVelocity = document.createElementNS(`http://www.w3.org/2000/svg`, `text`)
    this.renderer.setAttribute(textWindVelocity, `id`, `WindVelocity`)
    if (windSpeed > 0) {
    //  textWindVelocity.textContent = windDirectionRounded + ` ` + windSpeed.toString() + ` mph`
    textWindVelocity.textContent = windSpeed.toString() + ` mph`
    }

    if (windSpeed == 0) {
      textWindVelocity.textContent = `No Wind`
    }
    this.renderer.setAttribute(textWindVelocity, `dominant-baseline`, `baseline`)

    if (windDeg <= 170) {
      this.renderer.setAttribute(textWindVelocity, `x`, `155`)
    }

    if (windDeg >= 169) {
      this.renderer.setAttribute(textWindVelocity, `x`, `90`)
    }

    this.renderer.setAttribute(textWindVelocity, `y`, `150`)

    this.renderer.appendChild(InfoGroup, textWindVelocity)
    /*
        const bandGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
        this.renderer.setAttribute(bandGroup, `height`, `320`)
        this.renderer.setAttribute(bandGroup, `width`, `320`)
        this.renderer.setAttribute(bandGroup, `id`, `BandGroup`)
    
        const legentGroup = document.createElementNS(`http://www.w3.org/2000/svg`, `g`)
        this.renderer.setAttribute(legentGroup, `height`, `320`)
        this.renderer.setAttribute(legentGroup, `width`, `320`)
        this.renderer.setAttribute(legentGroup, `id`, `LegendGroup`)
    
    
        if (windSpeed >= 30) {
          this.renderer.appendChild(legentGroup, Legend30mph)
          this.renderer.appendChild(bandGroup, band25mph)
        }
        if (windSpeed >= 25 && windSpeed <= 29) {
          this.renderer.appendChild(legentGroup, Legend25mph)
          this.renderer.appendChild(bandGroup, band25mph)
        }
    
        if (windSpeed >= 16 && windSpeed <= 20) {
          this.renderer.appendChild(legentGroup, Legend20mph)
          this.renderer.appendChild(bandGroup, band20mph)
        }
    
        if (windSpeed >= 11 && windSpeed <= 15) {
          this.renderer.appendChild(legentGroup, Legend15mph)
          this.renderer.appendChild(bandGroup, band15mph)
        }
    
        if (windSpeed >= 6 && windSpeed <= 10) {
          this.renderer.appendChild(legentGroup, Legend10mph)
          this.renderer.appendChild(bandGroup, band10mph)
        }
    
        if (windSpeed >= 1 && windSpeed <= 5) {
          this.renderer.appendChild(legentGroup, Legend5mph)
          this.renderer.appendChild(bandGroup, band5mph)
        } */
    this.renderer.appendChild(InfoGroup, textN)
    this.renderer.appendChild(InfoGroup, textS)
    this.renderer.appendChild(InfoGroup, textE)
    this.renderer.appendChild(InfoGroup, textW)
    this.renderer.appendChild(InfoGroup, textNW) 
    this.renderer.appendChild(InfoGroup, textSW)  
    this.renderer.appendChild(InfoGroup, textNE) 
    this.renderer.appendChild(InfoGroup, textSE)   
    
    this.renderer.appendChild(InfoGroup, circle)


    // this.renderer.appendChild(svg, bandGroup)
    this.renderer.appendChild(svg, InfoGroup)
    // this.renderer.appendChild(svg, legentGroup)

    this.renderer.appendChild(this.container.nativeElement, svg)


  }

}
