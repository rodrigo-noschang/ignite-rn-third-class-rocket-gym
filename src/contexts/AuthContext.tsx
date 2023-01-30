import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@services/api";
import { storageRemoveUser, storageUserGet, userStoreUser } from "@storage/userStoreUser";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO,
    signIn: (email: string, password: string) => Promise<void>,
    isLoadingUserStorageData: boolean,
    signOut: () => void
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContextProvder = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    const signIn = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/sessions', {email, password})

            if (data.user) {
                setUser(data.user);
                await userStoreUser(data.user);
            }
        } catch (error) {
            throw error
        }
    }

    const signOut = async () => {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);

            await storageRemoveUser();

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    const loadUserData = async () => {
        try {
            const userLogged = await storageUserGet();
    
            if (userLogged) {
                setUser(userLogged);
                setIsLoadingUserStorageData(false);
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
            isLoadingUserStorageData,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}