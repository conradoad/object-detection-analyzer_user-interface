import { AnalysisResult } from '../models/AnalysisResult.js';
import { SingleDetectionResult } from '../models/SingleDetectionResult';

export class AnalysisResultView {

    private resultElement: HTMLElement;

    private analysisResult: AnalysisResult;

    constructor(selector: string) {
        this.resultElement = document.querySelector(selector)

        window.addEventListener("resize", () => this.adjustCellsSize());
    }

    update(analysisResult: AnalysisResult) {

        this.analysisResult = analysisResult;
        this.resultElement.innerHTML = this._template()

        this.adjustCellsSize();
    }
    
    clear() {
        this.resultElement.innerHTML = "";
    }

    _template() {
        return `
        <div id="matrix-result__grid">

            <div class="cell cell-options">
                <div class="cell-option cell-options__faces" data-selector="cell-result-child"><div>All</div></div>
                <div class="cell-option cell-options__faces" data-selector="cell-result__faces"><div>Faces</div></div>
                <div class="cell-option cell-options__time" data-selector="cell-result__time"><div>Mean Time</div></div>
            </div>

            ${this.populateAxisX(this.analysisResult.xAxis)}
            ${this.populateAxisY(this.analysisResult.yAxis)}

            ${this.populateResults(this.analysisResult.resultMatrix)}
        
        </div>
        `
    }

    populateAxisX(axisValues: number[]) {
        return `
        <div class="x-axis" style="display: grid; grid-row: 1 / span 1; grid-column: 2 / span ${axisValues.length}">

            <p style="display: grid; grid-row: 1 / span 1; grid-column: 1 / span ${axisValues.length}">Scale Factor</p>
        
            ${axisValues.reduce((template, value, idx_x) => {
            return template + `
                    <div class="cell cell-x-axis" style="grid-row: 2 / span 1; grid-column: ${1 + idx_x} / span 1;"> 
                        ${value.toFixed(3)}
                    </div>
                `
        }, "")}

        </div>
        `
    }

    populateAxisY(axisValues: number[]) {
        return `
        <div class="y-axis" style="display: grid; grid-row: 2 / span ${axisValues.length}; grid-column: 1 / span 1">

            <p style="display: grid; grid-row: 1 / span ${axisValues.length}; grid-column: 1 / span 1">Min. Size (%)</p>
        
        ${axisValues.reduce((template, value, idx_y) => {
            return template + `
                <div class="cell cell-y-axis" style="grid-row: ${1 + idx_y} / span 1; grid-column: 2 / span 1;"> 
                    ${(value * 100).toFixed(1)}
                </div>
            `
        }, "")}

        </div>
        `
    }

    populateResults(resultMatrix: SingleDetectionResult[][]) {
        const base = resultMatrix.reduce((obj1, resDim1) => {
            return resDim1.reduce((obj, result) => {
                const qtdFaces = result.detectedFaces.length;
                const time = result.meanDetectionTime;

                if (obj.faces.min === null) {
                    obj.faces.min = qtdFaces;
                    obj.faces.max = qtdFaces;

                    obj.time.min = time;
                    obj.time.max = time;
                    return obj;
                }

                if (qtdFaces < obj.faces.min) obj.faces.min = qtdFaces;
                if (qtdFaces > obj.faces.max) obj.faces.max = qtdFaces;

                if (time < obj.time.min) obj.time.min = time;
                if (time > obj.time.max) obj.time.max = time;

                return obj;
            }, obj1)

        }, {
            faces: { min: null, max: null },
            time: { min: null, max: null },
        }
        )


        return resultMatrix.reduce((template, resultDimension1, idx_x) => {
            return template + resultDimension1.reduce((temp1, singleDetection, idx_y) => {
                return temp1 + `
                    <div class="cell cell-result" data-idx-x="${idx_x}" data-idx-y="${idx_y}"  style="grid-row: ${2 + idx_y} / span 1; grid-column: ${2 + idx_x}/ span 1;">
                        <div class="cell-result-child cell-result__faces" 
                                style="background-color: rgba(0, 255, 0, ${((singleDetection.detectedFaces.length - base.faces.min) / (base.faces.max - base.faces.min))})"
                        >
                            <div>F: ${singleDetection.detectedFaces.length}</div>
                        </div>

                        <div class="cell-result-child cell-result__time"
                        style="background-color: rgb(255, 0, 0, ${((singleDetection.meanDetectionTime - base.time.min) / (base.time.max - base.time.min))});"
                        >
                            <div>T: ${singleDetection.meanDetectionTime}</div>
                        </div>
                    </div>
                `;
            }, "")
        }, "")
    }

    adjustCellsSize() {
        const xAxisLength = this.analysisResult?.xAxis.length;
        if (!xAxisLength) return;

        const totalWidth = (<HTMLDivElement>document.querySelector('#matrixResultContainer')).clientWidth;

        const cellElements = document.querySelectorAll('.cell-result');

        const cellWidth = (+totalWidth / (xAxisLength + 1));
        const cellWidthHeight = (cellWidth > 70 ? 70 : cellWidth).toString() + 'px';

        cellElements.forEach((cell: HTMLDivElement) => {
            cell.style.width = cellWidthHeight;
            cell.style.height = cellWidthHeight;
        });

    }

    optionFocus(optionSelector: string) {
        this.resultElement.querySelectorAll('.cell-result-child')
            .forEach((elem: HTMLDivElement) => {
                if (elem.classList.contains(optionSelector) || optionSelector === "") {
                    elem.hidden = false;
                }
                else {
                    elem.hidden = true;
                }
            })

    }

    emphasizeCell(cell: HTMLDivElement) {

        const resultCells = this.resultElement.querySelectorAll('.cell-result');
        resultCells.forEach((elem: HTMLDivElement) => {
            elem.classList.remove('cell-selected');
        });
        cell.classList.add('cell-selected');
    }
}