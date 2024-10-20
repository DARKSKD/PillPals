import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateMedication, deleteMedication } from './database/SQLite';

const UpdateScreen = ({ route, navigation }) => {
    const { medication, refreshMedications } = route.params;
    const [name, setName] = useState(medication.name);
    const [frequency, setFrequency] = useState(medication.frequency);
    const [usedFor, setUsedFor] = useState(medication.usedFor);

    // Function to safely parse the time
    const parseTime = (timeString) => {
        try {
            return timeString.split(',').map(v => v.trim()); // Convert comma-separated string back to array
        } catch (error) {
            console.error('Error parsing time:', error);
            return []; // Return an empty array on error
        }
    };

    const [time, setTime] = useState(parseTime(medication.time)); // Initialize time

    const handleUpdate = () => {
        // Ensure time is stored as a string array for the database
        updateMedication(medication.id, name, frequency, time, usedFor, () => {
            console.log('Medication updated');
            refreshMedications(); // Call refresh
        })
        navigation.goBack();
    };

    const handleDelete = () => {
        deleteMedication(medication.id, () => {
            console.log('Medication deleted');
            refreshMedications(); // Call refresh
        });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                value={frequency}
                onChangeText={setFrequency}
                placeholder="Frequency"
            />
            <TextInput
                style={styles.input}
                value={time.join(', ')} // Join time array for display
                onChangeText={(value) => setTime(value.split(',').map(v => v.trim()))} // Split and trim input back to array
                placeholder="Time (e.g. 8:00 AM, 12:00 PM)"
            />
            <TextInput
                style={styles.input}
                value={usedFor}
                onChangeText={setUsedFor}
                placeholder="Used For"
            />
            <Button title="Update" onPress={handleUpdate} />
            <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
});

export default UpdateScreen;
