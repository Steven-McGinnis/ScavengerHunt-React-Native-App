// External Libraries
import React, { useCallback, useEffect } from 'react';
import geolib, { getDistance, getCompassDirection } from 'geolib';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { View, Alert, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

// React Navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Local Components and Helpers
import HuntDetailCard from '../Components/PlayerHuntDetail/huntDetailCard';
import HuntNotStarted from '../Components/PlayerHuntDetail/huntNotStarted';
import AbandonHuntCard from '../Components/PlayerHuntDetail/abandonHuntCard';
import CustomFABGroup from '../Components/customFABGroup';
import CustomSnackbar from '../Components/customSnackBar';
import LocationListCard from '../Components/PlayerHuntDetail/locationListCard';
import CompassComponent from '../Components/compassComponent';
import apiCall from '../Helper/apiCall';
import useLocationTracking from '../Helper/useLocationTracking';
import { usePlayerHuntDetailFabActions } from '../Helper/fabActions';

// Styling
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';

const PlayerHuntDetail = (route) => {
    // Redux State
    const authTokenValue = useSelector((state) => state.authSlice.authToken);

    // Route Params
    const { completed, huntid, name } = route.route.params;

    // React Navigation
    const navigation = useNavigation();

    // Internationalization
    const intl = useIntl();

    // React States
    const [updatedHunt, setUpdatedHunt] = React.useState(null);
    const [completionData, setCompletionData] = React.useState([]);
    const [locations, setLocations] = React.useState([]);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarIconName, setSnackbarIconName] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayCompass, setDisplayCompass] = React.useState(false);

    // Custom Hooks
    const { locationData } = useLocationTracking();

    useEffect(() => {
        getHunts();
    }, [name]);

    useEffect(() => {
        if (!locationData) setLoading(true);
    }, []);

    useEffect(() => {
        if (updatedHunt) setCompletionData(updatedHunt.completed);
    }, [updatedHunt]);

    useFocusEffect(
        useCallback(() => {
            if (completed !== null) getLocations();
        }, [])
    );

    console.log(updatedHunt);

    const getHunts = async () => {
        let data = {
            token: authTokenValue,
            filter: name,
        };

        const response = await apiCall({
            endpointSuffix: 'findHunts.php',
            data,
        });

        if (response.success) {
            setUpdatedHunt(response.data.hunts[0]);
        }
    };

    const getLocations = async () => {
        setLoading(true);

        const response = await apiCall({
            endpointSuffix: 'getAvailableLocations.php',
            data: {
                token: authTokenValue,
                huntid: huntid,
            },
        });

        if (!response.success) {
            setSnackbarIconName('alert-circle');
            setSnackbarMessage(response.message);
            setSnackbarVisible(true);
        }

        if (response.success) {
            setLocations(response.data.locations);
        }

        setLoading(false);
    };

    // Start Hunt
    const startHunt = async () => {
        console.log('Start Hunt Pressed');

        const response = await apiCall({
            endpointSuffix: 'startHunt.php',
            data: {
                token: authTokenValue,
                huntid: huntid,
            },
        });

        if (!response.success) {
            console.log(response.message);
            return;
        }

        if (response.success) {
            navigation.goBack();
            return;
        }
    };

    // Abandon Hunt
    const abandonHunt = async () => {
        console.log('Abandon Hunt Pressed');

        const response = await apiCall({
            endpointSuffix: 'abandonHunt.php',
            data: {
                token: authTokenValue,
                huntid: huntid,
            },
        });

        if (!response.success) {
            console.log(response.message);
            return;
        }

        if (response.success) {
            navigation.goBack();
            return;
        }
    };

    // Shows the Confirmation Dialog for Abandoning a Hunt
    const showConfirmDialog = () => {
        Alert.alert(
            intl.formatMessage({
                id: 'abandonHuntCard.abandonConfirmDialog',
                defaultMessage: 'Are you sure you want to abandon this hunt?',
            }),
            `Abandon?`,
            [
                // The "Yes" button
                {
                    text: 'Yes',
                    onPress: () => {
                        abandonHunt();
                    },
                },
                // The "No" button
                {
                    text: 'No',
                },
            ]
        );
    };

    const checkIn = async (location) => {
        setLoading(true);

        const response = await apiCall({
            endpointSuffix: 'completeLocation.php',
            data: {
                token: authTokenValue,
                locationid: location.locationid,
                latitude: locationData.coords.latitude,
                longitude: locationData.coords.longitude,
            },
        });

        if (!response.success) {
            if (response.message === 'Too far') {
                setSnackbarIconName('error');
                setSnackbarMessage(
                    intl.formatMessage({
                        id: 'playerHuntDetail.tooFar',
                        defaultMessage: 'Too far from location!',
                    })
                );
                setSnackbarVisible(true);
            }

            if (response.message !== 'Too far') {
                setSnackbarIconName('error');
                setSnackbarMessage(response.message);
                setSnackbarVisible(true);
            }
        }

        if (response.success) {
            setSnackbarIconName('check-circle');
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'playerHuntDetail.checkInSuccess',
                    defaultMessage: 'Check-in successful!',
                })
            );
            setSnackbarVisible(true);
            getLocations();
            getHunts();
        }
        setLoading(false);
    };

    const giveHint = async (location) => {
        try {
            if (!locationData || !locationData.coords) {
                Alert.alert(
                    'Location Error',
                    "Can't get your current location."
                );
                return;
            }

            // Ensure the location object has the required properties
            if (!location || !location.latitude || !location.longitude) {
                Alert.alert('Location Error', 'Invalid location.');
                return;
            }

            const distance = getDistance(
                {
                    latitude: locationData.coords.latitude,
                    longitude: locationData.coords.longitude,
                },
                { latitude: location.latitude, longitude: location.longitude }
            );

            if (distance <= 25) {
                Alert.alert('Hint', "You're very close to the location!");
            } else {
                const direction = getCompassDirection(
                    {
                        latitude: locationData.coords.latitude,
                        longitude: locationData.coords.longitude,
                    },
                    {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }
                );

                Alert.alert(
                    'Hint',
                    `The location is ${distance} meters to the ${direction}`
                );
            }
        } catch (error) {
            console.error('An error occurred while giving hint:', error);
            Alert.alert('Error', 'An error occurred while giving hint.');
        }
    };

    const actions = usePlayerHuntDetailFabActions({
        showConfirmDialog,
        themeColors,
        setDisplayCompass,
    });

    return (
        <View style={styles.container2}>
            {displayCompass ? <CompassComponent /> : null}
            <HuntDetailCard
                title={name}
                huntid={huntid}
                completed={completionData}
            />
            {completed === null ? (
                <HuntNotStarted onPress={() => startHunt()} />
            ) : null}

            {loading && (
                <ProgressBar
                    indeterminate={true}
                    color={themeColors.loadingIndicatorColor}
                    visible={loading}
                />
            )}

            {locations &&
                Array.isArray(locations) &&
                locations.length > 0 &&
                locationData && (
                    <LocationListCard
                        locations={locations}
                        locationData={locationData}
                        onPress={checkIn}
                        giveHint={giveHint}
                    />
                )}

            {completed !== null ? <CustomFABGroup actions={actions} /> : null}
            <CustomSnackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                message={snackbarMessage}
                iconName={snackbarIconName}
            />
        </View>
    );
};

export default PlayerHuntDetail;
