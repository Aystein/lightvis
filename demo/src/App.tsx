import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Lasso, lassoToSvgPath, SVGLasso, useDrag, useLasso, useUncontrolled } from '@lightvis/hooks'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Test() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const { setRef, dragState } = useDrag({
    shouldSkip: (event) => {
      return event.x > 50;
    },
    onMouseDown: (event) => {
      console.log(event);
    },
    onMouseUp: (event) => {
      console.log(event);
    },
    onDrag: (event) => {
      console.log(event.movementX);
      const x = clamp(event.x - event.targetInitialX, 0, 200 + 40);
      setX(x);
      setY(event.y - event.targetInitialY);
    },
    onClick: (event) => {
      console.log(event);
    }
  });

  const [mounted, setMounted] = useState(true);

  return <>
  <button onClick={() => {
    setMounted(!mounted);
  }}>mount</button>
  {mounted ? <div ref={setRef} style={{ width: 300, height: 300, margin: 20, padding: 20, borderLeft: '10px solid black', background: dragState !== 'idle' ? 'red' : 'black', position: 'relative' }}>
    <div style={{ width: 100, height: 100, background: 'blue', position: 'absolute', top: y, left: x }}></div>
  </div> : null}</>
}

function Test2() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  /* const { setRef, dragState } = useLasso({
    shouldSkip: (event) => {
      return event.x > 50;
    },
  }); */

  const [intern, setIntern] = useState(0);

  
  const { setRef, value: lasso, setValue: setLasso } = useLasso({
    onChangeEnd: (value) => {
    },
  });

  const [mounted, setMounted] = useState(true);

  return <>
  <svg width="300" height="300" ref={setRef} style={{ border: '10px solid red' }}>
    {lasso ? <SVGLasso value={lasso} /> : null}
  </svg>

  {mounted ? <div style={{ width: 300, height: 300, margin: 20, padding: 20, borderLeft: '10px solid black', position: 'relative' }}>
    <div style={{ width: 100, height: 100, background: 'blue', position: 'absolute', top: y, left: x }}></div>
  </div> : null}</>
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Test2 />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
