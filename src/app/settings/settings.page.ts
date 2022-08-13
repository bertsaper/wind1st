/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NavigationEnd, Router } from '@angular/router'



@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})



export class SettingsPage {
  ifNoLocationNavTo = `/weather`

  apiLoaded: Observable<boolean>;
  constructor(
    public router: Router,
  ) { }

  updateWeather() {

    this.router.navigate([this.ifNoLocationNavTo])
  }
}

