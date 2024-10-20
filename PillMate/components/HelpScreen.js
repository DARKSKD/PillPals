import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HelpScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submit Your Information</Text>
            <Button title="Submit" onPress={() => console.log("Information submitted")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
});

export default HelpScreen;