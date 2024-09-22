const userSelector = state => {
  return { user: state.user }
}

const userDispatch = dispatch => {
  return {
    updateUser: attrs => dispatch({ type: 'updateUser', payload: attrs }),
  }
}
// connect意义就是用于组件的读和写
export const connectToUser = connect(userSelector, userDispatch)
