import { Component, OnInit } from '@angular/core';
import { FaceService } from 'src/app/services/face-service.service';

@Component({
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.scss']
})
export class FaceListComponent implements OnInit {
  public readonly faces = this.faceService.faces
  public readonly filteredDescriptors = this.faceService.filteredDescriptors

  constructor(public faceService: FaceService) { }

  ngOnInit(): void {
  }

  addImages(images: HTMLImageElement[]) {
    images.forEach(image => this.faceService.addFaceImage(image))
  }

  removeImage(index: number) {
    this.faceService.removeFace(index)
  }
}
