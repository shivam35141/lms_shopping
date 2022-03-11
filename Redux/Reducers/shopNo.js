import {
    SET_SHOP_NO
} from '../constants';

const shopNo = (state='', action) => {
    if(action.payload){
    switch (action.type) {
        case SET_SHOP_NO:
            state=action.payload;
            console.log("shop action=============>",action,state)
            return state  
        }
    }
    return state
}

export default shopNo;