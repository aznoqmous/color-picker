import ColorPicker, { ColorPickerEvents } from "./ColorPicker";


document.addEventListener('DOMContentLoaded', ()=>{
    let cp = new ColorPicker()
    cp.addEventListener(ColorPickerEvents.update, (e)=>{
        console.log(e.value)
    })
    document.body.appendChild(cp.container)
})