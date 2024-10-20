import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { initializeDatabase, fetchMedications } from './database/SQLite';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import Chatbot from './Chatbot';

const HomeScreen = ({ navigation, route }) => {
    const { newMedication } = route.params || {};
    const [medications, setMedications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Function to refresh the medication list
    const refreshData = () => {
        fetchMedications(setMedications); // Fetch medications and set state
    };

    useEffect(() => {
        initializeDatabase(); // Initialize the database on component mount
        refreshData(); // Initial load
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            refreshData(); // Refresh data when the screen is focused
        }, [])
    );

    const handleItemPress = (item) => {
        navigation.navigate('UpdateScreen', {
            medication: item,
            refreshMedications: refreshData, // Pass refresh function for updating
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemContainer}>
                <View>
                    <Image source={require('./img/medicine_wb.jpg')} style={styles.med} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemDescription}>Frequency: {item.frequency}</Text>
                    <Text style={styles.itemDescription}>Time: {Array.isArray(item.time) ? item.time.join(', ') : item.time}</Text>
                    <Text style={styles.itemDescription}>Used For: {item.usedFor}</Text>
                    <View style={styles.flexbox}>
                        <Image source={require('./img/add.png')} style={styles.add} />
                        <Text style={styles.itemDescription}>Today</Text>
                        <Image source={require('./img/play.png')} style={styles.play} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('./img/Pill_Mate.png')} style={styles.image} />
                <Text style={styles.headerText}>Pill Mate</Text>
                <Image source={require('./img/user.png')} />
                <Image source={require('./img/notification.png')} />
                <Image source={require('./img/settings.png')} />
            </View>
            <View style={styles.top}>
                <Text style={styles.headerText}>Schedule</Text>
                <Image source={require('./img/arrow.png')} style={styles.sch_arrow} />
            </View>
            <FlatList
                data={medications}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={require('./img/Home.png')} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Input')}>
                    <Image source={require('./img/stars.png')} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Help')}>
                    <Image source={require('./img/Help_circle.png')} style={styles.footerIcon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.chatbotContainer} 
                onPress={() => setModalVisible(true)} // Open chatbot
            >
                <Image source={require('./img/chatbot.png')} style={styles.chatbotIcon} />
            </TouchableOpacity>

            <Chatbot modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 80,
    },
    itemContainer: {
        margin: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    itemDescription: {
        fontSize: 14,
        color: 'black',
    },
    flexbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        backgroundColor: 'white',
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 130,
    },
    image: {
        height: 50,
        width: 50,
    },
    med: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 80,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
    },
    footerIcon: {
        width: 30,
        height: 30,
    },
    chatbotContainer: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        backgroundColor: '#007aff',
        borderRadius: 30,
        padding: 10,
    },
    chatbotIcon: {
        width: 50,
        height: 50,
    },
});
