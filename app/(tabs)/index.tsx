import React, { useEffect, useState } from "react";
import { 
  View, TouchableOpacity, Text, StyleSheet, FlatList, Image, Modal, TextInput 
} from "react-native";
import { url } from '../../constants/url';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Animal {
  idanimais: number;
  nome: string;
  caracteristicas: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data: string;
  telefone: string;
  nome_foto: string;
  tipo: string;
}

export default function TabTwoScreen() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterEndereco, setFilterEndereco] = useState<string>('');
  const [filterBairro, setFilterBairro] = useState<string>('');
  const [filterCidade, setFilterCidade] = useState<string>('');
  const [filterEstado, setFilterEstado] = useState<string>('');

  const getAnimais = async () => {
    try {
      const response = await fetch(`${url}/animais`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const json: Animal[] = await response.json();
      setAnimais(json);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAnimais();
    }, [])
  );

  const handlePress = (animal: Animal) => {
    setSelectedAnimal(animal);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedAnimal(null);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={animais.filter(animal => 
          (filterType ? animal.tipo.toLowerCase().includes(filterType.toLowerCase()) : true) &&
          (filterBairro ? animal.endereco.toLowerCase().includes(filterEndereco.toLowerCase()) : true) &&
          (filterBairro ? animal.bairro.toLowerCase().includes(filterBairro.toLowerCase()) : true) &&
          (filterCidade ? animal.cidade.toLowerCase().includes(filterCidade.toLowerCase()) : true) &&
          (filterEstado ? animal.estado.toLowerCase().includes(filterEstado.toLowerCase()) : true)
        )}
        keyExtractor={(item) => item.idanimais.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: `${url}/imagens/animais/${item.nome_foto}` }} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.textoItem}>
              <Text style={styles.boldText}>Nome do pet: <Text style={styles.normalText}>{item.nome || 'Nome não disponível'}</Text></Text>
              <Text style={styles.boldText}>Características: <Text style={styles.normalText}>{item.caracteristicas || 'Características não disponíveis'}</Text></Text>
              <Text style={styles.boldText}>Endereço no qual foi avistado por último: <Text style={styles.normalText}>{item.endereco || 'Endereço não disponível'}</Text></Text>
              <Text style={styles.boldText}>Bairro no qual desapareceu: <Text style={styles.normalText}>{item.bairro || 'Bairro não disponível'}</Text></Text>
              <Text style={styles.boldText}>Cidade na qual desapareceu: <Text style={styles.normalText}>{item.cidade || 'Cidade não disponível'}</Text></Text>
              <Text style={styles.boldText}>Estado no qual desapareceu: <Text style={styles.normalText}>{item.estado || 'Estado não disponível'}</Text></Text>
              <Text style={styles.boldText}>Data do desaparecimento: <Text style={styles.normalText}>{item.data || 'Data não disponível'}</Text></Text>
              <Text style={styles.boldText}>Telefone para contato: <Text style={styles.normalText}>{item.telefone || 'Telefone não disponível'}</Text></Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum animal encontrado</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal de detalhes do animal */}
      {selectedAnimal && (
        <Modal
          visible={detailModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeDetailModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: `${url}/imagens/animais/${selectedAnimal.nome_foto}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              <Text style={styles.boldText}>Nome do pet: <Text style={styles.normalText}>{selectedAnimal.nome}</Text></Text>
              <Text style={styles.boldText}>Características: <Text style={styles.normalText}>{selectedAnimal.caracteristicas}</Text></Text>
              <Text style={styles.boldText}>Endereço no qual foi avistado por último: <Text style={styles.normalText}>{selectedAnimal.endereco}</Text></Text>
              <Text style={styles.boldText}>Bairro no qual desapareceu: <Text style={styles.normalText}>{selectedAnimal.bairro}</Text></Text>
              <Text style={styles.boldText}>Cidade na qual desapareceu: <Text style={styles.normalText}>{selectedAnimal.cidade}</Text></Text>
              <Text style={styles.boldText}>Data do desaparecimento: <Text style={styles.normalText}>{selectedAnimal.data}</Text></Text>
              <Text style={styles.boldText}>Telefone para contato: <Text style={styles.normalText}>{selectedAnimal.telefone}</Text></Text>
              <TouchableOpacity onPress={closeDetailModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para filtro */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <Text style={styles.modalTitle}>Filtrar Animais</Text>

            <TextInput
              placeholder="Tipo de Animal"
              value={filterType}
              onChangeText={setFilterType}
              style={styles.filterInput}
            />
            <TextInput
              placeholder="Endereço"
              value={filterEndereco}
              onChangeText={setFilterEndereco}
              style={styles.filterInput}
            />
            <TextInput
              placeholder="Bairro"
              value={filterBairro}
              onChangeText={setFilterBairro}
              style={styles.filterInput}
            />
            <TextInput
              placeholder="Cidade"
              value={filterCidade}
              onChangeText={setFilterCidade}
              style={styles.filterInput}
            />
            <TextInput
              placeholder="Estado"
              value={filterEstado}
              onChangeText={setFilterEstado}
              style={styles.filterInput}
            />

            <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C0BA80',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    width: '100%',
    backgroundColor: '#FFFDEB',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  filterInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#FF7F50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  itemContainer: {
    padding: 10,
    width: '100%',
    backgroundColor: '#FFFDEB',
    borderRadius: 15,
    marginVertical: 5,
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    width: '80%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textoItem: {
    padding: 10,
    gap: 5,
    alignSelf: 'flex-start',
    paddingBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFDEB',
    padding: 20,
    borderRadius: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  normalText: {
    fontWeight: 'normal',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF7F50',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContent: {
    width: '80%',
    backgroundColor: '#FFFDEB',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
