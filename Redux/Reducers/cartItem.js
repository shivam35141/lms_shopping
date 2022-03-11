import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART
} from '../constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const index=state.findIndex(item=> {return item.product==action.payload.product});
            // console.log(index)
            if(index>-1){
                state[index].quantity=state[index].quantity+1
                state[index].price=state[index].price*state[index].quantity
                console.log("addItemToCart",state)
                return [...state]
            }
            console.log("addItemToCart",state, action.payload)
            return [...state, action.payload]
        case REMOVE_FROM_CART:
            // console.log("Remove item from cart",state,action.payload)
            return state.filter(cartItem => cartItem.product !== action.payload.id)
        case CLEAR_CART:
            return state = []
    }
    return state;
}

export default cartItems;