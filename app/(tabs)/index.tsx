import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function EmotionPredictor() {
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrediction(data.prediction);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Bir metin yazın..."
        placeholderTextColor="#666"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Tahmin Et" onPress={callApi} disabled={!inputText || loading} color="#4CAF50" />
      {loading && <ActivityIndicator size="large" color="#FF5722" />}
      {prediction && <Text style={styles.prediction}>Tahmin: {prediction}</Text>}
      {error && <Text style={styles.error}>Hata: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f4f7' },
  input: { 
    borderColor: '#4CAF50', 
    borderWidth: 2, 
    padding: 12, 
    marginBottom: 10, 
    borderRadius: 8, 
    fontSize: 16,
    color: '#333',
    backgroundColor: '#e8f5e9'
  },
  prediction: { marginTop: 20, fontSize: 22, fontWeight: '600', color: '#388E3C' },
  error: { marginTop: 20, fontSize: 16, color: '#D32F2F', fontWeight: '500' },
});
