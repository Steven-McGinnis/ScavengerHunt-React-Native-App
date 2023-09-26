import React, { useState, useEffect } from 'react';
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
import { List } from 'react-native-paper';
import { clearHunts } from '../Model/Slices/HuntSlice';
import { useFocusEffect } from '@react-navigation/native';

const ScavengerScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const huntList = useSelector((state) => state.huntSlice.huntItems);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const intl = useIntl();
	const [newHuntName, setNewHuntName] = useState('');

	const createHunt = () => {
		if (!newHuntName) {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'scavenger.newHuntName',
					defaultMessage: 'Please enter a hunt name',
				})
			);
			setSnackbarVisible(true);
			return;
		}
		let formData = new FormData();
		formData.append('name', newHuntName);
		formData.append('token', authTokenValue);

		fetch('https://cpsc345sh.jayshaffstall.com/addHunt.php', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'okay') {
					if (data.huntid) {
						fetchData();
						setNewHuntName('');
					}
				} else if (data.status === 'error') {
					setSnackbarMessage(data.error[0]);
					setSnackbarVisible(true);
				}
			})
			.catch((error) => {
				console.error('Network or other error:', error);
				setSnackbarMessage(
					intl.formatMessage({
						id: 'scavenger.failedToRegister',
						defaultMessage: 'Failed to Register New Hunt. Please try again.',
					})
				);
				setSnackbarVisible(true);
			});
	};

	const fetchData = () => {
		let formData = new FormData();
		formData.append('token', authTokenValue);

		fetch('https://cpsc345sh.jayshaffstall.com/getMyHunts.php', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'okay') {
					dispatch(clearHunts());
					let hunts = data.hunts;
					hunts.forEach((element) => {
						dispatch(addHunt(element));
					});
				} else if (data.status === 'error') {
					setSnackbarMessage(data.error[0]);
					setSnackbarVisible(true);
				}
			})
			.catch((error) => {
				console.error('Network or other error:', error);
				setSnackbarMessage('Failed to Register New Hunt. Please try again.');
				setSnackbarVisible(true);
			});
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchData();
			return () => {};
		}, [])
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<LogoutButton
				dispatch={dispatch}
				intl={intl}
			/>
			<ScrollView>
				<View style={styles.container}>
					<Snackbar
						visible={snackbarVisible}
						onDismiss={() => setSnackbarVisible(false)}
						duration={Snackbar.DURATION_SHORT}>
						{snackbarMessage}
					</Snackbar>
					<Card style={styles.card}>
						{/* Translated title using FormattedMessage component */}
						<Card.Title
							title={<FormattedMessage id='ScavengerScreen' />}
							subtitle={<FormattedMessage id='scavenger.newHunt' />}
						/>
						<Card.Cover source={require('../assets/splashLogo.png')} />
						<Card.Content>
							<TextInput
								label={intl.formatMessage({
									id: 'scavenger.newHuntName',
									defaultMessage: 'Hunt Name',
								})}
								value={newHuntName}
								onChangeText={(text) => setNewHuntName(text)}
								style={styles.input}
							/>
							<Button
								mode='contained'
								onPress={createHunt}
								style={styles.loginButton}
								buttonColor='green'>
								{intl.formatMessage({
									id: 'scavenger.createHunt',
									defaultMessage: 'Create Hunt',
								})}
							</Button>
						</Card.Content>
					</Card>
				</View>
				<Card>
					<Card.Title
						title='My Hunts'
						subtitle='Select a Hunt to Edit It'
					/>
					{huntList.map((hunt, index) => {
						return (
							<List.Item
								key={index}
								title={hunt.name}
								description={`Active: ${hunt.active.toString()}`}
								left={(props) => (
									<List.Icon
										{...props}
										icon='map-search'
									/>
								)}
								onPress={() => {
									navigation.navigate('Hunt Details', hunt);
								}}
							/>
						);
					})}
				</Card>
			</ScrollView>
			<SafeAreaView style={{ backgroundColor: 'white', borderRadius: 20 }}>
				{/* <SegmentedButtons
					value={value}
					onValueChange={setValue}
					buttons={[
						{
							value: 'walk',
							label: 'Not Implemented',
							onPress: () => navigation.navigate('Authentication'),
						},
						{
							value: 'ScavengerScreen',
							label: 'Hunt',
							onPress: () => navigation.navigate('ScavengerScreen'),
						},
						{
							value: 'editHunt',
							label: 'Edit Hunt',
							onPress: () => navigation.navigate('Hunt Details'),
						},
					]}
				/> */}
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default ScavengerScreen;
