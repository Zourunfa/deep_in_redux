import React, { useContext, useEffect, useState } from 'react'
export const appContext = React.createContext(null)

// 为防止一个地方改动User,所有组件都执行render
// 将store放在外面,然后只有被connect的组件在state变化的时候才会执行
export const store = {
  state: {
    user: {
      name: 'af',
      age: 25,
    },
  },
  setState: newState => {
    // console.log(newState,'---newState')
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  },
}

// userModifier组件 通过上面的wrapper的封装能够读写全局的state和使用dispatch
// 那么我们肯定会有很多组件，每个组件都这样写一遍肯定是成本很高的
// 这时候我们就需要抽离一个高阶函数组件完成这件事
export const connect = Component => {
  return props => {
    const { state, setState } = useContext(appContext)
    const [, update] = useState({})

    useEffect(() => {
      store.subscribe(() => {
        update({})
      })
    })
    const dispatch = action => {
      setState(reducer(state, action))
      update({})
    }

    return <Component {...props} dispatch={dispatch} state={state} />
  }
}

// reducer 规范state的创建流程
export const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    }
  } else {
    return state
  }
}
