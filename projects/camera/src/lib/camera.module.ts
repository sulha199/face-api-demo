import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { PeekToSideDetectorComponent } from './components/peek-to-side-detector/peek-to-side-detector.component';
import { WebcamFaceInputComponent } from './components/webcam-face-input/webcam-face-input.component';
import { WebcamInputComponent, WebcamListComponent } from './components/webcam-input/webcam-input.component';
import { WebcamQrInputComponent } from './components/webcam-qr-input/webcam-qr-input.component';


const COMPONENT_LIST = [WebcamFaceInputComponent, WebcamInputComponent, PeekToSideDetectorComponent, 
  WebcamListComponent, WebcamQrInputComponent]

const COMPONENTS_LIBRARY = {
  'webcam-face-input': WebcamFaceInputComponent,
  'webcam-input': WebcamInputComponent,
  'webcam-qr-input': WebcamQrInputComponent,
  'peek-detector': PeekToSideDetectorComponent,  
};

@NgModule({
  declarations: COMPONENT_LIST,
  imports: [
    BrowserModule
  ],
  exports: COMPONENT_LIST
})
export class CameraModule {
  components = COMPONENTS_LIBRARY
  constructor(private injector: Injector) {
    Object.keys(this.components).forEach(key => {
      const element = createCustomElement(this.components[key], { injector });
      customElements.define(key, element);
    })
  }
  ngDoBootstrap() {}
}
