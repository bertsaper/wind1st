import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { LocationContainerComponentModule } from '../location-container/location-container.module';
import { ImperialMetricContainerComponentModule } from '../imperial-metric-container/imperial-metric-container.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';



@NgModule({

  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    FormsModule,
    LocationContainerComponentModule,
    ImperialMetricContainerComponentModule,
    Tab2PageRoutingModule,
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule { }
