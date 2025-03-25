import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar
} from 'react-native';
import * as Speech from 'expo-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey] = useState('AIzaSyBiIqpSdEMxaBgEmaLwNUkJ1yaU3q77KRM');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollViewRef = useRef();

  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: "v1" });
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Handle keyboard appearance
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchGeminiResponse = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm sorry, I encountered an error processing your request.";
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleSubmit = async (inputText = text) => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setText('');
    setLoading(true);
    
    try {
      const response = await fetchGeminiResponse(inputText);
      
      const assistantMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      Speech.speak(response, {
        language: 'te-IN',
        pitch: 1,
        rate: 0.9,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <FontAwesome5 name="robot" size={24} color="white" style={styles.logo} />
        <Text style={styles.title}>Laxmi-AI</Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollViewRef}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <FontAwesome5 
                name="comment-alt" 
                size={80} 
                color="#4CAF50" 
                style={styles.welcomeIcon} 
              />
              <Text style={styles.welcomeText}>Type a message to start chatting</Text>
            </View>
          ) : (
            messages.map(message => (
              <View 
                key={message.id} 
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.assistantBubble
                ]}
              >
                {message.sender === 'assistant' && (
                  <FontAwesome5 
                    name="robot" 
                    size={16} 
                    color="#4CAF50" 
                    style={styles.messageIcon} 
                  />
                )}
                <Text style={styles.messageText}>{message.text}</Text>
                {message.sender === 'user' && (
                  <FontAwesome5 
                    name="user" 
                    size={16} 
                    color="#4CAF50" 
                    style={styles.messageIcon} 
                  />
                )}
              </View>
            ))
          )}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type your message..."
              placeholderTextColor="#666"
              onSubmitEditing={() => handleSubmit()}
            />
            {isSpeaking ? (
              <TouchableOpacity 
                style={[styles.sendButton, styles.stopButton]} 
                onPress={stopSpeaking}
              >
                <FontAwesome5 name="stop" size={16} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                <FontAwesome5 name="paper-plane" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logo: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingTop: 20,
    paddingBottom: 120, // Extra space for input and keyboard
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  assistantBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginHorizontal: 5,
  },
  messageIcon: {
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  welcomeIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {  
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});