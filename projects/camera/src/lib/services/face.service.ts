import { Injectable } from '@angular/core';
import { detectSingleFace, nets, TNetInput } from 'face-api.js'

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  constructor() {
    nets.ssdMobilenetv1.loadFromUri('./assets/face-api.js/models/ssd_mobilenetv1')
    nets.faceLandmark68Net.loadFromUri('./assets/face-api.js/models/face_landmark_68')
    nets.faceRecognitionNet.loadFromUri('./assets/face-api.js/models/face_recognition')
  }

  public async getSingleFaceDescriptor(input: TNetInput) {
    const faceDetection = await this.getSingleFace(input)
    return faceDetection?.descriptor
  }

  public async getSingleFace(input: TNetInput) {
    return await detectSingleFace(input).withFaceLandmarks().withFaceDescriptor();
  }
}
