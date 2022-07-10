import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  apiLoaded: Observable<boolean>;
  constructor() { }

}

