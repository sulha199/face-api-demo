import { Component, OnInit } from '@angular/core';
import { FaceService } from 'src/app/services/face-service.service';

@Component({
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss']
})
export class FaceMatchComponent implements OnInit {
  public image?: HTMLImageElement
  public readonly filteredDescriptors = this.faceService.filteredDescriptors
  public readonly faces = this.faceService.faces
  public scores: (number | null)[] = [] 

  constructor(public faceService: FaceService) { }

  ngOnInit(): void {
  }

  async matchImage(image?: HTMLImageElement) {
    this.scores = []
    this.image = image
    this.scores = image ? await this.faceService.getArrayMatchDistance(image) : []
  }

}
