import { Image } from '../models/Image.js';
import { ImageView } from '../views/ImageView.js';
import { ImageService } from '../services/ImageService.js';
import { SingleDetectionResult } from '../models/SingleDetectionResult';

const INIT_SETUP = {

}

export class ImageController {

    public image: Image;
    private imageView: ImageView;
    private inputFileElement: any;
    private imageService = new ImageService();


    constructor() {
        this.image = new Image()
        this.imageView = new ImageView('#imageViewer')
        this.inputFileElement = document.querySelector('#image-input-button')
        this.inputFileElement.addEventListener('change', this.atualiza)

    }

    private atualiza = () => {

        let file = this.inputFileElement.files[0];
        let url = URL.createObjectURL(file);
        this.image.file = file;
        this.image.url = url;
        this.imageView.update(this.image)
    }

    public uploadImage = async () => {

        //check if the image is already loaded in backend
        await this.imageService.checkImageLoaded(this.image.uuid)
            .then(async res => {
                if (res) {
                    console.log('Image already loaded');
                }
                else {
                    console.log('Image is not loaded');
                    await this.imageService.uploadImage(this.image.file)
                        .then(res => console.log(res))
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    
    public drawDetectedFaces(singleDetection: SingleDetectionResult) {
        this.removeFaces();
        this.imageView.drawFaces(singleDetection);
    }

    public removeFaces = () => {
        this.imageView.removeFaces();
    }
}

