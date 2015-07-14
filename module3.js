class ImageUtils {

    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0,0,c.width,c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

    // new in module 3
    static fromImageData(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;

        var pixelGrid = initializePixelGrid(height);

        for(var y = 0; y < height; y++) {
            var row = (y * width * 4);

            for(var x = 0; x < width; x++) {
                var index = row + (x * 4);
                var rgba = new RGBA(data[index], data[index+1], data[index+2], data[index+3]);
                pixelGrid[y][x] = rgba;
            }
        }
        return new ImageModel(height, width, pixelGrid);
    }

    // new in module 3
    static fromImgSrc(imgSrc) {
        var img = new Image();
        img.src = imgSrc;
        var data = ImageUtils.getPixels(img);
        return ImageUtils.fromImageData(data);
    }

    // new in module 3
    static toImageData(imageModel) {

        console.log(imageModel);
        var buffer = new ArrayBuffer(imageModel.height * imageModel.width * 4);

        var data = new Uint8ClampedArray(buffer);

        for(var y = 0; y < imageModel.height; y++) {
            var row = (y * imageModel.width * 4);

            for(var x = 0; x < imageModel.width; x++) {
                var rgba = imageModel.pixelGrid[y][x];

                var index =  row + (x * 4);

                data[index] = rgba.red;
                data[index + 1] = rgba.green;
                data[index + 2] = rgba.blue;
                data[index + 3] = rgba.alpha;
            }
        }

        return new ImageData(data, imageModel.width, imageModel.height);
    }

    // new in module 3
    static drawImageModel(imageModel) {
        var c = ImageUtils.getCanvas(imageModel.width, imageModel.height);
        var imageData = ImageUtils.toImageData(imageModel);
        ImageUtils.putPixels(imageData, imageModel.width, imageModel.height);
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class RGBA {
    constructor(redValue, greenValue, blueValue, alphaValue) {
        this.red = redValue;
        this.green = greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}


// class definitions here

$(document).ready(function() {
    var img = new Image();
    img.src = "img/cat.jpg";



});