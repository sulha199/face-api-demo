import { Component, OnInit } from '@angular/core';
import { BubbleDataPoint, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { FaceService } from 'projects/camera/src';
import { FaceDataService } from 'src/app/services/face-service.service';
import { CONFIG } from 'src/app/services/util';
const randomcolor = require ('randomcolor')

@Component({
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss']
})
export class FaceMatchComponent implements OnInit {
  public image?: HTMLImageElement
  private readonly descriptors = this.faceDataService.descriptors;
  public readonly filteredDescriptors = this.faceDataService.filteredDescriptors
  public readonly faces = this.faceDataService.faces
  public scores: (number | null)[] = [] 
  public chartData?: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], string>
  readonly minkowskyParam = CONFIG.minkowskyWeight

  constructor(public faceService: FaceService, public faceDataService: FaceDataService) { }

  ngOnInit(): void {
  }

  async matchImage(image?: HTMLImageElement) {
    this.scores = []
    this.image = image
    this.scores = image ? await this.faceDataService.getArrayMatchDistance(image) : []
    await this.loadChartData()
  }

  async loadChartData() {
    const inputDescriptor = await this.faceService.getSingleFaceDescriptor(this.image!) 
    const inputDescriptorArray = Array.from(inputDescriptor!)
    this.chartData = {
      datasets: this.scores.map((score, scoreIndex) => {
        return {
          data: score != null ? inputDescriptorArray.map((inputValue, index) => Math.abs(inputValue - this.descriptors![scoreIndex]![index])): [],
          label: `#${scoreIndex}`,
          borderColor: randomcolor(),
          borderWidth: 2
        }
      })
    }
  }

  changeParam(value: string) {
    CONFIG.minkowskyWeight = parseInt(value)
  }
}
