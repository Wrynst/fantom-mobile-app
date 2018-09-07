import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Platform, ScrollView, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { AsyncStorage } from "react-native"
import ProgressBar from '../../general/progressBar/index';
import Header from '../../general/header/index';
import style from './style';
import Button from '../../general/button/index';
import InputBox from '../../general/inputBox/index';
import '../../../global';
import Web3 from 'web3';
import EthereumJSWallet from 'ethereumjs-wallet';
import Hdkey from 'hdkey';
import EthUtil from 'ethereumjs-util';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as KeyAction from '../../redux/keys/action';
// Method of generation taken from: https://medium.com/bitcraft/so-you-want-to-build-an-ethereum-hd-wallet-cb2b7d7e4998;
import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
/**
 * CaptchaVerification: This component is meant for authenticating user with captcha verification,
 *  based secret codes generated in CaptionOutput.
 */
class CaptchaVerification extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      phraseFive: '',
      phraseNine: '',
      phraseTwelve: '',
      'seed': navigation.getParam('seed', 'NO-ID'),
      'mnemonicWords': navigation.getParam('mnemonicWords', 'NO-ID'),
      error: ''
    };
    this.walletSetup = this.walletSetup.bind(this);
    this.changePhrase = this.changePhrase.bind(this);
  };

  /**
   * walletSetup() : This function verifies the user and generates a unique masterPrivateKey for that user.
   *  Then navigate user to HomeScreen.
   */
  walletSetup() {
    if (!this.checkValidation()) {
      return;
    }
    const root = Hdkey.fromMasterSeed(this.state.seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1
    const pubKey = EthUtil.privateToPublic(addrNode._privateKey);
    const addr = EthUtil.publicToAddress(pubKey).toString('hex');
    const address = EthUtil.toChecksumAddress(addr);
    const key = {
      'root': root,
      'masterPrivateKey': masterPrivateKey,
      'addrNode': addrNode,
      'pubKey': pubKey,
      'addr': addr,
      'address': address
    };

    const hexPrivateKey = EthUtil.bufferToHex(addrNode._privateKey)
    // const bufferAgain = EthUtil.toBuffer(hexPrivateKey);
    // Save masterPrivateKey to device DO NOT USE IN PRODUCTION
    // this.saveMasterKey(masterPrivateKey, hexPublicKey);
    this.props.setKeys(masterPrivateKey, address, hexPrivateKey);
    // Save pubKey generation
    // this.savePublicKey(pubKey);

    this.props.navigation.navigate('HomeScreen');
    /*
       If using ethereumjs-wallet instead do after line 1:
       const address = addrNode.getWallet().getChecksumAddressString();
    */
  };

  /**
   * checkValidation() :  This function is meant to check that captcha entered by user is valid or not.
   *    If invalid then error message is displayed.
   */
  checkValidation() {
    const phraseFive = this.state.phraseFive;
    const phraseNine = this.state.phraseNine;
    const phraseTwelve = this.state.phraseTwelve;
    // check to make sure entered phrases match up.
    if (phraseFive !== this.state.mnemonicWords[4]) {
      this.state.errorMessage = 'Phrase five does not match up.';
      return false;
    } else if (phraseNine !== this.state.mnemonicWords[8]) {
      this.state.errorMessage = 'Phrase nine does not match up.';
      return false;
    } else if (phraseTwelve !== this.state.mnemonicWords[11]) {
      this.state.errorMessage = 'Phrase twelve does not match up.';
      return false;
    }
    return true;
  };


  saveMasterKey = async (masterPrivateKey, publicKey) => {
    try {
      await AsyncStorage.multiSet([['masterPrivateKey', masterPrivateKey], ['publicKey', publicKey]]);
    } catch (error) {
      if (error) {
        console.log(error);
      }
      // Error saving data
    }
  };
  savePublicKey = async (publicKey) => {
    try {
      await AsyncStorage.setItem('publicKey', publicKey);
    } catch (error) {
      if (error) {
        console.log(error);
      }
      // Error saving data
    }
  };

  /**
   * changePhrase()  : on change handler for text fields.
   * @param { String } text : Contains captcha text phrase.
   * @param {*} phrase : Contains position value of captcha phrase in generated captcha codes.
   */
  changePhrase(text, phrase) {
    const state = this.state;
    state[phrase] = text;
    this.setState(state);
  };
  getMasterKey() {
    const masterKeyTest = AsyncStorage.getItem('masterPrivateKey');
    console.log('getMasterKey');
    console.log(masterKeyTest);
  }
  onLeftIconPress = () => {
    console.log('onLeftIconPressonLeftIconPress');
    this.props.navigation.goBack()
  }
  onNavigation() {
    this.props.navigation.navigate('HomeScreen');
  }
  onTextFieldFocus() {
    let scrollValue = (Platform.OS === 'ios') ? 80 : 200
    setTimeout(() => {
      this.scrollView.scrollTo({ x: 0, y: scrollValue, animated: true })
    }, 10);
  }
  onTextFieldBlur() {
    Keyboard.dismiss();
    let scrollValue = (Platform.OS === 'ios') ? 0 : 0
    setTimeout(() => {
      this.scrollView.scrollTo({ x: 0, y: scrollValue, animated: true })
    }, 10);
  }

  render() {
    let behaviour = (Platform.OS === 'ios') ? 'padding' : null;
    return (
      <KeyboardAvoidingView behavior={behaviour} style={style.mainContainerStyle}>
        <ScrollView >
          <View style={style.mid}>

            <View style={style.progressContainer}>
              <ProgressBar completed='2' remaining='3' />
            </View>

            <View style={style.arrowContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Icon name='arrow-back' size={24} color='black' /></TouchableOpacity>
            </View>
            <View style={style.headerContainer}>
              <Text style={style.captchaText}>Captcha Verification</Text>
              <View style={style.subHeadContainer}>
                <Text style={style.pleaseText}>Please enter the corresponding</Text>
                <Text style={style.phraseText}>phrase out of the 12 back-up phrases</Text>
              </View>
            </View>

            <View style={style.textBoxContainer}>
              <View style={style.textBox}>
                <InputBox
                  phraseNumber='Enter phrase 5'
                  text={this.state.phraseFive}
                  onChangeText={(text) => this.changePhrase(text, 'phraseFive')}

                />
                {(this.state.phraseFive !== '' && this.state.phraseFive !== this.state.mnemonicWords[4]) ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ color: 'red' }}>Phrase five does not match up.</Text></View> : null}
              </View>
              <View style={style.textBox}>
                <InputBox
                  phraseNumber='Enter phrase 9'
                  text={this.state.phraseNine}
                  onChangeText={(text) => this.changePhrase(text, 'phraseNine')}

                />
                {(this.state.phraseNine !== '' && this.state.phraseNine !== this.state.mnemonicWords[8]) ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ color: 'red' }}>Phrase nine does not match up.</Text></View> : null}
              </View>
              <View style={style.textBox}>
                <InputBox
                  phraseNumber='Enter phrase 12'
                  text={this.state.phraseTwelve}
                  onChangeText={(text) => this.changePhrase(text, 'phraseTwelve')}

                />
                {(this.state.phraseTwelve !== '' && this.state.phraseTwelve !== this.state.mnemonicWords[11]) ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ color: 'red' }}>Phrase twelve does not match up.</Text></View> : null}
              </View>
            </View>

            {/* <View style={{ alignSelf: 'center' }}>
            <Text onPress={this.getMasterKey}>Get Master Key</Text>
          </View> */}



          </View>
        </ScrollView>
        <View style={style.footerStyle}>
          <Button text='Verify' onPress={this.walletSetup} buttonStyle={{ backgroundColor: 'black' }} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}



const mapStateToProps = (state) => {
  return {
  };
},
  mapDispatchToProps = (dispatch) => {
    return {
      setMasterKey: (key) => {
        dispatch({ type: KeyAction.MASTER_KEY, key });
      },
      setPublicKey: (key) => {
        dispatch({ type: KeyAction.PUBLIC_KEY, key });
      },
      setKeys: (masterKey, publicKey, privateKey) => {
        dispatch({ type: KeyAction.MASTER_PUBLIC_PRIVATE_KEY, masterKey, publicKey, privateKey });
      },
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(CaptchaVerification);
