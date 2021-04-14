import React from 'react';
import { shallow } from 'enzyme';
import MyManager from '../manager/manager';

test('should render User', () => {
    const wrapper = shallow(<MyManager/>);
    expect(wrapper).toMatchSnapshot();
});