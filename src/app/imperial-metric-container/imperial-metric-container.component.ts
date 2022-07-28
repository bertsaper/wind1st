/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-imperial-metric-container',
  templateUrl: './imperial-metric-container.component.html',
  styleUrls: ['./imperial-metric-container.component.scss'],
})
export default class ImperialMetricContainerComponent implements OnInit {

  recordData = `imperial`
  selectedItem = `imperial`

  constructor() { }

  ngOnInit() {
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
    console.log(` Value is : `, value);
  }
}
