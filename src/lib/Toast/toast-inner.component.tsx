import React, {useRef, useEffect, useState} from 'react';
import Animated, {Value,Easing, block, set, cond,timing, clockRunning, Clock, spring, event, stopClock, abs, startClock,debug, eq, defined,lessThan, call, and, or, Node } from 'react-native-reanimated';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import { ToastProps } from './toast.component';

interface Props {
    toastProps: ToastProps,
    closeToast: () => void,
    showToast: boolean
}


function runSpring(clock: Clock, value:any, velocity:any, dest:number) {
    const state = {
      finished: new Value(0),
      velocity: new Value(0),
      position: new Value(0),
      time: new Value(0)
    };
  
    const config = {
      damping: 7,
      mass: 1,
      stiffness: 121.6,
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      toValue: new Value(0)
    };
  
    return [
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.velocity, velocity),
        set(state.position, value),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      spring(clock, state, config),
      cond(state.finished, stopClock(clock)),
      state.position
    ];
  }

  function runTiming(clock:Clock, value:any, dest:any, callback?: any) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };
  
    const config = {
      duration: 100,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease),
    };
  
    return block([
      cond(
        clockRunning(clock),
        [
          // if the clock is already running we update the toValue, in case a new dest has been passed in
          set(config.toValue, dest),
        ],
        [
          // if the clock isn't running we reset all the animation params and start the clock
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, value),
          set(state.frameTime, 0),
          set(config.toValue, dest),
          startClock(clock),
        ]
      ),
      // we run the step here that is going to update position
      timing(clock, state, config),
      // if the animation is over we stop the clock
      cond(state.finished, debug('stop clock', block([stopClock(clock), call([],() => callback? callback():null)]))),
      // we made the block return the updated position
      state.position,
    ]);
  }

  let timeout: NodeJS.Timeout

const ToastInner: React.FC<Props> = ({toastProps, closeToast,  showToast}) => {
    const styled = styles(toastProps.color,  toastProps.actionButton) 
    const animatedOpacity = useRef(new Value(0)).current


    const clock = useRef(new Clock()).current
    const dragX = useRef(new Value(0)).current;
    const animState = useRef(new Value(-1)).current;
    const dragVX = useRef(new Value(0)).current;
    const transX = useRef(new Value()).current;
    const opacityClock = useRef(new Clock()).current
    const [loading, setLoading] = useState(true)
    const [close, setClose] = useState(false)

    useEffect(() => {
        if (showToast) {
            (timing as any)(animatedOpacity, {
                duration: 300,
                toValue: 1,
                easing: Easing.ease
            }).start(() => {
                setLoading(false)
            })
            timeout = setTimeout(() => {
                handleCloseToast()
            }, toastProps.duration)
        }
    }, [showToast])

    const swipeThreshold = 100


    const onGestureEvent = event([{
        nativeEvent: ({translationX, velocityX, state}:any) => 
        cond(
            lessThan(abs(dragX), swipeThreshold),
            [
                set(dragX, translationX),
                set(dragVX, velocityX),
                set(animState, state)
            ],
            [
                set(dragX, translationX),
                set(dragVX, velocityX),
                set(animState, state)
            ]
        )
    }
    ]
    )

    const translateX = cond(
        eq(animState, State.ACTIVE),
        [
            stopClock(clock),
            set(transX, dragX),
            transX
        ],
        [
            cond(
                lessThan(abs(dragX), swipeThreshold),
                [
                    set(
                        transX,
                        cond(defined(transX), runSpring(clock, transX, dragVX, 0), 0)
                    )
                ],
                [
                    set(
                        transX,
                        cond(lessThan(dragX, 0),runTiming(clock, transX, -1000),runTiming(clock, transX, 1000))
                    )
                ]
            )

        ]
    )

    const handleCloseToast = () => {
        clearTimeout(timeout)
        setClose(true);
    }

    useEffect(() => {
        if (close) {
            (timing as any)(animatedOpacity, {
                duration: 300,
                toValue: 0,
                easing: Easing.ease
            }).start(() => {
                console.log('close')
                closeToast()
            })
        }
    }, [close])
        

    const Opacity = cond(
        or(lessThan(abs(dragX), swipeThreshold),eq(animState, State.ACTIVE)),
        1,
        [
            runTiming(opacityClock, 1, 0, closeToast),
        ]
    )        

    return(
        <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onGestureEvent}
                maxPointers={1}
                >
                    <Animated.View
                    style={[styled.container, { opacity: loading||close? animatedOpacity:Opacity, transform: [{ translateX: translateX}]}]}
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
                </PanGestureHandler>
    )
}


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



export default  ToastInner;