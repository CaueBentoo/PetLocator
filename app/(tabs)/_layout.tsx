import { Tabs } from 'expo-router';
import React, { useState, useContext } from "react";
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { url } from "../../constants/url"
import AuthContext from "../../contexts/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useRouter } from "expo-router";

import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { getUser, signIn, signOut } = useContext(AuthContext);

  type User = {
    nome: string;
    telefone: string;
    email: string;
  };
  const [user, setUser] = useState<User | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const userData = getUser();
      setUser(userData as any);
    }, [getUser])
  );

  const toggleLoginModal = () => {
    setLoginModalVisible(!loginModalVisible);
    setEmail('');
    setPassword('');
  };

  const toggleSignupModal = () => {
    if (!signupModalVisible) {
      // Resetar campos apenas quando for abrir a modal
      setFullName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    setSignupModalVisible(!signupModalVisible);
  };

  const handleLogout = () => {
    signOut();
    setUser(null as any);
    setEmail("");       // ← limpa o campo de e-mail
    setPassword("");    // ← limpa o campo de senha
    alert("Usuário desconectado");
    router.replace("/");
  };
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${url}/cadastro-usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: fullName,
          telefone: phone,
          email: email,
          senha: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Cadastro realizado com sucesso!");
        setSignupModalVisible(false);
        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao cadastrar: ${
            errorData.message
          } || Verifique os dados e tente novamente.`
        );
      }
    } catch (error) {
      alert("Erro ao realizar o cadastro. Tente novamente mais tarde.");
      console.error("Erro ao realizar o cadastro:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login realizado com sucesso!");
        setLoginModalVisible(false);
        if (data.token !== null) {
          signIn(
            data.token,
            data.email,
            data.nome,
            data.telefone,
            data.id
          );
          setUser(data);
        }
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao fazer login: ${errorData.message} Verifique suas credenciais e tente novamente.`
        );
      }
    } catch (error) {
      alert("Erro ao realizar o login. Tente novamente mais tarde.");
      console.error("Erro ao realizar o login:", error);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Desaparecidos",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="search-location" size={24} color={color} />
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={handleLogout}>
                  <Ionicons name="exit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={toggleLoginModal}
                >
                  <FontAwesome name="user" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="infopet"
          options={{
            title: "Info Pet",
            tabBarIcon: ({ color }) => (
              <AntDesign name="form" size={24} color={color} />
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={handleLogout}>
                  <Ionicons name="exit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={toggleLoginModal}
                >
                  <FontAwesome name="user" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!user) {
                e.preventDefault();
                alert("Você precisa estar logado para acessar esta aba.");
                router.replace("/");
              }
            },
          }}
        />
      </Tabs>

      {/* Modal de login */}
      <Modal
        visible={loginModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleLoginModal}
      >
        {user ? (
          <TouchableWithoutFeedback onPress={toggleLoginModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.userInfoText}>{user.nome}</Text>
                <Text style={styles.userInfoText}>{user.telefone}</Text>
                <Text style={styles.userInfoText}>{user.email}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={toggleLoginModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Login</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSignupModal}>
                  <Text style={styles.linkText}>Cadastre-se</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={toggleLoginModal}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Modal>

      {/* Modal de cadastro */}
      <Modal
        visible={signupModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleSignupModal}
      >
        <TouchableWithoutFeedback onPress={toggleSignupModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cadastro</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleSignupModal}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: "red",
    textAlign: "center",
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
