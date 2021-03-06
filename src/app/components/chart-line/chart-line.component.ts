import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import { Chart, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLineComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() datasets: ChartDataset[] = []
  @Input() labels: string[] = new Array(128).fill('')
  @Input() title: string = 'Chart'  
  @Input() max = 0.5;
  @Input() min = -0.5;
  @Input() step = 0.1;
  
  @ViewChild('chartRef', {read: ElementRef}) chartRef!: ElementRef<HTMLCanvasElement>
  chart?: Chart 

  constructor() { }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: this.getChartData(),
      options: {
        scales: {
          yAxes: {
            display: true,
            ticks: {
              stepSize: this.step
            },
            max: this.max,
            min: this.min
          }
        }
      },
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.data = this.getChartData()
      this.chart.update(); 
    }
  }

  private getChartData() {
    return {
      datasets: this.datasets ? this.datasets.map(data => ({ ...data, backgroundColor: data?.borderColor } as any)) : [],
      labels: this.labels
    };
  }
}
