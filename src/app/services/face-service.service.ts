import { Injectable } from '@angular/core';
import { computeFaceDescriptor, ComputeSingleFaceDescriptorTask, detectSingleFace, euclideanDistance, FaceDetection, FaceLandmarks68, nets, TNetInput, WithFaceDescriptor, WithFaceDetection, WithFaceLandmarks } from 'face-api.js'

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  public faces: HTMLImageElement[] = []
  public descriptors: Float32Array[] = []

  constructor() {
    nets.ssdMobilenetv1.loadFromUri('./assets/face-api.js/models/ssd_mobilenetv1')
    nets.faceLandmark68Net.loadFromUri('./assets/face-api.js/models/face_landmark_68')
    nets.faceRecognitionNet.loadFromUri('./assets/face-api.js/models/face_recognition')
  }

  /** Insert new face and returns the new length of the array,
   * or return -1 if no face found
   */
  async addFaceImage(input: HTMLImageElement) {
    const descriptor = await this.getSingleFaceDescriptor(input)
    if (!descriptor) {return -1}
    this.descriptors.push(descriptor)
    return this.faces.push(input)
  }

  removeFace(index: number) {
    this.faces.splice(index, 1)
    this.descriptors.splice(index, 1)
  }

  async getMatchScore(input: TNetInput) {
    if (this.descriptors.length === 0) { return 0 }
    const inputDescriptor = await this.getSingleFaceDescriptor(input)
    if (!inputDescriptor) { return 0 }
    const sumScore = await this.descriptors.reduce(async (sumPromise, descriptor) => {
      const score = await euclideanDistance(descriptor, inputDescriptor);
      const sum = await sumPromise;
      return Promise.resolve(sum + score);
    }, Promise.resolve(0));
    return sumScore / (this.descriptors.length || 1)
  }

  private async getSingleFaceDescriptor(input: TNetInput) {
    const faceDetection = await detectSingleFace(input).withFaceLandmarks().withFaceDescriptor()
    return faceDetection?.descriptor
  }
}
