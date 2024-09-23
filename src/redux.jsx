import React, { useEffect, useState } from 'react'
export const appContext = React.createContext(null)


let  state = undefined
let  reducer = undefined

let  setState= newState => {
  // console.log(newState,'---newState')
  state = newState
  store.listeners.map(fn => fn(state))
}
// 精准渲染:只有自己的数据变化时渲染


// 为防止一个地方改动User,所有组件都执行render
// 将store放在外面,然后只有被connect的组件在state变化的时候才会执行
export const store = {
  getState(){
    return state
  },
  listeners: [],
  dispatch :action => {
    setState(reducer(state, action))
    update({})
  },
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  },
}
const dispatch = store.dispatch
export const createStore = (_reducer,initState) =>{
  state = initState
  reducer  =  _reducer

  return store
}


const changed =(oldState,newState) => {
  let changed = false
  for(let key in oldState) {
    if(oldState[key]!== newState[key]){
      changed = true
    }
  }
  return changed
}


// userModifier组件 通过上面的wrapper的封装能够读写全局的state和使用dispatch
// 那么我们肯定会有很多组件，每个组件都这样写一遍肯定是成本很高的
// 这时候我们就需要抽离一个高阶函数组件完成这件事
export const connect = (selector,mapDispatchToProps) => Component => {
  return props => {

   
    const [, update] = useState({})
    const data = selector? selector(state):{state:state}

    const dispatchers = mapDispatchToProps ? mapDispatchToProps(dispatch) :{dispatch}
    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const newData = selector ? selector(state) :{state:state}
        if(changed(data,newData)){
          console.log('data changed')
          update({})
        }
      
      })
      // 注意需要取消订阅 否则在selector变化的时候会重复订阅
      return unsubscribe
    },[selector,state])


    return <Component {...props} {...dispatchers} {...data} />
  }
}

// reducer 规范state的创建流程
// export const reducer = (state, { type, payload }) => {
//   if (type === 'updateUser') {
//     return {
//       ...state,
//       user: {
//         ...state.user,
//         ...payload,
//       },
//     }
//   } else {
//     return state
//   }
// }

export const Provider = ({ store,children })=>{
  return <appContext.Provider value={store}>
    {children}
</appContext.Provider>
}
