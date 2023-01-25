import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, HStack, FlatList, Heading } from 'native-base';

import Group from '@components/Group';
import HomeHeader from '@components/HomeHeader';
import ExerciseCard from '@components/ExerciseCard';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

export const Home = () => {
    const [groups, setGroups] = useState(['costas', 'ombro', 'bíceps', 'tríceps']);
    const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra']);
    const [groupSelected, setGroupSelected] = useState('costas');

    const navigate = useNavigation<AppNavigatorRoutesProps>();

    const handleOpenExerciseDetails = () => {
        navigate.navigate('exercise');
    }

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
                    keyExtractor = {item => item}
                    renderItem = {({ item }) => (
                        <ExerciseCard 
                            onPress = {handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator = {false}
                    _contentContainerStyle = {{ paddingBottom: 20 }}
                />

            </VStack>
        </VStack>
    )
}

export default Home;