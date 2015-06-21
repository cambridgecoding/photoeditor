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

    // should be private helper for ImageModel
    static initializePixelGrid(width, height) {
        var pixelGrid = new Array(height);
        for(var y = 0; y < height; y++) {
            pixelGrid[y] = new Array(width);
        }
        return pixelGrid;
    }
}

class RGBA {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    getRed() {
        return this.red;
    }

    getGreen() {
        return this.green;
    }

    getBlue() {
        return this.blue;
    }

    getAlpha() {
        return this.alpha;
    }
}

class ImageModel {

    constructor(width, height, pixelGrid) {
        this.width = width;
        this.height = height;
        this.pixelGrid = pixelGrid ? pixelGrid : ImageUtils.initializePixelGrid(width, height);
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    // factory method
    static fromImageData(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;

        var pixelGrid = ImageUtils.initializePixelGrid(width, height);

        for(var y = 0; y < height; y++) {
            var row = (y * width * 4);

            for(var x = 0; x < width; x++) {
                var index = row + (x * 4);
                var rgba = new RGBA(data[index], data[index+1], data[index+2], data[index+3]);
                pixelGrid[y][x] = rgba;
            }
        }
        return new ImageModel(width, height, pixelGrid);
    }

    // factory method
    static fromImgSrc(imgSrc) {
        var img = new Image();
        img.src = "img/cat.jpg";
        var data = ImageUtils.getPixels(img);
        return ImageModel.fromImageData(data);
    }

    toImageData() {

        var buffer = new ArrayBuffer(this.height * this.width * 4);

        var data = new Uint8ClampedArray(buffer);

        for(var y = 0; y < this.height; y++) {
            var row = (y * this.width * 4);

            for(var x = 0; x < this.width; x++) {
                var rgba = this.pixelGrid[y][x];

                var index =  row + (x * 4);

                data[index] = rgba.getRed();
                data[index + 1] = rgba.getGreen();
                data[index + 2] = rgba.getBlue();
                data[index + 3] = rgba.getAlpha();
            }
        }

        return new ImageData(data, this.width, this.height);
    }


    grayscale() {

        var newPixelGrid = ImageUtils.initializePixelGrid(this.width, this.height);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var rgba = this.pixelGrid[y][x];
                var average = (rgba.getRed() + rgba.getGreen() + rgba.getBlue()) / 3;
                //console.log(average);
                newPixelGrid[y][x] = new RGBA(average, average, average, rgba.getAlpha());

            }
        }

        this.pixelGrid = newPixelGrid;
        return this;
        //return new ImageModel(this.width, this.height, newPixelGrid);
    }

    invert() {
        var newPixelGrid = ImageUtils.initializePixelGrid(this.width, this.height);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var rgba = this.pixelGrid[y][x];
                var newRed = 255 - rgba.getRed();
                var newGreen = 255 - rgba.getGreen();
                var newBlue = 255 - rgba.getBlue();

                newPixelGrid[y][x] = new RGBA(newRed, newGreen, newBlue, rgba.getAlpha());
            }
        }

        this.pixelGrid = newPixelGrid;
        return this;
        //return new ImageModel(this.width, this.height, newPixelGrid);
    }

    brighten(adjustmentValue) {
        var newPixelGrid = ImageUtils.initializePixelGrid(this.width, this.height);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var rgba = this.pixelGrid[y][x];

                var newRed = Math.min(rgba.getRed() + adjustmentValue, 255);
                var newGreen = Math.min(rgba.getGreen() + adjustmentValue, 255);
                var newBlue = Math.min(rgba.getBlue() + adjustmentValue, 255);

                newPixelGrid[y][x] = new RGBA(newRed, newGreen, newBlue, rgba.getAlpha());
            }
        }

        this.pixelGrid = newPixelGrid;
        return this;
    }

    threshold(thresholdValue) {
        var newPixelGrid = ImageUtils.initializePixelGrid(this.width, this.height);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var rgba = this.pixelGrid[y][x];

                var average = (rgba.getRed() + rgba.getGreen() + rgba.getBlue()) / 3;

                var newValue = average >= thresholdValue ? 255 : 0;

                var newRed = newValue;
                var newGreen = newValue;
                var newBlue = newValue;

                newPixelGrid[y][x] = new RGBA(newRed, newGreen, newBlue, rgba.getAlpha());
            }
        }

        this.pixelGrid = newPixelGrid;
        return this;
    }
}

class ImageView extends ImageModel {
    constructor(imageModel) {
        super(imageModel.width, imageModel.height, imageModel.pixelGrid);
    }

    draw() {
        console.log(this.getHeight());
        var c = ImageUtils.getCanvas(this.width, this.height);
        var imageData = this.toImageData();
        ImageUtils.putPixels(imageData, this.width, this.height);
    }
}

$(document).ready(function() {

    var imageModel = ImageModel.fromImgSrc("img/cat.jpg");
    var imageView = new ImageView(imageModel);

    // various examples
    //imageView.brighten(40).threshold(120).draw();
    imageView.grayscale().invert().draw();

    // bonus:
    // refactor to using highorder fcts?
    // ignore pixels
    // convolution
});

