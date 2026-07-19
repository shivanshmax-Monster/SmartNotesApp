import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Note = {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
  createdAt: any;
};

export default function DashboardScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    // Simplified query to avoid requiring a Firestore composite index
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes: Note[] = [];
      snapshot.forEach((doc) => {
        fetchedNotes.push({ id: doc.id, ...doc.data() } as Note);
      });
      
      // Sort in memory: Pinned first, then by createdAt descending
      fetchedNotes.sort((a, b) => {
        if (a.pinned === b.pinned) {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        }
        return a.pinned ? -1 : 1;
      });

      setNotes(fetchedNotes);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const togglePin = async (id: string, currentPinnedStatus: boolean) => {
    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        pinned: !currentPinnedStatus
      });
    } catch (error) {
      console.error("Error updating pin status: ", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Note, index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(400)}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        style={styles.noteCard}
        onPress={() => router.push(`/note/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle} numberOfLines={1}>{item.title || 'Untitled Note'}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => togglePin(item.id, item.pinned)} style={styles.iconButton}>
              <Ionicons 
                name={item.pinned ? "pin" : "pin-outline"} 
                size={22} 
                color={item.pinned ? "#818cf8" : "#64748b"} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNote(item.id)} style={[styles.iconButton, { marginLeft: 8 }]}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.noteDescription} numberOfLines={3}>
          {item.description || 'No additional text'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Text style={styles.title}>My Notes</Text>
        <Text style={styles.subtitle}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.delay(200).duration(600)} style={[styles.searchContainer, searchFocused && styles.searchFocused]}>
        <Ionicons name="search" size={20} color={searchFocused ? "#818cf8" : "#64748b"} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your notes..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </Animated.View>

      {filteredNotes.length === 0 ? (
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-text" size={48} color="#334155" />
          </View>
          <Text style={styles.emptyText}>No notes found</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create a new note.</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: Math.max(insets.bottom + 100, 120) }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Animated.View entering={FadeInUp.delay(800).springify()} style={[styles.fabContainer, { bottom: Math.max(insets.bottom + 20, 32) }]}>
        <TouchableOpacity onPress={() => router.push('/note/new')} activeOpacity={0.8}>
          <LinearGradient
            colors={['#818cf8', '#6366f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Ionicons name="add" size={32} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchFocused: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontFamily: 'Inter_400Regular',
    flex: 1,
    color: '#f8fafc',
    paddingVertical: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  noteCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#f8fafc',
    flex: 1,
    marginRight: 12,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 10,
  },
  noteDescription: {
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -80, // Offset for header/search
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
