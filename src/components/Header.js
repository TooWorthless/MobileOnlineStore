import React, { useState } from 'react';
import { Image, TouchableHighlight, View, StyleSheet, Text } from 'react-native';

const Header = ({ navigation, cartItems, onRefresh }) => {
	return (
		<View style={styles.headerContainer}>
			{/* key={refreshKey} */}
			<View style={styles.logoContainer}>
				<TouchableHighlight style={{ borderRadius: 15 }} onPress={onRefresh}>
					<Image
						source={require('../../assets/storeLogo.jpg')}
						style={styles.logoImage}
					/>
				</TouchableHighlight>
			</View>

			<View style={styles.cartContainer}>
				<TouchableHighlight onPress={() => navigation.navigate('Cart')}>
					<Image
						source={{
							uri: 'https://findicons.com/files/icons/1700/2d/512/cart.png',
						}}
						style={styles.cartIcon}
					/>
				</TouchableHighlight>
				{cartItems.length > 0 && (
					<View style={styles.cartCount}>
						<Text style={styles.cartCountText}>{cartItems.length}</Text>
					</View>
				)}
			</View>

		</View >
	)
}


const styles = StyleSheet.create({
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20
	},
	logoContainer: {

	},
	logoImage: {
		width: 80,
		height: 80,
		borderRadius: 15
	},
	cartContainer: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 80,
		height: 80,
		borderRadius: 15,
		backgroundColor: "#0d1218"
	},
	cartIcon: {
		width: 45,
		height: 45,
	},
	cartCount: {
		position: 'absolute',
		bottom: -10,
		right: -10,
		backgroundColor: 'red',
		borderRadius: 10,
		paddingHorizontal: 6,
		paddingVertical: 2,
		zIndex: 2,
	},
	cartCountText: {
		color: 'white',
		fontSize: 12,
	},
});


export default Header
