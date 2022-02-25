var makerjs = require('makerjs');


const pthickness = {
    "16# Bond": {caliper: 0.003},
    "18# Bond": {caliper: 0.003},
    "20# Bond": {caliper: 0.004},
    "24# Bond": {caliper: 0.005},
    "28# Bond": {caliper: 0.006},
    "32# Bond": {caliper: 0.006},
    "70# Text": {caliper: 0.006},
    "80# Text": {caliper: 0.006},
    "60# Card": {caliper: 0.007},
    "80# Card": {caliper: 0.009},
    "90# Card": {caliper: 0.01},
    "110# Card": {caliper: 0.0135}
};

const app = new Vue({
    el: "#app",
    data: {
        pages: 200,
        paper_type: "20# Bond",
        cover_material: "",
        width: 5,
        height: 7,
        gap: 0.5,
        offset: 0.1875
    },
    computed: {
        paper_types () {
            return Object.keys(pthickness);
        },
        paper_thickness () {
            return pthickness[this.paper_type].caliper;
        },
        sheets () {
            return parseInt(this.pages) / 2;
        },
        block_thickness () {
            return this.sheets * this.paper_thickness;
        },
        board_dims () {
            return {width: parseFloat(this.width), height: parseFloat(this.height) + 0.25};
        },
        spine_dims () {
            return {width: parseFloat(this.block_thickness), height: parseFloat(this.height) + 0.25};
        },
        wrap_dimensions () {
            const width = (this.gap * 2 + this.board_dims.width * 2 + this.offset * 2 + this.spine_dims.width);
            const height = (this.board_dims.height + this.gap * 2);

            return {width, height};
        },
        b1 () {
            const x = this.gap;
            const y = this.gap;
            let box = new Box([x,y],this.board_dims.width, this.board_dims.height);
            box.layer = "blue";
            return box;
        },
        b2 () {
            const x = (this.gap + this.board_dims.width + this.offset * 2 + this.spine_dims.width);
            const y = this.gap;
            let box = new Box([x,y], this.board_dims.width, this.board_dims.height);
            box.layer = "blue";
            return box;
        },
        spine () {
            const x = (this.gap + this.board_dims.width + this.offset);
            const y = this.gap;
            let box = new Box([x, y], this.spine_dims.width, this.spine_dims.height);
            box.layer = "blue";
            return box;
        },
        wrap () {
            let box = new Box([0,0],this.wrap_dimensions.width,this.wrap_dimensions.height);
            box.layer = "red";
            return box;
        },
        drawing () {
            const model = {
                models: {wrap: this.wrap, b1: this.b1, s: this.spine, b2: this.b2},
            };

            console.log("MODEL:", model);
            let svg = makerjs.exporter.toSVG(model, {useSvgPathOnly: false, scale: 50});

            return svg;
        }
    },
    methods: {
        download () {

            const model = {
                models: {
                    wrap: this.wrap,
                    b1: this.b1,
                    b2: this.b2,
                    s: this.spine
                },
                units: makerjs.unitType.Inch
            };

            const svg = makerjs.exporter.toSVG(model);
            const blob = new Blob([svg.toString()]);
            const element = document.createElement("a");
            element.download = "case.svg";
            element.href = window.URL.createObjectURL(blob);
            element.click();
            element.remove();
        }
    }
});


function Box (origin, width, height) {
    this.models = {
        outer: new makerjs.models.Rectangle(width, height)
    };

    this.origin = origin;
}