import { euclideanDistance } from "face-api.js";

export const CONFIG = { minkowskyWeight: 3}

export function calculateDistance(descriptor: Float32Array, inputDescriptor: Float32Array): number {
  return minkowskyDistance(descriptor, inputDescriptor);
}

export function minkowskyDistance(descriptor: Float32Array, inputDescriptor: Float32Array): number {
  const pow = descriptor
    .reduce((result, v1, index) => result + Math.pow(Math.abs(v1 - inputDescriptor[index]), CONFIG.minkowskyWeight), 0);
  return Math.pow( pow, 1/ CONFIG.minkowskyWeight)
}