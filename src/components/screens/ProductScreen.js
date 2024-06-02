import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProductScreen = ({ navigation, route }) => {
    const [product, setProduct] = useState(null);
    const [isSizesVisible, setIsSizesVisible] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmationVisible, setConfirmationVisible] = useState(false);

    useEffect(() => {
        axios.get(`https://mobileonlinestoreapi.onrender.com/products/${route.params._id}`)
            .then(response => {
                console.log('_id :>> ', route.params._id);
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log('_id :>> ', route.params._id);
                console.error('Error fetching product data:', error);
                setLoading(false);
            });
    }, []);

    const toggleSizes = () => {
        setIsSizesVisible(!isSizesVisible);
    };

    const selectSize = (size) => {
        setSelectedSize(size);
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const addToCart = async () => {
        if (selectedSize) {
            const cartItem = {
                productId: product.id,
                title: product.title,
                size: selectedSize,
                price: product.price,
                image: product.images[0],
            };

            try {
                const existingCart = await AsyncStorage.getItem('cart');
                let cart = existingCart ? JSON.parse(existingCart) : [];
                cart.push(cartItem);
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
                // console.log('cart :>> ', (await AsyncStorage.getItem('cart')));
                setConfirmationVisible(true);
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    const handleConfirmationClose = () => {
        setConfirmationVisible(false);
        navigation.navigate('Home');
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loader}>
                <Text>Помилка завантаження даних!</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Card>
                <Card.Title style={styles.title}>{product.title}</Card.Title>
                <Card.Divider />
                <ScrollView horizontal>
                    {product.images.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => openModal(image)}>
                            <Image style={styles.image} source={{ uri: image }} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={styles.description}>{'Опис:\n'}    {product.description}</Text>
                <Text style={styles.price}>{product.price} грн</Text>
                <Button
                    title="Показати розміри"
                    type="clear"
                    icon={
                        <Icon
                            name={isSizesVisible ? 'chevron-up' : 'chevron-down'}
                            type="font-awesome"
                            size={20}
                            color="blue"
                        />
                    }
                    onPress={toggleSizes}
                />
                {isSizesVisible && (
                    <View style={styles.sizesContainer}>
                        {product.sizes.map((size, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.size,
                                    selectedSize === size && styles.selectedSize
                                ]}
                                onPress={() => selectSize(size)}
                            >
                                <Text style={styles.sizeText}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <Button
                    title="Додати в кошик"
                    buttonStyle={styles.addButton}
                    onPress={addToCart}
                    disabled={!selectedSize}
                />
            </Card>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                        <Text style={styles.modalCloseText}>X</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image style={styles.modalImage} source={{ uri: selectedImage }} />
                    )}
                </View>
            </Modal>

            <Modal
                visible={confirmationVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleConfirmationClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.confirmationBox}>
                        <Text style={styles.confirmationText}>Товар додано в кошик</Text>
                        <Button
                            title="Закрити"
                            onPress={handleConfirmationClose}
                        />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 150,
        height: 150,
        marginRight: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    description: {
        marginVertical: 10,
        fontSize: 16
    },
    price: {
        marginVertical: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    sizesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10
    },
    size: {
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5
    },
    selectedSize: {
        backgroundColor: 'lightblue'
    },
    sizeText: {
        fontSize: 16
    },
    addButton: {
        backgroundColor: 'green',
        marginTop: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1
    },
    modalCloseText: {
        color: 'white',
        fontSize: 18
    },
    modalImage: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain'
    },
    confirmationBox: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    confirmationText: {
        fontSize: 18,
        marginBottom: 20
    }
});

export default ProductScreen;
