import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo'

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    const firebaseConfig = {
      apiKey: "AIzaSyCKFzpc4na3dmJm0wBgM8M7JM9R_UWiJWY",
      authDomain: "chat-app-fa40f.firebaseapp.com",
      projectId: "chat-app-fa40f",
      storageBucket: "chat-app-fa40f.appspot.com",
      messagingSenderId: "498659047419",
      appId: "1:498659047419:web:310e5f7ef230ae6908fd5e",
      measurementId: "G-930JN8JRG8"
    };
    
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessagesUser = null;
    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      message: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
    }
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name});

    NetInfo.fetch().then(connection => {
      if(connection.isConnected) {
        this.setState({
            isConnected: true
          });
        console.log('online');

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if(!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user._uid,
              name: user.name
            }
          });
        });
      } else {
        this.getMessages();
        console.log('offline');
      }
    });

    this.referenceChatMessagesUser = firebase.firestore()
      .collection('messages')
      .where('uid', '==', this.state.uid);
    
    this.unsubscribeUser = this.referenceChatMessagesUser.onSnapshot(this.onCollectionUpdate)

    this.unsubscribe = this.referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.onCollectionUpdate)
  }

  addMessage = (m) => {
    const message = m[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach(doc => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      });
    });
    this.setState({
      messages,
    });
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch(error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name});

    NetInfo.fetch().then(connection => {
      if(connection.isConnected) {
        this.setState({isConnected: true})
        console.log('online');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if(!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user._uid,
              name: user.name
            }
          });
        });
      } else {
        this.getMessages();
        this.setState({
          isConnected: false
        })
        console.log('offline');
      }
    });

    this.referenceChatMessagesUser = firebase.firestore()
      .collection('messages')
      .where('uid', '==', this.state.uid);
    
    this.unsubscribeUser = this.referenceChatMessagesUser.onSnapshot(this.onCollectionUpdate)

    this.unsubscribe = this.referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.onCollectionUpdate)
  }

  renderInputToolBar(props) {
    if(this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar {...props} />
      )
    }
  }

  renderBubble(props) {
    return(
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeUser();
    this.authUnsubscribe();
  }

  render() {
    let { backgroundColor } = this.props.route.params
    return (
      <View style={{flex: 1, backgroundColor: backgroundColor}}>
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
        <GiftedChat 
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar}
          onSend={(messages) => {
            this.onSend(messages)
            this.addMessage(messages)
          }}
          user ={{_id: this.state.uid}}
        />
        {console.log(this.state.isConnected)}
      </View>
    );
  }
}