import { Component, OnInit } from '@angular/core';
import { BubbleDataPoint, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { FaceService } from 'src/app/services/face-service.service';
const randomcolor = require ('randomcolor')

@Component({
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss']
})
export class FaceMatchComponent implements OnInit {
  public image?: HTMLImageElement
  private readonly descriptors = this.faceService.descriptors;
  public readonly filteredDescriptors = this.faceService.filteredDescriptors
  public readonly faces = this.faceService.faces
  public scores: (number | null)[] = [] 
  public chartData?: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], string>

  constructor(public faceService: FaceService) { }

  ngOnInit(): void {
  }

  async matchImage(image?: HTMLImageElement) {
    this.scores = []
    this.image = image
    this.scores = image ? await this.faceService.getArrayMatchDistance(image) : []
    await this.loadChartData()
  }

  async loadChartData() {
    const inputDescriptor = await this.faceService.getSingleFaceDescriptor(this.image!) 
    const inputDescriptorArray = Array.from(inputDescriptor!)
    this.chartData = {
      datasets: this.scores.map((score, scoreIndex) => {
        return {
          data: score != null ? inputDescriptorArray.map((inputValue, index) => inputValue - this.descriptors![scoreIndex]![index]): [],
          label: `#${scoreIndex}`,
          borderColor: randomcolor(),
          borderWidth: 2
        }
      })
    }
  }
}
