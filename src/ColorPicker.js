export default class ColorPicker {
    constructor(colorString=null){
        this.color = new Color()
        console.log(this)
        this.build()
        this.bind()
    }

    build(){
        this.container = this.createElement('div', {class: "color-picker"})

        this.colorCanvasContainer = this.createElement('div', {class:"color canvas-container"}, this.container)
        this.colorCircle = this.createElement('i', {class:"color-circle"}, this.colorCanvasContainer)
        this.colorCanvas = this.createElement('canvas', {
            width: 200,
            height: 100
        }, this.colorCanvasContainer)
        this.colorCanvasCtx = this.colorCanvas.getContext('2d')
        this.updateColorCanvas()

        this.hueCanvasContainer = this.createElement('div', {class:"hue canvas-container"}, this.container)
        this.hueCircle = this.createElement('i', {class:"color-circle"}, this.hueCanvasContainer)
        this.hueCanvas = this.createElement('canvas', {
            width: 200,
            height: 10
        }, this.hueCanvasContainer)
        this.hueCanvasCtx = this.hueCanvas.getContext('2d')
        this.updateHueCanvas()

        this.colorRow = this.createElement('div', {class: "color-row"}, this.container)
        this.colorDisplay = this.createElement('span', {class: "color-display"}, this.colorRow)
        this.colorInput = this.createElement('input', {type: "text"}, this.colorRow)
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
            this.color = new Color(this.colorInput.value)
            
        })
    }

    pickColor(e){
        if(!this.mouseDown) return;
        let rect = this.colorCanvas.getBoundingClientRect()
        let x = e.pageX - rect.x
        let y = e.pageY - rect.y
        this.colorCircle.x = x
        this.colorCircle.y = y
        this.colorCircle.style.left = this.colorCircle.x + "px"
        this.colorCircle.style.top = this.colorCircle.y + "px"
        this.updateColorDisplay()
    }
    pickHue(e){
        if(!this.mouseDown) return;
        let rect = this.hueCanvas.getBoundingClientRect()
        let x = e.pageX - rect.x
        let y = e.pageY - rect.y
        this.color.hsla.h = x / rect.width * 360
        this.updateColorCanvas()
        this.updateColorDisplay()
    }
    updateColorDisplay(){
        this.hueCircle.style.left = this.color.hsla.h / 360 * 100 + "%"
        this.color = Color.fromImageData(this.colorCanvasCtx.getImageData(this.colorCircle.x, this.colorCircle.y, 1, 1).data)
        this.colorInput.value = this.color.rgba.toString()
        this.colorDisplay.style.background = this.color.rgba.toString()
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
            l = (this.colorCanvas.height - y) / this.colorCanvas.height * 255
            for(let x = 0; x < this.colorCanvas.width; x++){
                currentColor.s = x / this.colorCanvas.width * 255
                currentColor.l = l * ((this.colorCanvas.width - x) / this.colorCanvas.width / 2 + 0.5)
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
        this.hexa = this.rgba.toHexa()
        this.hsla = this.rgba.toHsla()
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
    toHexa(){
        let r = this.r.toString(16);
        let g = this.g.toString(16);
        let b = this.b.toString(16);
        let a = this.a.toString(16);
      
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
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

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
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return new HslaColor(h,s,l,this.a);
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
}