// 请从课程简介里下载本代码
import React, { useContext, useEffect, useState } from 'react'

const appContext = React.createContext(null)

// 为防止一个地方改动User,所有组件都执行render
// 将store放在外面,然后只有被connect的组件在state变化的时候才会执行
const store = {
  state:{
    user:{
      name:'af',
      age:25
    }
  },
  setState: (newState) =>{
    // console.log(newState,'---newState')
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners:[],
  subscribe(fn){
    store.listeners.push(fn)
    return ()=>{
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index,1)
    }
  }
}
export const App = () => {

  return (
    <appContext.Provider value={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => {
  console.log('大儿子执行')
  return <section>大儿子<User/></section>
}
const 二儿子 = () => {
  console.log('2儿子执行')
  return <section>二儿子<UserModifier x={'123'}>你好吖</UserModifier></section>
}
const 幺儿子 = () => {
  console.log('幺儿子执行')
  return <section>幺儿子</section>
}
const User =connect(({state,dispatch}) => {
  console.log('User执行')
  return <div>User:{state.user.name}</div>
})

// reducer 规范state的创建流程
const reducer = (state,{type,payload})=>{
  if(type === 'updateUser'){
    return {
      ...state,
      user:{
          ...state.user,
          ...payload
      }
    }
  }else{
    return state
  }
}
  // react规定只能在组件内部使用Hooks,
  // 为了使得dispatch函数被抽离，dispatch的使用需要通过一个外层组件包裹
  // dispatch 的目的是为了规范setState的流程
const  Wrapper = ()=>{
  const {appState, setAppState} = useContext(appContext)

  const dispatch = (action) => {
    setAppState(reducer(appState,action))
  }

  return <UserModifier dispatch={dispatch} state={appState}/>
}

// userModifier组件 通过上面的wrapper的封装能够读写全局的state和使用dispatch
// 那么我们肯定会有很多组件，每个组件都这样写一遍肯定是成本很高的
// 这时候我们就需要抽离一个高阶函数组件完成这件事
function connect(Component){
  return (props)=>{
    const {state,setState} = useContext(appContext)
    const [,update] = useState({})

    useEffect(()=>{
      store.subscribe(()=>{
        update({})  
      })
    })
    const dispatch = (action) => {
      setState(reducer(state,action))
      update({})
    }
  
    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}


// const _UserModifier = ({dispatch,state}) => {


//   const onChange = (e) => {
  

//     // setAppState 会触发 contextValue.appState 的更新，前提条件是不能给原来对象的引用，必须给一个新的对象
//     // 此原因从而引导reducer的诞生{...contextValue.appState}
//     // setAppState(reducer(appState,{type:'updateUser',payload:{name:e.target.value}}))

//     dispatch({type:'updateUser',payload:{name:e.target.value}})
//   }
//   return <div>
//     <input value={state.user.name}
//       onChange={onChange}/>
//   </div>
// }


const UserModifier = connect(({dispatch,state,children}) => {


  console.log('UserModifier执行')
  const onChange = (e) => {
  

    // setAppState 会触发 contextValue.appState 的更新，前提条件是不能给原来对象的引用，必须给一个新的对象
    // 此原因从而引导reducer的诞生{...contextValue.appState}
    // setAppState(reducer(appState,{type:'updateUser',payload:{name:e.target.value}}))

    dispatch({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    {children}
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
}
)
