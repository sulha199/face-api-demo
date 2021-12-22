import { NormalizedLandmark, Results } from "@mediapipe/pose";

export const FACE_FRONT_ANGLE_TRESHOLD: RotationOnAxes = {
  pitch: 20,
  yaw: 20,
  roll: 10
}

export const MIN_YAW_TRESHOLD = 30;

export interface RotationOnAxes {
  /** positive means it is facing upwards. Negative means its facing downward */
  pitch: number, 
  /** positive means it is facing to right. Negative means its facing to the right */
  yaw: number, 
  /** positive means it is leaning/rotating to right. Negative means it is leaning/rotating to left */
  roll: number
}

export function normalizeAngle(angle: number){
  if (angle > 360) return angle - 360;
  if (angle < 0) return 360 + angle;
  else return angle;
}

export function getAngleBetweenPoints(cx: number, cy: number, ex: number, ey: number){
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta;
}

export function getXYRotation(leftPoint: NormalizedLandmark, rightpoint: NormalizedLandmark, frontPoint: NormalizedLandmark){
  const [x, y, z] = [(rightpoint.x - leftPoint.x), (rightpoint.y - leftPoint.y), (rightpoint.z - leftPoint.z)]
  const xPower = x * x;
  const zPower = z * z;
  const yPower = y * y;
  const d = Math.sqrt(xPower + yPower + zPower)
  const roty = Math.atan2(z, Math.sqrt(xPower + yPower))
  const rotz = Math.atan2(y, Math.sqrt(xPower + zPower))
  const frontPointNormalizedToLeftPoint: NormalizedLandmark = {
    z: (frontPoint.z - leftPoint.z),
    x: (frontPoint.x - leftPoint.x),
    y: (frontPoint.y - leftPoint.y)
  }
  const frontPointYawReversed: NormalizedLandmark = { ...frontPointNormalizedToLeftPoint, 
    x: Math.sin(-roty) * frontPointNormalizedToLeftPoint.z + Math.cos(-roty) * frontPointNormalizedToLeftPoint.x,
    z: Math.cos(-roty) * frontPointNormalizedToLeftPoint.z - Math.sin(-roty) * frontPointNormalizedToLeftPoint.x
  }
  const frontPointRollReversed: NormalizedLandmark = { ...frontPointYawReversed,
    x: Math.cos(-rotz) * frontPointYawReversed.x - Math.sin(-rotz) * frontPointYawReversed.y,
    y: Math.sin(-rotz) * frontPointYawReversed.x + Math.cos(-rotz) * frontPointYawReversed.y
  }
  const rotx = Math.atan2(frontPointRollReversed.y, frontPointRollReversed.z)

  const pitchDegree = (rotx * 180 / Math.PI) % 180;
  return { yaw: roty * 180 / Math.PI, roll: rotz * 180 / Math.PI, pitch: (180 - Math.abs(pitchDegree)) * (pitchDegree > 0 ? -1 : 1)}
}

export function isFacingFront(poseResult: Results, treshold: RotationOnAxes = FACE_FRONT_ANGLE_TRESHOLD) {
  const rotationOnAxis = getAxesRotationFromPose(poseResult);
  console.log(rotationOnAxis)
  const faceFront = isAxesFacingFront(rotationOnAxis, treshold);
  return faceFront;
}

export function getAxesRotationFromPose(poseResult: Results): RotationOnAxes {
  const { leftEyeInner, leftEyeOuter, rightEyeInner, rightEyeOuter, leftEar, rightEar, nose } = getFaceLandmarks(poseResult.poseLandmarks);
  const rotationOnAxis = getXYRotation(leftEar, rightEar, nose);
  return rotationOnAxis;
}

export function isAxesFacingFront(rotationOnAxis: RotationOnAxes, treshold: RotationOnAxes = FACE_FRONT_ANGLE_TRESHOLD) {
  return (Math.abs(rotationOnAxis.roll) < treshold.roll) && (Math.abs(rotationOnAxis.yaw) < treshold.yaw) && (Math.abs(rotationOnAxis.pitch) < treshold.pitch);
}

export function getFaceLandmarks(landmarks: NormalizedLandmark[]) {
  const [ nose, leftEyeInner, leftEyeCenter, leftEyeOuter, rightEyeInner, rightEyeCenter, rightEyeOuter, leftEar, rightEar, mouthLeft, mouthRight, ...rest] = landmarks
  return {nose, leftEyeInner, leftEyeCenter, leftEyeOuter, rightEyeInner, rightEyeCenter, rightEyeOuter, leftEar, rightEar, mouthLeft, mouthRight}
}

export function isYawingToSide(poseResult: Results, minimumYaw: number = MIN_YAW_TRESHOLD) {
  const { leftEar, rightEar, nose } = getFaceLandmarks(poseResult.poseLandmarks);
  const rotationOnAxis = getAxesRotationFromPose(poseResult)  
  return isAxesYawingToSide(rotationOnAxis, minimumYaw);
}

export function isAxesYawingToSide(rotationOnAxis: RotationOnAxes, minimumYaw: number = MIN_YAW_TRESHOLD) {
  return Math.abs(rotationOnAxis.yaw) > minimumYaw;
}
