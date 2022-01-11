import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceListComponent } from './containers/face-list/face-list.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { FaceMatchComponent } from './containers/face-match/face-match.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { Chart, registerables } from 'chart.js';
import { WebcamInputComponent, WebcamListComponent } from './components/webcam-input/webcam-input.component';
import { WebcamFaceInputComponent } from './components/webcam-face-input/webcam-face-input.component';
import { PeekToSideDetectorComponent } from './components/peek-to-side-detector/peek-to-side-detector.component';
import { FaceYawComponent } from './containers/face-yaw/face-yaw.component';
import { AxesRotationInfoComponent } from './components/axes-rotation-info/axes-rotation-info.component';
import  { createCustomElement } from '@angular/elements';

Chart.register(...registerables);

const COMPONENTS_LIBRARY = {
  'webcam-face-input': WebcamFaceInputComponent,
  'webcam-input': WebcamInputComponent,
  'peek-detector': PeekToSideDetectorComponent
};
@NgModule({
  declarations: [
    AppComponent,
    FaceListComponent,
    ImagePickerComponent,
    FaceMatchComponent,
    ChartLineComponent,
    WebcamInputComponent,
    WebcamFaceInputComponent,
    PeekToSideDetectorComponent,
    FaceYawComponent,
    AxesRotationInfoComponent,
    WebcamListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, WebcamInputComponent, WebcamFaceInputComponent, WebcamInputComponent]
})
export class AppModule {
  components = COMPONENTS_LIBRARY
  constructor(private injector: Injector) {
    Object.keys(this.components).forEach(key => {
      const element = createCustomElement(this.components[key], { injector });
      customElements.define(key, element);
    })
  }
  ngDoBootstrap() {}
}
