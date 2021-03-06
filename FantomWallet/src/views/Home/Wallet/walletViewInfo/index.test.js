import React from 'react';
import { shallow } from 'enzyme';

// eslint-disable-next-line import/first
import { WalletFantomScreen } from './index';

test('renders correctly', () => {
  const wrapper = shallow(
    <WalletFantomScreen balance="123.123" isLoading={false} onRefresh={() => { }} />,
  );
  expect(wrapper).toMatchSnapshot();
});
