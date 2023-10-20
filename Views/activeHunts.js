import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageProgressEventDataIOS,
    Image,
} from 'react-native';

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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useNavigation } from '@react-navigation/native';
import completedImage from '../assets/completionBadge.png';
import { useFocusEffect } from '@react-navigation/native';

// Version 1.0.0
const ActiveHunts = () => {
    // Auth Token
    const authTokenValue = useSelector((state) => state.authSlice.authToken);
    const intl = useIntl();

    const navigation = useNavigation();

    // Scnaackbar State
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarIconName, setSnackbarIconName] = useState(null);

    const [hunts, setHunts] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getActiveHunts();
        }, [])
    );

    const getActiveHunts = async () => {
        const response = await apiCall({
            endpointSuffix: 'findActiveHunts.php',
            data: { token: authTokenValue },
        });

        if (response.success) {
            response.data.hunts = response.data.hunts.filter(
                (hunt) => hunt.completed !== 100
            );
            setHunts(response.data.hunts);
        }

        if (!response.success) {
            setSnackbarIconName('error-outline');
            setSnackbarMessage(response.message);
            setSnackbarVisible(true);
        }
    };

    return (
        <>
            <ScrollView
                style={{
                    backgroundColor: themeColors.backgroundcolors,
                    flex: 1,
                }}>
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
                                left={(props) => (
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 8,
                                        }}>
                                        {/* Added marginLeft */}
                                        {hunt.completed === 100 ? (
                                            <Image
                                                source={completedImage}
                                                style={{
                                                    paddingLeft: 20,
                                                    marginLeft: 8,
                                                    width: 40,
                                                    height: 40,
                                                }}
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
                                        )}
                                    </View>
                                )}
                                right={(props) => (
                                    <Text
                                        style={{
                                            color: 'white',
                                            ...props.style,
                                        }}></Text>
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

export default ActiveHunts;
