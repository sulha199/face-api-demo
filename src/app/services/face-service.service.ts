import { Injectable } from '@angular/core';
import { computeFaceDescriptor, ComputeSingleFaceDescriptorTask, detectSingleFace, euclideanDistance, FaceDetection, FaceLandmarks68, nets, TNetInput, WithFaceDescriptor, WithFaceDetection, WithFaceLandmarks } from 'face-api.js'

export enum FaceDirection {
  left = 'left',
  right = 'right',
  front = 'front'
}

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  public readonly faces: (HTMLImageElement | null)[] = []
  public readonly descriptors: (Float32Array | null)[] = []
  public readonly faceDirections: FaceDirection[] = []
  public get filteredDescriptors() {
    return this.descriptors.filter(descriptor => !!descriptor)
  }

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
    this.faces[index] = null
    this.descriptors.splice(index, 1)
  }

  async getAvgMatchDistance(input: TNetInput) {
    const descriptors = this.filteredDescriptors
    const arrayDistance = await this.getArrayMatchDistance(input)
    return arrayDistance.reduce((sum: number, value) =>  sum + ( value ?? 0), 0) / (descriptors.length || 1)
  }

  async getArrayMatchDistance(input: TNetInput): Promise<(number | null)[]> {
    const result: (number | null)[] = new Array(this.descriptors.length).fill(null)
    const filteredDescriptors = this.filteredDescriptors;
    if (filteredDescriptors.length === 0) { return result }
    const inputDescriptor = await this.getSingleFaceDescriptor(input)
    if (!inputDescriptor) { return result }
    await this.descriptors.forEach(async (descriptor, index) => {
      if (!descriptor) { return }
      result[index] = await euclideanDistance(descriptor, inputDescriptor);
    });
    return result
  }

  private async getSingleFaceDescriptor(input: TNetInput) {
    const faceDetection = await detectSingleFace(input).withFaceLandmarks().withFaceDescriptor()
    return faceDetection?.descriptor
  }
}
