// Core
import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	Image,
	TouchableOpacity,
	Platform,
} from 'react-native';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useFocusEffect } from '@react-navigation/native';
import {
	Button,
	Card,
	Text,
	TextInput,
	Snackbar,
	ProgressBar,
	List,
	FAB,
	Switch,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FormattedMessage } from 'react-intl';

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import NavMenu from '../Components/navMenu';
import apiCall from '../Helper/apiCall';
import useLocationTracking from '../Helper/useLocationTracking';
import { LocationDetails } from '../Components/LocationDetailComponents/LocationDetails';

const LocationDetailScreen = ({ navigation, route }) => {
	// Props and External Hooks
	const { location, currentName, huntid } = route.params;
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const { locationData, subscription } = useLocationTracking();
	const dispatch = useDispatch();
	const intl = useIntl();

	// Currently Displayed Values
	const [currentLocationName, setCurrentLocationName] = useState('');
	const [currentLatitude, setCurrentLatitude] = useState('');
	const [currentLongitude, setCurrentLongitude] = useState('');
	const [currentClue, setCurrentClue] = useState('');
	const [currentDescription, setCurrentDescription] = useState('');
	const [isSwitchOn, setIsSwitchOn] = useState(true);

	// New Values for Updating
	const [newLocationName, setNewLocationName] = useState('');
	const [newClue, setNewClue] = useState('');
	const [newDescription, setNewDescription] = useState('');

	// Time Related States
	const initialStartTime = new Date();
	initialStartTime.setHours(0);
	initialStartTime.setMinutes(0);

	const initialEndTime = new Date();
	initialEndTime.setHours(23);
	initialEndTime.setMinutes(59);

	const [startTime, setStartTime] = useState(initialStartTime);
	const [endTime, setEndTime] = useState(initialEndTime);

	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	// Other States
	const [conditions, setConditions] = useState([]);
	const [locations, setLocations] = useState([]);
	const [selectedLocationId, setSelectedLocationId] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [openLocationEdit, setOpenLocationEdit] = useState(false);
	const [openLocationSet, setOpenLocationSet] = useState(false);
	const [openConditionPanel, setOpenConditionPanel] = useState(false);

	// Function Declarations
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

	// Load my States from the Hunt
	useEffect(() => {
		setCurrentLocationName(location.name);
		setCurrentClue(location.clue);
		setCurrentDescription(location.description);
		setCurrentLatitude(location.latitude);
		setCurrentLongitude(location.longitude);
		setNewLocationName(location.name);
		setNewClue(location.clue);
		setNewDescription(location.description);
	}, [location]);

	useFocusEffect(
		React.useCallback(() => {
			fetchConditions();
			fetchLocations();
			return () => {};
		}, [])
	);

	// Fetch Locations for the Hunt
	const fetchLocations = async () => {
		setLoading(true);

		const response = await apiCall({
			endpointSuffix: 'getHuntLocations.php',
			data: {
				huntid: huntid,
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'networkError',
		});

		if (response.success) {
			const locations = response.data.locations;
			setLocations(locations);
			if (locations.length > 0) {
				setSelectedLocationId(locations[0].locationid);
			}
		}
		setLoading(false);
	};

	// Fetch Conditions
	const fetchConditions = async () => {
		setLoading(true);
		const response = await apiCall({
			endpointSuffix: 'getConditions.php',
			data: {
				locationid: location.locationid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'locationDetailScreen.conditionsSuccessfullyDownloaded',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setConditions(response.data.conditions);
		}
		setLoading(false);
	};

	// Submit Edit Hunt
	const submitEditedLocationDetails = async () => {
		if (!newLocationName || newLocationName === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newLocationNameError',
					defaultMessage: 'Please enter a New location name',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		if (!newClue || newClue === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newClueError',
					defaultMessage: 'Please enter a New clue',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		if (!newDescription || newDescription === '') {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'locationDetailScreen.newDescriptionError',
					defaultMessage: 'Please enter a New description',
				})
			);
			setSnackbarVisible(true);
			return;
		}

		const response = await apiCall({
			endpointSuffix: 'updateHuntLocation.php',

			data: {
				locationid: location.locationid,
				token: authTokenValue,
				name: newLocationName,
				description: newDescription,
				clue: newClue,
			},
			onSuccessMessageId: 'locationDetailScreen.locationUpdated',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentClue(newClue);
			setCurrentDescription(newDescription);
			setCurrentLocationName(newLocationName);
			setNewClue(newClue);
			setNewDescription(newDescription);
			setNewLocationName(newLocationName);
			setOpenLocationEdit(false);
		}
	};

	// Confirm Delete Hunt
	const showConfirmDialog = () => {
		if (Platform.OS === 'web') {
			const isConfirmed = window.confirm(
				intl.formatMessage({
					id: 'locationDetailScreen.deleteLocationConfirm',
					defaultMessage: 'Are you sure you want to delete selected location?',
				})
			);
			if (isConfirmed) {
				deleteHunt();
			}
		} else {
			Alert.alert(
				intl.formatMessage({
					id: 'locationDetailScreen.deleteLocationConfirm',
					defaultMessage: 'Are you sure you want to delete selected location?',
				}),
				`Delete?`,
				[
					// The "Yes" button
					{
						text: 'Yes',
						onPress: () => {
							deleteLocation();
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

	const addConditionToLocation = async () => {
		if (isSwitchOn) {
			if (!selectedLocationId) {
				setSnackbarMessage(
					intl.formatMessage({
						id: 'locationDetailScreen.selectLocationError',
						defaultMessage: 'Please select a location',
					})
				);
				setSnackbarVisible(true);
				return;
			}

			if (selectedLocationId === location.locationid) {
				setSnackbarMessage(
					intl.formatMessage({
						id: 'locationDetailScreen.selectDifferentLocationError',
						defaultMessage: 'Please select a different location',
					})
				);
				setSnackbarVisible(true);
				return;
			}
		}

		let formattedUTCStartTime, formattedUTCEndTime;

		if (!isSwitchOn) {
			let utcStartHours, utcStartMinutes, utcEndHours, utcEndMinutes;
			// Convert startTime to UTC
			utcStartHours = startTime.getUTCHours();
			utcStartMinutes = startTime.getUTCMinutes();

			// Convert endTime to UTC
			utcEndHours = endTime.getUTCHours();
			utcEndMinutes = endTime.getUTCMinutes();

			// Format the time
			formattedUTCStartTime = `${utcStartHours
				.toString()
				.padStart(2, '0')}:${utcStartMinutes.toString().padStart(2, '0')}:00`;
			formattedUTCEndTime = `${utcEndHours
				.toString()
				.padStart(2, '0')}:${utcEndMinutes.toString().padStart(2, '0')}:00`;
		}

		let data;
		if (isSwitchOn) {
			data = {
				locationid: location.locationid,
				token: authTokenValue,
				requiredlocationid: selectedLocationId,
				starttime: null,
				endtime: null,
			};
		} else {
			data = {
				locationid: location.locationid,
				token: authTokenValue,
				starttime: formattedUTCStartTime,
				endtime: formattedUTCEndTime,
				requiredlocationid: null,
			};
		}

		const response = await apiCall({
			endpointSuffix: 'addCondition.php',
			data: data,
			onSuccessMessageId: 'locationDetailScreen.conditionAdded',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setOpenConditionPanel(false);
			fetchConditions();
			fetchLocations();
		}
	};

	// Set Location API Call
	const setLocation = async () => {
		const response = await apiCall({
			endpointSuffix: 'updateHuntLocationPosition.php',
			data: {
				locationid: location.locationid,
				token: authTokenValue,
				latitude: locationData.coords.latitude,
				longitude: locationData.coords.longitude,
			},
			onSuccessMessageId: 'locationDetailScreen.locationSet',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			setCurrentLatitude(locationData.coords.latitude);
			setCurrentLongitude(locationData.coords.longitude);
			setOpenLocationSet(false);
		}
	};

	// Delete Location API Call
	const deleteLocation = async () => {
		const response = await apiCall({
			endpointSuffix: 'deleteHuntLocation.php',
			data: {
				locationid: location.locationid,
				token: authTokenValue,
			},
			onSuccessMessageId: 'locationDetailScreen.locationDeleted',
			onFailureMessageId: 'networkError',
			intl,
		});

		if (response.success) {
			navigation.goBack();
		}
	};

	// Create an array for the actions FAB
	const actions = [
		{
			icon: 'delete',
			label: intl.formatMessage({
				id: 'locationDetailScreen.deleteLocationButton',
				defaultMessage: 'Delete Location',
			}),
			onPress: showConfirmDialog,
			color: themeColors.fabIconColor,
			style: { backgroundColor: themeColors.fabIconBackgroundColor },
		},
		{
			icon: 'pencil',
			label: intl.formatMessage({
				id: 'locationDetailScreen.editLocationButton',
				defaultMessage: 'Edit Location',
			}),
			onPress: () => !setOpenLocationEdit((prevState) => !prevState),
			color: themeColors.fabIconColor,
			style: { backgroundColor: themeColors.fabIconBackgroundColor },
		},
		{
			icon: 'map-marker-plus',
			label: intl.formatMessage({
				id: 'locationDetailScreen.openConditionPanel',
				defaultMessage: 'Open Condition Panel',
			}),
			onPress: () => setOpenConditionPanel((prevState) => !prevState),
			color: themeColors.fabIconColor,
			style: { backgroundColor: themeColors.fabIconBackgroundColor },
		},
	];

	if (locationData) {
		actions.push({
			icon: 'map-marker',
			label: intl.formatMessage({
				id: 'locationDetailScreen.openLocationSet',
				defaultMessage: 'Open Location Set Panel',
			}),
			color: themeColors.fabIconColor,
			style: { backgroundColor: themeColors.fabIconBackgroundColor },
			onPress: () => setOpenLocationSet((prevState) => !prevState),
		});
	}

	if (currentLatitude && currentLongitude) {
		actions.push({
			icon: 'map',
			label: intl.formatMessage({
				id: 'locationDetailScreen.viewLocationOnMap',
				defaultMessage: 'View Location on Map',
			}),
			color: themeColors.fabIconColor,
			style: { backgroundColor: themeColors.fabIconBackgroundColor },
			onPress: () => {
				navigation.navigate('Map Location', {
					location: location,
					locationName: currentLocationName,
					huntid: huntid,
					currentLatitude: currentLatitude,
					currentLongitude: currentLongitude,
				});
			},
		});
	}

	// End of FAB actions array

	function formatTime(date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;

		return hours + ':' + minutes + ' ' + ampm;
	}

	const convertUTCToLocal = (utcTimeString) => {
		const now = new Date();
		const [hours, minutes] = utcTimeString.split(':').map(Number);

		const utcDate = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
		);
		const localDate = new Date(utcDate);

		let localHours = localDate.getHours();
		const ampm = localHours >= 12 ? 'PM' : 'AM';
		localHours = localHours % 12;
		localHours = localHours || 12;

		return `${localHours}:${localDate
			.getMinutes()
			.toString()
			.padStart(2, '0')} ${ampm}`;
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<NavMenu
				dispatch={dispatch}
				intl={intl}
			/>

			<ScrollView style={{ marginBottom: 70 }}>
				<LocationDetails
					location={location}
					currentLocationName={currentLocationName}
					currentLatitude={currentLatitude}
					currentLongitude={currentLongitude}
					currentClue={currentClue}
					currentDescription={currentDescription}
					openLocationEdit={openLocationEdit}
					newLocationName={newLocationName}
					setNewLocationName={setNewLocationName}
					newClue={newClue}
					setNewClue={setNewClue}
					newDescription={newDescription}
					setNewDescription={setNewDescription}
					submitEditedLocationDetails={submitEditedLocationDetails}
					intl={intl}
				/>

				{openLocationSet && locationData ? (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'locationDetailScreen.locationPanelTitle',
									defaultMessage: 'Location Set Panel',
								})}
							/>
							<Card.Content>
								<View
									style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text>
										{intl.formatMessage({
											id: 'locationDetailScreen.touchToSetLocation',
											defaultMessage: 'Location Set Panel',
										})}
									</Text>
									<TouchableOpacity
										onPress={() => {
											setLocation();
										}}>
										<Image
											source={require('../assets/locationPrimary.png')}
											style={{ width: 150, height: 150, alignSelf: 'center' }}
										/>
									</TouchableOpacity>
								</View>
								<View style={styles.spacer2} />
								<Button
									mode={themeColors.buttonMode}
									onPress={() => setOpenLocationSet((prevState) => !prevState)}
									style={styles.loginButton}
									buttonColor={themeColors.buttonColor}>
									{intl.formatMessage({
										id: 'locationDetailScreen.closeLocationSet',
										defaultMessage: 'Close Location Set Panel',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				) : null}

				{openConditionPanel && (
					<View style={styles.container}>
						<Card style={styles.card}>
							<Card.Title
								title={intl.formatMessage({
									id: 'locationDetailScreen.conditionPanel',
									defaultMessage: 'Condition Panel',
								})}
							/>
							<Card.Content>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
										width: '100%',
									}}>
									<Text>
										{intl.formatMessage({
											id: 'locationDetailScreen.switchCondition',
											defaultMessage: 'Switch to Other Condition',
										})}
									</Text>
									<Switch
										value={isSwitchOn}
										onValueChange={onToggleSwitch}
									/>
								</View>
								{isSwitchOn ? (
									<View>
										<Picker
											selectedValue={selectedLocationId}
											onValueChange={(itemValue, itemIndex) =>
												setSelectedLocationId(itemValue)
											}
											style={{ backgroundColor: 'white', flex: 1 }} // Here's the correction
										>
											{locations.map((location, index) => (
												<Picker.Item
													key={index}
													label={location.name}
													value={location.locationid}
												/>
											))}
										</Picker>
									</View>
								) : (
									<View style={{ padding: 10 }}>
										<TouchableOpacity
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginBottom: 15,
											}}
											onPress={() => setShowStartPicker(true)}>
											<Text>
												{intl.formatMessage({
													id: 'locationDetailScreen.startTime',
													defaultMessage: 'Start Time: ',
												})}
											</Text>
											<Text>{formatTime(startTime)}</Text>
										</TouchableOpacity>

										{showStartPicker && (
											<DateTimePicker
												value={startTime}
												mode={'time'}
												display='default'
												onChange={(event, selectedDate) => {
													setShowStartPicker(false);
													if (selectedDate) setStartTime(selectedDate);
												}}
											/>
										)}

										<TouchableOpacity
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginTop: 15,
												marginBottom: 15,
											}}
											onPress={() => setShowEndPicker(true)}>
											<Text>
												{intl.formatMessage({
													id: 'locationDetailScreen.endTime',
													defaultMessage: 'End Time: ',
												})}
											</Text>
											<Text>{formatTime(endTime)}</Text>
										</TouchableOpacity>

										{showEndPicker && (
											<DateTimePicker
												value={endTime}
												mode={'time'}
												display='default'
												onChange={(event, selectedDate) => {
													setShowEndPicker(false);
													if (selectedDate) setEndTime(selectedDate);
												}}
											/>
										)}
									</View>
								)}

								<View style={styles.spacer2} />
								<Button
									mode={themeColors.buttonMode}
									onPress={() => addConditionToLocation()}
									style={styles.loginButton}
									buttonColor={themeColors.buttonColor}>
									{intl.formatMessage({
										id: 'locationDetailScreen.addCondition',
										defaultMessage: 'Add New Condition',
									})}
								</Button>
							</Card.Content>
						</Card>
					</View>
				)}

				{loading && (
					<ProgressBar
						indeterminate={true}
						color='#00FF00'
						visible={loading}
					/>
				)}

				{conditions && Array.isArray(conditions) && conditions.length > 0 && (
					<Card>
						<Card.Title
							title={intl.formatMessage({
								id: 'locationDetailScreen.conditions',
								defaultMessage: 'Conditions',
							})}
						/>

						{conditions.map((condition, index) => (
							<List.Item
								key={condition.conditionid}
								title={condition.conditionid}
								description={
									condition.requiredlocationid
										? `Location ID: ${condition.requiredlocationid}`
										: `Start Time: ${convertUTCToLocal(
												condition.starttime
										  )}, End Time: ${convertUTCToLocal(condition.endtime)}`
								}
								left={(props) => (
									<List.Icon
										{...props}
										icon='map-marker-radius'
									/>
								)}
								onPress={() => {
									navigation.navigate('Edit Condition', {
										condition,
										locationid: location.locationid,
										huntid: huntid,
									});
								}}
							/>
						))}
					</Card>
				)}
			</ScrollView>
			<FAB.Group
				open={open}
				icon={open ? 'close' : 'plus'}
				actions={actions}
				onStateChange={({ open }) => setOpen(open)}
				onPress={() => {
					if (open) {
					}
				}}
				fabStyle={{ backgroundColor: themeColors.fabBackGroundColor }}
				color={themeColors.fabColor}
			/>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={Snackbar.DURATION_SHORT}>
				{snackbarMessage}
			</Snackbar>
		</KeyboardAvoidingView>
	);
};

export default LocationDetailScreen;
