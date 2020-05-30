import {useEffect, useCallback, useState} from 'react';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};


export default (dispatch) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        firebase.initializeApp(firebaseConfig);
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const ref = firebase.database().ref(`/${user.uid}`);
                const snapshot = await ref.once('value');
                const state = snapshot.val();
                if (state)
                    dispatch({type: 'LOGGED_IN', payload: state});
            }
            setUser(user);
        });
    }, [dispatch]);

    const signIn = useCallback((email, password) => firebase.auth().signInWithEmailAndPassword(email, password), []);
    const signOut = useCallback(() => firebase.auth().signOut().catch(console.error), []);

    const persistData = useCallback((data) => {
        firebase.database().ref(`/${user.uid}`).update(data)
            .catch(console.error);
    }, [user]);

    return {user, persistData, signIn, signOut};
}
