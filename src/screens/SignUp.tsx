import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import BgImage from '@assets/background.png';
import LogoSVG from '@assets/logo.svg';
import Input from '@components/Input';
import Button from '@components/Button';

const SignIn = () => {
    return (
        <ScrollView contentContainerStyle = {{flexGrow: 1}} showsVerticalScrollIndicator = {false}>
            <VStack flex = {1} bgColor = 'gray.700' px = {8} pb = {16}>
                <Image 
                    source = {BgImage}
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
                        Crie sua Conta
                    </Heading>

                    <Input 
                        placeholder = 'Nome'
                    />
                    <Input 
                        placeholder = 'Email'
                        keyboardType = 'email-address'    
                        autoCapitalize = 'none'
                    />
                    <Input 
                        placeholder = 'Senha'
                        secureTextEntry
                    />

                    <Button title = 'Criar e acessar'/>
                </Center>

                <Center mt = {24}>

                    <Button title = 'Voltar para o login' variant = 'outline'/>
                </Center>

            </VStack>
        </ScrollView>
    )
}

export default SignIn;