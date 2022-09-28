import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from './weather-container.component';

import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MatButtonModule],
  declarations: [ExploreContainerComponent],
  exports: [ExploreContainerComponent]
})
export class WeatherContainerComponentModule { }
