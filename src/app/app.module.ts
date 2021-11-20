import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceListComponent } from './containers/face-list/face-list.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { FaceMatchComponent } from './containers/face-match/face-match.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceListComponent,
    ImagePickerComponent,
    FaceMatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
