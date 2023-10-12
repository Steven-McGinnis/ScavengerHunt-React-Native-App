import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../Styles/styles';
import { themeColors } from '../Styles/constants';
import HuntDetailCard from '../Components/PlayerHuntDetail/huntDetailCard';
import HuntNotStarted from '../Components/PlayerHuntDetail/huntNotStarted';

const PlayerHuntDetail = (route) => {
    const { completed, huntid, name } = route.route.params;
    console.log(completed);

    return (
        <View style={styles.container2}>
            <HuntDetailCard
                title={name}
                huntid={huntid}
                completed={completed}
            />
            {completed === null && (
                <HuntNotStarted onPress={() => console.log('pressed')} />
            )}
        </View>
    );
};

export default PlayerHuntDetail;
