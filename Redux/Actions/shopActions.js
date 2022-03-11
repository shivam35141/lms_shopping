import {
    SET_SHOP_NO
} from '../constants';

export const setShopNo = (payload) => {
    console.log(payload)
    return {
        type: SET_SHOP_NO,
        payload
    }
}