import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MEDIA_STREAM_PARAMS, WebcamInputComponent } from '../webcam-input/webcam-input.component';
import { Html5Qrcode } from 'html5-qrcode'

@Component({
  selector: 'app-webcam-qr-input',
  templateUrl: './webcam-qr-input.component.html',
  styleUrls: [ './webcam-qr-input.component.scss']
})
export class WebcamQrInputComponent extends WebcamInputComponent {  
  html5QrCode?: Html5Qrcode
  videoRefId = `videoRef-${(new Date()).getTime()}`
  @Output() captureText = new EventEmitter<string>()

  async ngAfterViewInit(): Promise<void> {
    super.ngAfterViewInit()    
    this.html5QrCode = new Html5Qrcode(this.videoRefId)
  }

  async startStream(): Promise<void> {
      if (this.html5QrCode && this.cameraId) {
        this.html5QrCode.start(
          this.cameraId, 
          {
            fps: this.fps, 
            qrbox: { width: 500, height: 500 },
            videoConstraints: MEDIA_STREAM_PARAMS
          },
          (decodedText, decodedResult) => {
            if (decodedText) {
              this.captureText.emit(decodedText)
              this.stopStream()
            }            
          },
          (errorMessage) => { this.error.emit(errorMessage) })
        .catch((err) => {this.error.emit(err)});
        this.updateStartStreamAttribute()
      }
  }

  async stopStream(): Promise<void> {
    this.html5QrCode?.stop()
      this.hideElements()
  }

}
