import { Injectable } from '@angular/core';
import { detectSingleFace, nets, TNetInput } from 'face-api.js'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  constructor() {
    nets.ssdMobilenetv1.loadFromUri(environment.production ? environment.faceApiSourceUrl : `${environment.faceApiSourceUrl}/ssd_mobilenetv1`)
    nets.faceLandmark68Net.loadFromUri(environment.production ? environment.faceApiSourceUrl : `${environment.faceApiSourceUrl}/face_landmark_68`)
    nets.faceRecognitionNet.loadFromUri(environment.production ? environment.faceApiSourceUrl : `${environment.faceApiSourceUrl}/face_recognition`)
  }

  public async getSingleFaceDescriptor(input: TNetInput) {
    const faceDetection = await this.getSingleFace(input)
    return faceDetection?.descriptor
  }

  public async getSingleFace(input: TNetInput) {
    return await detectSingleFace(input).withFaceLandmarks().withFaceDescriptor();
  }
}
