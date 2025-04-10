import React, { createContext, useState, ReactNode } from "react";

interface AuthContextData {
  signed: boolean;
  token: string;
  nome: string;
  email: string;
  telefone: string;
  idusuarios: string;
  signIn(user: any, token: any, nome: any, telefone: any, idusuarios: any): Promise<void>;
  signOut(): void;
  getUser(): { nome: string; email: string; telefone: string; idusuarios: string } | null; // Adiciona a função user
}

interface AuthProviderProps {
  children: ReactNode; // Define que o children deve ser do tipo ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [signed, setSigned] = useState(false);
  const [token, setToken] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idusuarios, setIdusuarios] = useState("");

  const getUser = () => {
    // Retorna um objeto com os dados do usuário ou null se não estiver autenticado

   // console.log( nome, email, telefone, idusuarios )

    return signed ? { nome, email, telefone, idusuarios } : null;
  };

  const signIn = async (token: any, email: any, nome: any, telefone: any, id: any) => {
    console.log(token + '-' + email + '-' + nome + '-' + telefone + '-' + id);

    try {
      if (token && email && nome && telefone && id) {
        setSigned(true);
        setToken(token);
        setNome(nome);
        setEmail(email);
        setTelefone(telefone);
        setIdusuarios(id);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao fazer login");
    }
  };

  const signOut = () => {
    setSigned(false);
    setToken("");
    setNome("");
    setEmail("");
    setTelefone("");
    setIdusuarios("");
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!token,
        token,
        nome,
        email,
        telefone,
        idusuarios,
        signIn,
        signOut,
        getUser, // Adiciona a função user ao valor do contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export { AuthProvider, AuthContext };
