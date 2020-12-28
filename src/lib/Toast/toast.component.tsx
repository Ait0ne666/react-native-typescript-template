import React, { Fragment, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import Animated, {Value,Easing, block, set, cond,timing, clockRunning, Clock, spring, event, stopClock, startClock, eq, defined,lessThan, call } from 'react-native-reanimated';

import { useRoot } from '../Root/root.provider';
import ToastInner from './toast-inner.component';


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
    
    
    

    useEffect(() => {
        if (toastProps) {
            setShowToast(true);

        }
    }, [toastProps])




    const closeToast = () => {
        hideToast()
        setShowToast(false)
    }



    return (
        <Fragment>
            {
                toastProps&&styled?
                <ToastInner
                closeToast={closeToast}
                showToast={showToast}
                toastProps={toastProps}
                />
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