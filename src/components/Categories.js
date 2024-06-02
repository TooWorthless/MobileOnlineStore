import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import axios from 'axios'

const Categories = ({ navigation }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mobileonlinestoreapi.onrender.com/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryPress = (category) => {
        console.log('category._id :>> ', category._id);
        navigation.navigate('Products', { _id: category._id });
        // navigation.navigate('Products');
    };

    const renderCategory = (item) => (
        <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress(item)}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <View style={{ width: '500%' }}><Text style={styles.title}>{item.title}</Text></View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View>
            <Text style={styles.header}>Категорії</Text>
            <View style={styles.categoriesContainer}>
                {renderCategory({
                    _id: 'all',
                    title: 'Усі товари',
                    description: '',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Republic_Of_Korea_Broadcasting-TV_Rating_System%28ALL%29.svg/250px-Republic_Of_Korea_Broadcasting-TV_Rating_System%28ALL%29.svg.png'
                })}
                
                {categories.map((category) => {
                    return renderCategory(category);
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 15
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    categoryContainer: {
        width: '30%',
        marginBottom: 20,
        overflow: 'hidden'
    },
    category: {
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

export default Categories;
