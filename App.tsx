import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider } from 'native-base';
import OneSignal from 'react-native-onesignal';

import Loading from '@components/Loading';
import { THEME } from './src/theme';

import Routes from '@routes/index';

import { AuthContextProvder } from '@contexts/AuthContext';

OneSignal.setAppId('f96dd671-f4c3-4895-84ee-e3e3e0ff28d3');

export default function App() {
	const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});

	return (
		<NativeBaseProvider theme = {THEME}>
			<StatusBar barStyle = {'light-content'} backgroundColor = {'transparent'} translucent/>
			
			<AuthContextProvder>
				{ fontsLoaded ? <Routes /> : <Loading /> }
			</AuthContextProvder>
			
		</NativeBaseProvider>
	);
}
