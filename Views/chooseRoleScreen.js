// Core
import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

// Third-party libraries
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';

const ChooseRoleScreen = ({ navigation }) => {
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const dispatch = useDispatch();
	const intl = useIntl();

	return (
		<View style={styles.splash}>
			{/* flex column */}
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'space-between',
				}}>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Player Home Screen');
					}}>
					<Image
						source={require('../assets/player.png')}
						style={{
							width: 200,
							height: 200,
							marginBottom: 100,
							backgroundColor: 'white',
							borderRadius: 100,
						}}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('ScavengerScreen');
					}}>
					<Image
						source={require('../assets/build.png')}
						style={{
							width: 200,
							height: 200,
							backgroundColor: 'white',
							borderRadius: 100,
						}}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ChooseRoleScreen;
