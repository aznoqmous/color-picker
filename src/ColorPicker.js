import "./extensions"

export default class ColorPicker extends EventTarget {
    constructor(opts={}){
        super()

        this.opts = Object.assign({
            defaultColor: "#ffffff",
            formats: "hex,rgb,hsl",
            width: 200,
            height: 100
        }, opts)

        this.color = new Color(this.opts.defaultColor)
        this.defaultFormats = {
            hexa: HexaColor,
            rgba: RgbaColor,
            hsla: HslaColor,
            hex: HexaColor,
            rgb: RgbaColor,
            hsl: HslaColor
        }
        this.formats = Object.fromEntries(
            Object.keys(this.defaultFormats)
            .filter(key => this.opts.formats.split(',').includes(key))
            .map(key => [key, this.defaultFormats[key]])
        )

        this.build()
        this.bind()
    }

    build(){
        this.container = this.createElement('div', {class: "color-picker"})

        this.colorCanvasContainer = this.createElement('div', {class:"color canvas-container"}, this.container)
        this.colorCircle = this.createElement('i', {class:"color-circle"}, this.colorCanvasContainer)
        this.colorCircle.x = 0
        this.colorCircle.y = 0
        this.colorCanvas = this.createElement('canvas', {
            width: this.opts.width,
            height: this.opts.height
        }, this.colorCanvasContainer)
        this.colorCanvasCtx = this.colorCanvas.getContext('2d')
        this.updateColorCanvas()

        this.hueCanvasContainer = this.createElement('div', {class:"hue canvas-container"}, this.container)
        this.hueCircle = this.createElement('i', {class:"color-circle"}, this.hueCanvasContainer)
        this.hueCanvas = this.createElement('canvas', {
            width: this.opts.width,
            height: 10
        }, this.hueCanvasContainer)
        this.hueCanvasCtx = this.hueCanvas.getContext('2d')
        this.updateHueCanvas()

        this.colorRow = this.createElement('div', {class: "color-row"}, this.container)
        this.colorDisplay = this.createElement('span', {class: "color-display"}, this.colorRow)
        this.colorInput = this.createElement('input', {type: "text"}, this.colorRow)

        this.formatSelect = this.createElement('select', {class: "format-select"}, this.colorRow)
        Object.keys(this.formats).map((key, i) => {
            this.formatSelect.add(new Option(key, key, !i))
        })

        this.setColorFromString(this.opts.defaultColor)
        this.dispatchEvent(new ColorPickerUpdateEvent(this.colorInput.value))

        this.updateColorDisplay()
        this.colorInput.value = this.opts.defaultColor
    }

    get selectedFormatKey(){
        return this.formatSelect.selectedOptions[0].value
    }

