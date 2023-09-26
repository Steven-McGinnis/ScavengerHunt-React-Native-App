import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addAuthToken } from '../Model/Slices/authSlice';

const LogoutButton = ({ dispatch, intl }) => {
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ paddingRight: 5 }}>
					<Button
						icon='history'
						mode='contained'
						onPress={() => {
							dispatch(addAuthToken(null));
							navigation.replace('Authentication');
						}}
						buttonColor='green'>
						{intl.formatMessage({ id: 'Logout' })}
					</Button>
				</View>
			),
		});
	}, [navigation, dispatch, intl]);

	return null;
};

export default LogoutButton;
