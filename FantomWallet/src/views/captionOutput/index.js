import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from "react-native";
import styles from "./style";
import Button from "../../components/general/Button";
// import "../../../global";
import Bip39 from "react-native-bip39";
// import ProgressBar from "../../../general/progressBar/index";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import dangerIcon from "../../images/warning.png";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

import { SafeAreaView } from "react-navigation";
import { Colors } from "../../theme";

/**
 * CaptionOutput: This component is meant for generating secret codes for captcha verification.
 */
class CaptionOutput extends Component {
  constructor(props) {
    super(props);
    this.state = { mnemonicWords: [], loading: true };
  }

  componentDidMount() {
    const menmonicPromise = Bip39.generateMnemonic();
    menmonicPromise.then(mnemonic => {
      const seed = Bip39.mnemonicToSeed(mnemonic); //creates seed buffer
      const mnemonicWords = mnemonic.split(" ");
      this.setState({
        mnemonicWords,
        seed: seed,
        loading: false
      });
    });
  }

  onLeftIconPress() {
    this.props.navigation.goBack();
  }
  async copyToClipboard() {
    const string = this.state.mnemonicWords.join(",");
    await Clipboard.setString(string);
    // const clipboardContent = await Clipboard.getString();
  }
  onConfirmHandler() {
    this.props.navigation.navigate("CaptchaVerification", {
      mnemonicWords: this.state.mnemonicWords,
      seed: this.state.seed
    });
  }
  render() {
    // return (
    //     <View style={style.mainContainer}>
    //         <View style={style.progressContainer}>
    //             <ProgressBar completed='2' remaining='3' />
    //         </View>
    //         <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={style.arrowContainer}>
    //             <Icon name='arrow-back' size={24} color='black' />
    //         </TouchableOpacity>
    //         <View style={{ height: deviceHeight * 0.75 }}>
    //             <ScrollView
    //                 style={style.mid}
    //                 scrollEnabled={true}
    //             >
    //                 <View style={style.warningContainer}>
    //                     <Image source={dangerIcon} style={{ width: 20, height: 20 }} />
    //                     <Text style={style.secretText}> Secret Mnemonic:</Text>
    //                 </View>
    //                 {
    //                     !this.state.loading ? (
    //                         <View style={style.textContainer}>
    //                             {
    //                                 this.state.mnemonicWords.map((val, i) => {
    //                                     return (
    //                                         <View key={i} style={style.wordWrap}>
    //                                             <Text style={style.text} >{val}</Text>
    //                                         </View>
    //                                     );
    //                                 })
    //                             }
    //                         </View>
    //                     )
    //                         :
    //                         <View style={{
    //                             height: deviceHeight * 0.25, flexDirection: 'row', alignSelf: 'center',
    //                         }}>
    //                             <ActivityIndicator size="small" color="#000" />
    //                         </View>
    //                 }
    //                 <View style={style.messageContainer}>
    //                     <Text style={{ fontSize: deviceWidth * 0.035, fontFamily: 'SegoeUI-SemiBold' }}>Please write down this new Secret Mnemonic.</Text>
    //                     <Text style={{ fontSize: deviceWidth * 0.035, fontFamily: 'SegoeUI-SemiBold' }}>All previous mnemonic will become invalid.</Text>
    //                 </View>
    //                 <TouchableOpacity style={style.clipBoardContainer} onPress={() => this.copyToClipboard()}>
    //                     <Text style={style.clipBoardText}> Copy to clipboard</Text>
    //                 </TouchableOpacity>
    //                 <View style={style.line}>
    //                 </View>
    //                 <View style={style.lastMessageContainer}>
    //                     <Image source={dangerIcon} style={{ width: 20, height: 16 }} />
    //                     <View>
    //                         <Text style={{ fontSize: 12, fontFamily: 'Futura' }}> You will lose your account if</Text>
    //                         <Text style={{ fontSize: 12, fontFamily: 'Futura' }}> you lose your Secret PIN Mnemonic.</Text>
    //                     </View>

    //                 </View>
    //             </ScrollView>
    //         </View>
    //         <View style={style.footerStyle}>
    //             <Button
    //                 text='Confirm'
    //                 onPress={!this.state.loading && this.onConfirmHandler.bind(this)}
    //                 buttonStyle={{ backgroundColor: this.state.loading ? '#f2f2f2' : 'black', fontFamily: 'SegoeUI' }}
    //             />
    //         </View>
    //     </View>
    // );
    return (
      <View style={styles.mainContainerStyle}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* <StatusBar barStyle="light-content" /> */}
          <View style={styles.flex1}>
            <View style={styles.mainHeadingContainer}>
              <Text style={styles.mainHeading}>Your recovery words</Text>
            </View>
            <View style={styles.subHeadingContainer}>
              <Text style={styles.subHeading}>
                Write down these words in the right order and store them
                somewhere safe.
              </Text>
            </View>
          </View>
          <View style={styles.flex1}>
            {!this.state.loading ? (
              <View style={styles.textContainer}>
                {this.state.mnemonicWords.map((val, i) => {
                  return (
                    <View key={i} style={styles.wordWrap}>
                      <Text style={styles.indexStyle}>{i + 1}</Text>
                      <Text style={styles.wordText}>{val}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  height: deviceHeight * 0.25,
                  flexDirection: "row",
                  alignSelf: "center"
                }}
              >
                <ActivityIndicator size="small" color="#000" />
              </View>
            )}
          </View>
          <View style={styles.flex1}>
            <Button
              onPress={() =>
                this.props.navigation.navigate("VerifyRecoveryWords", {
                  mnemonicWords: this.state.mnemonicWords,
                  seed: this.state.seed
                })
              }
              buttonStyle={styles.buttonStyle}
              textStyle={styles.buttonText}
              text={"CONTINUE"}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
export default CaptionOutput;