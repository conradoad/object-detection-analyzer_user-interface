var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Image } from '../models/Image.js';
import { ImageView } from '../views/ImageView.js';
import { ImageService } from '../services/ImageService.js';
const INIT_SETUP = {};
export class ImageController {
    constructor() {
        this.imageService = new ImageService();
        this.atualiza = () => {
            let file = this.inputFileElement.files[0];
            let url = URL.createObjectURL(file);
            this.image.file = file;
            this.image.url = url;
            this.imageView.update(this.image);
        };
        this.uploadImage = () => __awaiter(this, void 0, void 0, function* () {
            //check if the image is already loaded in backend
            yield this.imageService.checkImageLoaded(this.image.uuid)
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                if (res) {
                    console.log('Image already loaded');
                }
                else {
                    console.log('Image is not loaded');
                    yield this.imageService.uploadImage(this.image.file)
                        .then(res => console.log(res));
                }
            }))
                .catch(err => {
                console.log(err);
            });
        });
        this.removeFaces = () => {
            this.imageView.removeFaces();
        };
        this.image = new Image();
        this.imageView = new ImageView('#imageViewer');
        this.inputFileElement = document.querySelector('#image-input-button');
        this.inputFileElement.addEventListener('change', this.atualiza);
    }
    drawDetectedFaces(singleDetection) {
        this.removeFaces();
        this.imageView.drawFaces(singleDetection);
    }
}
