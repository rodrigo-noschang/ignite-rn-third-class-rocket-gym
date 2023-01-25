import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import BgImage from '@assets/background.png';
import LogoSVG from '@assets/logo.svg';
import Input from '@components/Input';
import Button from '@components/Button';

type FormDataProps = {
    name: string, 
    email: string,
    password: string,
    confirmPassword: string
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email').email('Email inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
    confirmPassword: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), null], 'As senhas não são iguais')
})

const SignUp = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const navigate = useNavigation();

    const handleGoBack = () => {
        navigate.goBack();
    }

    const handleSignUp = (data: any) => {
        console.log(data);
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
                        Crie sua Conta
                    </Heading>

                    <Controller 
                        control = {control}
                        name = 'name'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                placeholder = 'Nome'
                                onChangeText = {onChange}
                                value = {value}
                                errorMessage = {errors.name?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'email'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                placeholder = 'Email'
                                onChangeText = {onChange}
                                keyboardType = 'email-address'    
                                autoCapitalize = 'none'
                                value = {value}
                                errorMessage = {errors.email?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'password'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                placeholder = 'Senha'
                                onChangeText = {onChange}
                                secureTextEntry
                                value = {value}
                                errorMessage = {errors.password?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'confirmPassword'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                placeholder = 'Confirme sua senha'
                                onChangeText = {onChange}
                                secureTextEntry
                                onSubmitEditing = {handleSubmit(handleSignUp)}
                                returnKeyType = 'send'
                                value = {value}
                                errorMessage = {errors.confirmPassword?.message}
                            />
                        )}
                    />

                    <Button 
                        title = 'Criar e acessar'
                        onPress = {handleSubmit(handleSignUp)}
                    />
                </Center>

                <Center mt = {18}>

                    <Button 
                        title = 'Voltar para o login' 
                        variant = 'outline'
                        onPress = {handleGoBack}    
                    />
                </Center>

            </VStack>
        </ScrollView>
    )
}

export default SignUp;