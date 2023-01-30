import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';
import { useToast } from 'native-base';

import { AppError } from '@utils/AppError';

import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import BgImage from '@assets/background.png';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/Button';
import LogoSVG from '@assets/logo.svg';
import Input from '@components/Input';


const singInSchema = yup.object({
    email: yup.string().required('Informe o email').email('Email inválido'),
    password: yup.string().required('Informe a senha')
})

type signInFormProps = {
    email: string,
    password: string
}

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<signInFormProps>({
        resolver: yupResolver(singInSchema)
    })

    const { signIn } = useAuth();
    const toast = useToast();

    const navigate = useNavigation<AuthNavigationRoutesProps>()

    const handleSignIn = async ({email, password}: signInFormProps) => {
        try {
            setIsLoading(true);
            await signIn(email, password);
            
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
            toast.show({
                title,
                placement: 'top', 
                bgColor: 'red.500'
            })

            setIsLoading(false);
        }
    }

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

                    <Controller 
                        control = {control}
                        name = 'email'
                        render = {({ field: { onChange, value } }) => (
                            <Input 
                                placeholder = 'Email'
                                onChangeText = {onChange}
                                value = {value}
                                keyboardType = 'email-address'    
                                autoCapitalize = 'none'
                                errorMessage = {errors.email?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'password'
                        render = {({ field: { onChange, value } }) => (
                            <Input 
                                placeholder = 'Senha'
                                onChangeText = {onChange}
                                value = {value}
                                secureTextEntry
                                errorMessage = {errors.password?.message}
                                onSubmitEditing = {handleSubmit(handleSignIn)}
                                returnKeyType = 'send'
                            />
                        )}
                    />

                    <Button 
                        title = 'Acessar'
                        onPress = {handleSubmit(handleSignIn)}
                        isLoading = {isLoading}
                    />
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