    isFormatEnabled(formatKey){
        return Object.keys(this.formats).includes(formatKey)
    }
    guessFormat(string){
        let format =  this.selectedFormatKey
        if(string.match(/^rgb/) && this.isFormatEnabled('rgb')) format = 'rgb'
        if(string.match(/^rgba/) && this.isFormatEnabled('rgba')) format = 'rgba'
        if(string.match(/^hsl/) && this.isFormatEnabled('hsl')) format = 'hsl'
        if(string.match(/^hsla/) && this.isFormatEnabled('hsla')) format = 'hsla'
        if(string.match(/^#/)) {
            if(this.isFormatEnabled('hex')) format = 'hex'
            if(this.isFormatEnabled('hexa')) format = 'hexa'
            if(this.isFormatEnabled('hexa') && this.isFormatEnabled('hex')) format = (string.length - 1) % 3 ? 'hexa' : 'hex'
        }
        if(this.isFormatEnabled(format)) return format
        return this.selectedFormatKey
    }

    bind(){
        this.mouseDown = false
        this.colorCanvas.addEventListener('mousedown', (e)=>{ 
            this.mouseDown = true 
            this.pickColor(e)
        })
        this.colorCanvas.addEventListener('mouseup', (e)=>{ this.mouseDown = false })
        this.colorCanvas.addEventListener('mouseleave', (e)=>{ this.mouseDown = false })
        this.colorCanvas.addEventListener('mousemove', (e)=>{
            this.pickColor(e)
        })

        this.hueCanvas.addEventListener('mousedown', (e)=>{
            this.mouseDown = true 
            this.pickHue(e)
        })
        this.hueCanvas.addEventListener('mouseup', (e)=>{ this.mouseDown = false })
        this.hueCanvas.addEventListener('mouseleave', (e)=>{ this.mouseDown = false })
        this.hueCanvas.addEventListener('mousemove', (e)=>{ this.pickHue(e)})

        this.colorInput.addEventListener('input', ()=>{
            let value = this.colorInput.value
            let selectionStart = this.colorInput.selectionStart
            this.setColorFromString(value)
            this.colorInput.selectionStart = selectionStart
            this.colorInput.selectionEnd = selectionStart
            this.dispatchEvent(new ColorPickerUpdateEvent(this.colorInput.value))
        })
        this.colorInput.addEventListener('focus', ()=> this.colorInput.select())
        this.formatSelect.addEventListener('input', ()=>{
            this.updateColorDisplay()
            this.dispatchEvent(new ColorPickerUpdateEvent(this.colorInput.value))
        })

    }

    setColorFromString(value){
        this.formatSelect.value = this.guessFormat(value)
        this.color = new Color(value)
        console.log(this.color)
        this.colorCircle.x = this.color.hsla.s / 255 * this.colorCanvas.width
        this.colorCircle.y =  (1 - this.color.hsla.l / 255) * this.colorCanvas.height
        this.updateColorCanvas()
        this.updateColorDisplay()
        this.colorInput.value = value
    }
    pickColor(e){
        if(!this.mouseDown) return;
        let rect = this.colorCanvas.getBoundingClientRect()
        let x = e.pageX - rect.x
        let y = e.pageY - rect.y - window.scrollY
        this.colorCircle.x = x
        this.colorCircle.y = y
        this.updateColorDisplay()
        this.dispatchEvent(new ColorPickerUpdateEvent(this.colorInput.value))
    }
    pickHue(e){
        if(!this.mouseDown) return;
        let rect = this.hueCanvas.getBoundingClientRect()
        let x = e.pageX - rect.x
        this.color.hsla.h = x / rect.width * 360
        this.updateColorCanvas()
        this.updateColorDisplay()
        this.dispatchEvent(new ColorPickerUpdateEvent(this.colorInput.value))
    }
    updateColorDisplay(){
        this.hueCircle.style.left = this.color.hsla.h / 360 * 100 + "%"
        this.colorCircle.style.left = this.colorCircle.x + "px"
        this.colorCircle.style.top = this.colorCircle.y + "px"
        this.colorCircle.x = Math.clamp(this.colorCircle.x, 0, this.colorCanvas.width-1)
        this.colorCircle.y = Math.clamp(this.colorCircle.y, 0, this.colorCanvas.height-1)
        this.color = Color.fromImageData(this.colorCanvasCtx.getImageData(this.colorCircle.x, this.colorCircle.y, 1, 1).data)
        this.colorInput.value = this.color[this.selectedFormatKey].toHumanString()
        this.colorDisplay.style.background = this.colorInput.value
        this.colorCircle.style.background = this.color.rgba.toString()
        this.colorCircle.style.outlineColor = this.color.rgba.toString()
    }

    updateHueCanvas(){
        this.hueCanvasCtx.clearRect(0, 0, this.hueCanvas.width, this.hueCanvas.height)
        let currentColor = new HslaColor(0, 0.7*255, 0.5*255, 1)
        for(let x = 0; x < this.hueCanvas.width; x++){
            currentColor.h = x / this.hueCanvas.width * 360
            this.hueCanvasCtx.fillStyle = currentColor.toString()
            this.hueCanvasCtx.fillRect(x, 0, 1, this.hueCanvas.height)
        }
    }
    updateColorCanvas(){
        this.colorCanvasCtx.clearRect(0, 0, this.colorCanvas.width, this.colorCanvas.height)
        let currentColor = new HslaColor(this.color.hsla.h, 0, 0, 1)
        let l = 0
        for(let y = 0; y < this.colorCanvas.height; y++){
            l = (1 - y/ this.colorCanvas.height)
            for(let x = 0; x < this.colorCanvas.width; x++){
                currentColor.s = x / this.colorCanvas.width * 255
                currentColor.l = l * 255
                this.colorCanvasCtx.fillStyle = currentColor.toString()
                this.colorCanvasCtx.fillRect(x, y, 1, 1)
            }
        }
    }

    createElement(tagName='div', attributes={}, parent=null){
        let element = document.createElement(tagName)
        for(let key in attributes) element.setAttribute(key, attributes[key])
        if(parent) parent.appendChild(element)
        return element
    }
}

export class Color {
    constructor(colorString="#fff"){
        this.setFromString(colorString)
    }

