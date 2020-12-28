import React from 'react';
import {storiesOf} from '@storybook/react-native';


import Modal from './modal.component';


storiesOf('Modal', module).add('ModalRed', () => <Modal color='red'/>);
storiesOf('Modal', module).add('ModalBlue', () => <Modal color='blue'/>);