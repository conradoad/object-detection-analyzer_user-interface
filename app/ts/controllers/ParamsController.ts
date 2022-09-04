import { Params } from '../models/Params.js';

const INIT_SETUP = {
    host: {
        inputSelector: '#hostInput',
        value: "127.0.0.1",
    },

    port: {
        inputSelector: '#portInput',
        value: "5000",
    },

    model: {
        inputSelector: '#modelSelector',
        optionIndex: 1,
    },


    sliders: [
        {
            inputSelector: '#minNeighborsInput',
            attributes: {
                min: '1',
                max: '10',
                step: '1',
                value: '3'
            },
            labelSelector: '#minNeighborsLabel',
            decimals: '0'
        },
        {
            inputSelector: '#numberOfSamplesInput',
            attributes: {
                min: '1',
                max: '10',
                step: '1',
                value: '3'
            },
            labelSelector: '#numberOfSamplesLabel',
            decimals: '0'
        }
    ],

    ranges: [
        {
            inputSelector: '#scaleFactorEndInput',
            value: "1.15",
        },
        {
            inputSelector: '#scaleFactorInitInput',
            value: "1.1",
        },
        {
            inputSelector: '#scaleFactorStepsInput',
            value: "5",
        },
        {
            inputSelector: '#minSizeInitInput',
            value: "2",
        },
        {
            inputSelector: '#minSizeEndInput',
            value: "10",
        },
        {
            inputSelector: '#minSizeStepsInput',
            value: "3",
        }

    ]

}

export class ParamsController {

    private hostInput: HTMLInputElement;
    private portInput: HTMLInputElement;

    private modelSelector: HTMLSelectElement;

    private minNeighborsInput: HTMLInputElement;
    private numberOfSamplesLabel: HTMLInputElement;

    private scaleFactorEndInput: HTMLInputElement;
    private scaleFactorInitInput: HTMLInputElement;
    private scaleFactorStepsInput: HTMLInputElement;

    private minSizeInitInput: HTMLInputElement;
    private minSizeEndInput: HTMLInputElement;
    private minSizeStepsInput: HTMLInputElement;

    constructor() {
        this.init();
    }

    private init() {

        this.hostInput = document.querySelector('#hostInput');
        this.portInput = document.querySelector('#portInput');
        this.modelSelector = document.querySelector('#modelSelector');

        this.hostInput.value = INIT_SETUP.host.value;
        this.portInput.value = INIT_SETUP.port.value;
        this.modelSelector.selectedIndex = INIT_SETUP.model.optionIndex;

        INIT_SETUP.sliders.forEach(rangeInput => {
            const inputElement = document.querySelector(rangeInput.inputSelector);
            inputElement.setAttribute('min', rangeInput.attributes.min);
            inputElement.setAttribute('max', rangeInput.attributes.max);
            inputElement.setAttribute('step', rangeInput.attributes.step);
            inputElement.setAttribute('value', rangeInput.attributes.value);

            const labelElement = document.querySelector(rangeInput.labelSelector);
            labelElement.textContent = rangeInput.attributes.value;

            inputElement.addEventListener('change', (e) => {
                let trg: HTMLInputElement | any;
                trg = e.target;
                labelElement.textContent = trg.value;
            })
        });

        INIT_SETUP.ranges.forEach(input => {
            const inputElement: HTMLInputElement = document.querySelector(input.inputSelector);
            inputElement.value = input.value;
        });

        this.minNeighborsInput = document.querySelector('#minNeighborsInput');
        this.numberOfSamplesLabel = document.querySelector('#numberOfSamplesInput');

        this.scaleFactorEndInput = document.querySelector('#scaleFactorEndInput');
        this.scaleFactorInitInput = document.querySelector('#scaleFactorInitInput');
        this.scaleFactorStepsInput = document.querySelector('#scaleFactorStepsInput');

        this.minSizeInitInput = document.querySelector('#minSizeInitInput');
        this.minSizeEndInput = document.querySelector('#minSizeEndInput');
        this.minSizeStepsInput = document.querySelector('#minSizeStepsInput');
    }

    public getParams() {

        const params: Params = {
            model: this.modelSelector.value,
            minNeighbors: +this.minNeighborsInput.value,
            numberOfSamples: +this.numberOfSamplesLabel.value,
            scaleFactor_x_axis: {
                from: +this.scaleFactorInitInput.value,
                to: +this.scaleFactorEndInput.value,
                steps: +this.scaleFactorStepsInput.value,
            },
            minSize_y_axis: {
                from: +this.minSizeInitInput.value / 100,
                to: +this.minSizeEndInput.value / 100,
                steps: +this.minSizeStepsInput.value,
            }

        }

        return params;
    }

    public getMinNeighbors() {

        return this.minNeighborsInput.value;
    }

    public getNumberOfSamples() {
        return this.numberOfSamplesLabel.value;
    }

}