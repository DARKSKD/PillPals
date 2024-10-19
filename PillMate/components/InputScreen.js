import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertMedication, checkMedicationExists } from './database/SQLite'; // Adjust the import path as needed

const InputScreen = ({ navigation }) => {
    const [medicationName, setMedicationName] = useState('');
    const [usedFor, setUsedFor] = useState('');
    const [frequency, setFrequency] = useState('');
    const [time, setTime] = useState([]);
    const [showPicker, setShowPicker] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [pickerIndex, setPickerIndex] = useState(-1); 

    const fetchUsedFor = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:5000/used-for?medication=${medicationName}`);
            const data = await response.json();
            setUsedFor(data.usedFor);
        } catch (error) {
            console.error('Error fetching used for:', error);
        }
    };

    const handleFrequencyChange = (value) => {
        const freqNumber = parseInt(value);
        if (!isNaN(freqNumber) && freqNumber > 0) {
            setTime(new Array(freqNumber).fill('')); 
            setFrequency(value);
        } else {
            setTime([]); 
            setFrequency('');
        }
    };

    const showTimePicker = (index) => {
        setPickerIndex(index);
        setShowPicker(true);
    };

    const handleTimeChange = (event, date) => {
        if (date) {
            const newTime = [...time];
            newTime[pickerIndex] = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTime(newTime); 
        }
        setShowPicker(false); 
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!medicationName || !frequency || time.some(t => !t)) {
            Alert.alert('Error', 'Please fill out all fields and set all times.');
            return;
        }

        // Check if medication already exists in the database (check with the first time entry)
        const medicationExists = await new Promise((resolve) => {
            checkMedicationExists(medicationName, time[0], resolve);
        });

        if (medicationExists) {
            Alert.alert('Medication already exists', 'This medication for the specified time already exists.');
            return;
        }

        const newMedication = {
            name: medicationName,
            usedFor,
            frequency,
            time,
        };

        // Insert the new medication into the database
        await insertMedication(newMedication.name, newMedication.frequency, newMedication.time, newMedication.usedFor);
        
        // Navigate to Home
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('./img/Pill_Mate.png')} style={styles.image} />
                <Text style={styles.headerText}>Pill Mate</Text>
            </View>

            <Text style={styles.title}>Add Medication</Text>

            <TextInput
                placeholder="Medication Name"
                value={medicationName}
                onChangeText={setMedicationName}
                onBlur={fetchUsedFor}
                style={styles.input}
            />
            <Text style={styles.usedForText}>Used For: {usedFor}</Text>

            <TextInput
                placeholder="Frequency (e.g., 3 times per day)"
                value={frequency}
                onChangeText={handleFrequencyChange}
                style={styles.input}
                keyboardType="numeric"
            />

            {time.map((timeValue, index) => (
                <View key={index} style={styles.timePickerContainer}>
                    <Button title={`Time ${index + 1} (${timeValue || 'Select Time'})`} onPress={() => showTimePicker(index)} />
                </View>
            ))}

            {showPicker && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <Button title="Add Medication" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    usedForText: {
        marginVertical: 5,
        fontStyle: 'italic',
    },
    timePickerContainer: {
        marginVertical: 5,
    },
});

export default InputScreen;
