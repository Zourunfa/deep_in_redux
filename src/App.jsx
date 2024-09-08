// 请从课程简介里下载本代码
import React, { useContext, useState } from 'react'

const appContext = React.createContext(null)
export const App = () => {
  const [appState, setAppState] = useState({
    user: {name: 'frank', age: 18}
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<Wrapper/></section>
const 幺儿子 = () => <section>幺儿子</section>
const User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>

}

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
const UserModifier = ({dispatch,state}) => {


  const onChange = (e) => {
  

    // setAppState 会触发 contextValue.appState 的更新，前提条件是不能给原来对象的引用，必须给一个新的对象
    // 此原因从而引导reducer的诞生{...contextValue.appState}
    // setAppState(reducer(appState,{type:'updateUser',payload:{name:e.target.value}}))

    dispatch({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
}

