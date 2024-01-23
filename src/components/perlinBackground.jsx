"use client"
import { Noise } from 'noisejs'
import { useEffect, useRef } from 'react'

const PerlinBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size to match the component size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let w = canvas.width
    let h = canvas.height

    let nt = 0
    let noiseSpeed = 0.005
    let noiseScale = 200
    let dotSize = 8
    let gap = 0
    let hueBase = 200
    let hueRange = 60
    let shape = 0
    let noise = new Noise(Math.random())



    function draw() {
      nt += noiseSpeed;
      for (var x = 0; x < w; x += dotSize + gap) {
        for (var y = 0; y < h; y += dotSize + gap) {
          var yn = noise.perlin3(y / noiseScale, x / noiseScale, nt) * 20;

          ctx.beginPath();
          const theme = document.body.classList.contains('dark')
          ctx.fillStyle = theme
            ? `rgba(${yn * 10}, ${yn * 10}, ${yn * 10}, 1)`
            : `rgba(${255 - yn * 10}, ${255 - yn * 10}, ${255 - yn * 10}, 1)`
          if (shape == 0) {
            ctx.fillRect(x, y, dotSize, dotSize);
          } else if (shape == 1) {
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (shape == 2) {
            ctx.moveTo(x + (dotSize / 2), y + dotSize);
            ctx.lineTo(x, y);
            ctx.lineTo(x + dotSize, y);
            ctx.fill();
          } else if (shape == 3) {
            if (y % ((gap + dotSize) * 2) == (gap + dotSize)) {
              ctx.moveTo(x + (dotSize / 2), y);
              ctx.lineTo(x + dotSize, y + dotSize);
              ctx.lineTo(x, y + dotSize);
            } else {
              ctx.moveTo(x + (dotSize / 2), y + dotSize);
              ctx.lineTo(x, y);
              ctx.lineTo(x + dotSize, y);
            }
            ctx.fill();
          }
          ctx.closePath();
        }
      }
    }

    function clear() {
      ctx.fillStyle = "rgba(0,0,4,1)";
      ctx.fillRect(0, 0, w, h);
    };

    function lerp(x1, x2, n) {
      return (1 - n) * x1 + n * x2;
    }

    function render() {
      clear();
      draw();
      requestAnimationFrame(render);
    }
    render();
  }, [])
  return <canvas ref={canvasRef} className='h-full w-full absolute z-0' />
}

export default PerlinBackground

