const { reducerCases } = require("./constants")


export const initialState = {
    userInfo: undefined,
    room: undefined,
    socket: undefined,
    users: [],
}

const reducer = (state, action) => {
    const {type, payload} = action
    switch(type){
        case reducerCases.SET_USER_INFO:
            return {...state, userInfo: payload}
            break
        
        case reducerCases.SET_ROOM:
            return {...state, room: payload}
            break
        
        case reducerCases.SET_SOCKET:
            return {...state, socket: payload}
            break

        case reducerCases.SET_USERS:
            return {...state, users: payload}
            break
            
        default:
            return state

    }
}

export default reducer