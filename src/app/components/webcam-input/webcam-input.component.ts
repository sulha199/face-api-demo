import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

const POPUP_CLASS_NAME = 'popup';
@Component({
  selector: 'app-webcam-input',
  templateUrl: './webcam-input.component.html',
  styleUrls: ['./webcam-input.component.scss'],
})
export class WebcamInputComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('videoRef', {read: ElementRef}) videoRef?: ElementRef<HTMLVideoElement> 
  @ViewChild('overlayRef', {read: ElementRef}) overlayRef?: ElementRef<HTMLCanvasElement> 

  @Input() shouldPlay = false
  stream?: MediaStream

  @Output() capture = new EventEmitter<HTMLImageElement>()

  constructor(private host: ElementRef<HTMLElement>) {  }

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
    this.host.nativeElement.classList.add(POPUP_CLASS_NAME)
    this.shouldPlay = true
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      }
    });
  }

  stopStream() {
    this.host.nativeElement.classList.remove(POPUP_CLASS_NAME)
    this.shouldPlay = false
    this.stream?.getTracks().forEach(track => track.stop());
    this.videoRef?.nativeElement.pause();
  }

  onCapture() {
    if (!this.videoRef) { return }
    const canvas = document.createElement("canvas");
    const video = this.videoRef?.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = document.createElement("img")
    img.src = canvas.toDataURL()
    this.capture.emit(img)
  }

  onPlay(element: HTMLVideoElement) {
    if (this.shouldPlay) {  setTimeout(() => this.onPlay(element)) }    
  }
}
