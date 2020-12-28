import React, {useContext, ReactNode} from 'react';


interface ContextProps {
    showToast: (props: ToastProps) => void
    
}

const RootContext = React.createContext<ContextProps|null>(null);


const Root: React.FC<{children: ReactNode}> = ({children}) => {


    return (
        <RootContext.Provider
        value={{

        }}
        >
            {children}
        </RootContext.Provider>
    )
}


export const useRoot = () => {
    const language = useContext(RootContext)
    if (!language) {
        throw new Error('useRoot hook used outside of Root component')
    }
    return language;
}

export default Root;