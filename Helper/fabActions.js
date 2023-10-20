// fabActions.js
import { themeColors } from '../Styles/constants';
import { useIntl } from 'react-intl';

export const useHuntDetailFabActions = ({
    publishHunt,
    unpublishHunt,
    showConfirmDialog,
    setOpenEditHunt,
    setOpenLocationAdd,
    currentActive,
}) => {
    const intl = useIntl();

    const publishAction = {
        icon: 'publish',
        label: intl.formatMessage({
            id: 'huntDetailScreen.publishHunt',
            defaultMessage: 'Publish Hunt',
        }),
        onPress: publishHunt,
        style: { backgroundColor: themeColors.buttonColor },
        color: themeColors.fabIconColor,
    };

    const unpublishAction = {
        icon: 'publish-off',
        label: intl.formatMessage({
            id: 'huntDetailScreen.unpublishHunt',
            defaultMessage: 'Unpublish Hunt',
        }),
        onPress: unpublishHunt,
        style: { backgroundColor: themeColors.buttonColor },
        color: themeColors.fabIconColor,
    };

    return [
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
            onPress: () => setOpenEditHunt((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'map-marker-plus',
            label: intl.formatMessage({
                id: 'huntDetailScreen.addLocationButton',
                defaultMessage: 'Add Location',
            }),
            onPress: () => setOpenLocationAdd((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];
};

export const useHuntActions = ({ setOpenCreateNewHunt }) => {
    const intl = useIntl();

    return [
        {
            icon: 'tag-plus',
            label: intl.formatMessage({
                id: 'huntScreen.newHunt',
                defaultMessage: 'Add Location',
            }),
            onPress: () => !setOpenCreateNewHunt((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];
};

export const useLocationDetailFabActions = ({
    showConfirmDialog,
    setOpenLocationEdit,
    setOpenConditionPanel,
    locationData,
    setOpenLocationSet,
    currentLatitude,
    currentLongitude,
    navigation,
    location,
    currentLocationName,
    huntid,
}) => {
    const intl = useIntl();

    let actions = [
        {
            icon: 'delete',
            label: intl.formatMessage({
                id: 'locationDetailScreen.deleteLocationButton',
                defaultMessage: 'Delete Location',
            }),
            onPress: showConfirmDialog,
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'pencil',
            label: intl.formatMessage({
                id: 'locationDetailScreen.editLocationButton',
                defaultMessage: 'Edit Location',
            }),
            onPress: () => !setOpenLocationEdit((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'map-marker-plus',
            label: intl.formatMessage({
                id: 'locationDetailScreen.openConditionPanel',
                defaultMessage: 'Open Condition Panel',
            }),
            onPress: () => setOpenConditionPanel((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];

    if (locationData) {
        actions.push({
            icon: 'map-marker',
            label: intl.formatMessage({
                id: 'locationDetailScreen.openLocationSet',
                defaultMessage: 'Open Location Set Panel',
            }),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
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
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
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

    return actions;
};

export const useConditionFabActions = ({ showConfirmDialog }) => {
    const intl = useIntl();

    return [
        {
            icon: 'delete',
            label: intl.formatMessage({
                id: 'conditionEditScreen.deleteConditionButton',
                defaultMessage: 'Delete Condition',
            }),
            onPress: showConfirmDialog,
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];
};

export const usePlayerHuntDetailFabActions = ({
    showConfirmDialog,
    themeColors,
    setDisplayCompass,
    showHelp,
}) => {
    return [
        {
            icon: 'cancel',
            label: 'Abandon Hunt',
            onPress: showConfirmDialog,
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'compass',
            label: 'Show Compass',
            onPress: () => setDisplayCompass((prevState) => !prevState),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
        {
            icon: 'help-circle',
            label: 'Show Help',
            onPress: () => showHelp(),
            style: { backgroundColor: themeColors.buttonColor },
            color: themeColors.fabIconColor,
        },
    ];
};
