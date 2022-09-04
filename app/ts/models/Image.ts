import { v4 as uuidv4 } from '../../../node_modules/uuid/dist/esm-browser/index.js';

export class Image {

    private _file: string;
    private _url: string;
    private _uuid: string;

    constructor() {
        this._url = null;
        this._uuid = null;
    }

    set file(file) {
        this._file = file;
        this._uuid = uuidv4();
    }

    get file() {
        return this._file;
    }

    set url(url) {
        this._url = url;
    }

    get url() {
        return this._url;
    }

    get uuid() {
        return this._uuid;
    }

}