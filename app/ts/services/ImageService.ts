
export class ImageService {

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

    checkImageLoaded(image_uuid: string): Promise<boolean> {

        const reqInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                image_uuid: image_uuid,
            })
        }

        return fetch(this.baseUrl() + 'check_image_loaded', reqInit)
            .then(res => res.text())
            .then(res => res == 'true')
            .catch(err => {
                console.error(err.message);
                throw new Error('Some problem has ocurred whem trying request from server.\nPlease, check if server is running.')
            });

    }


    uploadImage(image_file): Promise<string> {

        const formData = new FormData();
        formData.append('image_data', image_file);

        const reqInit = {
            method: 'POST',
            body: formData
        }

        return fetch(this.baseUrl() + 'upload_image', reqInit)
            .then(res => res.json())
            .then(res => {
                if (res.status == 'ok') {
                    //chama próxima função
                    return res.msg;
                }
                else return res.msg;
            })
            .catch(err => {
                console.error(err.message);
                throw new Error('Some problem has ocurred when trying send image to server.\nPlease, check if server is running.')
            });

    }


}