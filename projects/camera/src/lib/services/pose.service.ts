import { Injectable } from '@angular/core';
import { NormalizedLandmark,  Results, ResultsListener, Pose as PoseClass, PoseConfig, Options } from '@mediapipe/pose'

export const DEFAULT_POSE_OPTIONS: Options = {
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
}

@Injectable({
  providedIn: 'root'
})
export class PoseService {
  private _poseInstance?: PoseClass

  constructor() {
    this.initTempPoseInstance()
  }

  async getPoseInstance(resultsListener: ResultsListener, options: Options = DEFAULT_POSE_OPTIONS ) {
    if (!this._poseInstance) {  }
    const pose: PoseClass = await this.useTempPoseInstance()
    pose.setOptions(options)
    pose.onResults(resultsListener)
    return pose
  }

  async useTempPoseInstance() {
    let pose: PoseClass
    if (this._poseInstance) {
      pose = this._poseInstance
      this.createTempPoseInstance
    } else {
      pose = await this.createTempPoseInstance()
      this.initTempPoseInstance()
    }
    return pose
  }

  async initTempPoseInstance() {
    this._poseInstance = await this.createTempPoseInstance()
  }

  private async createTempPoseInstance() {
    const pose: PoseClass = new PoseClass({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635988162/${file}`;
      }
    } as PoseConfig);
    await pose.initialize();
    return pose;
  }
}
