import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { sendChatMessage } from './services/api';

export default function NFLChat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: "Welcome to NFL Expert! I can help you with stats, game analysis, player information, and NFL history. What would you like to know?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user', content: message };
      setChatHistory(prev => [...prev, userMessage]);
      setMessage('');

      const response = await sendChatMessage(message, 'nfl');
      
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: response.message
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSendButton = () => (
    <TouchableOpacity 
      style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
      onPress={sendMessage}
      disabled={isLoading}
    >
      <Text style={styles.sendButtonText}>
        {isLoading ? 'Sending...' : 'Send'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButtonContainer}
            onPress={() => router.back()}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NFL Expert</Text>
        </View>

        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((msg, index) => (
            <View 
              key={index} 
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.role === 'user' && styles.userMessageText
              ]}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#666"
            multiline
            editable={!isLoading}
          />
          {renderSendButton()}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#013369',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButtonContainer: {
    padding: 5,
    zIndex: 1,
  },
  backButton: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#013369',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000000',
    fontSize: 16,
  },
  userMessageText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#013369',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  }
}); 