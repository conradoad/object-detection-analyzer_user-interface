// import { Params } from './Params.js';
export class AnalysisResult {
    constructor(res) {
        this.xAxis = res.xAxis;
        this.yAxis = res.yAxis;
        this.resultMatrix = res.resultMatrix;
    }
}
