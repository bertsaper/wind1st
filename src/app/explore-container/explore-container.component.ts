import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
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
export class ExploreContainerComponent implements OnInit {
  SearchPlacesForm: NgForm;
  public shippingAddress: string;


  apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient, @Inject(DOCUMENT) private document: Document, private renderer2: Renderer2) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + googleMapsKey + '', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  ngOnInit() {

    this.loadAutoComplete();

  }

  private loadAutoComplete() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsKey+ '&libraries=places&v=weekly';
    this.loadScript(url).then(() => this.initAutocomplete());
  }
  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }
  initAutocomplete() {
    const input = document.getElementById("txtSearchPlaces") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "icon",
      "name"
    ]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert('No details available for input:' + input.value);
        return;
      } else {
        return;
      }
    });
  }

}


