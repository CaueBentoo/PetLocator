import React, { useState } from "react";
import { 
  ScrollView, 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TextInput, 
  Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { url } from '../../constants/url';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



type ImageType = string | null;

type FileData = {
  uri: string;
  type: string;
  name: string;
};

export default function TabTwoScreen() {
  const [nome, setNome] = useState<string>('');
  const [caracteristicas, setCaracteristicas] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [image, setImage] = useState<ImageType>(null);

  useFocusEffect(
    useCallback(() => {
      // Resetar todos os campos ao focar na tela
      setNome('');
      setCaracteristicas('');
      setEndereco('');
      setBairro('');
      setCidade('');
      setEstado('');
      setTelefone('');
      setTipo('');
      setData('');
      setImage(null);
    }, [])
  );
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria de imagens é necessária!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('caracteristicas', caracteristicas);
    formData.append('endereco', endereco);
    formData.append('bairro', bairro);
    formData.append('cidade', cidade);
    formData.append('estado', estado);
    formData.append('telefone', telefone);
    formData.append('tipo', tipo);
    formData.append('data', data);
    
    if (image) {
      const fileData: FileData = {
        uri: image,
        type: 'image/jpeg',
        name: 'animal.jpg',
      };
      formData.append('file', fileData as any);
    }

    try {
      const response = await fetch(`${url}/procurar-animal`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Dados enviados com sucesso!');
        
        setNome('');
        setCaracteristicas('');
        setEndereco('');
        setBairro('');
        setCidade('');
        setEstado('');
        setTelefone('');
        setTipo('');
        setData('');
        setImage(null);
      } else {
        alert('Erro ao enviar os dados.');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Nome do pet" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Características" value={caracteristicas} onChangeText={setCaracteristicas} />
        <TextInput style={styles.input} placeholder="Endereço no qual foi avistado por último" value={endereco} onChangeText={setEndereco} />
        <TextInput style={styles.input} placeholder="Bairro no qual desapareceu" value={bairro} onChangeText={setBairro} />
        <TextInput style={styles.input} placeholder="Cidade na qual desapareceu" value={cidade} onChangeText={setCidade} />
        <TextInput style={styles.input} placeholder="Estado no qual desapareceu" value={estado} onChangeText={setEstado} />
        <TextInput style={styles.input} placeholder="Telefone para contato" value={telefone} onChangeText={setTelefone} />
        <TextInput style={styles.input} placeholder="Qual é o animal?" value={tipo} onChangeText={setTipo} />
        <TextInput style={styles.input} placeholder="Data do desaparecimento" value={data} onChangeText={setData} />
        
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.text}>{image ? 'Imagem selecionada' : 'Selecionar imagem'}</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.text}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDEB',
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#FFFDEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    borderColor: 'black', // Borda preta
    borderWidth: 1,       // Largura da borda
  },
  
  text: {
    color: 'black',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
});