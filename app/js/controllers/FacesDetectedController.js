var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AnalysisResult } from '../models/AnalysisResult.js';
import { AnalysisService } from '../services/AnalysisService.js';
import { AnalysisResultView } from '../views/AnalysisResultView.js';
export class FacesDetectedController {
    constructor(imageController, paramsController) {
        this.sendAnalisysRequest = () => __awaiter(this, void 0, void 0, function* () {
            yield this.imageController.uploadImage();
            //implementar retorno da chamada acima e check do resultado antes de chamar a funcao abaixo
            this.analysisResultView.clear();
            this.imageController.removeFaces();
            const params = this.paramsController.getParams();
            console.log("Chamando análise");
            this.analysisResult = new AnalysisResult(yield this.analysisService.requestAnalysis(params));
            console.log(this.analysisResult);
            this.analysisResultView.update(this.analysisResult);
            this.registerEventListeners();
        });
        this.sendMetricsRequest = () => __awaiter(this, void 0, void 0, function* () {
            const metrics = yield this.analysisService.requestMetrics(this.sampleSelectedParams);
            console.log(metrics);
            const elm = document.querySelector('.metricsTable');
            var html = `
                    <tr>
                        <th> Metric </th>
                        <th> Value </th>
                    </tr>
                    `;
            Object.keys(metrics).forEach(key => {
                if (key != '3.1 - Faces images') {
                    html = html + `
                    <tr>
                        <td> ${key} </td>
                        <td> ${metrics[key]} </td>
                    </tr>
                    `;
                }
                else {
                    html = html + `
                    <tr>
                        <td> ${key} </td>
                        <td id='facesImagesContainer'>  </td>
                    </tr>
                    `;
                }
            });
            elm.innerHTML = html;
            const facesContainer = elm.querySelector('#facesImagesContainer');
            metrics['3.1 - Faces images'].forEach(faceImg => {
                var img = new Image();
                img.src = `data:image/bmp;base64,${faceImg}`;
                facesContainer.appendChild(img);
            });
        });
        this.registerEventListeners = () => {
            const cellsResult = document.querySelectorAll('.cell-result');
            cellsResult === null || cellsResult === void 0 ? void 0 : cellsResult.forEach((cellResult) => cellResult.addEventListener('click', this.manageClickEventResult));
            const viewOptions = document.querySelectorAll('.cell-option');
            viewOptions === null || viewOptions === void 0 ? void 0 : viewOptions.forEach((cellOption) => cellOption.addEventListener('click', this.manageClickEventOptions));
        };
        this.manageClickEventResult = (e) => {
            const target = e.currentTarget;
            if (target.classList.contains('cell-result')) {
                const idx_x = target.getAttribute('data-idx-x');
                const idx_y = target.getAttribute('data-idx-y');
                this.sampleSelectedParams = {
                    minNeighbors: +this.paramsController.getMinNeighbors(),
                    numberOfSamples: +this.paramsController.getNumberOfSamples(),
                    scaleFactor: this.analysisResult.resultMatrix[idx_x][idx_y].scaleFactor_x_axis,
                    minSize: this.analysisResult.resultMatrix[idx_x][idx_y].minSize_y_axis
                };
                this.imageController.drawDetectedFaces(this.analysisResult.resultMatrix[idx_x][idx_y]);
                this.analysisResultView.emphasizeCell(target);
            }
        };
        this.manageClickEventOptions = (e) => {
            const target = e.currentTarget;
            const optionSelector = target.getAttribute('data-selector');
            this.analysisResultView.optionFocus(optionSelector);
        };
        this.imageController = imageController;
        this.paramsController = paramsController;
        this.analysisService = new AnalysisService();
        this.analysisResultView = new AnalysisResultView('#matrixResultContainer');
        this.sampleSelectedParams = null;
        const sendButton = document.querySelector('#sendButton');
        sendButton.addEventListener('click', this.sendAnalisysRequest);
        const getMetricsButton = document.querySelector('#getMetricsButton');
        getMetricsButton.addEventListener('click', this.sendMetricsRequest);
    }
}
