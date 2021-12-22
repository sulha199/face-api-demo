import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MEDIA_STREAM_PARAMS, WebcamInputComponent } from '../webcam-input/webcam-input.component';
import { NormalizedLandmark,  Results, ResultsListener, Pose as PoseType, PoseConfig } from '@mediapipe/pose'
import { getAxesRotationFromPose, getXYRotation, isAxesFacingFront, isFacingFront, RotationOnAxes } from 'src/app/model/geometry';

export const EYE_WIDTH_TRESHOLD = 0.8

@Component({
  selector: 'app-webcam-face-input',
  templateUrl: './webcam-face-input.component.html',
  styleUrls: ['./webcam-face-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebcamFaceInputComponent extends WebcamInputComponent {
  pose?: PoseType
  isCaptureEnabled = false
  fps: number = 3;
  isLibraryInitialized = false
  axesRotation?: RotationOnAxes

  constructor(protected host: ElementRef<HTMLElement>, public cdr: ChangeDetectorRef) { 
    super(host)
   }

  async startStream(): Promise<void> {
    await super.startStream()
    await this.initPoseInstance()
  }

  async initPoseInstance() {
    const pose: PoseType = new PoseType({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635988162/${file}`;
      }
    } as PoseConfig);
    await pose.initialize()
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(this.onPoseResult.bind(this))
    this.isLibraryInitialized = true
    this.pose = pose
    this.cdr.detectChanges() 
  }

  async onPlay(element: HTMLVideoElement) {  
    super.onPlay(element)  
    if (this.shouldPlay) {
      await element && this?.stream && this.pose?.send({ image: this.videoRef!.nativeElement })
    }
  }

  onPoseResult(result: Results) {
    this.isLibraryInitialized = true
    if (!result?.poseLandmarks) { 
      this.isCaptureEnabled = false
      return
    }
    const axesRotation = getAxesRotationFromPose(result)    
    const isCaptureEnabled = isAxesFacingFront(axesRotation)
    this.axesRotation = axesRotation
    if (this.isCaptureEnabled !== isCaptureEnabled) { 
      this.isCaptureEnabled = isCaptureEnabled
      this.cdr.detectChanges() 
    }
  }
}
