import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { withExpoSnack } from 'nativewind';

// Auth Screen (Mock KYC)
const AuthScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [docNumber, setDocNumber] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-brand-light">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-brand-teal">Flex-Living</Text>
          <Text className="text-gray-500 mt-2">Premium Stays in Africa</Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-sm">
          <Text className="text-lg font-semibold text-brand-teal mb-4">Sign In / KYC</Text>
          
          <Text className="text-sm text-gray-500 mb-1">Phone Number</Text>
          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4"
            placeholder="+233 55 000 0000"
            value={phone}
            onChangeText={setPhone}
          />

          <Text className="text-sm text-gray-500 mb-1">Ghana Card (GHA-...)</Text>
          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6"
            placeholder="GHA-123456789-0"
            value={docNumber}
            onChangeText={setDocNumber}
          />

          <TouchableOpacity 
            className="bg-brand-coral py-4 rounded-xl items-center"
            onPress={() => onLogin(phone, docNumber)}
          >
            <Text className="text-white font-bold text-lg">Verify & Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Home Screen (Catalog)
const HomeScreen = ({ userTier }) => {
  const mockListings = [
    { id: 1, title: 'Accra Luxury Apartment', location: 'Cantonments, Accra', price: 150, rating: '4.9' },
    { id: 2, title: 'Osu Nightlife Condo', location: 'Osu, Accra', price: 120, rating: '4.7' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-brand-light">
      <ScrollView className="px-4 pt-6">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-500">Welcome back,</Text>
            <Text className="text-2xl font-bold text-brand-teal">Verified Guest</Text>
          </View>
          <View className="bg-brand-gold px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">Tier {userTier}</Text>
          </View>
        </View>

        <Text className="text-xl font-bold text-brand-teal mb-4">Nearby Stays (PostGIS)</Text>

        {mockListings.map(listing => (
          <View key={listing.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="h-40 bg-gray-200 rounded-xl mb-4" /> 
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-lg font-bold text-brand-teal">{listing.title}</Text>
                <Text className="text-gray-500">{listing.location}</Text>
              </View>
              <View className="bg-brand-coral/10 px-2 py-1 rounded-md">
                <Text className="text-brand-coral font-bold">${listing.price}/nt</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTier, setUserTier] = useState(0);

  const handleLogin = (phone, docNumber) => {
    // Mock KYC Logic
    if (docNumber.startsWith('GHA-')) {
      setUserTier(2);
      setIsAuthenticated(true);
    } else {
      alert("Invalid Ghana Card Number. Must start with GHA-");
    }
  };

  return isAuthenticated ? <HomeScreen userTier={userTier} /> : <AuthScreen onLogin={handleLogin} />;
};

// withExpoSnack is only for NativeWind v2 Expo compatibility out of the box
export default withExpoSnack(App);
