import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

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

  constructor(private _http: HttpClient,
    public router: Router,) { }


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
      })

    }
    catch (error) { }

  }

  ngAfterViewInit() {  // the intention is to process the list after it's loaded

    this.doughnutChartMethod()

  }

  doughnutChartMethod() {

     const weatherNowStringOut = localStorage.getItem(`currentWeather`)


    const weatherNowStringOutParsed = JSON.parse(weatherNowStringOut)


    console.log(`current weather`, weatherNowStringOutParsed.wind.deg)


    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
        datasets: [{
          label: '# of Votes',
          data: [50, 29, 15, 10, 7],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      }
    });
  }

}

