import { createContext, ReactNode, useEffect, useState } from "react";
// useEffect, qunado quero discapar uma função quando algo acontecer. Controla o F5 para recuparar um estado
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const { displayName, photoURL, uid } = user
  
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
  
        }      
      })
  
      // parar de ficar ouvindo um listener
      return () => {
        unsubscribe();
      }
    }, [])
  
    async function signWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider);
        console.log(result);
        if (result.user) {
          const { displayName, photoURL, uid } = result.user
  
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.');
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
  
        }
    }

    return (
    <AuthContext.Provider value={{ user, signWithGoogle }}>
        {props.children}
    </AuthContext.Provider>            
    );
}