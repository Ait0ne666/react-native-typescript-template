import React from 'react';
import { ThemeProvider } from 'styled-components';
import {useSelector} from 'react-redux';

import Navigation from './src/navigation/navigation';
import {themes} from './src/theme/theme';
import {settingsSelectors} from './src/redux/settings/settings.selectors';
import LanguageProvider from './src/components/LanguageProvider/language.provider';
import Root from './src/lib/Root/root.provider';
import Toast from './src/lib/Toast/toast.component';

const Layout: React.FC = () => {
    const theme = useSelector(settingsSelectors.theme)


    return (
        <Root>
            <ThemeProvider
            theme={themes[theme]}
            >
                <LanguageProvider>
                    <Navigation/>
                    <Toast/>
                </LanguageProvider>
            </ThemeProvider>
        </Root>
    )
} 


export default Layout;