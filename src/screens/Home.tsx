import { useState } from 'react';
import { VStack, HStack, FlatList, Heading } from 'native-base';

import HomeHeader from '@components/HomeHeader';
import Group from '@components/Group';

export const Home = () => {
    const [groups, setGroups] = useState(['costas', 'ombro', 'bíceps', 'tríceps']);
    const [groupSelected, setGroupSelected] = useState('costas');



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
                            isActive = {groupSelected === item}
                            onPress = {() => {setGroupSelected(item)}}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator = {false}
                    _contentContainerStyle = {{px: 8}}
                    my = {10}
                    maxH = {10}
                />
            </HStack>

            <VStack flex = {1} px = {8}>
                <HStack justifyContent = 'space-between'>
                    <Heading color = 'gray.200' fontSize = 'md'>
                        Exercícios
                    </Heading>

                    <Heading color = 'gray.200' fontSize = 'sm'>
                        4
                    </Heading>
                </HStack>

            </VStack>
        </VStack>
    )
}

export default Home;