/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ColorPicker.js":
/*!****************************!*\
  !*** ./src/ColorPicker.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Color\": () => (/* binding */ Color),\n/* harmony export */   \"HexaColor\": () => (/* binding */ HexaColor),\n/* harmony export */   \"HslaColor\": () => (/* binding */ HslaColor),\n/* harmony export */   \"RgbaColor\": () => (/* binding */ RgbaColor),\n/* harmony export */   \"default\": () => (/* binding */ ColorPicker)\n/* harmony export */ });\nclass ColorPicker {\r\n    constructor(colorString=null){\r\n        this.color = new Color()\r\n        console.log(this)\r\n        this.build()\r\n        this.bind()\r\n    }\r\n\r\n    build(){\r\n        this.container = this.createElement('div', {class: \"color-picker\"})\r\n\r\n        this.colorCanvasContainer = this.createElement('div', {class:\"color canvas-container\"}, this.container)\r\n        this.colorCircle = this.createElement('i', {class:\"color-circle\"}, this.colorCanvasContainer)\r\n        this.colorCanvas = this.createElement('canvas', {\r\n            width: 200,\r\n            height: 100\r\n        }, this.colorCanvasContainer)\r\n        this.colorCanvasCtx = this.colorCanvas.getContext('2d')\r\n        this.updateColorCanvas()\r\n\r\n        this.hueCanvasContainer = this.createElement('div', {class:\"hue canvas-container\"}, this.container)\r\n        this.hueCircle = this.createElement('i', {class:\"color-circle\"}, this.hueCanvasContainer)\r\n        this.hueCanvas = this.createElement('canvas', {\r\n            width: 200,\r\n            height: 10\r\n        }, this.hueCanvasContainer)\r\n        this.hueCanvasCtx = this.hueCanvas.getContext('2d')\r\n        this.updateHueCanvas()\r\n\r\n        this.colorRow = this.createElement('div', {class: \"color-row\"}, this.container)\r\n        this.colorDisplay = this.createElement('span', {class: \"color-display\"}, this.colorRow)\r\n        this.colorInput = this.createElement('input', {type: \"text\"}, this.colorRow)\r\n    }\r\n\r\n    bind(){\r\n        this.mouseDown = false\r\n        this.colorCanvas.addEventListener('mousedown', (e)=>{ \r\n            this.mouseDown = true \r\n            this.pickColor(e)\r\n        })\r\n        this.colorCanvas.addEventListener('mouseup', (e)=>{ this.mouseDown = false })\r\n        this.colorCanvas.addEventListener('mouseleave', (e)=>{ this.mouseDown = false })\r\n        this.colorCanvas.addEventListener('mousemove', (e)=>{\r\n            this.pickColor(e)\r\n        })\r\n\r\n        this.hueCanvas.addEventListener('mousedown', (e)=>{\r\n            this.mouseDown = true \r\n            this.pickHue(e)\r\n        })\r\n        this.hueCanvas.addEventListener('mouseup', (e)=>{ this.mouseDown = false })\r\n        this.hueCanvas.addEventListener('mouseleave', (e)=>{ this.mouseDown = false })\r\n        this.hueCanvas.addEventListener('mousemove', (e)=>{ this.pickHue(e)})\r\n\r\n        this.colorInput.addEventListener('input', ()=>{\r\n            this.color = new Color(this.colorInput.value)\r\n            \r\n        })\r\n    }\r\n\r\n    pickColor(e){\r\n        if(!this.mouseDown) return;\r\n        let rect = this.colorCanvas.getBoundingClientRect()\r\n        let x = e.pageX - rect.x\r\n        let y = e.pageY - rect.y\r\n        this.colorCircle.x = x\r\n        this.colorCircle.y = y\r\n        this.colorCircle.style.left = this.colorCircle.x + \"px\"\r\n        this.colorCircle.style.top = this.colorCircle.y + \"px\"\r\n        this.updateColorDisplay()\r\n    }\r\n    pickHue(e){\r\n        if(!this.mouseDown) return;\r\n        let rect = this.hueCanvas.getBoundingClientRect()\r\n        let x = e.pageX - rect.x\r\n        let y = e.pageY - rect.y\r\n        this.color.hsla.h = x / rect.width * 360\r\n        this.updateColorCanvas()\r\n        this.updateColorDisplay()\r\n    }\r\n    updateColorDisplay(){\r\n        this.hueCircle.style.left = this.color.hsla.h / 360 * 100 + \"%\"\r\n        this.color = Color.fromImageData(this.colorCanvasCtx.getImageData(this.colorCircle.x, this.colorCircle.y, 1, 1).data)\r\n        this.colorInput.value = this.color.rgba.toString()\r\n        this.colorDisplay.style.background = this.color.rgba.toString()\r\n        this.colorCircle.style.background = this.color.rgba.toString()\r\n        this.colorCircle.style.outlineColor = this.color.rgba.toString()\r\n    }\r\n\r\n    updateHueCanvas(){\r\n        this.hueCanvasCtx.clearRect(0, 0, this.hueCanvas.width, this.hueCanvas.height)\r\n        let currentColor = new HslaColor(0, 0.7*255, 0.5*255, 1)\r\n        for(let x = 0; x < this.hueCanvas.width; x++){\r\n            currentColor.h = x / this.hueCanvas.width * 360\r\n            this.hueCanvasCtx.fillStyle = currentColor.toString()\r\n            this.hueCanvasCtx.fillRect(x, 0, 1, this.hueCanvas.height)\r\n        }\r\n    }\r\n    updateColorCanvas(){\r\n        this.colorCanvasCtx.clearRect(0, 0, this.colorCanvas.width, this.colorCanvas.height)\r\n        let currentColor = new HslaColor(this.color.hsla.h, 0, 0, 1)\r\n        let l = 0\r\n        for(let y = 0; y < this.colorCanvas.height; y++){\r\n            l = (this.colorCanvas.height - y) / this.colorCanvas.height * 255\r\n            for(let x = 0; x < this.colorCanvas.width; x++){\r\n                currentColor.s = x / this.colorCanvas.width * 255\r\n                currentColor.l = l * ((this.colorCanvas.width - x) / this.colorCanvas.width / 2 + 0.5)\r\n                this.colorCanvasCtx.fillStyle = currentColor.toString()\r\n                this.colorCanvasCtx.fillRect(x, y, 1, 1)\r\n            }\r\n        }\r\n    }\r\n\r\n    createElement(tagName='div', attributes={}, parent=null){\r\n        let element = document.createElement(tagName)\r\n        for(let key in attributes) element.setAttribute(key, attributes[key])\r\n        if(parent) parent.appendChild(element)\r\n        return element\r\n    }\r\n}\r\n\r\nclass Color {\r\n    constructor(colorString=\"#fff\"){\r\n        this.setFromString(colorString)\r\n    }\r\n\r\n    setFromString(colorString){\r\n        this.rgba = Color.stringToRGBA(colorString)\r\n        this.hexa = this.rgba.toHexa()\r\n        this.hsla = this.rgba.toHsla()\r\n    }\r\n\r\n    static fromImageData(datas){\r\n        return new Color(`rgba(${datas[0]},${datas[1]},${datas[2]},${datas[3]})`)\r\n    }\r\n\r\n    static stringToRGBA(string){\r\n        let canvas = document.createElement('canvas')\r\n        canvas.width = 1\r\n        canvas.height = 1\r\n        let ctx = canvas.getContext('2d')\r\n        ctx.fillStyle = string\r\n        ctx.fillRect(0, 0, 1, 1)\r\n        let datas = ctx.getImageData(0, 0, 1, 1).data\r\n        return new RgbaColor(datas[0], datas[1], datas[2], datas[3])\r\n    }\r\n}\r\n\r\nclass RgbaColor {\r\n    constructor(r, g, b, a){\r\n        this.r = r\r\n        this.g = g\r\n        this.b = b\r\n        this.a = a\r\n    }\r\n    toString(){\r\n        return `rgba(${this.r},${this.g},${this.b},${this.a})`\r\n    }\r\n    toHexa(){\r\n        let r = this.r.toString(16);\r\n        let g = this.g.toString(16);\r\n        let b = this.b.toString(16);\r\n        let a = this.a.toString(16);\r\n      \r\n        if (r.length == 1)\r\n          r = \"0\" + r;\r\n        if (g.length == 1)\r\n          g = \"0\" + g;\r\n        if (b.length == 1)\r\n          b = \"0\" + b;\r\n        if (a.length == 1)\r\n          a = \"0\" + a;\r\n      \r\n        return new HexaColor(r, g, b, a);\r\n    }\r\n    toHsla(){\r\n        // Make r, g, and b fractions of 1\r\n        let r = this.r / 255;\r\n        let g = this.g / 255;\r\n        let b = this.b / 255;\r\n\r\n        // Find greatest and smallest channel values\r\n        let cmin = Math.min(r,g,b),\r\n        cmax = Math.max(r,g,b),\r\n        delta = cmax - cmin,\r\n        h = 0,\r\n        s = 0,\r\n        l = 0;\r\n\r\n        // Calculate hue\r\n        // No difference\r\n        if (delta == 0)\r\n        h = 0;\r\n        // Red is max\r\n        else if (cmax == r)\r\n        h = ((g - b) / delta) % 6;\r\n        // Green is max\r\n        else if (cmax == g)\r\n        h = (b - r) / delta + 2;\r\n        // Blue is max\r\n        else\r\n        h = (r - g) / delta + 4;\r\n\r\n        h = Math.round(h * 60);\r\n        \r\n        // Make negative hues positive behind 360°\r\n        if (h < 0)\r\n        h += 360;\r\n\r\n        // Calculate lightness\r\n        l = (cmax + cmin) / 2;\r\n\r\n        // Calculate saturation\r\n        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));\r\n\r\n        // Multiply l and s by 100\r\n        s = +(s * 100).toFixed(1);\r\n        l = +(l * 100).toFixed(1);\r\n\r\n        return new HslaColor(h,s,l,this.a);\r\n    }\r\n}\r\n\r\nclass HexaColor{\r\n    constructor(r, g, b, a){\r\n        this.r = r\r\n        this.g = g\r\n        this.b = b\r\n        this.a = a\r\n    }\r\n    toString(){\r\n        return `#${this.r}${this.g}${this.b}${this.a}`\r\n    }\r\n}\r\n\r\nclass HslaColor{\r\n    constructor(h,s,l,a){\r\n        this.h = h\r\n        this.s = s\r\n        this.l = l\r\n        this.a = a\r\n    }\r\n    toString(){\r\n        return `hsla(${this.h},${this.s/255*100}%,${this.l/255*100}%,${this.a})`\r\n    }\r\n}\n\n//# sourceURL=webpack://color-picker/./src/ColorPicker.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ColorPicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorPicker */ \"./src/ColorPicker.js\");\n\r\n\r\n\r\ndocument.addEventListener('DOMContentLoaded', ()=>{\r\n    let cp = new _ColorPicker__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\r\n    document.body.appendChild(cp.container)\r\n})\n\n//# sourceURL=webpack://color-picker/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;