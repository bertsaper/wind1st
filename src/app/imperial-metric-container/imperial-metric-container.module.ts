import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import ImperialMetricContainerComponent from './imperial-metric-container.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [ImperialMetricContainerComponent],
  exports: [ImperialMetricContainerComponent]
})
export class ImperialMetricContainerComponentModule { }
