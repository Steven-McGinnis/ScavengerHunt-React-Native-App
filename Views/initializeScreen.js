import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../Styles/styles';
import { useDispatch } from 'react-redux';
import { addAuthToken } from '../Model/Slices/authSlice';

const InitializeScreen = ({ navigation }) => {
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const dispatch = useDispatch();

	useEffect(() => {
		setTimeout(() => {
			if (!authTokenValue) {
				navigation.replace('Authentication');
			} else {
				// Validate Token
				let formData = new FormData();
				formData.append('token', authTokenValue);

				fetch('https://cpsc345sh.jayshaffstall.com/verifyToken.php', {
					method: 'POST',
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.status === 'okay') {
							console.log('Token is valid!', data);
							navigation.replace('ScavengerScreen');
						} else if (data.status === 'error') {
							dispatch(addAuthToken(null));
						}
					})
					.catch((error) => {
						dispatch(addAuthToken(null));
						console.error('Network or other error:', error);
					});
			}
		}, 3000);
	}, [authTokenValue, navigation]);

	return (
		<View style={styles.splash}>
			<Image
				source={require('../assets/splashLogo.png')}
				style={{ width: 400, height: 400 }}
			/>
		</View>
	);
};

export default InitializeScreen;
