import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import styles from "../styles";
import CardImage from "../../../../images/fantomWhiteIcon.png";
import { NavigationService, routes } from "~/navigation/helpers";

import { balanceToDollar } from "~/utils/converts.js";

const StickyHeader = ({ data, setCurrentWallet }) => {
  const { name, balance } = data;
  const handleCardClick = () => {
    setCurrentWallet(data);
    NavigationService.navigate(routes.HomeScreen.Wallet);
  };
  return (
    <TouchableOpacity
      onPress={() => handleCardClick()}
      style={styles.stickyHeaderStyle}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={styles.cardHeaderText}>{name || ""}</Text>
        <Text style={styles.bottomCardText}>{`${balance} FTM`}</Text>
      </View>
      <View style={styles.cardBottomTextContainer}>
        <Text style={styles.bottomCardSubText}>{`$${balanceToDollar(
          balance,
          10
        )}`}</Text>
      </View>
      <ImageBackground
        style={styles.stickyHeaderImageStyle}
        source={CardImage}
      />
    </TouchableOpacity>
  );
};
export default StickyHeader;
