import React, { ReactNode, useContext, useState } from 'react';
import { ToastProps } from '../Toast/toast.component';




interface ContextProps {
    showToast: (props: ToastProps) => void,
    hideToast: () => void,
    toastProps: ToastProps|undefined
}

const RootContext = React.createContext<ContextProps|null>(null);


const Root: React.FC<{children: ReactNode}> = ({children}) => {
    const [toastProps, setToastProps] = useState<ToastProps|undefined>(undefined)


    const showToast = (props: ToastProps) => {
        setToastProps(props)
    }

    const hideToast = () => {
        setToastProps(undefined)
    }

    return (
        <RootContext.Provider
        value={{
            showToast,
            hideToast,
            toastProps
        }}
        >
            {children}
        </RootContext.Provider>
    )
}


export const useRoot = () => {
    const root = useContext(RootContext)
    if (!root) {
        throw new Error('useRoot hook used outside Root')
    }
    return root;
}

export default Root;