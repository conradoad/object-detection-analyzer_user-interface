import { FacesDetectedController } from './controllers/FacesDetectedController.js';
import { ImageController } from './controllers/ImageController.js';
import { ParamsController } from './controllers/ParamsController.js';

const paramsController = new ParamsController();

console.log(paramsController.getParams());

const imageController = new ImageController();
const facesDetectedController = new FacesDetectedController(imageController, paramsController);

