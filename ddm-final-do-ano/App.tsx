import React, { useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

// Tipagem do usuário
type User = {
  name: string;
  phone: string;
  email: string;
  cpf: string;
};

// Função para formatar telefone com limite de 11 dígitos
const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
};

// Função para formatar CPF com limite de 11 dígitos
const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  return match ? `${match[1]}.${match[2]}.${match[3]}-${match[4]}` : cleaned;
};

// Função para validar email
const isValidEmail = (email: string): boolean => {
  return email.includes('@');
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleSubmit = () => {
    if (!name || !phone || !email || !cpf) return;
    if (!isValidEmail(email)) return;

    const formattedPhone = formatPhone(phone);
    const formattedCPF = formatCPF(cpf);

    if (editingUser) {
      const updated = users.map(u =>
        u === editingUser ? { ...u, name, phone: formattedPhone, email, cpf: formattedCPF } : u
      );
      setUsers(updated);
      setEditingUser(null);
    } else {
      setUsers([...users, { name, phone: formattedPhone, email, cpf: formattedCPF }]);
    }

    setName('');
    setPhone('');
    setEmail('');
    setCPF('');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setPhone(user.phone);
    setEmail(user.email);
    setCPF(user.cpf);
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    setUsers(users.filter(u => u !== userToDelete));
    if (editingUser === userToDelete) {
      setEditingUser(null);
      setName('');
      setPhone('');
      setEmail('');
      setCPF('');
    }
    setModalVisible(false);
    setUserToDelete(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{editingUser ? 'Editar' : 'Cadastrar'} Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#7A7A7A"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#7A7A7A"
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7A7A7A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#7A7A7A"
          value={cpf}
          onChangeText={(text) => setCPF(formatCPF(text))}
          keyboardType="numeric"
          maxLength={14}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>{editingUser ? 'Atualizar' : 'Cadastrar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        <Text style={styles.title}>Usuários Cadastrados</Text>
        {users.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <Text style={styles.userText}>{user.name}</Text>
            <Text style={styles.userText}>{user.phone}</Text>
            <Text style={styles.userText}>{user.email}</Text>
            <Text style={styles.userText}>{user.cpf}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(user)} style={styles.editBtn}>
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(user)} style={styles.deleteBtn}>
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Deseja excluir este usuário?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleDelete} style={styles.confirmBtn}>
                <Text style={styles.btnText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos responsivos
const { width } = Dimensions.get('window');
const isSmall = width < 360;

const styles = StyleSheet.create({
  container: { flex: 1, padding: isSmall ? 12 : 18, backgroundColor: '#F4F6F9' },
  form: { backgroundColor: '#FFF', padding: isSmall ? 12 : 18, borderRadius: 14, marginBottom: 20, elevation: 2 },
  title: { fontSize: isSmall ? 20 : 24, fontWeight: '700', marginBottom: 16, color: '#2D3436', textAlign: 'center' },
  input: { backgroundColor: '#F0F2F5', paddingVertical: isSmall ? 10 : 12, paddingHorizontal: 14, borderRadius: 10, fontSize: isSmall ? 14 : 16,   marginBottom: 12, borderWidth: 1, borderColor: '#D6D6D6', color: '#2D3436' },
  submitBtn: { backgroundColor: '#4A90E2', paddingVertical: isSmall ? 10 : 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: '600', fontSize: isSmall ? 16 : 18 },
  list: { width: '100%' },
  userCard: { backgroundColor: '#FFF', padding: isSmall ? 14 : 18, borderRadius: 14, marginBottom: 14, elevation: 2 },
  userText: { fontSize: isSmall ? 16 : 18, fontWeight: '500', color: '#2D3436', marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  editBtn: { backgroundColor: '#6C5CE7', paddingVertical: isSmall ? 8 : 10, borderRadius: 10, width: '48%', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#D63031', paddingVertical: isSmall ? 8 : 10, borderRadius: 10, width: '48%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: isSmall ? 14 : 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', padding: isSmall ? 18 : 24, width: '100%', maxWidth: 360, borderRadius: 14, elevation: 4 },
  modalText: { fontSize: isSmall ? 16 : 20, textAlign: 'center', fontWeight: '500', color: '#2D3436', marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmBtn: { backgroundColor: '#0984E3', paddingVertical: isSmall ? 8 : 12, paddingHorizontal: 22, borderRadius: 10 },
  cancelBtn: { backgroundColor: '#636E72', paddingVertical: isSmall ? 8 : 12, paddingHorizontal: 22, borderRadius: 10 },
});
