import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomSnackbar = ({
	visible,
	onDismiss,
	message,
	iconName,
	...props
}) => {
	return (
		<Snackbar
			visible={visible}
			onDismiss={onDismiss}
			style={styles.snackbar}
			{...props}>
			<View style={styles.container}>
				{iconName && (
					<Icon
						name={iconName}
						size={20}
						style={styles.icon}
					/>
				)}
				<Text>{message}</Text>
			</View>
		</Snackbar>
	);
};

const styles = StyleSheet.create({
	snackbar: {
		backgroundColor: 'white',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: 5,
	},
});

export default CustomSnackbar;
