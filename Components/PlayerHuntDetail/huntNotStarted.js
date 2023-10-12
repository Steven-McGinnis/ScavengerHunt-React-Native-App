import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';

const HuntNotStarted = ({ onPress }) => {
    return (
        <View>
            <Card style={{ backgroundColor: '#fed47d', margin: 10 }}>
                <Card.Title
                    titleStyle={{ color: '#000', fontSize: 20 }}
                    title={'Press to Start Hunt'}
                />
                <Card.Content
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={onPress}>
                        <Image
                            source={require('../../assets/startHunt.png')}
                            style={{ width: 200, height: 200 }}
                        />
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </View>
    );
};

export default HuntNotStarted;
