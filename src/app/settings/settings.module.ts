import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { LocationContainerComponentModule } from '../location-container/location-container.module';
import { ImperialMetricContainerComponentModule } from '../imperial-metric-container/imperial-metric-container.module';
import { SettingsPageRoutingModule } from './settings-routing.module';

import { MatButtonModule } from '@angular/material/button';



@NgModule({

  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    FormsModule,
    LocationContainerComponentModule,
    ImperialMetricContainerComponentModule,
    SettingsPageRoutingModule,
    MatButtonModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule { }
