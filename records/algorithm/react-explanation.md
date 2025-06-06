---
title: react 执行顺序题目讲解
date: 2025/06/06
author: xdd
---

# React 学习笔记

## 执行流程
### 第一题
```jsx
import React, { useState, useCallback, useEffect, useLayoutEffect, useMemo } from 'react@18';
import { createRoot } from 'react-dom@18/client';

const Test = function () {
  const [value, setValue] = useState(() => {
    console.log('useState');
    return 0;
  })

  const cb = useCallback(() => {
    console.log('useCallback')
    setValue(value +1)
  }, [value])

  const bigData = useMemo(() => {
    console.log('useMemo')
    return {
      name: 'senmu',
      age: 18
    }
  }, [value])



  useEffect(() => {
    console.log('useEffect')

    return () => {
      console.log('clean effect')
    }
  },[value])

  useEffect(() => {
    console.log('useEffect1111')

  })

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return ()=>{
      console.log('clear LayoutEffect')
    }
  }, [value])

  const handleClick = ()=>{
    setValue(value+1)
  }

  console.log('render')
  return <div>App
  {bigData.name}:{bigData.age}
  ces :{ value}
    <button onClick={handleClick}>按钮1</button>
    <button onClick={cb}>按钮</button>
  </div>;
};

const app = document.getElementById('app');
const root = createRoot(app!)
root.render(<Test />);
```
:::: code-group
::: code-group-item 初始化
- 执行顺序
  - useStata
  - useMemo
  - render
  - useLayoutEffect
  - useEffect
  - useEffect1111
- 原因
  - 首次渲染的时候，会先执行state的初始化逻辑，所以打印useState
  - 之后是useCallback，他因为是缓存了一个函数，这个函数没有立马执行，所以他不会进行打印。
  - useMemo 也是一个缓存一个结果，所以他会立即执行，打印 useMemo
  - useEffect 和 useLayoutEffect 他是在 render 之后才去执行 他们自身也有不同，layout先打印，所以顺序是 render、useLayoutEffect、useEffect、useEffect1111  
:::
::: code-group-item 点击按钮1
- 执行顺序
  - useMemo
  - render
  - clear LayoutEffect
  - useLayoutEffect
  - clear  effect
  - useEffect
  - useEffect1111
- 原因
  - 因为只有第一次渲染的时候才会执行state的初始化函数，所以本次更新不会打印usestate
  - useCallback 是一个缓存函数，尽管他依赖了更新的value，但是因为没有调用他，所以不会打印
  - useMemo 因为依赖的value发生了改变，所以会打印
  - render
  - 在重新渲染之前，会先执行清理函数，clearLayoutEffect，useLayoutEffect，clearEffect，useEffect，useEffect1111
:::
::: code-group-item 点击按钮
- 执行顺序
  - useMemo
  - render
  - clear LayoutEffect
  - useLayoutEffect
  - clear  effect
  - useEffect
  - useEffect1111
- 原因
  - 因为只有第一次渲染的时候才会执行state的初始化函数，所以本次更新不会打印usestate
  - useCallback因为点击的按钮就是他对应的方法，所以会打印
  - useMemo 因为依赖的value发生了改变，所以会打印
  - render
  - 在重新渲染之前，会先执行清理函数，clearLayoutEffect，useLayoutEffect，clearEffect，useEffect，useEffect1111
:::
::::