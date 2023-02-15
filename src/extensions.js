Math.clamp = function(value, min=0, max=1){
    return Math.max(Math.min(value, max), min)
}