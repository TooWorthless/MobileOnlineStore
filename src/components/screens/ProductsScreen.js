import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ProductsScreen = ({ navigation, route }) => {
    const [products, setProducts] = useState([]);
    const [productsCategoryTitle, setProductsCategoryTitle] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsCategoryId = route.params._id;

            let productsCategory = 'Усі товари';
            let productsResponse;

            if(productsCategoryId && productsCategoryId !== 'all') {
                const categoryResponse = await axios.get(`https://mobileonlinestoreapi.onrender.com/categories/${productsCategoryId}`);
                const category = categoryResponse.data;

                productsCategory = category.title;
                productsResponse = await axios.get(`https://mobileonlinestoreapi.onrender.com/products/byCategoryId/${productsCategoryId}`);
            }
            else {
                productsResponse = await axios.get('https://mobileonlinestoreapi.onrender.com/products');
            }

            setProducts(productsResponse.data);
            setProductsCategoryTitle(productsCategory);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleProductPress = (product) => {
        console.log('product._id :>> ', product._id);
        navigation.navigate('Product', { _id: product._id });
    };

    const renderProduct = (item) => (
        <View style={styles.productContainer}>
            <TouchableOpacity style={styles.product} onPress={() => handleProductPress(item)}>
                <Image style={styles.image} source={{ uri: item.images[0] }} />
                <View style={{ width: '500%' }}><Text style={styles.title}>{item.title.split(' ').join('\n')}</Text></View>
                <Text>{item.price} грн</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView>
            <View>
                <Text style={styles.header}>{productsCategoryTitle}</Text>

                {products.length === 0 ? (
                    <Text style={styles.title}>Товари відсутні!</Text>
                ) : (
                    <View style={styles.productsContainer}>
                        {products.map((product) => {
                            return renderProduct(product);
                        })}
                    </View>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 15
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    productContainer: {
        width: '30%',
        marginBottom: 20,
        overflow: 'hidden'
    },
    product: {
        display: 'flex',
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBottom: 10,
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
});

export default ProductsScreen;
