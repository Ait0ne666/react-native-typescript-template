import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import { useRoot } from '../../lib/Root/root.provider';


const MainScreen:React.FC = () => {
    const {showToast} = useRoot()



    const handleShowToast = () => {
        showToast({
            color: '#ff8a80',
            duration: 60000,
            message: 'I am the Toast'
        })
    }

    return(
        <View>
            <TouchableOpacity
            onPress={handleShowToast}
            >
                <Text>
                    Show Toast
                </Text>
            </TouchableOpacity>
        </View>
    )
}


export default MainScreen;