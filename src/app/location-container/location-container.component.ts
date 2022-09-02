/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NgForm, FormBuilder } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

/*
* Google Palces Autocomplete info from
* https://www.thecodehubs.com/integrate-google-map-places-autocomplete-in-angular/
*/

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
  deviceLocation: any
  public input
  selectedItem = `deviceLocation`
  enteredLocation: boolean

  apiLoaded: Observable<boolean>

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadAutoComplete()
  }

  private loadAutoComplete() {

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

  public rbDeviceLocationSelection = [
    { name: `Device Location`, value: `deviceLocation` },
    { name: `Enter Location`, value: `enteredLocation` }
  ]

  initAutocomplete() {
    this.input = document.getElementById(`txtSearchPlaces`) as HTMLInputElement
    const autocomplete = new google.maps.places.Autocomplete(this.input)

    /*
    * Sometimes Google sends lat or lng with trailing whitespace.
    * Changing the number to a string then trimming might prevent crashes.
    */

    autocomplete.addListener(`place_changed`, () => {
      const place = autocomplete.getPlace()
      const placeLat = place.geometry.location.lat().toString()
      const placeLng = place.geometry.location.lng().toString()

      localStorage.setItem(`weatherLocation`,
        `{"location":{"lat":"` + placeLat.trim() + `", "lng":"` + placeLng.trim() + `"}}`)
      if (!place) {

        /*
        * User entered the name of a Place that was not suggested and
        * pressed the Enter key, or the Place Details request failed.
        */

        alert(`No details available for input:` + this.input.value)
        return
      } else {
        // setTimeout(() => { this.clearTheForm() }, 5000)
        return
      }
    });
    autocomplete.setFields([
      `geometry`
    ])
  }

  clearTheForm() {
    this.input.value = ``
  }

  locationPreference(value) {

    if (value === `enteredLocation`) {
      this.enteredLocation = true
    }

    if (value === `deviceLocation`) {
      this.clearTheForm()
      this.enteredLocation = false
      localStorage.setItem(`weatherLocation`, `{"location":{"lat":"useDevice", "lng":"useDevice"}}`)
    }
  }
}
