import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../Header';
import Categories from '../Categories';
import Products from '../Products';


const HomeScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const handlePress = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        getCartItems();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getCartItems();
        }, [])
    );


    const getCartItems = async () => {
        try {
            const items = await AsyncStorage.getItem('cart');
            console.log('items :>> ', JSON.parse(items));
            if (items !== null) {
                setCartItems(JSON.parse(items));
            }
            else {
                setCartItems([])
            }

            console.log('cartItems :>> ', cartItems);
        } catch (error) {
            console.error('Error retrieving cart items:', error);
        }
    };


    return (
        <ScrollView key={refreshKey}>
            <Header navigation={navigation} cartItems={cartItems} onRefresh={handlePress}/>
            <Categories navigation={navigation} />
            <Products navigation={navigation} />
        </ScrollView>
    )
}


export default HomeScreen;