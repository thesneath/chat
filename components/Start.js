import React from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backgroundColor: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/background.png')} resizeMode='cover' style={styles.image}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Chat App</Text>
          </View>
          
          <View style={styles.startContainer} >
            <TextInput
              value={this.state.name}
              onChangeText={(name) => this.setState({name})} 
              style={styles.startInput}
              placeholder='Your Name'/>
            <View>
              <Text style={styles.colorChoiceText}>Choose Background Color:</Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <TouchableOpacity 
                  style={[styles.colorChoice, styles.black]} 
                  onPress={() => this.setState({ backgroundColor: '#090C08'})} 
                />
                <TouchableOpacity 
                  style={[styles.colorChoice, styles.purple]} 
                  onPress={() => this.setState({ backgroundColor: '#474056' })} 
                />
                <TouchableOpacity 
                  style={[styles.colorChoice, styles.blue]} 
                  onPress={() => this.setState({ backgroundColor: '#8A95A5'})}
                />
                <TouchableOpacity 
                  style={[styles.colorChoice, styles.green]}
                  onPress={() => this.setState({ backgroundColor: '#B9C6AE' })} 
                />
              </View>
            </View>
            <Pressable 
              style={styles.startButton}
              onPress={() => this.props.navigation.navigate('Chat', { 
                name: this.state.name, 
                backgroundColor: this.state.backgroundColor
              })}  
            >
              <Text style={styles.startButtonText}>Start Chat</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    flex: .8,
  },

  titleText: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '600',
  },

  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  startContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    width: '88%',
    height: '44%',
    paddingLeft: '6%',
    paddingRight: '6%',
  },

  startInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    height: 70
  },

  colorChoice: {
    marginTop: 10,
    marginRight: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
  },

  colorChoiceText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },

  black: {
    backgroundColor: '#090C08'
  },

  purple: {
    backgroundColor: '#474056'
  },

  blue: {
    backgroundColor: '#8A95A5'
  },

  green: {
    backgroundColor: '#B9C6AE',
  },

  startButton: {
    backgroundColor: '#757083',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
  }
});

