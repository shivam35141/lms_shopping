import React, { useContext } from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import ProductContainer from "../Screens/Products/ProductContainer";
import SingleProduct from "../Screens/Products/SingleProduct"
import Shops from "../Screens/Products/shops"
import AuthGlobal from "../Context/store/AuthGlobal";

const Stack = createStackNavigator()

function MyStack() {
    const context = useContext(AuthGlobal)
    console.log("after logout========================================================================>", context.stateUser)
    return (
        <Stack.Navigator>

            <Stack.Screen
                name='Home'
                component={ProductContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Product Detail'
                component={SingleProduct}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminHomeNavigator() {
    return <MyStack />;
}