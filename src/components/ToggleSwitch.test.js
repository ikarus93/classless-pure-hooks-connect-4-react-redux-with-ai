import React from 'react';
import { shallow, mount } from 'enzyme';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch tests', () => {
    it('it should render correctly', () => {
        const component = shallow(<ToggleSwitch />);
        expect(component).toMatchSnapshot();
    });

    it('it should toggle input checked attribute on click ', () => {
        const component = mount(<ToggleSwitch />);
        component.find("div.switch").simulate("click");
        let checkbox = wrapper.find({ type: 'checkbox' });
        expect(checkbox.props().checked).to.equal(true);
    });
});