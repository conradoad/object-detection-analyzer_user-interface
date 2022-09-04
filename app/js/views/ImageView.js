export class ImageView {
    constructor(selector) {
        this.imageViewerElement = document.querySelector(selector);
        this.detectedFaces = [];
        window.addEventListener("resize", () => { this.removeFaces(); this.drawFaces(); });
    }
    _template(image) {
        return `
            <img class="img-fluid" src="${image.url}">
        `;
    }
    update(image) {
        this.imageViewerElement.innerHTML = this._template(image);
        this.imageElement = this.imageViewerElement.querySelector('img');
    }
    drawFaces(singleDetectionResult) {
        if (singleDetectionResult)
            this.detectedFaces = singleDetectionResult.detectedFaces;
        const imgWidth = this.imageElement.width;
        const imgHeight = this.imageElement.height;
        this.detectedFaces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.innerHTML = `
            <div class="face-rect"
            style="
                position: absolute;
                border: 2px solid #00FF00;
                top: ${face.perc_y * imgHeight}px;
                left: ${face.perc_x * imgWidth}px;
                height: ${face.perc_h * imgHeight}px;
                width: ${face.perc_w * imgWidth}px;
            "
            ></div>
            `;
            this.imageViewerElement.appendChild(faceElement);
        });
    }
    removeFaces() {
        this.imageViewerElement.querySelectorAll('.face-rect')
            .forEach(elm => elm.remove());
    }
}
