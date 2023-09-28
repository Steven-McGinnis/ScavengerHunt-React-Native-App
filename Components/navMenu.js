import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addAuthToken } from '../Model/Slices/authSlice';
import { Button, Menu } from 'react-native-paper';

const NavMenu = ({ dispatch, intl }) => {
	const navigation = useNavigation();
	const [visible, setVisible] = useState(false);

	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: 'row', paddingRight: 5 }}>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchor={
							<Button
								onPress={openMenu}
								icon='menu'>
								Menu
							</Button>
						}>
						{/* Home Button */}
						<Menu.Item
							icon='home'
							onPress={() => {
								closeMenu();
								navigation.navigate('ScavengerScreen');
							}}
							title={intl.formatMessage({ id: 'Home' })}
						/>

						{/* Logout Button */}
						<Menu.Item
							icon='logout'
							onPress={() => {
								closeMenu();
								dispatch(addAuthToken(null));
								navigation.reset({
									index: 0,
									routes: [{ name: 'Authentication' }],
								});
							}}
							title={intl.formatMessage({ id: 'Logout' })}
						/>
					</Menu>
				</View>
			),
		});
	}, [navigation, dispatch, intl, visible]);

	return null;
};

export default NavMenu;
