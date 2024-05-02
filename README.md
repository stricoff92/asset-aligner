# asset-aligner

A tool for mapping relative coordinates to an asset.

 - Uses `localStorage` (zombie cookies) to save last executed configuration.


### Configuration Syntax

 - `assetFileName FILE_NAME` __required__. the image file name to draw
 - `mupm UNSIGNED_INTEGER` __required__. map units per meter. Pixels per meter with no scaling
 - `assetWidthMeters POSITIVE_FLOAT` __required__. the width of the asset in meters (no rotations)
 - `assetHeightMeters POSITIVE_FLOAT` __required__. the height of the asset in meters (no rotations)
 - `addCenterDot` places a dot in the center of the image
 - `centerDotColor HTML_COLOR_HEX` set the color of the center dot. Defaults to `#f00`
 - `addScaleBar` adds a map scale to the rendering
 - `refDot RELATIVE_X,RELATIVE_Y,HTML_COLOR_HEX` places a dot with a coordinate relative to the center of the unrotated asset center. You can add as many refDots as you please.


Example config
```
addCenterDot
centerDotColor #0f0
addScaleBar
mupm 600
assetFileName sword.svg
assetWidthMeters: 0.12
assetHeightMeters: 0.8
refDot 0,0.4,#fff
refDot 0,-0.47,#f00
refDot 0.5,-0.5,#000
refDot 0.5,0.5,#000
refDot -0.5,-0.5,#000
refDot -0.5,0.5,#000
```

 <hr>

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHptZ2wwZHF3OGY4OWxuZnViNXhnNHBvOGtnZzJjYzkzcXR6OGU2aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aglT7twNUtLPpU29a5/giphy.gif)
![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHk4ZHVlaWxkM2p0end4MGh2eW53OWZmYTJxMjFyd2lmdXBjMm1xeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aT8mxzGkCkGpNyevmC/giphy.gif)
![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjRleDR3NzE3NnhwOGZ2eWhjY3ludm82aXdvanJmMzdzMDZhMWw1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4brGZzmSnAFHJbBJuR/giphy.gif)
