import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../Styles/styles';
import { addAuthToken } from '../Model/Slices/authSlice';
import apiCall from '../Helper/apiCall';
import { useIntl } from 'react-intl';

const InitializeScreen = ({ navigation }) => {
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const dispatch = useDispatch();
	const intl = useIntl();

	useEffect(() => {
		setTimeout(async () => {
			if (!authTokenValue) {
				navigation.replace('Authentication');
			} else {
				const response = await apiCall({
					endpointSuffix: 'verifyToken.php',
					data: { token: authTokenValue },
					onFailureMessageId: 'networkError',
					intl,
				});

				if (response.success) {
					navigation.replace('ScavengerScreen');
				} else {
					dispatch(addAuthToken(null));
					navigation.replace('Authentication');
				}
			}
		}, 3000);
	}, [authTokenValue, navigation, dispatch, intl]);

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
