import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@services/api";
import { storageRemoveUser, storageUserGet, userStoreUser } from "@storage/userStoreUser";
import { storageAuthTokenGet, storageAuthTokenSave, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO,
    signIn: (email: string, password: string) => Promise<void>,
    isLoadingUserStorageData: boolean,
    signOut: () => void,
    updateUserProfile: (updatedUser: UserDTO) => Promise<void>
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContextProvder = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    const userAndTokenUpdate = async (userData: UserDTO, token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    }

    const storageUserAndTokenSave = async (userData: UserDTO, token: string) => {
        try {
            setIsLoadingUserStorageData(true);
            await userStoreUser(userData);
            await storageAuthTokenSave(token);
            
        } catch (error) {
            throw error

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/sessions', {email, password})

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token);
                userAndTokenUpdate(data.user, data.token);
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    const signOut = async () => {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);

            await storageRemoveUser();
            await storageAuthTokenRemove();

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    const updateUserProfile = async (updatedUser: UserDTO) => {
        try {
            setUser(updatedUser);
            
            await userStoreUser(updatedUser); 
        } catch (error) {
            throw error
        }
    }

    const loadUserData = async () => {
        try {
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();
    
            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token)
            }

        } catch (error) {
            throw error;

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, [])

    return (
        <AuthContext.Provider value = {{
            user, 
            signIn, 
            signOut,
            isLoadingUserStorageData,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}