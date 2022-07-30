/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';



@Component({
  selector: 'app-imperial-metric-container',
  templateUrl: './imperial-metric-container.component.html',
  styleUrls: ['./imperial-metric-container.component.scss'],
})
export default class ImperialMetricContainerComponent implements OnInit {
  imperialMetricChoice = localStorage.getItem('imperialMetricChoice');
  recordData = `imperial`
  selectedItem = `imperial`

  constructor() { }

  ngOnInit() {
    if (this.imperialMetricChoice === null) {
      localStorage.setItem(`imperialMetricChoice`, `{"imperialMetric":{"choice": "imperial"}}`)
    }

    const imperialMetricChoiceStorageParsed = JSON.parse(this.imperialMetricChoice)

    const measurementChoice: any = imperialMetricChoiceStorageParsed.imperialMetric.choice
    this.selectedItem = measurementChoice
  }



  public rbImperialMetricSelection = [
    { name: `Imperial`, value: `imperial` },
    { name: `Metric`, value: `metric` }
  ];

  show(value) {
    // console.log(this.value)
    console.log(this.recordData)
  }

  onItemChange(value) {
    localStorage.setItem(`imperialMetricChoice`, `{"imperialMetric":{"choice": "` + value + `"}}`)
    console.log(` Value is : `, value);
  }
}
