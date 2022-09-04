import { DetectedFace } from './DetectedFace.js';

export type SingleDetectionResult = {

    scaleFactor_x_axis: number;
    minSize_y_axis: number;

    meanDetectionTime: number;

    minLevelWeight: number;
    meanLevelWeight: number;
    maxLevelWeight: number;
    detectedFaces: DetectedFace[];
}
