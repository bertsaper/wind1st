import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import ExploreContainerComponent from './explore-container.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatAutocompleteModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [ExploreContainerComponent],
  exports: [ExploreContainerComponent]
})
export class ExploreContainerComponentModule { }
