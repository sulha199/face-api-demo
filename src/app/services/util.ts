import { euclideanDistance } from "face-api.js";

export function calculateDistance(descriptor: Float32Array, inputDescriptor: Float32Array): number {
  return euclideanDistance(descriptor, inputDescriptor);
}