/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { environment } from 'src/environments/environment';


import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// autocomplete from  https://www.thecodehubs.com/integrate-google-map-places-autocomplete-in-angular/

declare const google;
const googleMapsKey = environment.google_maps_api_key

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export default class ExploreContainerComponent implements OnInit {

  showData = false
  selectedItem = 'false'


  // selections: string[] = [`Imperial`, `Metric`]
  // form: FormGroup = new FormGroup({});

  searchPlacesForm: NgForm;
  public address: string;

  // isSubmitted = false;

  apiLoaded: Observable<boolean>

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private fb: FormBuilder
  ) {
    // this.form = fb.group({
    //   measurementSelectionField: ['', [Validators.required]],
    // })
  }

  ngOnInit() {
    this.loadAutoComplete()
  }

  private loadAutoComplete() {
    // const url = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsKey+ '&libraries=places&v=weekly';
    const url = `https://maps.googleapis.com/maps/api/js?key=` + googleMapsKey + `&libraries=places&v=weekly`;

    this.loadScript(url).then(() => this.initAutocomplete())
  }
  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script')
      script.type = `text/javascript`
      script.src = url
      script.text = ``
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = reject
      this.renderer2.appendChild(this.document.head, script)
    })
  }
  initAutocomplete() {
    const input = document.getElementById(`txtSearchPlaces`) as HTMLInputElement
    const autocomplete = new google.maps.places.Autocomplete(input)

    autocomplete.addListener(`place_changed`, () => {
      const place = autocomplete.getPlace()

      // console.log(place.geometry.location.lat())
      // console.log(place.geometry.location.lng())

      localStorage.setItem(`weatherLocation`,
        `{"location":{"lat": "` + place.geometry.location.lat() + `", "lng": "` + place.geometry.location.lng() + `"}}`)
      if (!place) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert(`No details available for input:` + input.value)
        return
      } else {
        return
      }
    });
    autocomplete.setFields([
      `geometry`
    ])
  }

  // submitForm(form: NgForm) {
  //   this.isSubmitted = true;
  //   if (!form.valid) {
  //     return false;
  //   } else {
  //     alert(JSON.stringify(form.value))
  //   }
  // }

  // templateForm(value: any) {
  //   alert(JSON.stringify(value));
  // }


  // get f() {
  //   return this.form.controls;
  // }

  // submit() {
  //   console.log(this.form.value);
  // }

  public rbImperialMetricSelection = [
    { name: `Imperial`, value: `false` },
    { name: `Metric`, value: `true` }
  ];

  show(value) {
    if (value !== `true`) {
      this.showData = true
    }
  }
}
