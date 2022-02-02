import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MEDIA_STREAM_PARAMS, WebcamInputComponent } from '../webcam-input/webcam-input.component';
import { NormalizedLandmark,  Results, ResultsListener, Pose as PoseType, PoseConfig } from '@mediapipe/pose'
import { getAxesRotationFromPose, getXYRotation, isAxesFacingFront, isFacingFront, RotationOnAxes } from 'projects/camera/src/lib/model/geometry';
import { FaceService } from '../../services/face.service';
import { PoseService } from '../../services';

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
  @Output() captureFaceRotation = new EventEmitter<RotationOnAxes>()
  @Output() captureFaceDescriptor = new EventEmitter<Float32Array>()
  @Output() captureFaceImage = new EventEmitter<HTMLImageElement>()

  constructor(protected host: ElementRef<HTMLElement>, public cdr: ChangeDetectorRef, public faceService: FaceService, public poseService: PoseService) { 
    super(host)
   }

  async startStream(): Promise<void> {
    await super.startStream()
    await this.initPoseInstance()
  }

  async initPoseInstance() {    
    this.pose = await this.poseService.getPoseInstance(this.onPoseResult.bind(this))
    this.isLibraryInitialized = true
    this.cdr.detectChanges() 
  }

  async onPlay(element: HTMLVideoElement) {  
    super.onPlay(element)  
    if (this.shouldPlay) {
      await element && this?.stream && this.pose?.send({ image: this.videoRef!.nativeElement })
    }
  }

  async onCapture() {
    this.videoRef?.nativeElement.pause()
    super.onCapture()
    const img = this.getImgFromCanvas();
    if (img) {
      const face = await this.faceService.getSingleFace(img)
      if (face?.detection) {
        const { left, top, width, height } = face.detection.box
        const factor = 0.3
        const sizeFactor = 1.0 + (2 * factor)
        const faceImage = this.getImgFromCanvas(Math.max(left - width * factor, 0), Math.max(top  - height * factor, 0), width * sizeFactor, height * sizeFactor)
        this.captureFaceImage.emit(faceImage!)
        this.captureFaceDescriptor.emit(face?.descriptor)
      }
    }
    this.videoRef?.nativeElement.play()
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
    this.captureFaceRotation.emit(axesRotation)
    if (this.isCaptureEnabled !== isCaptureEnabled) { 
      this.isCaptureEnabled = isCaptureEnabled
      this.cdr.detectChanges() 
    }
  }
}
