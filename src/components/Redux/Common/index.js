import { Navigations } from './action.type';

let initialState = {
    navigationData : {},
    id:null,
    projectId:null
}

export const NavigationData = (state=initialState, action) => {    
    switch (action.type) {
        case Navigations.NAVIGATIONSUCESS:
            return {
                ...state, 
                navigationData : action.data,id:action.id
            }
           
        case Navigations.NAVIGATIONFAILURE :
            return {...state}
        default:
            return {...state};
    }
}




