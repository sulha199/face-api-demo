import { Component, OnInit } from '@angular/core';
import { FaceService } from 'src/app/services/face-service.service';

@Component({
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss']
})
export class FaceMatchComponent implements OnInit {
  public score = 0
  public image?: HTMLImageElement

  constructor(public faceService: FaceService) { }

  ngOnInit(): void {
  }

  async matchImage(image?: HTMLImageElement) {
    this.image = image
    this.score = image ? await this.faceService.getMatchScore(image) : 0
  }

}
