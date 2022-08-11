import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherPage } from './weather.page';

import { WeatherContainerComponentModule } from '../weather-container/weather-container.module';

import { WeatherPageRoutingModule } from './weather-routing.module';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WeatherPageRoutingModule,
    WeatherContainerComponentModule,
    HttpClientModule
  ],
  declarations: [WeatherPage]
})
export class WeatherPageModule { }
