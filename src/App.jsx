// 请从课程简介里下载本代码
import React, { useContext } from 'react'
import { appContext, connect, store } from './redux.jsx'

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
const User =connect(state =>{
  return {user:state.user}
})(({user}) => {
  console.log(user,'----user')
  console.log('User执行')
  return <div>User:{user.name}</div>
})


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


const UserModifier = connect()(({dispatch,state,children}) => {

  
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
