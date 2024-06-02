import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import ProductsScreen from './screens/ProductsScreen';

const Stack = createNativeStackNavigator();

export default Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="Products" component={ProductsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};