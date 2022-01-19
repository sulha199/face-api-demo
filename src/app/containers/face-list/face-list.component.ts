import { Component, OnInit } from '@angular/core';
import { BubbleDataPoint, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { FaceDataService } from 'src/app/services/face-service.service';
const randomcolor = require ('randomcolor')

@Component({
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.scss']
})
export class FaceListComponent implements OnInit {
  public readonly faces = this.faceService.faces
  public readonly descriptors = this.faceService.descriptors
  public readonly filteredDescriptors = this.faceService.filteredDescriptors
  public readonly stringify = JSON.stringify

  public chartData?: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], string>

  constructor(public faceService: FaceDataService) { }

  ngOnInit(): void {
    this.loadChartData()
  }

  async addImages(images: HTMLImageElement[]) {
    await Promise.all(images.map((image => this.faceService.addFaceImage(image))))
    this.loadChartData()
  }

  removeImage(index: number) {
    this.faceService.removeFace(index)
    this.loadChartData()
  }

  loadChartData() {
    this.chartData = {
      datasets: this.descriptors.map((descriptor, index) => ({
        data: (descriptor || []) as number[],
        label: `#${index}`,
        borderColor: randomcolor(),
        borderWidth: 2
      })),
    }
  }

  log(descriptor: Float32Array) {
    const array = Object.values(descriptor)
    console.log(array)
    console.log(this.stringify(array))
  }
}
