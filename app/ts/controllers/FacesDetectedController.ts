import { AnalysisResult } from '../models/AnalysisResult.js';
import { Params } from '../models/Params.js';
import { AnalysisService } from '../services/AnalysisService.js';
import { AnalysisResultView } from '../views/AnalysisResultView.js';
import { ImageController } from './ImageController.js';
import { ParamsController } from './ParamsController.js';

export class FacesDetectedController {

    private imageController: ImageController;
    private paramsController: ParamsController;

    private analysisResult: AnalysisResult;

    private analysisService: AnalysisService;

    private analysisResultView: AnalysisResultView;

    private sampleSelectedParams: any;

    constructor(imageController: ImageController, paramsController: ParamsController) {

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

    public sendAnalisysRequest = async () => {

        await this.imageController.uploadImage();

        //implementar retorno da chamada acima e check do resultado antes de chamar a funcao abaixo

        this.analysisResultView.clear();
        this.imageController.removeFaces();

        const params: Params = this.paramsController.getParams();

        console.log("Chamando análise");
        this.analysisResult = new AnalysisResult(await this.analysisService.requestAnalysis(params));
        console.log(this.analysisResult);

        this.analysisResultView.update(this.analysisResult);
        this.registerEventListeners();

    };

    public sendMetricsRequest = async () => {
        const metrics = await this.analysisService.requestMetrics(this.sampleSelectedParams);

        console.log(metrics);
        const elm = document.querySelector('.metricsTable');
        var html = `
                    <tr>
                        <th> Metric </th>
                        <th> Value </th>
                    </tr>
                    `
        Object.keys(metrics).forEach(key =>
        { 
            if (key != '3.1 - Faces images')
            {

                html = html + `
                    <tr>
                        <td> ${key} </td>
                        <td> ${metrics[key]} </td>
                    </tr>
                    `
            }
            else {
                html = html + `
                    <tr>
                        <td> ${key} </td>
                        <td id='facesImagesContainer'>  </td>
                    </tr>
                    `
            }
        })
        elm.innerHTML = html

        const facesContainer = elm.querySelector('#facesImagesContainer')

        metrics['3.1 - Faces images'].forEach(faceImg => {
            
            var img = new Image();
            
            img.src = `data:image/bmp;base64,${faceImg}`;
            facesContainer.appendChild(img);
            
        });
    }

    public registerEventListeners = () => {

        const cellsResult = document.querySelectorAll('.cell-result');
        cellsResult?.forEach((cellResult) => cellResult.addEventListener('click', this.manageClickEventResult));

        const viewOptions = document.querySelectorAll('.cell-option');
        viewOptions?.forEach((cellOption) => cellOption.addEventListener('click', this.manageClickEventOptions));

    }

    public manageClickEventResult = (e: Event) => {
        const target: HTMLDivElement = <HTMLDivElement>e.currentTarget;

        if (target.classList.contains('cell-result')) {
            const idx_x = target.getAttribute('data-idx-x');
            const idx_y = target.getAttribute('data-idx-y');

            this.sampleSelectedParams = {
                minNeighbors: +this.paramsController.getMinNeighbors(),
                numberOfSamples: +this.paramsController.getNumberOfSamples(),
                scaleFactor: this.analysisResult.resultMatrix[idx_x][idx_y].scaleFactor_x_axis,
                minSize: this.analysisResult.resultMatrix[idx_x][idx_y].minSize_y_axis
            }

            this.imageController.drawDetectedFaces(this.analysisResult.resultMatrix[idx_x][idx_y]);
            this.analysisResultView.emphasizeCell(target);
        }

    };

    public manageClickEventOptions = (e: Event) => {
        const target: HTMLDivElement = <HTMLDivElement>e.currentTarget;
        const optionSelector = target.getAttribute('data-selector');
        this.analysisResultView.optionFocus(optionSelector);
    };

}