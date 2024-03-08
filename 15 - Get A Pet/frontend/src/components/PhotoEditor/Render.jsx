import { useState, useRef, useCallback, useEffect } from 'react'

const Render = ({ file, size = 500, handleChange, isOver, setIsOver, handleFlashMessage, currentProfileImage }) => {

    const [image, setImage] = useState()

    const [canvas, setCanvas] = useState()
    const [ctx, setCtx] = useState()

    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const startCoords = {
        distanceX: 0,
        distanceY: 0
    }

    const [zoom, setZoom] = useState(0)
    const [zoomMax, setZoomMax] = useState(false)
    const [mouseState, setMouseState] = useState(false)
    const [IsDragging, setIsDragging] = useState(false)
    const [initialCoord, setInitialCoord] = useState(startCoords)
    const [distanceXY, setDistanceXY] = useState(startCoords)
    const [storedDistanceXY, setStoredDistanceXY] = useState(startCoords)
    const [dynamicZero, setDynamicZero] = useState(0)
    const [accelerator, setAccelerator] = useState(1)

    const zoomIncrement = size / 10
    const circleRadius = 50
    const overBorder = 50
    const outBorder = (size - circleRadius * 2) / 2

    const myCanvas = useRef()

    const [maxlenght, setMaxlenght] = useState(0)

    // const canvas = myCanvas.current
    // const ctx = canvas.getContext('2d')
    // console.count()
    const renderImage = async (distanceXYcurrent) => {
        let zoomInternal

        if (!distanceXYcurrent) {
            distanceXYcurrent = {
                distanceX: 0,
                distanceY: 0
            }
        }
        // setDistanceXY(distanceXYcurrent)
        setZoom(prev => {
            zoomInternal = prev
            return prev
        })

        if (!image || !ctx) {
            return
        }

        const img = new Image()

        img.src = image.src

        img.onload = () => {

            // const dynamicMaxLenght = maxlenght > size ? maxlenght : size

            let sy = (imageHeight - size) / 2
            let sx = (imageWidth - size) / 2

            // if (size > imageWidth) {
            //     dx = (size - imageWidth) / 2
            // }
            // else {
            //     sx = (imageWidth - size) / 2

            // }
            // if (size > imageHeight) {
            //     dy = (size - imageHeight) / 2
            // }
            // else {
            //     sy = (imageHeight - size) / 2

            // }

            // console.log('sy: ', sy)
            // console.log('sx: ', sx)

            ctx.clearRect(0, 0, size, size)
            // console.log('zoomInternal: ', zoomInternal)

            // if (((dynamicMaxLenght - size) / 2) < zoomInternal) {
            //     // console.log(zoomInternal)
            //     // setZoom(zoom)
            // }

            if (zoomInternal + zoomIncrement > maxlenght) {
                zoomInternal = zoomInternal < zoom ? zoomInternal : zoom
                setZoomMax(prev => !prev)
                setZoom(zoomInternal)
            }

            // console.log('distanceX: ', distanceXY)


            const sxTransformed = sx - zoomInternal
            const syTransformed = sy - zoomInternal

            let sxDynamic = (sxTransformed + distanceXYcurrent.distanceX)
            let syDynamic = (syTransformed + distanceXYcurrent.distanceY)

            // console.log('sy: ', sy)

            // console.log('distanceXY: ', distanceXYcurrent)
            // console.log('storedXY: ', storedDistanceXY)
            // console.log('syTransformed: ', syTransformed)
            // console.log('syDynamic: ', syDynamic, distanceXYcurrent.distanceY)
            // console.log('dynamicZero: ', dynamicZero)
            // console.log('zoom: ', zoomInternal)
            const sWidth = imageWidth - (2 * sxTransformed)
            const sHeight = imageHeight - (2 * syTransformed)
            // console.log('sHeight: ', sHeight)
            // console.log('sWidth: ', sWidth)
            // console.log('syDynamic: ', syDynamic)
            // console.log('dynamicZero: ', dynamicZero)
            if (syDynamic === syTransformed || syTransformed < dynamicZero.relative * -1) {
                // console.log('first')
                syDynamic = syTransformed
            }
            else if (syDynamic < dynamicZero.relative * -1) {
                // console.log('second')
                syDynamic = syTransformed < dynamicZero.relative * -1 ? syTransformed : dynamicZero.relative * -1
            }
            else if (syTransformed * 2 + Math.abs(dynamicZero.relative) < syDynamic) {
                // console.log('third')
                syDynamic = syTransformed * 2 + Math.abs(dynamicZero.relative)
            }

            // console.log('syDynamicAjusted: ', syDynamic)

            if (sxDynamic === sxTransformed || sxTransformed < dynamicZero.relative * -1) {
                sxDynamic = sxTransformed
            }
            else if (sxDynamic < dynamicZero.relative * -1) {
                sxDynamic = sxTransformed < dynamicZero.relative * -1 ? sxTransformed : dynamicZero.relative * -1
            }
            else if (sxTransformed * 2 + Math.abs(dynamicZero.relative) < sxDynamic) {
                sxDynamic = sxTransformed * 2 + Math.abs(dynamicZero.relative)
            }

            // syDynamic += 50

            setAccelerator(sWidth / size)
            ctx.drawImage(img, sxDynamic, syDynamic, sWidth, sHeight, 0, 0, size, size)

            ctx.beginPath();
            ctx.moveTo(0, 0)
            ctx.lineTo(0, size)
            ctx.lineTo(size, size)
            ctx.lineTo(size, 0)
            ctx.lineTo(0, 0)
            ctx.arc(size / 2, size / 2, circleRadius + overBorder, 0, 2 * Math.PI)
            // ctx.clip()
            // ctx.stroke()
            // ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            // ctx.fillStyle = '#181A1B'
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fill()
        }

    }

    useEffect(() => {
        async function main() {
            const reader = new FileReader()
            reader.onload = function (e) {

                if (e.target.result.slice(0, 10) != "data:image") {
                    handleFlashMessage('error', 'The file should be PNG or JPEG.', 'inner')
                    handleChange(currentProfileImage, true)
                    return
                }

                const img = new Image()
                img.src = e.target.result
                img.onload = () => {
                    setImageWidth(img.width)
                    setImageHeight(img.height)
                    setMaxlenght(img.width > img.height ? img.width : img.height)
                    setImage(img)
                }
                setDynamicZero({
                    relative: outBorder,
                    absolute: outBorder
                })
            }
            reader.readAsDataURL(file)
            setCanvas(myCanvas.current)
            setCtx(myCanvas.current.getContext('2d'))
            myCanvas.current.getContext('2d').save()
        }
        if (file) {
            main()
        }
    }, [file])

    useEffect(() => {
        if (image) {
            renderImage()
        }
    }, [image])


    const handleWheel = (e) => {
        // document.body.style.overflow = 'hidden'
        if (isOver) {
            if (e.deltaY > 0) {
                setZoom(prev => prev + zoomIncrement)
            }
            else {
                setZoom(prev => {
                    return prev > -(4 * zoomIncrement) ? prev - zoomIncrement : -(4 * zoomIncrement)
                })
            }

            let currentZoom
            setZoom(prev => {
                currentZoom = prev
                setDynamicZero((start) => {
                    let normalizerOutBorderZoom
                    if (outBorder > zoomIncrement) {
                        normalizerOutBorderZoom = outBorder / zoomIncrement
                    }
                    else {
                        normalizerOutBorderZoom = zoomIncrement / outBorder
                    }
                    const addition = Math.abs(currentZoom / zoomIncrement) * (size / 50) * normalizerOutBorderZoom
                    return outBorder > 0 ?
                        {
                            relative: prev < 0 ? outBorder - addition : outBorder + addition,
                            absolute: outBorder - addition
                        }
                        :
                        start
                })
                return prev
            })



            renderImage(storedDistanceXY)
        }
    }

    const exit = (e) => {
        setMouseState(false)
        setIsDragging(false)
        if (image) {
            const coords = {
                distanceX: storedDistanceXY.distanceX + (initialCoord.distanceX - e.nativeEvent.offsetX) * accelerator,
                distanceY: storedDistanceXY.distanceY + (initialCoord.distanceY - e.nativeEvent.offsetY) * accelerator
            }
            // console.log(coords)


            // console.log(e.nativeEvent.offsetX)
            // Create zoom system using cursor position (CREATE AND FIX)

            if (zoomMax || (maxlenght < size && zoom === (zoomIncrement * 2))) {
                return
            }

            let dynamicSizeX = zoom + ((imageWidth - size) / 2)
            dynamicSizeX = ((imageWidth - (circleRadius * 2)) / 2) - ((circleRadius * 2) / 10) * zoom / zoomIncrement
            if (coords.distanceX > dynamicSizeX) {
                coords.distanceX = dynamicSizeX
            }
            else if (coords.distanceX <= (dynamicSizeX) * -1) {
                coords.distanceX = (dynamicSizeX) * -1
            }


            let dynamicSizeY = zoom + ((imageHeight - size) / 2)
            dynamicSizeY = (((imageHeight - (circleRadius * 2)) / 2) - ((circleRadius * 2) / 10) * zoom / zoomIncrement)
            if (coords.distanceY > dynamicSizeY) {
                coords.distanceY = dynamicSizeY
            }
            else if (coords.distanceY <= (dynamicSizeY) * -1) {
                coords.distanceY = (dynamicSizeY) * -1
            }

            // console.log('coords: ', coords)
            setStoredDistanceXY(coords)

        }
        setInitialCoord({
            distanceX: e.nativeEvent.offsetX,
            distanceY: e.nativeEvent.offsetY
        })
    }

    const handleEnter = () => {
        // document.body.style.overflow = 'hidden'
        setIsOver(true)
        // console.log('entrou', isOver)
    }

    const handleOut = (e) => {
        // setIsOver(false)
        // document.body.style.overflow = 'auto'
        if (ctx) {
            ctx.clip()
            ctx.clearRect(0, 0, size, size)
            ctx.restore()
            ctx.save()
            const myImage = canvas.toDataURL('image/pnj')
            handleChange(myImage, true)
        }
        if (mouseState) {
            exit(e)
        }
    }

    const handleMouseDown = (e) => {
        setMouseState(true)
        setIsDragging(true)
        setInitialCoord({
            distanceX: e.nativeEvent.offsetX,
            distanceY: e.nativeEvent.offsetY
        })
    }

    const handleMouseUp = (e) => {
        exit(e)
    }

    const handleMouseMove = (e) => {
        if (mouseState) {
            renderImage({
                distanceX: storedDistanceXY.distanceX + (initialCoord.distanceX - e.nativeEvent.offsetX) * accelerator,
                distanceY: storedDistanceXY.distanceY + (initialCoord.distanceY - e.nativeEvent.offsetY) * accelerator
            })
        }
    }

    return (
        <canvas width={`${size}px`} height={`${size}px`} style={{ cursor: IsDragging ? 'grabbing' : 'grab' }} onWheel={handleWheel} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onMouseOut={handleOut} onMouseEnter={handleEnter} ref={myCanvas}></canvas>
    )
}

export default Render
