import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';


const POPUP_CLASS_NAME = 'popup';
export const MEDIA_STREAM_PARAMS: MediaTrackConstraints = {
  facingMode: 'user',
  width: 1280,
  height: 780
};
@Component({
  selector: 'app-webcam-input',
  templateUrl: './webcam-input.component.html',
  styleUrls: ['./webcam-input.component.scss'],
})
export class WebcamInputComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoRef', {read: ElementRef}) videoRef?: ElementRef<HTMLVideoElement> 
  @ViewChild('overlayRef', {read: ElementRef}) overlayRef?: ElementRef<HTMLCanvasElement> 

  /** Frame per second */
  @Input() fps = 60
  @Input() shouldPlay = false
  stream?: MediaStream

  @Output() capture = new EventEmitter<HTMLImageElement>()

  width = MEDIA_STREAM_PARAMS.width as number
  height = MEDIA_STREAM_PARAMS.height as number

  constructor(protected host: ElementRef<HTMLElement>) {  }

  ngOnInit(): void {
    if (this.shouldPlay) { this.startStream() }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.shouldPlay.previousValue !== this.shouldPlay) {
      if (this.shouldPlay) { this.startStream() }
      else { this.stopStream }
    }
  }

  async ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.shouldPlay = false
    this.stopStream();
  }

  async startStream() {
    await this.startStreamInstance();
    this.updateStartStreamAttribute();
    this.videoRef?.nativeElement.play()
  }

  async stopStream() {
    this.host.nativeElement.classList.remove(POPUP_CLASS_NAME)
    this.shouldPlay = false
    await this.stopStreamInstance();
    this.videoRef?.nativeElement.pause();
  }

  async onCapture() {
    if (!this.videoRef) { return }
    const img = this.getImgFromCanvas();
    this.capture.emit(img)
  }

  protected async stopStreamInstance() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  protected async startStreamInstance() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: MEDIA_STREAM_PARAMS
    });
  }

  protected updateStartStreamAttribute() {
    this.host.nativeElement.classList.add(POPUP_CLASS_NAME);
    this.shouldPlay = true;
  }

  getImgFromCanvas(sx: number = 0, sy: number = 0, sw?: number, sh?: number) {
    if (!this.videoRef) { return }
    const canvas = document.createElement("canvas");
    const video = this.videoRef?.nativeElement;
    canvas.width = sw ?? video.videoWidth;
    canvas.height = sh ?? video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, sx, sy,canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    const img = document.createElement("img");
    img.src = canvas.toDataURL();
    img.width = canvas.width
    img.height = canvas.height
    return img;
  }

  onPlay(element: HTMLVideoElement) {
    if (this.shouldPlay) {  setTimeout(() => this.onPlay(element), 1000 / this.fps) }    
  }
}
