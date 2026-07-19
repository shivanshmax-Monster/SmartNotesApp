import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id !== 'new') {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const noteDoc = await getDoc(doc(db, 'notes', id as string));
      if (noteDoc.exists()) {
        const data = noteDoc.data();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPinned(data.pinned || false);
      } else {
        Alert.alert('Error', 'Note not found');
        router.back();
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      Alert.alert('Error', 'Failed to fetch note details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !description.trim()) {
      Alert.alert('Hold on', 'Cannot save an empty note.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save notes');
      return;
    }

    setSaving(true);

    const noteData = {
      title,
      description,
      pinned,
      userId: user.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      if (id === 'new') {
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'notes', id as string), noteData);
      }
      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={26} color="#f8fafc" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setPinned(!pinned)} style={styles.iconButton}>
            <Ionicons name={pinned ? "pin" : "pin-outline"} size={26} color={pinned ? "#818cf8" : "#94a3b8"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note Title"
            placeholderTextColor="#475569"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Start typing your note here..."
            placeholderTextColor="#475569"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Midnight background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
    fontSize: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleInput: {
    fontFamily: 'Inter_700Bold',
    color: '#f8fafc',
    fontSize: 32,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  descriptionInput: {
    fontFamily: 'Inter_400Regular',
    color: '#cbd5e1',
    fontSize: 18,
    lineHeight: 28,
    minHeight: 300,
    paddingBottom: 40,
  },
});
