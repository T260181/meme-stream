import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ---- Template library (manually approved samples for the MVP) ----
const TEMPLATES = [
  {
    id: 'distracted-boyfriend',
    title: 'Distracted Boyfriend',
    image: 'https://i.imgflip.com/1ur9b0.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Classic',
    trendScore: 62,
    addedAt: '2026-08-01',
    replaceablePeople: ['Boyfriend', 'Girlfriend', 'Other woman'],
  },
  {
    id: 'drake',
    title: 'Drake Hotline Bling',
    image: 'https://i.imgflip.com/30b1gx.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Classic',
    trendScore: 71,
    addedAt: '2026-08-03',
    replaceablePeople: ['Drake'],
  },
  {
    id: 'two-buttons',
    title: 'Two Buttons',
    image: 'https://i.imgflip.com/1g8my4.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Decisions',
    trendScore: 55,
    addedAt: '2026-08-06',
    replaceablePeople: ['Button presser'],
  },
  {
    id: 'change-my-mind',
    title: 'Change My Mind',
    image: 'https://i.imgflip.com/24y43o.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Debate',
    trendScore: 48,
    addedAt: '2026-08-08',
    replaceablePeople: ['Man at table'],
  },
  {
    id: 'success-kid',
    title: 'Success Kid',
    image: 'https://i.imgflip.com/1bhk.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Victory',
    trendScore: 80,
    addedAt: '2026-08-10',
    replaceablePeople: ['Kid'],
  },
  {
    id: 'disaster-girl',
    title: 'Disaster Girl',
    image: 'https://i.imgflip.com/23ls.jpg',
    source: 'imgflip public template API',
    rights: 'sample for private testing — review before launch',
    approved: true,
    category: 'Chaos',
    trendScore: 75,
    addedAt: '2026-08-09',
    replaceablePeople: ['Girl'],
  },
];

const TABS = ['For You', 'Trending', 'New'];

function templatesForTab(tab) {
  const approved = TEMPLATES.filter((t) => t.approved);
  if (tab === 'Trending') {
    return [...approved].sort((a, b) => b.trendScore - a.trendScore);
  }
  if (tab === 'New') {
    return [...approved].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
  }
  return approved;
}

// ---------------- Feed screen ----------------
function FeedScreen({ onRemix }) {
  const [tab, setTab] = useState('For You');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>😂 Meme Stream</Text>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={templatesForTab(tab)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => onRemix(item)}>
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>
                  {item.category} · 🔥 {item.trendScore}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.remixButton}
                onPress={() => onRemix(item)}
              >
                <Text style={styles.remixText}>REMIX</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ---------------- Remix screen ----------------
function RemixScreen({ template, onBack }) {
  const [person, setPerson] = useState('');
  const [photo, setPhoto] = useState(null);

  const pickPhoto = async () => {
    // Photos stay on the device at this stage — private by default.
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.remixHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.remixTitle}>Remix</Text>
        <View style={styles.backButton} />
      </View>

      <Image
        source={{ uri: template.image }}
        style={styles.remixImage}
        resizeMode="contain"
      />
      <Text style={styles.remixMemeTitle}>{template.title}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Who do you want to replace?</Text>
        <View style={styles.chips}>
          {template.replaceablePeople.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, person === p && styles.chipActive]}
              onPress={() => setPerson(p)}
            >
              <Text style={[styles.chipText, person === p && styles.chipTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your photo</Text>
        <View style={styles.photoRow}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoThumb} />
          ) : null}
          <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
            <Text style={styles.photoButtonText}>
              {photo ? 'Change photo' : '📸 Add your photo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        {person === '' ? (
          <Text style={styles.hint}>👆 Tap a name above to get started</Text>
        ) : photo === null ? (
          <Text style={styles.hint}>
            Replacing “{person}” — now add a photo of the person to put in! 📸
          </Text>
        ) : (
          <View>
            <Text style={styles.hint}>
              Ready! “{person}” will be replaced with your photo. ✨
            </Text>
            <View style={styles.generateButton}>
              <Text style={styles.generateText}>
                🪄 GENERATE — arrives in Step 7
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------- App (simple navigation) ----------------
export default function App() {
  const [remixing, setRemixing] = useState(null);

  if (remixing) {
    return (
      <RemixScreen template={remixing} onBack={() => setRemixing(null)} />
    );
  }
  return <FeedScreen onRemix={(t) => setRemixing(t)} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101014' },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  tabs: { flexDirection: 'row', marginTop: 12 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1c1c22',
    marginRight: 8,
  },
  tabActive: { backgroundColor: '#7c3aed' },
  tabText: { color: '#9b9ba4', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  feed: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#18181e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: { width: '100%', height: 300, backgroundColor: '#26262e' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#9b9ba4', fontSize: 12, marginTop: 2 },
  remixButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  remixText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  remixHeader: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 70 },
  backText: { color: '#7c3aed', fontSize: 18, fontWeight: '700' },
  remixTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  remixImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#18181e',
  },
  remixMemeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionLabel: { color: '#9b9ba4', fontSize: 14, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: {
    borderColor: '#7c3aed',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: '#7c3aed' },
  chipText: { color: '#c4b5fd', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  hint: { color: '#e4e4e7', fontSize: 15, lineHeight: 22 },
  photoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#26262e',
  },
  photoButton: {
    borderColor: '#7c3aed',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  photoButtonText: { color: '#c4b5fd', fontSize: 14, fontWeight: '700' },
  generateButton: {
    marginTop: 14,
    backgroundColor: '#2a2a33',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  generateText: { color: '#71717a', fontSize: 14, fontWeight: '800' },
});
