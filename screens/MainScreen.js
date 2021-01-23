import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';


export default class MainScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            imageUrl: "#"
        }
    };

    choosePicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!cancelled) {
            this.uploadImageToFirebase(uri, this.state.userID);
        }
    };

    uploadImageToFirebase = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase.storage().ref().child("user_images/" + imageName);

        return ref.put(blob).then((response) => {
            this.getImage(imageName);
        });
    };

    getImage = (imageName) => {
        var storageRef = firebase.storage().ref().child("user_images/" + imageName);

        storageRef.getDownloadURL()
            .then((url) => {
                this.setState({ imageUrl: url });
            })
            .catch((error) => {
                this.setState({ imageUrl: "#" });
            })
    };

    // getImageDetails() {
    //     const got = require('got');

    //     const apiKey = 'acc_3caff537a9bb7b0';
    //     const apiSecret = '4951fdbb312c7c8c4758736e04a6d269';

    //     const imageUrl = 'https://docs.imagga.com/static/images/docs/sample/japan-605234_1280.jpg';
    //     const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

    //     (async () => {
    //         try {
    //             const response = await got(url, { username: apiKey, password: apiSecret });
    //             console.log(response.body);
    //         } catch (error) {
    //             console.log(error.response.body);
    //         }
    //     })();
    // };

    componentDidMount() {
        this.getImage(this.state.userID);
    }

    render() {
        return (
                <View style={styles.container}>
                    <Text>Main Screen</Text>
                </View>
        )
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    text: {
        color: '#000',
        fontSize: 25,
        fontWeight: "bold",
        alignSelf: "center",
        justifyContent: "center"
    }
})