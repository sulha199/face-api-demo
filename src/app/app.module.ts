import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceListComponent } from './containers/face-list/face-list.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { FaceMatchComponent } from './containers/face-match/face-match.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    FaceListComponent,
    ImagePickerComponent,
    FaceMatchComponent,
    ChartLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
