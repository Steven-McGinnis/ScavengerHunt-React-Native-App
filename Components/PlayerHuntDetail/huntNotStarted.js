import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { styles } from '../../Styles/styles';
import { themeColors } from '../../Styles/constants';

const HuntNotStarted = ({ onPress }) => {
    return (
        <View>
            <Card
                style={{
                    backgroundColor: themeColors.locationCardBackgroundColor,
                    marginBottom: 10,
                }}>
                <Card.Title
                    titleStyle={{ color: '#FFF', fontSize: 20 }}
                    title={'Press to Start Hunt'}
                />
                <Card.Content
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={onPress}>
                        <Image
                            source={require('../../assets/checkIn.png')}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10,
                            }}
                        />
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </View>
    );
};

export default HuntNotStarted;
