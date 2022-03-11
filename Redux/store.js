import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import cartItems from './Reducers/cartItem'
import shopNo from './Reducers/shopNo'

const reducers = combineReducers({
    cartItems: cartItems,
    shopNo: shopNo
})

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)

export default store;