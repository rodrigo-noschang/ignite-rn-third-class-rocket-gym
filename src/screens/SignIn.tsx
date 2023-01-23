import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigationRoutesProps } from '@routes/auth.routes'

import BgImage from '@assets/background.png';
import LogoSVG from '@assets/logo.svg';
import Input from '@components/Input';
import Button from '@components/Button';



const SignIn = () => {
    const navigate = useNavigation<AuthNavigationRoutesProps>()

    const handleNewAccount = () => {
        navigate.navigate('signUp');
    }

    return (
        <ScrollView contentContainerStyle = {{flexGrow: 1}} showsVerticalScrollIndicator = {false}>
            <VStack flex = {1}px = {8} pb = {16}>
                <Image 
                    source = {BgImage}
                    defaultSource = {BgImage}
                    alt = 'Pessoas treinando'
                    resizeMode = 'contain'
                    position = 'absolute'
                />

                <Center my = {24}>
                    <LogoSVG />
                    <Text color = 'gray.100' fontSize = 'sm'>
                        Treine sua mente e seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color = 'gray.100' fontSize = 'xl' mb = {6} fontFamily = 'heading'>
                        Acesse sua conta
                    </Heading>

                    <Input 
                        placeholder = 'Email'
                        keyboardType = 'email-address'    
                        autoCapitalize = 'none'
                    />
                    <Input 
                        placeholder = 'Senha'
                        secureTextEntry
                    />

                    <Button title = 'Acessar'/>
                </Center>

                <Center mt = {24}>
                    <Text color = 'gray.100' fontSize = 'sm' mb = {3} fontFamily = 'body'>
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                        title = 'Criar conta' 
                        variant = 'outline'
                        onPress = {handleNewAccount}
                    />
                </Center>

            </VStack>
        </ScrollView>
    )
}

export default SignIn;