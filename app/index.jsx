import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your ChatBot</Text>
      
      <TouchableOpacity 
        style={[styles.botButton, { backgroundColor: '#e53238' }]} 
        onPress={() => router.push('/ebay-chat')}>
        <Text style={styles.buttonText}>eBay Assistant</Text>
        <Text style={styles.description}>Shop and sell with AI help</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botButton, { backgroundColor: '#013369' }]}
        onPress={() => router.push('/nfl-chat')}>
        <Text style={styles.buttonText}>NFL Expert</Text>
        <Text style={styles.description}>Your football knowledge companion</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botButton, { backgroundColor: '#f96302' }]}
        onPress={() => router.push('/homedepot-chat')}>
        <Text style={styles.buttonText}>Home Depot Helper</Text>
        <Text style={styles.description}>DIY and home improvement guide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  botButton: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  }
});
