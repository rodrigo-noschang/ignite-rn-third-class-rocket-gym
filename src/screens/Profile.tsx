import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import UserPhoto from '@components/UserPhoto';
import ScreenHeader from '@components/ScreenHeader';
import Input from '@components/Input';
import Button from '@components/Button';

const PHOTO_SIZE = 33;

type ProfileFormProps = {
    name: string, 
    email: string,
    currentPassword: string,
    newPassword: string,
    newPassowrdConfirm: string
}

const profileFormSchema = yup.object({
    name: yup.string().required('Informe o novo nome'),
    newPassword: yup
        .string()
        .nullable()
        .min(6, 'A senha deve ter pelo menos 6 caractéres')
        .nullable()
        .transform((value) => !!value ? value : null),
    newPassowrdConfirm: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('newPassword'), null], 'As senhas devem ser iguais')
        .when('newPassword', {
            is: (Field: any) => Field,
            then: yup.string().nullable().required('Informe a confirmação da senha').transform((value) => !!value ? value : null)
        })
})

export const Profile = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/rodrigo-noschang.png');

    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormProps>({
        resolver: yupResolver(profileFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email
        }
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

    const handleProfileUpdate = async (data: ProfileFormProps) => {
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put('/users', data);
            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            })

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel atualizar os dados. Tente novamente mais tarde'

            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false);
        }
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

                    <Controller 
                        control = {control}
                        name = 'email'
                        render = {({ field: { value} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'E-mail'
                                value = {value}
                                isDisabled
                            />
                        )}
                    />
                </Center>

                <VStack px = {10} mt = {12} mb = {9}>
                    <Heading color = 'gray.200' fontSize = 'md' mb = {2} fontFamily = 'heading'>
                        Alterar senha
                    </Heading>

                    <Controller 
                        control = {control}
                        name = 'currentPassword'
                        render = {({ field: {onChange} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Senha antiga'
                                secureTextEntry
                                onChangeText = {onChange}
                                errorMessage = {errors.currentPassword?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'newPassword'
                        render = {({ field: {onChange} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Nova senha'
                                secureTextEntry
                                onChangeText = {onChange}
                                errorMessage = {errors.newPassword?.message}
                            />
                        )}
                    />

                    <Controller 
                        control = {control}
                        name = 'newPassowrdConfirm'
                        render = {({ field: {onChange} }) => (
                            <Input 
                                bgColor = 'gray.600'
                                placeholder = 'Confirme a nova senha'
                                secureTextEntry
                                onChangeText = {onChange}
                                errorMessage = {errors.newPassowrdConfirm?.message}
                            />
                        )}
                    />

                    <Button 
                        title = 'Atualizar'
                        mt = {4}
                        onPress = {handleSubmit(handleProfileUpdate)}
                        isLoading = {isUpdating}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    )
}

export default Profile;