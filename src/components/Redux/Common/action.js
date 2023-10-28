import { Navigations } from './action.type'

export const getNavigationData = (data,id=null) => {
    
   
    return dispatch => {
        dispatch(datagettingSuccess(data,id))
    };
}


export const datagettingSuccess = (result,id) => {
    return {
        type: Navigations.NAVIGATIONSUCESS,
        data: result,id
    }
}

export const datagettingFaliure = () => {
    return {
        type: Navigations.NAVIGATIONFAILURE,
        data: {}
    }
}