import { Component, Input, OnInit } from '@angular/core';
import { Results } from '@mediapipe/pose';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { getAxesRotationFromPose, isAxesYawingToSide, isYawingToSide, RotationOnAxes } from 'src/app/model/geometry';
import { WebcamFaceInputComponent } from '../webcam-face-input/webcam-face-input.component';

@Component({
  selector: 'app-peek-to-side-detector',
  templateUrl: './peek-to-side-detector.component.html',
  styleUrls: ['./peek-to-side-detector.component.scss']
})
export class PeekToSideDetectorComponent extends WebcamFaceInputComponent implements OnInit {
  isYawingToSide: boolean = false
  /** in miliseconds */
  @Input() minimumYawDuration: number = 5000

  isPopUpShown = false

  _yawTimerInstance$?: Subscription
  _onYawStop$ = new Subject<void>()

  ngOnInit(): void {
    this.startStream()
  }
  

  onPoseResult(result: Results) {
    if (!result?.poseLandmarks) { 
      this.isCaptureEnabled = false
      return
    }

    const axesRotation = getAxesRotationFromPose(result)
    this.axesRotation = axesRotation
    const isYawingToSideVar = isAxesYawingToSide(axesRotation)
    if (isYawingToSideVar) {
      if (!this._yawTimerInstance$ || this._yawTimerInstance$.closed) {
        this.createTimerInstance()
        console.log('start counting', new Date())
      } 
    } else {
      this._onYawStop$.next()
      this._yawTimerInstance$ && (this._yawTimerInstance$.unsubscribe())
      this.isPopUpShown = false
    }
    if (this.isYawingToSide !== isYawingToSideVar){
      this.isYawingToSide = isYawingToSideVar
      this.cdr.detectChanges()
    }

  }

  createTimerInstance() {
    this._yawTimerInstance$ = interval(this.minimumYawDuration).pipe(takeUntil(this._onYawStop$)).subscribe(() => {
      this.followUpYaw()
    })
  }

  followUpYaw() {
    this.capture.emit(this.getImgFromCanvas())
    this.isPopUpShown = true
  }
}
