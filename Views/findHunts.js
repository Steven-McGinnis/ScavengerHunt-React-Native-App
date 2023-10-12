// React and React Native core libraries
import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

// External libraries and components
import {
    DataTable,
    Snackbar,
    List,
    Searchbar,
    Button,
    Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

// Internal modules and components
import apiCall from '../Helper/apiCall';
import CustomSnackbar from '../Components/customSnackBar';
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import { useIntl, FormattedMessage } from 'react-intl';
import { useNavigation } from '@react-navigation/native';
import completedImage from '../assets/completionBadge.png';

const FindHunts = () => {
    const navigation = useNavigation();

    // Auth Token
    const authTokenValue = useSelector((state) => state.authSlice.authToken);
    const intl = useIntl();

    // Scnaackbar State
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    const [hunts, setHunts] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        getHunts();
    }, []);

    const getHunts = async () => {
        let data;
        if (searchFilter === '') {
            data = {
                token: authTokenValue,
            };
        }

        if (searchFilter !== '') {
            data = {
                token: authTokenValue,
                filter: searchFilter,
            };
        }

        const response = await apiCall({
            endpointSuffix: 'findHunts.php',
            data,
        });

        if (response.success) {
            setSnackbarIconName('check-circle-outline');
            setSnackbarMessage('Hunts Found');
            setSnackbarVisible(true);
            setHunts(response.data.hunts);
        }

        if (!response.success) {
            setSnackbarIconName('error-outline');
            setSnackbarMessage(response.message);
            setSnackbarVisible(true);
        }
    };

    const getCompletionStatus = (completedValue) => {
        if (completedValue === null) return 'Not Started';
        if (completedValue === 100) return 'Completed';
        return `${completedValue}%`;
    };

    const filterHunts = () => {
        getHunts();
    };

    const clearFilter = () => {
        setSearchFilter('');
        getHunts();
    };

    return (
        <>
            <ScrollView
                style={{
                    backgroundColor: themeColors.backgroundcolors,
                    flex: 1,
                }}>
                <Card
                    style={{
                        marginBottom: 10,
                        backgroundColor:
                            themeColors.locationCardBackgroundColor,
                    }}>
                    <Searchbar
                        style={{ margin: 10 }}
                        placeholder='Filter'
                        onChangeText={(text) => setSearchFilter(text)}
                    />
                    <View
                        style={{
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}>
                        <Button
                            mode={themeColors.buttonMode}
                            onPress={filterHunts}
                            style={styles.loginButton}
                            buttonColor={themeColors.buttonColor}>
                            {intl.formatMessage({
                                id: 'findHunts.filter',
                                defaultMessage: 'Filter Hunts',
                            })}
                        </Button>
                        <Button
                            mode={themeColors.buttonMode}
                            onPress={clearFilter}
                            style={styles.loginButton}
                            buttonColor={themeColors.buttonColor}>
                            {intl.formatMessage({
                                id: 'findHunts.clearFilter',
                                defaultMessage: 'Clear Filter',
                            })}
                        </Button>
                    </View>
                </Card>
                <View
                    style={{
                        backgroundColor: themeColors.listBackgroundColor,
                        flex: 1,
                    }}>
                    {Array.isArray(hunts) &&
                        hunts.map((hunt, index) => (
                            <List.Item
                                key={index}
                                title={hunt.name}
                                titleStyle={{ color: 'white', fontSize: 20 }}
                                style={{
                                    backgroundColor:
                                        themeColors.listBackgroundColor,
                                }}
                                left={(props) =>
                                    hunt.completed === 100 ? (
                                        <Image
                                            source={completedImage}
                                            style={{ width: 20, height: 20 }}
                                        />
                                    ) : (
                                        <Icon
                                            {...props}
                                            name='circle'
                                            color={
                                                hunt.completed !== null
                                                    ? 'yellow'
                                                    : 'red'
                                            }
                                            size={20}
                                        />
                                    )
                                }
                                right={(props) => (
                                    <Text
                                        style={{
                                            color: 'white',
                                            ...props.style,
                                        }}>
                                        {getCompletionStatus(hunt.completed)}
                                    </Text>
                                )}
                                onPress={() =>
                                    navigation.navigate(
                                        'PlayerHuntDetail',
                                        hunt
                                    )
                                }
                            />
                        ))}
                </View>
            </ScrollView>
            <CustomSnackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                message={snackbarMessage}
                iconName={snackbarIconName}
                duration={Snackbar.DURATION_SHORT}
            />
        </>
    );
};

export default FindHunts;
