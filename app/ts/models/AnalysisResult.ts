import { SingleDetectionResult } from './SingleDetectionResult.js';
// import { Params } from './Params.js';

export class AnalysisResult {

    // uuid: string;

    // params: Params;

    xAxis: number[];
    yAxis: number[];
    resultMatrix: SingleDetectionResult[][];

    constructor(res: { xAxis: number[], yAxis: number[], resultMatrix: SingleDetectionResult[][] }) {
        this.xAxis = res.xAxis;
        this.yAxis = res.yAxis;
        this.resultMatrix = res.resultMatrix;
    }



}