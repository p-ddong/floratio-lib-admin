'use client';

import { PlantList, User } from '@/types';
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type StoreContextType = {
users: User[]; 
  setUsers: Dispatch<SetStateAction<User[]>>;
  plants: PlantList[];
  setPlants: Dispatch<SetStateAction<PlantList[]>>;
//   contributes: any[];
//   setContributes: Dispatch<SetStateAction<any[]>>;
//   marks: any[];
//   setMarks: Dispatch<SetStateAction<any[]>>;
};

export const StoreContext = createContext<StoreContextType | null>(null);

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<PlantList[]>([]);
//   const [contributes, setContributes] = useState<any[]>([]);
//   const [marks, setMarks] = useState<any[]>([]);

  return (
    <StoreContext.Provider
      value={{
        users,
        setUsers,
        plants,
        setPlants,
        // contributes,
        // setContributes,
        // marks,
        // setMarks,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
