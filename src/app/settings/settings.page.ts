/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */

import { Component, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  ifNoLocationNavTo = `/weather`;

  apiLoaded: Observable<boolean>;

  constructor(
    public router: Router,
    private elementRef: ElementRef // Inject ElementRef
  ) { }

  ionViewWillLeave() {
    // Clear focus before leaving the page
    const activeElement = this.elementRef.nativeElement.ownerDocument.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
  }

  updateWeather() {
    // Blur any focused element to prevent focus retention
    const activeElement = this.elementRef.nativeElement.ownerDocument.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.router.navigate([this.ifNoLocationNavTo]);
  }
}
