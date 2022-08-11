import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  apiLoaded: Observable<boolean>;
  constructor() { }

}

