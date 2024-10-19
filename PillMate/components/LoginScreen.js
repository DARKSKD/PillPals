
import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button } from 'react-native';

const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toHome = () => {
        if (email.trim() !== '' && password.trim() !== '') {
            navigation.navigate('Home');
        } else {
            console.warn('Email and password cannot be empty');
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('./img/get_start.png')} 
                style={styles.image} 
                resizeMode="contain" 
            />
            <Text style={styles.title}>PillMate - Consistency made easy.</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                placeholderTextColor="#888"
                value = {email}
                onChangeText={setEmail}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                placeholderTextColor="#888"
                secureTextEntry
                value = {password}
                onChangeText={setPassword}
            />
            <View>
                <Button title='Sign in' style={styles.button} onPress={toHome}></Button>
            </View>
            <Text style={styles.title}>OR</Text>
            <View style={styles.socialButtons}>
                {/* Google , Apple */}
            </View>
        </View>
    );
};



export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color:'black',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 20,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});