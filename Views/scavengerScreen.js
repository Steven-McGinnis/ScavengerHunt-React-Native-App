// Core
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Card,
	Text,
	TextInput,
	Snackbar,
	List,
	ProgressBar,
} from 'react-native-paper';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFocusEffect } from '@react-navigation/native';

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import NavMenu from '../Components/navMenu';
import apiCall from '../Helper/apiCall';
import CustomSnackbar from '../Components/customSnackBar';

// Redux slices
import { addHunt, clearHunts } from '../Model/Slices/huntSlice';

const ScavengerScreen = ({ navigation }) => {
	// Redux hooks
	const dispatch = useDispatch();

	// State selectors
	const authTokenValue = useSelector((state) => state.authSlice.authToken);
	const huntList = useSelector((state) => state.huntSlice.huntItems);

	// Snackbar state
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarIconName, setSnackbarIconName] = useState(null);

	// Internationalization hook
	const intl = useIntl();

	// Loader state
	const [loading, setLoading] = useState(false);

	// Input state
	const [newHuntName, setNewHuntName] = useState('');

	// Initial Load for Data
	useFocusEffect(
		React.useCallback(() => {
			fetchData();
			return () => {};
		}, [])
	);

	/**
	 * Asynchronously creates a hunt. It first checks if there's a new hunt name.
	 * If the hunt name is missing, it shows an error. Otherwise, it makes an API call
	 * to create the hunt. After successfully creating the hunt, it fetches the latest data.
	 *
	 * @async
	 * @function
	 * @returns {void} Returns nothing
	 */
	const createHunt = async () => {
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

		const response = await apiCall({
			endpointSuffix: 'addHunt.php',
			data: {
				name: newHuntName,
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'scavenger.failedToRegister',
			intl,
		});

		if (response.success) {
			if (response.data.huntid) {
				fetchData();
				setNewHuntName('');
				setSnackbarMessage(
					intl.formatMessage({
						id: 'scavenger.huntCreated',
						defaultMessage: 'Hunter Created Successfully!',
					})
				);
				setSnackbarIconName('check-circle-outline');
				setSnackbarVisible(true);
			}
		}
	};

	/**
	 * Asynchronously fetches hunts data using an API call.
	 * It sets a loading state before starting the call and resets it after finishing.
	 * If the API call is unsuccessful, an error snackbar is displayed.
	 * On successful fetch, it clears any existing hunts and dispatches new hunts to the store.
	 *
	 * @async
	 * @function
	 * @returns {void} Returns nothing
	 */
	const fetchData = async () => {
		setLoading(true);

		const response = await apiCall({
			endpointSuffix: 'getMyHunts.php',
			data: {
				token: authTokenValue,
			},
			onSuccessMessageId: null,
			onFailureMessageId: 'scavenger.failedToRegister',
			intl,
		});

		if (!response.success) {
			setSnackbarMessage(
				intl.formatMessage({
					id: 'scavenger.failedToLoadData',
					defaultMessage: 'Failed to load data',
				})
			);
			setSnackbarIconName('error-outline');
			setSnackbarVisible(true);
			return;
		}

		if (response.success) {
			dispatch(clearHunts());
			let hunts = response.data.hunts;
			hunts.forEach((element) => {
				dispatch(addHunt(element));
			});
		}

		setLoading(false);
	};

	return (
		<View style={styles.container}>
			<NavMenu
				dispatch={dispatch}
				intl={intl}
			/>
			<ScrollView>
				<View style={styles.container}>
					<Card style={styles.card}>
						<Card.Title
							title={<FormattedMessage id='ScavengerScreen' />}
							subtitle={<FormattedMessage id='scavenger.newHunt' />}
						/>
						<Card.Cover source={require('../assets/splashLogo.png')} />
						<Card.Content>
							<TextInput
								activeOutlineColor={themeColors.textactiveOutlineColor}
								mode={themeColors.textMode}
								label={intl.formatMessage({
									id: 'scavenger.newHuntName',
									defaultMessage: 'Hunt Name',
								})}
								value={newHuntName}
								onChangeText={(text) => setNewHuntName(text)}
								style={styles.input}
							/>
							<Button
								mode={themeColors.buttonMode}
								onPress={createHunt}
								style={styles.loginButton}
								buttonColor={themeColors.buttonColor}>
								{intl.formatMessage({
									id: 'scavenger.createHunt',
									defaultMessage: 'Create Hunt',
								})}
							</Button>
						</Card.Content>
					</Card>
				</View>
				{loading && (
					<ProgressBar
						indeterminate={true}
						color='#00FF00'
						visible={loading}
						style={{ marginBottom: 10 }}
					/>
				)}
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
			<CustomSnackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				message={snackbarMessage}
				iconName={snackbarIconName}
				duration={Snackbar.DURATION_SHORT}
			/>
		</View>
	);
};

export default ScavengerScreen;
