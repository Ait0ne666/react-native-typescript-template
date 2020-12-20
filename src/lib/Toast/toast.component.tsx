import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';

import { useRoot } from '../Root/root.provider';


export interface ToastProps {
    duration: number,
    color: string,
    message: string,
    actionButton?: boolean,
    actionButtonText?: boolean
}
let timeout: NodeJS.Timeout

const Toast:React.FC = () => {
    const {toastProps, hideToast} = useRoot()
    const styled = toastProps? styles(toastProps?.color,  toastProps?.actionButton) : null
    const [showToast, setShowToast] = useState(false)
    const {Value, timing } = Animated
    const animatedOpacity = new Value(0)

    useEffect(() => {
        if (toastProps) {
            setShowToast(true);
            // timeout = setTimeout(() => {
            //     handleCloseToast()
            // }, toastProps.duration)
        }
    }, [toastProps])

    useEffect(() => {
        if (showToast) {
            (timing as any)(animatedOpacity, {
                duration: 300,
                toValue: 1,
                easing: Easing.ease
            }).start()
        }
    }, [showToast])

    console.log(showToast)

    const handleCloseToast = () => {
        (timing as any)(animatedOpacity, {
            duration: 300,
            toValue: 0,
            easing: Easing.ease
        }).start(() => {
            hideToast()
            clearTimeout(timeout)
            setShowToast(false)
        })
    }


    return (
        <Fragment>
            {
                toastProps&&styled?
                <Animated.View
                style={[styled.container, { opacity: animatedOpacity}]}
                >
                    <View
                    style={styled.messageContainer}
                    >
                        <Text 
                        style={styled.message}
                        >{toastProps.message}</Text>
                    </View>
                    {
                        toastProps.actionButton!==false?
                        <TouchableOpacity
                        style={styled.actionContainer}
                        onPress={handleCloseToast}
                        >
                            <Text
                            style={styled.actionText}
                            >{toastProps.actionButtonText? toastProps.actionButtonText: 'OK'}</Text>
                        </TouchableOpacity>
                        :null
                    } 
                </Animated.View>
                :null
            }
        </Fragment>
    )
}


export default Toast;




const styles = (color:string,  actionButton: boolean|undefined) => StyleSheet.create({
    container: {
        backgroundColor: color,
        position: "absolute",
        bottom: 50,
        alignSelf: "center",
        flexDirection: "row",
        width: '95%',
        maxWidth: 350,
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        zIndex: 1300
    },
    message: {
        color: '#fff',
        fontSize: 16,
    },
    messageContainer: {
        flex:actionButton!==false? 0.85: 1,
        justifyContent: 'center'
    },
    actionContainer: {
        height: '100%',
        flex:0.15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    }
})