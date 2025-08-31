import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatInputModule } from '@angular/material/input';
import { LocationContainerComponent } from './location-container.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [LocationContainerComponent],
  exports: [LocationContainerComponent]
})
export class LocationContainerComponentModule { }
