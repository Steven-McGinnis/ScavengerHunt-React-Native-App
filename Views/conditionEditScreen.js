// Core
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    TouchableOpacity,
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
import timeHelper from '../Helper/timeHelper';
import CustomSnackbar from '../Components/customSnackBar';

const ConditionEditScreen = ({ navigation, route }) => {
    // Props and External Hooks
    const { condition, locationid, huntid } = route.params;

    // Redux hooks
    const authTokenValue = useSelector((state) => state.authSlice.authToken);
    const dispatch = useDispatch();

    // Internationalization
    const intl = useIntl();

    // Panel, Loading, and Condition states
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    // Switch states and handlers
    const [isSwitchOn, setIsSwitchOn] = useState(true);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    // Location-related states
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [locations, setLocations] = useState([]);

    // Time-related states
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
    const [currentLocationId, setCurrentLocationId] = useState(null);
    const [currentStartTime, setCurrentStartTime] = useState(null);
    const [currentEndTime, setCurrentEndTime] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            fetchLocations();
            if (condition.starttime && condition.endtime) {
                setIsSwitchOn(false);
            }
            setStartTime(
                condition.starttime
                    ? utcStringToLocalDate(condition.starttime)
                    : initialStartTime
            );
            setEndTime(
                condition.endtime
                    ? utcStringToLocalDate(condition.endtime)
                    : initialEndTime
            );
            setCurrentStartTime(startTime);
            setCurrentEndTime(endTime);
            if (condition.requiredlocationid) {
                setCurrentLocationId(condition.requiredlocationid);
                setSelectedLocationId(condition.requiredlocationid);
            }
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

    // Confirm Delete Hunt
    const showConfirmDialog = () => {
        Alert.alert(
            intl.formatMessage({
                id: 'conditionEditScreen.deleteConditionConfirm',
                defaultMessage:
                    'Are you sure you want to delete selected condition?',
            }),
            `Delete?`,
            [
                // The "Yes" button
                {
                    text: 'Yes',
                    onPress: () => {
                        deleteCondition();
                    },
                },
                // The "No" button
                {
                    text: 'No',
                },
            ]
        );
    };

    // Delete Condition
    const deleteCondition = async () => {
        const response = await apiCall({
            endpointSuffix: 'deleteCondition.php',
            data: {
                conditionid: condition.conditionid,
                token: authTokenValue,
            },
            onSuccessMessageId: 'conditionEditScreen.conditionDeleted',
            onFailureMessageId: 'networkError',
            intl,
        });

        if (response.success) {
            navigation.goBack();
        }
    };

    function stringToTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes + ' ' + ampm;
    }

    function getLocationNameById(id) {
        const location = locations.find((loc) => loc.locationid === id);
        return location ? location.name : 'Not Found';
    }

    // Create an array for the actions FAB
    const actions = [
        {
            icon: 'delete',
            label: intl.formatMessage({
                id: 'conditionEditScreen.deleteConditionButton',
                defaultMessage: 'Delete Condition',
            }),
            onPress: showConfirmDialog,
            color: themeColors.fabIconColor,
            style: { backgroundColor: themeColors.fabIconBackgroundColor },
        },
    ];

    function utcStringToLocalDate(utcTimeString) {
        if (!utcTimeString) return null;

        const [hours, minutes] = utcTimeString.split(':').map(Number);
        const localDate = new Date();

        // Set local date object to provided UTC hours and minutes
        localDate.setHours(hours, minutes, 0, 0);

        // Adjust by timezone offset
        localDate.setMinutes(
            localDate.getMinutes() - localDate.getTimezoneOffset()
        );

        return localDate;
    }

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

            if (selectedLocationId === locationid) {
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
                .padStart(2, '0')}:${utcStartMinutes
                .toString()
                .padStart(2, '0')}:00`;
            formattedUTCEndTime = `${utcEndHours
                .toString()
                .padStart(2, '0')}:${utcEndMinutes
                .toString()
                .padStart(2, '0')}:00`;
        }

        let data;
        if (isSwitchOn) {
            data = {
                conditionid: condition.conditionid,
                token: authTokenValue,
                requiredlocationid: selectedLocationId,
                starttime: null,
                endtime: null,
            };
        } else {
            data = {
                conditionid: condition.conditionid,
                token: authTokenValue,
                starttime: formattedUTCStartTime,
                endtime: formattedUTCEndTime,
                requiredlocationid: null,
            };
        }

        const response = await apiCall({
            endpointSuffix: 'updateCondition.php',
            data: data,
            onSuccessMessageId: 'conditionEditScreen.conditionUpdated',
            onFailureMessageId: 'networkError',
            intl,
            debug: true,
        });

        if (response.success) {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <NavMenu />
            {loading && (
                <ProgressBar
                    indeterminate={true}
                    color='#00FF00'
                    visible={loading}
                />
            )}
            <ScrollView style={{ backgroundColor: '#444654' }}>
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Title
                            title={intl.formatMessage({
                                id: 'conditionEditScreen.conditionPanel',
                                defaultMessage: 'Edit Condition Panel',
                            })}
                        />
                        <Card.Content>
                            {currentLocationId ? (
                                <>
                                    <Text>
                                        Required Location:{' '}
                                        {getLocationNameById(currentLocationId)}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text>
                                        Required StartTime:{' '}
                                        {currentStartTime
                                            ? timeHelper.convertUTCToLocal(
                                                  currentStartTime
                                              )
                                            : 'None'}
                                    </Text>
                                    <Text>
                                        Required EndTime:{' '}
                                        {currentEndTime
                                            ? timeHelper.convertUTCToLocal(
                                                  currentEndTime
                                              )
                                            : 'None'}
                                    </Text>
                                </>
                            )}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}>
                                <Text>
                                    {intl.formatMessage({
                                        id: 'conditionEditScreen.switchCondition',
                                        defaultMessage:
                                            'Switch to Other Condition',
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
                                        style={{
                                            backgroundColor: 'white',
                                            flex: 1,
                                        }} // Here's the correction
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
                                        onPress={() =>
                                            setShowStartPicker(true)
                                        }>
                                        <Text>
                                            {intl.formatMessage({
                                                id: 'conditionEditScreen.startTime',
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
                                                if (selectedDate)
                                                    setStartTime(selectedDate);
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
                                                id: 'conditionEditScreen.endTime',
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
                                                if (selectedDate)
                                                    setEndTime(selectedDate);
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
                                    id: 'conditionEditScreen.editCondition',
                                    defaultMessage: 'Edit Condition',
                                })}
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
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

export default ConditionEditScreen;
