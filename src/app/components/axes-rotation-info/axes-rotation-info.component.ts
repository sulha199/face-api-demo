import { Component, Input, OnInit } from '@angular/core';
import { RotationOnAxes } from 'src/app/model/geometry';

@Component({
  selector: 'app-axes-rotation-info',
  templateUrl: './axes-rotation-info.component.html',
  styleUrls: ['./axes-rotation-info.component.scss']
})
export class AxesRotationInfoComponent implements OnInit {
  @Input() axesRotation?: RotationOnAxes

  constructor() { }

  ngOnInit(): void {
  }

}