    setFromString(colorString){
        this.rgba = Color.stringToRGBA(colorString)
        this.hexa = this.toHexa()
        this.hsla = this.toHsla()
        this.rgb = new RgbColor(this.rgba.r, this.rgba.g, this.rgba.b)
        this.hex = new HexColor(this.hexa.r, this.hexa.g, this.hexa.b)
        this.hsl = new HslColor(this.hsla.h, this.hsla.s, this.hsla.l)
    }

    static fromImageData(datas){
        return new Color(`rgba(${datas[0]},${datas[1]},${datas[2]},${datas[3]})`)
    }

    static stringToRGBA(string){
        let canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = string
        ctx.fillRect(0, 0, 1, 1)
        let datas = ctx.getImageData(0, 0, 1, 1).data
        return new RgbaColor(datas[0], datas[1], datas[2], datas[3])
    }

    toHexa(){
        let r = this.rgba.r.toString(16);
        let g = this.rgba.g.toString(16);
        let b = this.rgba.b.toString(16);
        let a = this.rgba.a.toString(16);
      
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
        if (a.length == 1)
          a = "0" + a;
      
        return new HexaColor(r, g, b, a);
    }
    toHsla(){
        // Make r, g, and b fractions of 1
        let r = this.rgba.r / 255;
        let g = this.rgba.g / 255;
        let b = this.rgba.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

        // Calculate hue
        // No difference
        if (delta == 0)
        h = 0;
        // Red is max
        else if (cmax == r)
        h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
        h = (b - r) / delta + 2;
        // Blue is max
        else
        h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        
        // Make negative hues positive behind 360°
        if (h < 0)
        h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        // Multiply l and s by 100
        s = +(s * 255).toFixed(1);
        l = +(l * 255).toFixed(1);

        return new HslaColor(h,s,l,this.rgba.a);
    }
}

export class RgbColor {
    constructor(r, g, b){
        this.r = r
        this.g = g
        this.b = b
    }
    toString(){
        return `rgb(${this.r},${this.g},${this.b})`
    }
    toHumanString(){
        return this.toString()
    }
}

export class RgbaColor {
    constructor(r, g, b, a){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    toString(){
        return `rgba(${this.r},${this.g},${this.b},${this.a})`
    }
    toHumanString(){
        return `rgba(${this.r},${this.g},${this.b},${Math.floor(this.a/255*100)/100})`
    }
}

export class HexColor{
    constructor(r, g, b){
        this.r = r
        this.g = g
        this.b = b
    }
    toString(){
        return `#${this.r}${this.g}${this.b}`
    }
    toHumanString(){
        return this.toString()
    }
}

export class HexaColor{
    constructor(r, g, b, a){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    toString(){
        return `#${this.r}${this.g}${this.b}${this.a}`
    }
    toHumanString(){
        return this.toString()
    }
}

export class HslColor{
    constructor(h,s,l){
        this.h = h
        this.s = s
        this.l = l
    }
    toString(){
        return `hsl(${this.h},${this.s/255*100}%,${this.l/255*100}%)`
    }
    toHumanString(){
        return `hsl(${this.h},${Math.round(this.s/255*100)}%,${Math.round(this.l/255*100)}%)`
    }
}

export class HslaColor{
    constructor(h,s,l,a){
        this.h = h
        this.s = s
        this.l = l
        this.a = a
    }
    toString(){
        return `hsla(${this.h},${this.s/255*100}%,${this.l/255*100}%,${this.a})`
    }
    toHumanString(){
        return `hsla(${this.h},${Math.round(this.s/255*100)}%,${Math.round(this.l/255*100)}%,${Math.floor(this.a/255*100)/100})`
    }
}

export const ColorPickerEvents = {
    update: "colorPicker_update"
}

export class ColorPickerUpdateEvent extends Event {
    constructor(value){
        super(ColorPickerEvents.update)
        this.value = value
    }
}