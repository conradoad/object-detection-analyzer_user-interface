import { AnalysisResult } from '../models/AnalysisResult.js';
import { Params } from '../models/Params.js';

export class AnalysisService {

    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;

    constructor() {
        this.hostInput = document.querySelector('#hostInput');
        this.portInput = document.querySelector('#portInput');
    }

    baseUrl(): string {
        const host = this.hostInput.value;
        const port = this.portInput.value;

        return `http://${host}:${port}/`;
    }

    requestAnalysis(params: Params): Promise<any> {

        const reqInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                params: params,
            })
        }

        return fetch(this.baseUrl() + 'detection_analysis', reqInit)
            .then(res => res.json())
            .then((res) => res)
            .catch(err => {
                console.error(err.message);
                throw new Error('Some problem has ocurred whem trying request from server.\nPlease, check if server is running.')
            });

    }

    requestMetrics(params: any): Promise<any> {

        const reqInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                params: params,
            })
        }

        return fetch(this.baseUrl() + 'metrics', reqInit)
            .then(res => res.json())
            .then((res) => res)
            .catch(err => {
                console.error(err.message);
                throw new Error('Some problem has ocurred whem trying request from server.\nPlease, check if server is running.')
            });

    }
}