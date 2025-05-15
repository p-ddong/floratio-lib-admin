"use client";

import { PlantList, User } from '@/types';
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
// import axios from 'axios';
// import { BASE_API, ENDPOINT_PLANT, ENDPOINT_USER } from '@/constant/API';

type StoreContextType = {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  plants: PlantList[];
  setPlants: Dispatch<SetStateAction<PlantList[]>>;
};

export const StoreContext = createContext<StoreContextType | null>(null);

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<PlantList[]>([]);

  useEffect(() => {
    // const fetchStoreData = async () => {
    //   const token =
    //     typeof window !== 'undefined'
    //       ? localStorage.getItem('authToken')
    //       : null;

    //   const headers = token
    //     ? {
    //         Authorization: `Bearer ${token}`,
    //       }
    //     : {};

    //   try {
    //     const [plantRes, userRes] = await Promise.all([
    //       axios.get(`${BASE_API}${ENDPOINT_PLANT.list}`, { headers }),
    //       axios.get(`${BASE_API}${ENDPOINT_USER.list}`, { headers }),
    //     ]);

    //     setPlants(plantRes.data);
    //     setUsers(userRes.data);
    //   } catch (error) {
    //     console.error("❌ Failed to fetch store data:", error);
    //   }
    // };

    // if (plants.length === 0 || users.length === 0) {
    //   fetchStoreData();
    // }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        users,
        setUsers,
        plants,
        setPlants,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
