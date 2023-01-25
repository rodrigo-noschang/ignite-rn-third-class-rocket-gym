import { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import UserPhoto from '@components/UserPhoto';
import ScreenHeader from '@components/ScreenHeader';
import Input from '@components/Input';
import Button from '@components/Button';

const PHOTO_SIZE = 33;

type ProfileFormProps = {
    name: string, 
    currentPassword: string,
    newPassword: string,
    newPassowrdConfirm: string
}

const profileFormSchema = yup.object({
    name: yup.string().required('Informe o novo nome'),
    currentPassword: yup.string().required('Informe a senha atual'),
    newPassword: yup.string().required('Informe a nova senha').min(6, 'A senha deve ter pelo menos 6 caractéres'),
    newPassowrdConfirm: yup.string().required('Confirme a senha').oneOf([yup.ref('newPassword'), null], 'As senhas devem ser iguais')
})

export const Profile = () => {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/rodrigo-noschang.png');

    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormProps>({
        resolver: yupResolver(profileFormSchema)
    })

    const toast = useToast();

    const handleUserPhotoSelect = async () => {
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });
    
            if (photoSelected.canceled) return;
    
            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                
                if (photoInfo.size && (photoInfo.size / 1024 / 1024 > 5)) {
                    return toast.show({
                        title: 'Essa imagem é muito grande, escolha uma de até 5MB',
                        placement: "top",
                        bgColor: 'red.500'
                    });
                }


                setUserPhoto(photoSelected.assets[0].uri);
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            setPhotoIsLoading(false);
        }
    }

    const handleUpdateProfile = (data: ProfileFormProps) => {
        console.log(data);
    }

    return (
        <VStack flex = {1}>
            <ScreenHeader title = 'Perfil'/>

            <ScrollView contentContainerStyle = {{paddingBottom: 36}}>
                <Center mt = {6} px = {10}>
                    { photoIsLoading ?
                    <Skeleton 
                        w = {PHOTO_SIZE}
                        h = {PHOTO_SIZE}
                        rounded = 'full'
                        startColor = 'gray.500'
                        endColor = 'gray.300'
                    />
                    :
                    <UserPhoto 
                        source = {{uri: userPhoto}}
                        alt = 'Foto do usuário'
                        size = {PHOTO_SIZE}
                    />
                    }

                    <TouchableOpacity onPress = {handleUserPhotoSelect}>
                        <Text color = 'green.500' fontWeight = 'bold' fontSize = 'md' mt = {2} mb = {8}>
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>

                    <Controller 
                        control = {control}
                        name = 'name'
                        render = {({ field: { onChange, value } }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Nome'
                                onChangeText = {onChange}
                                value = {value}
                                errorMessage = {errors.name?.message}
                            />
                        )}
                    />

                    <Input 
                        bgColor = 'gray.600'
                        placeholder = 'E-mail'
                        isDisabled
                    />
                </Center>

                <VStack px = {10} mt = {12} mb = {9}>
                    <Heading color = 'gray.200' fontSize = 'md' mb = {2} fontFamily = 'heading'>
                        Alterar senha
                    </Heading>

                    <Controller 
                        control = {control}
                        name = 'currentPassword'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Senha antiga'
                                secureTextEntry
                                onChangeText = {onChange}
                                value = {value}
                                errorMessage = {errors.currentPassword?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'newPassword'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Nova senha'
                                secureTextEntry
                                onChangeText = {onChange}
                                value = {value}
                                errorMessage = {errors.newPassword?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'newPassowrdConfirm'
                        render = {({ field: {onChange, value} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Confirme a nova senha'
                                secureTextEntry
                                onChangeText = {onChange}
                                value = {value}
                                errorMessage = {errors.newPassowrdConfirm?.message}
                            />
                        )}
                    />

                    <Button 
                        title = 'Atualizar'
                        mt = {4}
                        onPress = {handleSubmit(handleUpdateProfile)}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    )
}

export default Profile;