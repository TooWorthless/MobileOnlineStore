import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Modal, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartItemsPrice, setCartItemsPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getCartItems();
    }, []);

    const getCartItems = async () => {
        try {
            const items = await AsyncStorage.getItem('cart');
            if (items !== null) {
                const jsonItems = JSON.parse(items);
                setCartItems(jsonItems);

                let price = 0;

                for(const item of jsonItems) {
                    price += +item.price;
                }
                setCartItemsPrice(price);
            }
        } catch (error) {
            console.error('Error retrieving cart items:', error);
        }
    };

    const handleDeleteItem = async (index) => {
        try {
            const updatedItems = cartItems.filter((item, i) => i !== index);
            await AsyncStorage.setItem('cart', JSON.stringify(updatedItems));
            let price = 0;

            for(const item of updatedItems) {
                price += +item.price;
            }
            setCartItems(updatedItems);
            setCartItemsPrice(price);
        } catch (error) {
            console.error('Error deleting item from cart:', error);
        }
    };

    const handleBuy = async () => {
        try {
            if (cartItems.length > 0) {
                await AsyncStorage.removeItem('cart');
                setCartItems([]);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error clearing cart items:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await AsyncStorage.removeItem('cart');
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart items:', error);
        }
    };


    const renderItem = ({ item, index }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Розмір: {item.size}</Text>
                <Text>Ціна: {item.price} грн</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Кошик порожній</Text>
            ) : (

                <ScrollView style={styles.listStyles}>
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.title}>
                                Загальна ціна - {cartItemsPrice} грн
                            </Text>
                        </View>
                    </View>
                    {cartItems.map((item, index) => {
                        return renderItem({ item, index });
                    })}
                </ScrollView>
            )}


            {cartItems.length > 0 && (
                <View>
                    <View disabled={cartItems.length === 0}>
                        <Button style={styles.buyButton} title='Придбати' onPress={handleBuy} disabled={cartItems.length === 0} />
                    </View>
                    <TouchableOpacity onPress={handleClearCart} disabled={cartItems.length === 0}>
                        <Text style={[styles.clearCartButton, cartItems.length === 0 && styles.disabledButton]}>Очистити кошик</Text>
                    </TouchableOpacity>
                </View>
            )}


            <Modal visible={showModal} animationType='slide' transparent>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Покупка здійснена</Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Text style={styles.returnButton} onPress={() => navigation.navigate('Home')}>Повернутись на головну</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20
    },
    listStyles: {
        display: 'flex',
        width: '100%',
        marginBottom: 20
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#e1e8ee',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        maxWidth: '100%',
        minWidth: '200px',
        width: 'auto'
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 5
    },
    itemDetails: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    buyButton: {
        marginVertical: 10
    },
    deleteButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196f3',
        marginLeft: 10
    },
    emptyCartText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    clearCartButton: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20
    },
    disabledButton: {
        color: '#ccc'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },
    returnButton: {
        fontSize: 18,
        color: 'white',
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
});

export default CartScreen;
