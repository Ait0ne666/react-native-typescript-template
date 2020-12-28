import React from 'react';
import {View, Text} from 'react-native';

interface ModalProps {
    color: string
}

const Modal: React.FC<ModalProps> = ({color}) => {
    return (
        <View
        style={{backgroundColor: color}}
        >
            <Text style={{fontSize: 25}}>
                Storybook Modal!!!
            </Text>
        </View>
    )
}


export default Modal;