# aznoqmous/color-picker

a light js color picker

![Color picker preview](https://github.com/aznoqmous/color-picker/blob/master/color-picker.png)

## Get started
```js

let cp = new ColorPicker({
    // Default values
    defaultColor: "#ffffff",
    defaultFormat: "hexa",
    allowedFormats: "hexa,hsla,rgba"
    width: 200, // canvas width
    height: 100 // canvas height
})

document.body.appendChild(cp.container) // append the color picker container to the DOM

cp.addEventListener(ColorPickerEvents.update, (e)=>{
    console.log(e.value) // output the color picker input value
})
```

## Use Color Picker default style
Default Color Picker style is located in `/dist/main.min.css`
