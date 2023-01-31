import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { VStack, HStack, FlatList, Heading, useToast } from 'native-base';

import Group from '@components/Group';
import HomeHeader from '@components/HomeHeader';
import ExerciseCard from '@components/ExerciseCard';
import Loading from '@components/Loading';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

export const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([]);
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [groupSelected, setGroupSelected] = useState('antebraço');

    const toast = useToast();

    const navigate = useNavigation<AppNavigatorRoutesProps>();

    const handleOpenExerciseDetails = (exerciseId: string) => {
        navigate.navigate('exercise', {
            exerciseId
        });
    }

    const fetchGroups = async () => {
        try {
            const { data } = await api.get('/groups');

            setGroups(data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os grupos musculares';

            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            })
        } 
    }

    const fetchExercisesByGroup = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/bygroup/${groupSelected}`);

            setExercises(response.data);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os exercícios';

            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]))

    return (
        <VStack flex = {1}>
            <HomeHeader />


            <HStack>
                <FlatList 
                    data = {groups}
                    keyExtractor = {item => item}
                    renderItem={({ item }) => (
                        <Group 
                            name = {item}
                            isActive = {groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                            onPress = {() => {setGroupSelected(item)}}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator = {false}
                    _contentContainerStyle = {{px: 8}}
                    my = {10}
                    maxH = {10}
                    minH = {10}
                />
            </HStack>


           {
           isLoading ? 
            <Loading /> 
           :
            <VStack flex = {1} px = {8}>
                <HStack justifyContent = 'space-between' mb = {6}>
                    <Heading color = 'gray.200' fontSize = 'md' fontFamily = 'heading'>
                        Exercícios
                    </Heading>

                    <Heading color = 'gray.200' fontSize = 'sm' fontFamily = 'heading'>
                        {exercises.length}
                    </Heading>
                </HStack>

                <FlatList 
                    data = {exercises}
                    keyExtractor = {item => item.id}
                    renderItem = {({ item }) => (
                        <ExerciseCard 
                            data = {item}
                            onPress = {() => handleOpenExerciseDetails(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator = {false}
                    _contentContainerStyle = {{ paddingBottom: 20 }}
                />

            </VStack>
            }
        </VStack>
    )
}

export default Home;