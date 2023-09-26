// HeaderButton.js
import React from 'react';
import { Button, View } from 'react-native';

const HeaderButton = ({ navigation, title, routeName }) => (
	<View style={{ paddingRight: 5 }}>
		<Button
			title={title}
			onPress={() => navigation.navigate(routeName)}
		/>
	</View>
);

export default HeaderButton;
