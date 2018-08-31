import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, StatusBar } from 'react-native';
import style from './style';

//CaptchaVerification
//CaptionOutput,EditContact

/**
 * WalletSetup: This component will render UI for wallet setup screen,
 *  this component is rendered only if the user first time uses the app on Phone,
 *  through this screen user is navigated to fill captcha verification to generate key.
 */
class WalletSetup extends Component {
    onCreateNewWallet() {
        this.props.navigation.navigate('CaptionOutput');
    }
    render() {
        return (<ImageBackground
            style={style.imageBackground}
            source={require('../../images/background.png')}
            imageStyle={{ resizeMode: 'cover' }}
        >
            <StatusBar barStyle="light-content" />
            <View style={style.mainContainer}>
                <View style={style.headerContainer}>
                    <Image source={require('../../images/fantom-logo.png')} style={style.headerImage}
                        resizeMode='contain' />
                </View>
                <View style={style.subHeaderContainer}>
                    <Text style={style.subHeaderText1}>Beyond Blockchain</Text>
                    <Text style={style.subHeaderText2}>The Future of Decentralized </Text>
                    <Text style={style.subHeaderText3}>Ecosystem</Text>
                </View>
                <TouchableOpacity style={style.walletSetup} onPress={this.onCreateNewWallet.bind(this)} >
                    <Text style={style.walletSetupText}>Create Wallet</Text>
                </TouchableOpacity>
                <View style={style.footer}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Terms') }} >
                        <Text style={style.footerText1}>Terms of Service</Text>
                    </TouchableOpacity>
                    <View style={style.division} />

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PrivacyPolicy')} >
                        <Text style={style.footerText2}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground >
        );
    }
}

export default WalletSetup;