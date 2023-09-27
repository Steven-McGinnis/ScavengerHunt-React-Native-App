import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../Styles/styles';
import { useDispatch } from 'react-redux';
import { Button, Card, Text, TextInput, Snackbar } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useIntl, FormattedMessage } from 'react-intl';
import LogoutButton from '../Components/logoutButton';
import apiCall from '../Helper/apiCall';
import { useSelector } from 'react-redux';

const HuntDetailScreen = ({ navigation, route }) => {
	const { active, huntid, name, locations } = route.params;
	const authTokenValue = useSelector((state) => state.authSlice.authToken);

	// State Management for Hunt Name
	const [currentName, setCurrentName] = useState('');
	const [newHuntName, setNewHuntName] = useState('');
	const [newHuntLocations, setNewHuntLocations] = useState('');

	// State Management for Snackbar
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	// Edit Hunt State
	const [openEditHunt, setOpenEditHunt] = useState(false);

	const dispatch = useDispatch();
	const intl = useIntl();

	useEffect(() => {
		setNewHuntName(name);
		setCurrentName(name);
	}, [name]);

	const submitEditHunt = async () => {
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

		const response = await apiCall({
			endpointSuffix: 'updateHunt.php',
			data: {
				name: newHuntName,
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.huntUpdated',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentName(newHuntName);
			setOpenEditHunt(false);
		}
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

	const addLocationToTheHunt = async () => {
		if (!newHuntLocations || newHuntLocations === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'huntDetailScreen.newLocationNameError',
					defaultMessage: 'Please enter a New Location name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'addHuntLocation.php',
			data: {
				name: newHuntLocations,
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.locationCreatedSuccessfully',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentName(newHuntName);
			setOpenEditHunt(false);
		}
		if (response.error) {
			setSnackbarMessage(response.error);
			setSnackbarVisible(true);
		}
	};

	const deleteHunt = async () => {
		const response = await apiCall({
			endpointSuffix: 'deleteHunt.php',
			data: {
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'huntDetailScreen.huntDeleted',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			navigation.navigate('ScavengerScreen');
		}
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
							{openEditHunt && (
								<View>
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
										onPress={submitEditHunt}
										style={styles.loginButton}
										buttonColor='green'>
										{intl.formatMessage({
											id: 'huntDetailScreen.submitEditHunt',
											defaultMessage: 'Submit',
										})}
									</Button>
								</View>
							)}
						</Card.Content>
					</Card>
				</View>

				{openEditHunt && (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'huntDetailScreen.locationTitle',
									defaultMessage: 'Add Location to Hunt',
								})}
								subtitle={intl.formatMessage({
									id: 'huntDetailScreen.selectLocationText',
									defaultMessage: 'Select a Location to Edit It',
								})}
							/>
							<Card.Content>
								{/* Add Location to Hunt */}
								<TextInput
									label={intl.formatMessage({
										id: 'huntDetailScreen.addLocation',
										defaultMessage: 'Add Location to Hunt',
									})}
									value={newHuntLocations}
									onChangeText={(text) => setNewHuntLocations(text)}
									style={styles.input}
								/>
								<View style={styles.spacer2} />
								<Button
									mode='contained'
									// skip onpress
									style={styles.loginButton}
									buttonColor='green'>
									{intl.formatMessage({
										id: 'huntDetailScreen.addLocationButton',
										defaultMessage: 'Add Location',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				)}

				{locations &&
					Array.isArray(locations) &&
					locations.length > 0 &&
					locations.map((location, index) => {
						return (
							<Card>
								<Card.Title
									title='Locations in this Hunt'
									subtitle='Select a Location to Edit It'
								/>
								<List.Item
									key={index}
									title={location.name}
									description={`Active: ${location.active.toString()}`}
									left={(props) => (
										<List.Icon
											{...props}
											icon='map-marker-radius'
										/>
									)}
									onPress={() => {
										navigation.navigate('location Details', location);
									}}
								/>
							</Card>
						);
					})}
			</ScrollView>
			<View style={styles.navigation}>
				<Card style={styles.card}>
					<Card.Content
						Content
						style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							mode='contained'
							onPress={() => !setOpenEditHunt((prevState) => !prevState)}
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
		</KeyboardAvoidingView>
	);
};

export default HuntDetailScreen;
