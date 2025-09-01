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

export class LocationContainerComponent implements OnInit {

  searchPlacesForm: NgForm;



  public address: string;

  deviceLocation: any

  public input

  selectedItem: any = `deviceLocation`

  enteredLocation: boolean

  txtSearchPlaces = `txtSearchPlaces`

  settingsHolder = `settingsHolder`

  apiLoaded: Observable<boolean> = of(false);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.apiLoaded = of(false); // Initial state
    this.loadAutoComplete();


    localStorage.setItem(`weatherLocation`, `{"location":{"lat":"useDevice", "lng":"useDevice"}}`)

    /*
    * places the text entry into view when keyboard appears
    */

    window.addEventListener('resize', (() => {
      const el = document.getElementById(this.settingsHolder)
     // el.scrollIntoView({ behavior: `smooth` })
    }))
  }

  
private loadAutoComplete() {
  // Check if Google Maps API is already loaded
  if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    console.log('Google Maps API already loaded, initializing autocomplete');
    this.initAutocomplete();
    this.apiLoaded = of(true);
    return;
  }

  // Load the Google Maps script
  const url = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
  this.loadScript(url)
    .then(() => {
      console.log('Google Maps script loaded successfully');
      // Wait briefly to ensure the API is fully initialized
      setTimeout(() => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          this.initAutocomplete();
          this.apiLoaded = of(true);
        } else {
          console.error('Google Maps API not available after loading script.');
          this.apiLoaded = of(false);
        }
      }, 100); // Small delay to ensure API is ready
    })
    .catch((error) => {
      console.error('Error loading Google Maps script:', error);
      this.apiLoaded = of(false);
    });
}

// private loadAutoComplete() {
//   // Check if Google Maps API is already loaded
//   if (typeof google !== 'undefined' && google.maps && google.maps.places) {
//     console.log('Google Maps API already loaded, initializing autocomplete');
//     this.initAutocomplete();
//     this.apiLoaded = of(true);
//     return;
//   }

//   // Load the Google Maps script
//   const url = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
//   this.loadScript(url)
//     .then(() => {
//       console.log('Google Maps script loaded successfully');
//       this.initAutocomplete();
//       this.apiLoaded = of(true);
//     })
//     .catch((error) => {
//       console.error('Error loading Google Maps script:', error);
//       this.apiLoaded = of(false);
//     });
// }

initAutocomplete() {
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
    console.error('Google Maps API not available. Ensure the script loaded correctly.');
    return;
  }

  // Get the input element
  this.input = document.getElementById(this.txtSearchPlaces) as HTMLInputElement;
  if (!this.input) {
    console.error('Input element with ID "txtSearchPlaces" not found.');
    return;
  }

  // Initialize Google Places Autocomplete
  const autocomplete = new google.maps.places.Autocomplete(this.input);

  // Set fields to retrieve (only geometry for lat/lng)
  autocomplete.setFields(['geometry']);

  // Add listener for place selection
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    // Check if place and geometry are valid
    if (!place || !place.geometry || !place.geometry.location) {
      console.warn(`No details available for input: ${this.input.value}`);
      alert(`No details available for input: ${this.input.value}`);
      return;
    }

    // Get latitude and longitude, convert to string and trim
    const placeLat = place.geometry.location.lat().toString().trim();
    const placeLng = place.geometry.location.lng().toString().trim();

    // Store location in localStorage
    localStorage.setItem(
      'weatherLocation',
      JSON.stringify({ location: { lat: placeLat, lng: placeLng } })
    );

    // Optionally clear the form after selection
    // setTimeout(() => { this.clearTheForm(); }, 5000);
  });
}


  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = url + '&loading=async';

      // Add onload and onerror to handle resolution
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      this.renderer2.appendChild(this.document.head, script);
      console.log('Google Maps script appended:', script);
    });
  }

  public rbDeviceLocationSelection = [
    { name: `Device Location`, value: `deviceLocation` },
    { name: `Enter Location`, value: `enteredLocation` }
  ]









  clearTheForm() {
    // Correct handling based on actual usage
    this.enteredLocation = false; // Accurately represent the control flow
    this.address = ''; // Reset address field

    // Only attempt to set values on objects
    if (this.selectedItem && typeof this.selectedItem === 'object') {
      this.selectedItem.value = '';
    }
  }



  locationPreference(value: any) {

    if (typeof value === 'string' && value === `enteredLocation`) {
      this.enteredLocation = true
    }

    if (typeof value === 'string' && value === `deviceLocation`) {
      this.clearTheForm()
      this.enteredLocation = false
      localStorage.setItem(`weatherLocation`, `{"location":{"lat":"useDevice", "lng":"useDevice"}}`)
    }
  }


}
