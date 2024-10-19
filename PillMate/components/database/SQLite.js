import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
    name: 'medications.db',
    location: 'default',
});

export const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS medications (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frequency TEXT, time TEXT, usedFor TEXT)',
            [],
            () => console.log('Table created successfully'),
            error => console.log('Error creating table:', error)
        );
    });
};

export const fetchMedications = (setMedications) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM medications',
            [],
            (_, result) => {
                const medications = [];
                for (let i = 0; i < result.rows.length; i++) {
                    medications.push(result.rows.item(i));
                }
                setMedications(medications); // Update the state with fetched medications
            },
            error => {
                console.log('Error fetching medications: ', error);
            }
        );
    });
};

export const checkMedicationExists = (medicationName, medicationTime, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM medications WHERE name = ? AND time LIKE ?',
            [medicationName, `%${medicationTime}%`],
            (_, { rows }) => {
                callback(rows.length > 0); // Return true if exists, false otherwise
            },
            error => {
                console.log('Error checking medication existence: ', error);
                callback(false); // Error case, return false
            }
        );
    });
};

export const insertMedication = (name, frequency, time, usedFor) => {
    // Check for duplicates before inserting
    checkMedicationExists(name, time.join(','), exists => {
        if (exists) {
            console.log('Medication already exists');
            return; // Prevent duplicate insertion
        }

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO medications (name, frequency, time, usedFor) VALUES (?, ?, ?, ?)',
                [name, frequency, time.join(','), usedFor], // Convert time array to comma-separated string
                (_, result) => {
                    console.log('Medication inserted successfully: ', result);
                },
                error => {
                    console.log('Error inserting medication: ', error);
                }
            );
        });
    });
};

export const deleteMedication = (id) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM medications WHERE id = ?',
            [id],
            () => {
                console.log('Medication deleted successfully');
            },
            error => {
                console.log('Error deleting medication: ', error);
            }
        );
    });
};

export const updateMedication = (id, name, frequency, time, usedFor, callback) => {
    const query = `
        UPDATE medications
        SET name = ?, frequency = ?, time = ?, usedFor = ?
        WHERE id = ?
    `;

    db.transaction(tx => {
        tx.executeSql(
            query,
            [name, frequency, time.join(','), usedFor, id], // Convert time array to string
            (_, result) => {
                console.log('Medication updated successfully');
                if (callback) callback(result);
            },
            (_, error) => {
                console.error('Error updating medication: ', error);
            }
        );
    });
};
