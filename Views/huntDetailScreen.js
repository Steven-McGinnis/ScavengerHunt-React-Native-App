import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../Styles/styles';
import { useDispatch } from 'react-redux';
import { Button, Card, Text, TextInput, Snackbar } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addAuthToken } from '../Model/Slices/authSlice';
import { useIntl, FormattedMessage } from 'react-intl';
import LogoutButton from '../Components/logoutButton';
import { SafeAreaView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { addHunt } from '../Model/Slices/HuntSlice';
import { useSelector } from 'react-redux';

const HuntDetailScreen = ({ navigation, route }) => {
	const dispatch = useDispatch();
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [currentName, setCurrentName] = useState('');
	const intl = useIntl(); // Use the intl hook
	const { active, huntid, name } = route.params;
	const [value, setValue] = useState('walk');
	const [newHuntName, setNewHuntName] = useState('');

	useEffect(() => {
		setNewHuntName(name);
		setCurrentName(name);
	}, [name]);

	const editHunt = () => {
		if (!newHuntName || newHuntName === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'huntDetailScreen.newHuntNameError',
					defaultMessage: 'Please enter a New hunt name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		let formData = new FormData();
		formData.append('name', newHuntName);
		formData.append('huntid', huntid);
		formData.append('token', authTokenValue);

		fetch('https://cpsc345sh.jayshaffstall.com/updateHunt.php', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'okay') {
					console.log('Hunt updated successfully!', data);
					setSnackbarMessage(
						intl.formatMessage({
							id: 'huntDetailScreen.huntUpdated',
							defaultMessage: 'Hunt updated successfully!',
						})
					);
					setSnackbarVisible(true);
					setCurrentName(newHuntName);
				} else if (data.status === 'error') {
					setSnackbarMessage(data.error[0]);
					setSnackbarVisible(true);
				}
			})
			.catch((error) => {
				console.error('Network or other error:', error);
				setSnackbarMessage(
					intl.formatMessage({
						id: 'networkError',
						defaultMessage: 'Network or other error',
					})
				);
				setSnackbarVisible(true);
			});
	};

	const showConfirmDialog = () => {
		if (Platform.OS === 'web') {
			const isConfirmed = window.confirm(
				intl.formatMessage({
					id: 'huntDetailScreen.deleteHuntConfirm',
					defaultMessage: 'Are you sure you want to delete selected Hunt?',
				})
			);
			if (isConfirmed) {
				deleteHunt();
			}
		} else {
			Alert.alert(
				intl.formatMessage({
					id: 'huntDetailScreen.deleteHuntConfirm',
					defaultMessage: 'Are you sure you want to delete selected Hunt?',
				}),
				`Delete?`,
				[
					// The "Yes" button
					{
						text: 'Yes',
						onPress: () => {
							deleteHunt();
						},
					},
					// The "No" button
					{
						text: 'No',
					},
				]
			);
		}
	};

	const deleteHunt = () => {
		let formData = new FormData();
		formData.append('huntid', huntid);
		formData.append('token', authTokenValue);

		fetch('https://cpsc345sh.jayshaffstall.com/deleteHunt.php', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'okay') {
					console.log('Hunt Deleted successfully!', data);
					setSnackbarMessage(
						intl.formatMessage({
							id: 'huntDetailScreen.huntDeleted',
							defaultMessage: 'Hunt deleted successfully!',
						})
					);
					setSnackbarVisible(true);
					navigation.navigate('ScavengerScreen');
				} else if (data.status === 'error') {
					setSnackbarMessage(data.error[0]);
					setSnackbarVisible(true);
				}
			})
			.catch((error) => {
				console.error('Network or other error:', error);
				setSnackbarMessage(
					intl.formatMessage({
						id: 'networkError',
						defaultMessage: 'Network or other error',
					})
				);
				setSnackbarVisible(true);
			});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<LogoutButton
				dispatch={dispatch}
				intl={intl}
			/>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
			<ScrollView>
				<View style={styles.container}>
					<Card style={styles.card}>
						<Card.Title
							title={<FormattedMessage id='huntDetailScreen.editHunt' />}
						/>
						<Card.Content>
							<Text>
								<FormattedMessage id='huntDetailScreen.huntName' />{' '}
								{currentName}
							</Text>
							<Text>
								<FormattedMessage id='huntDetailScreen.huntID' /> {huntid}
							</Text>
							<Text>
								<FormattedMessage id='huntDetailScreen.active' />{' '}
								{active ? 'Yes' : 'No'}
							</Text>
							<View style={styles.spacer2} />
							<TextInput
								label={intl.formatMessage({
									id: 'huntDetailScreen.huntName',
									defaultMessage: 'Hunt Name',
								})}
								value={newHuntName}
								onChangeText={(text) => setNewHuntName(text)}
								style={styles.input}
							/>
							<View style={styles.spacer2} />
							<Button
								mode='contained'
								onPress={editHunt}
								style={styles.loginButton}
								buttonColor='green'>
								{intl.formatMessage({
									id: 'huntDetailScreen.editHuntButton',
									defaultMessage: 'Edit Hunt',
								})}
							</Button>
							<View style={styles.spacer2} />
							<Button
								mode='contained'
								onPress={showConfirmDialog}
								style={styles.loginButton}
								buttonColor='green'>
								{intl.formatMessage({
									id: 'huntDetailScreen.deleteHuntButton',
									defaultMessage: 'Edit Hunt',
								})}
							</Button>
						</Card.Content>
					</Card>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default HuntDetailScreen;
