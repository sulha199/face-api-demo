import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { bufferToImage } from 'face-api.js';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePickerComponent implements OnInit {
  @Input() multiple = true

  @ViewChild('imgFileUpload', {read: ElementRef}) imgFileUpload!: ElementRef<HTMLInputElement>

  @Output() addImage = new EventEmitter<HTMLImageElement[]>()

  constructor() { }

  ngOnInit(): void {
  }
  
  async uploadImage() {
    const imgFiles = Array.from(this.imgFileUpload.nativeElement?.files || [])
    const imgs = await Promise.all(imgFiles.map(async imgFile => await bufferToImage(imgFile)))
    this.addImage.emit(imgs)
  }
}
