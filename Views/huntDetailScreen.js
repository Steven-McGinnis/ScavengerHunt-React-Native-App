// Core
import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView } from 'react-native';

// Third-party libraries
import { useDispatch, useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
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
} from 'react-native-paper';

// Custom components and utilities
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import NavMenu from '../Components/navMenu';
import apiCall from '../Helper/apiCall';
import CustomSnackbar from '../Components/customSnackBar';

// Redux slices
import {
    clearHuntLocations,
    addHuntLocations,
} from '../Model/Slices/huntSlice';

const HuntDetailScreen = ({ navigation, route }) => {
    // Extracting route parameters
    const { active, huntid, name } = route.params;

    // Redux selectors
    const hunt = useSelector((state) =>
        state.huntSlice.huntItems.find((h) => h.huntid === huntid)
    );
    const authTokenValue = useSelector((state) => state.authSlice.authToken);

    // Redux dispatch hook
    const dispatch = useDispatch();

    // Internationalization hook
    const intl = useIntl();

    // Hunt-related state
    const [currentName, setCurrentName] = useState('');
    const [newHuntName, setNewHuntName] = useState('');
    const [newHuntLocations, setNewHuntLocations] = useState('');
    const [locations, setLocations] = useState([]);
    const [currentActive, setCurrentActive] = useState(false);

    // Snackbar state management
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    // Loading and modal states
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEditHunt, setOpenEditHunt] = useState(false);
    const [openLocationAdd, setOpenLocationAdd] = useState(false);

    // Set the Hunt Name
    useEffect(() => {
        setNewHuntName(name);
        setCurrentName(name);
        setCurrentActive(active);
    }, [name]);

    // Initial Load Data
    useFocusEffect(
        React.useCallback(() => {
            fetchLocations();
            return () => {};
        }, [])
    );

    useEffect(() => {
        if (hunt) {
            setLocations(hunt.locations);
        }
    }, [hunt]);

    // Submit Edit Hunt
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

    // Confirm Delete Hunt
    const showConfirmDialog = () => {
        Alert.alert(
            intl.formatMessage({
                id: 'huntDetailScreen.deleteHuntConfirm',
                defaultMessage:
                    'Are you sure you want to delete selected Hunt?',
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
    };

    /**
     * Asynchronously adds a location to the specified hunt using an API call.
     * Before making the API call, it checks if there's a valid new location name.
     * If the location name is missing or invalid, an error snackbar is displayed.
     * On successful API response, it fetches the latest locations and closes the location addition interface.
     *
     * @async
     * @function
     * @returns {void} Returns nothing
     */
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
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'huntDetailScreen.locationCreatedSuccessfully',
                    defaultMessage: 'Location Created Successfully!',
                })
            );
            setSnackbarIconName('check-circle-outline');
            setSnackbarVisible(true);
            fetchLocations();
            setOpenLocationAdd(false);
        }
    };

    // Delete Hunt
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

        if (!response.success) {
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'huntDetailScreen.huntDeleteError',
                    defaultMessage: 'Failed to delete Hunt',
                })
            );
            setSnackbarVisible(true);
            return;
        }

        if (response.success) {
            navigation.replace('ScavengerScreen');
        }
    };

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
            dispatch(clearHuntLocations({ huntid: huntid }));

            const locations = response.data.locations;
            dispatch(
                addHuntLocations({ huntid: huntid, locations: locations })
            );
        }
        setLoading(false);
    };

    const publishHunt = async () => {
        const response = await apiCall({
            endpointSuffix: 'updateHunt.php',
            data: {
                name: currentName,
                huntid: huntid,
                token: authTokenValue,
                active: 1,
            },
            onSuccessMessageId: 'huntDetailScreen.huntPublished',
            onFailureMessageId: 'networkError',
            intl,
        });

        if (response.success) {
            setCurrentActive(true);
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'huntDetailScreen.huntPublished',
                    defaultMessage: 'Hunt Published Successfully!',
                })
            );
            setSnackbarVisible(true);
        }
    };

    // Unpublish Hunt
    const unpublishHunt = async () => {
        const response = await apiCall({
            endpointSuffix: 'updateHunt.php',
            data: {
                name: currentName,
                huntid: huntid,
                token: authTokenValue,
                active: 0,
            },
            onSuccessMessageId: 'huntDetailScreen.huntUnpublished',
            onFailureMessageId: 'networkError',
            intl,
        });

        if (response.success) {
            setCurrentActive(false);
            setSnackbarMessage(
                intl.formatMessage({
                    id: 'huntDetailScreen.huntUnpublished',
                    defaultMessage: 'Hunt Unpublished Successfully!',
                })
            );
            setSnackbarVisible(true);
        }
    };

    // FAB Actions
    const publishAction = {
        icon: 'publish',
        label: intl.formatMessage({
            id: 'huntDetailScreen.publishHunt',
            defaultMessage: 'Publish Hunt',
        }),
        onPress: () => {
            publishHunt();
        },
        style: { backgroundColor: themeColors.buttonColor },
        color: themeColors.fabIconColor,
    };

    const unpublishAction = {
        icon: 'publish-off',
        label: intl.formatMessage({
            id: 'huntDetailScreen.unpublishHunt',
            defaultMessage: 'Unpublish Hunt',
        }),
        onPress: () => {
            unpublishHunt();
        },
        style: { backgroundColor: themeColors.buttonColor },
        color: themeColors.fabIconColor,
    };

    const actions = [
        {
            icon: 'delete',
            label: intl.formatMessage({
                id: 'huntDetailScreen.deleteHuntButton',
                defaultMessage: 'Delete Hunt',
            }),
            onPress: showConfirmDialog,
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        currentActive ? unpublishAction : publishAction,
        {
            icon: 'pencil',
            label: intl.formatMessage({
                id: 'huntDetailScreen.editHuntButton',
                defaultMessage: 'Edit Hunt',
            }),
            onPress: () => !setOpenEditHunt((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'map-marker-plus',
            label: intl.formatMessage({
                id: 'huntDetailScreen.addLocationButton',
                defaultMessage: 'Add Location',
            }),
            onPress: () => !setOpenLocationAdd((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];

    return (
        <View style={styles.container}>
            <NavMenu
                dispatch={dispatch}
                intl={intl}
            />
            <ScrollView style={{ marginBottom: 70 }}>
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text>
                                <FormattedMessage id='huntDetailScreen.huntName' />{' '}
                                {currentName}
                            </Text>
                            <Text>
                                <FormattedMessage id='huntDetailScreen.huntID' />{' '}
                                {huntid}
                            </Text>
                            <Text>
                                <FormattedMessage id='huntDetailScreen.active' />{' '}
                                {currentActive ? 'Yes' : 'No'}
                            </Text>
                            {openEditHunt && (
                                <View>
                                    <View style={styles.spacer2} />
                                    <TextInput
                                        activeOutlineColor={
                                            themeColors.textactiveOutlineColor
                                        }
                                        mode={themeColors.textMode}
                                        label={intl.formatMessage({
                                            id: 'huntDetailScreen.huntName',
                                            defaultMessage: 'Hunt Name',
                                        })}
                                        value={newHuntName}
                                        onChangeText={(text) =>
                                            setNewHuntName(text)
                                        }
                                        style={styles.input}
                                    />
                                    <View style={styles.spacer2} />
                                    <Button
                                        mode={themeColors.buttonMode}
                                        onPress={submitEditHunt}
                                        style={styles.loginButton}
                                        buttonColor={themeColors.buttonColor}>
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

                {openLocationAdd && (
                    <View style={styles.container}>
                        <Card style={styles.card}>
                            <Card.Title
                                title={intl.formatMessage({
                                    id: 'huntDetailScreen.locationTitle',
                                    defaultMessage: 'Add Location to Hunt',
                                })}
                                subtitle={intl.formatMessage({
                                    id: 'huntDetailScreen.selectLocationText',
                                    defaultMessage:
                                        'Select a Location to Edit It',
                                })}
                            />
                            <Card.Content>
                                <TextInput
                                    activeOutlineColor={
                                        themeColors.textactiveOutlineColor
                                    }
                                    mode={themeColors.textMode}
                                    label={intl.formatMessage({
                                        id: 'huntDetailScreen.addLocation',
                                        defaultMessage: 'Add Location to Hunt',
                                    })}
                                    value={newHuntLocations}
                                    onChangeText={(text) =>
                                        setNewHuntLocations(text)
                                    }
                                    style={styles.input}
                                />
                                <View style={styles.spacer2} />
                                <Button
                                    mode={themeColors.buttonMode}
                                    onPress={addLocationToTheHunt}
                                    style={styles.loginButton}
                                    buttonColor={themeColors.buttonColor}>
                                    {intl.formatMessage({
                                        id: 'huntDetailScreen.addLocationButton',
                                        defaultMessage: 'Add Location',
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
                        style={{ marginBottom: 10 }}
                    />
                )}

                {locations &&
                    Array.isArray(locations) &&
                    locations.length > 0 && (
                        <Card>
                            <Card.Title
                                title='Locations in this Hunt'
                                subtitle='Select a Location to Edit It'
                            />
                            {locations.map((location, index) => (
                                <List.Item
                                    key={location.locationid}
                                    title={location.name}
                                    left={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon='map-marker-radius'
                                        />
                                    )}
                                    onPress={() => {
                                        navigation.navigate(
                                            'Location Details',
                                            {
                                                location,
                                                currentName,
                                                huntid,
                                            }
                                        );
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

export default HuntDetailScreen;
