import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "@dtos/UserDTO";
import { USER_COLLECTION } from "./storageConfig";

export const userStoreUser = async (user: UserDTO) => {
    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user));
}

export const storageUserGet = async () => {
    const storage = await AsyncStorage.getItem(USER_COLLECTION);

    const user: UserDTO = storage ? JSON.parse(storage) : {};

    return user;
}

export const storageRemoveUser = async () => {
    await AsyncStorage.removeItem(USER_COLLECTION);
}