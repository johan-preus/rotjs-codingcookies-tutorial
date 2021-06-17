window.onload = function(){
    const display = new ROT.Display({ width: 80, height: 20 })
    const container = display.getContainer()
    
    let foreground, background, colors
    
    for (let i = 0; i < 15; i++) {
        foreground = ROT.Color.toRGB([255 - i * 20, 255 - i * 20, 255 - i * 20])
        background = ROT.Color.toRGB([i * 20, i * 20, i * 20])
        colors = "%c{" + foreground + "}%b{" + background + "}"
        const str = colors + "Hello world!"
        display.drawText(2, i, str)
        console.log(i, colors)
    }
    
    document.body.appendChild(container)
}

