import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { toFixed } from '~/utils/converts';
import style from './style';
/**
 * BalanceView: This component is meant for rendering balance of wallet on wallet screen.
 */
class BalanceView extends PureComponent {
  render() {
    const { balance } = this.props;
    const ftmBalance = toFixed(balance, 4);

    return (
      <View style={style.fantomBalanceView}>
        <View style={style.balanceContainer}>
          <Text style={style.amountHeadingStyle}>Amount</Text>
        </View>
        <View style={style.balanceViewText}>
          <Text numberOfLines={1} style={style.balanceUnitTextStyle}>
            {ftmBalance} FTM
          </Text>
        </View>
      </View>
    );
  }
}

export default BalanceView;
