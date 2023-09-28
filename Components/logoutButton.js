import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addAuthToken } from '../Model/Slices/authSlice';
import { themeColors } from '../Styles/constants';

const LogoutButton = ({ dispatch, intl }) => {
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ paddingRight: 5 }}>
					<Button
						icon='history'
						mode={themeColors.buttonMode}
						onPress={() => {
							dispatch(addAuthToken(null));
							navigation.reset({
								index: 0,
								routes: [{ name: 'Authentication' }],
							});
						}}
						buttonColor={themeColors.buttonColor}>
						{intl.formatMessage({ id: 'Logout' })}
					</Button>
				</View>
			),
		});
	}, [navigation, dispatch, intl]);

	return null;
};

export default LogoutButton;
