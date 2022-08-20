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
const googleMapsKey = environment.googleMapsApiKey

@Component({
  selector: 'app-location-container',
  templateUrl: './location-container.component.html',
  styleUrls: ['./location-container.component.scss'],
})
export default class LocationContainerComponent implements OnInit {

  searchPlacesForm: NgForm;
  public address: string;



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
    '&libraries=places&v=weekly';
    const url = `https://maps.googleapis.com/maps/api/js?key=` + googleMapsKey + `&libraries=places&v=weekly`;

    this.loadScript(url).then(() => this.initAutocomplete())
  }

  /*
  * Google Palces Autocomplete info from
  * https://www.thecodehubs.com/integrate-google-map-places-autocomplete-in-angular/
  */

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

      localStorage.setItem(`weatherLocation`,
        `{"location":{"lat": "` + place.geometry.location.lat() + `", "lng": "` + place.geometry.location.lng() + `"}}`)
      if (!place) {

        /* User entered the name of a Place that was not suggested and
        * pressed the Enter key, or the Place Details request failed.
        */

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


}
