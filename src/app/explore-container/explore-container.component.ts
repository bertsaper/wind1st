import { Component, OnInit, Input } from '@angular/core';

import { environment } from 'src/environments/environment'; // src\environments


import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


const googleMapsKey = environment.google_maps_api_key

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  
  @Input() name: string;

  apiLoaded: Observable<boolean>;
  
  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + googleMapsKey + '', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
      }

  ngOnInit() {
    
  }

}


