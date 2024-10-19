import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const FrontScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }, 2000);

        return () => clearTimeout(timer); 
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('./img/Pill_Mate.png')} style={styles.image} />
            <Text style={styles.title}>Pill Mate</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default FrontScreen;
