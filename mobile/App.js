import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PROPERTIES = [
  // Accra Properties
  {
    id: 1,
    title: 'Luxury Cantonments Penthouse',
    city: 'Accra, Ghana',
    neighborhood: 'Cantonments',
    priceGhs: 4200,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    scout: 'Ama (Senior Flex Guide)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'ATS < 6s • 38 dB Silent Inverter • Dedicated Standing Desk'
  },
  {
    id: 2,
    title: 'Airport Residential Executive Villa',
    city: 'Accra, Ghana',
    neighborhood: 'Airport Residential',
    priceGhs: 4800,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    scout: 'Kofi (Flex Scout Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: '10kVA Victron Solar • Private Swimming Pool • Chef Kitchen'
  },
  {
    id: 3,
    title: 'Labone Modern Duplex',
    city: 'Accra, Ghana',
    neighborhood: 'Labone',
    priceGhs: 3800,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    scout: 'Ama (Senior Flex Guide)',
    badges: ['⚡ 24/7 Solar', '🌐 100Mbps Fibre', '💧 Borehole'],
    amenities: 'Dual Grid Transfer • 5,000L Overhead Water • Garden Patio'
  },
  {
    id: 4,
    title: 'Osu Contemporary Studio',
    city: 'Accra, Ghana',
    neighborhood: 'Osu Oxford St',
    priceGhs: 2900,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    rating: 4.81,
    scout: 'Kwame (Flex Scout)',
    badges: ['⚡ Inverter Backup', '🌐 50Mbps Fibre', '🔐 Smart Lock'],
    amenities: 'Balcony View • Noise Insulated • 2 Mins to Oxford Street'
  },
  {
    id: 5,
    title: 'East Legon Tech Nomad Hub',
    city: 'Accra, Ghana',
    neighborhood: 'East Legon',
    priceGhs: 3500,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    rating: 4.90,
    scout: 'Kofi (Flex Scout Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '🔐 Smart Lock'],
    amenities: 'Ergonomic Chair • 4K Monitor Station • Dual Battery Pack'
  },
  {
    id: 6,
    title: 'Dzorwulu Executive Garden Flat',
    city: 'Accra, Ghana',
    neighborhood: 'Dzorwulu',
    priceGhs: 3200,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    scout: 'Ama (Senior Flex Guide)',
    badges: ['⚡ 24/7 Solar', '💧 Borehole', '🛡️ Gated 24/7'],
    amenities: 'Quiet Sector • Solar Water Heating • Gated Perimeter'
  },
  {
    id: 7,
    title: 'Roman Ridge Diplomatic Residence',
    city: 'Accra, Ghana',
    neighborhood: 'Roman Ridge',
    priceGhs: 5200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    rating: 4.98,
    scout: 'Kofi (Flex Scout Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'Triple Redundancy Power • Embassy Sector • Private Gym'
  },

  // Lagos Properties
  {
    id: 8,
    title: 'Banana Island Waterfront Villa',
    city: 'Lagos, Nigeria',
    neighborhood: 'Ikoyi (Banana Island)',
    priceGhs: 7800,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    rating: 4.99,
    scout: 'Chinedu (Lagos Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: '15kVA Solar Microgrid • Marina Access • 24/7 Armed Security'
  },
  {
    id: 9,
    title: 'Sleek Lekki Phase 1 Studio',
    city: 'Lagos, Nigeria',
    neighborhood: 'Lekki Phase 1',
    priceGhs: 5400,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    rating: 4.78,
    scout: 'Chinedu (Lagos Lead)',
    badges: ['⚡ Inverter Backup', '🌐 30Mbps Fibre', '🛡️ Gated'],
    amenities: 'Dual Gen Transfer • Water Treatment Plant • Modern Kitchenette'
  },
  {
    id: 10,
    title: 'Victoria Island Skyline Loft',
    city: 'Lagos, Nigeria',
    neighborhood: 'Victoria Island',
    priceGhs: 6200,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
    rating: 4.91,
    scout: 'Bolu (Flex Scout)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole'],
    amenities: 'Atlantic Ocean View • Dedicated Zoom Room • 24/7 Concierge'
  },
  {
    id: 11,
    title: 'Ikoyi Colonial Garden Suite',
    city: 'Lagos, Nigeria',
    neighborhood: 'Ikoyi',
    priceGhs: 6800,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    rating: 4.94,
    scout: 'Chinedu (Lagos Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'Lithium Battery Storage • Lush Private Garden • High Perimeter'
  },
  {
    id: 12,
    title: 'Ikeja GRA Diplomatic Flat',
    city: 'Lagos, Nigeria',
    neighborhood: 'Ikeja GRA',
    priceGhs: 4600,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    scout: 'Bolu (Flex Scout)',
    badges: ['⚡ 24/7 Solar', '💧 Borehole', '🛡️ Gated'],
    amenities: '10 Mins to Airport • Industrial Soundproofing • Full Backup'
  },
  {
    id: 13,
    title: 'Eko Atlantic Marina Penthouse',
    city: 'Lagos, Nigeria',
    neighborhood: 'Eko Atlantic City',
    priceGhs: 8500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    scout: 'Chinedu (Lagos Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'Panoramic Ocean Balcony • Smart Home Automation • Private Lift'
  },

  // Nairobi Properties
  {
    id: 14,
    title: 'Westlands Skyview Penthouse',
    city: 'Nairobi, Kenya',
    neighborhood: 'Westlands',
    priceGhs: 4300,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    rating: 4.96,
    scout: 'Njeri (Nairobi Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'Rooftop Infinity Pool • Fibre + Starlink Failover • City Skyline'
  },
  {
    id: 15,
    title: 'Kilimani Tech Nomad Haven',
    city: 'Nairobi, Kenya',
    neighborhood: 'Kilimani',
    priceGhs: 3600,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    rating: 4.89,
    scout: 'Njeri (Nairobi Lead)',
    badges: ['⚡ 24/7 Solar', '🌐 100Mbps Fibre', '💧 Reserve Tank'],
    amenities: 'Solar Inverter Backup • 5,000L Reserve Tank • Quiet Balcony'
  },
  {
    id: 16,
    title: 'Karen Country Garden Estate',
    city: 'Nairobi, Kenya',
    neighborhood: 'Karen',
    priceGhs: 6900,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    rating: 4.98,
    scout: 'Otieno (Flex Scout)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'Acre Private Forest • Solar Off-Grid Setup • Pure Borehole'
  },
  {
    id: 17,
    title: 'Lavington Serene Executive Flat',
    city: 'Nairobi, Kenya',
    neighborhood: 'Lavington',
    priceGhs: 3900,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.84,
    scout: 'Njeri (Nairobi Lead)',
    badges: ['⚡ 24/7 Solar', '💧 Borehole', '🛡️ Gated'],
    amenities: 'Electric Fence • Solar Water Heating • Tree-lined Sanctuary'
  },
  {
    id: 18,
    title: 'Riverside UN Diplomatic Suite',
    city: 'Nairobi, Kenya',
    neighborhood: 'Riverside Drive',
    priceGhs: 4700,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    rating: 4.93,
    scout: 'Otieno (Flex Scout)',
    badges: ['⚡ 24/7 Solar', '🌐 Starlink 180M', '💧 Borehole', '🔐 Smart Lock'],
    amenities: 'UN Blue Zone Security • Starlink Satellite • Sauna Access'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('EXPLORE'); // EXPLORE, KEY, SLA, PROFILE
  const [currency, setCurrency] = useState('GHS'); // GHS, USD, NGN
  const [activeCity, setActiveCity] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Smart Lock State
  const [lockStatus, setLockStatus] = useState('LOCKED'); // LOCKED, UNLOCKING, UNLOCKED
  
  // SLA Outage State
  const [outageReported, setOutageReported] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(7200); // 2 hours

  useEffect(() => {
    let timer;
    if (outageReported && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [outageReported, timeLeftSeconds]);

  const formatPrice = (priceGhs) => {
    if (currency === 'USD') return `$${Math.round(priceGhs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(priceGhs * 105).toLocaleString()}`;
    return `GHS ${priceGhs.toLocaleString()}`;
  };

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUnlockDoor = () => {
    setLockStatus('UNLOCKING');
    setTimeout(() => {
      setLockStatus('UNLOCKED');
      setTimeout(() => {
        setLockStatus('LOCKED');
      }, 8000);
    }, 1200);
  };

  const [propertyList, setPropertyList] = useState(PROPERTIES);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [hostStep, setHostStep] = useState(1);
  const [hostSuccess, setHostSuccess] = useState(null);
  const [hostForm, setHostForm] = useState({
    title: '',
    city: 'Accra',
    neighborhood: 'Cantonments',
    w3w: '///luxury.stay.flex',
    priceGhs: 4500,
    solar: true,
    starlink: true,
    borehole: true,
    smartLock: true,
    caretakerPhone: '+233 55 123 4999',
    caretakerName: 'Kofi Mensah',
    photos: [] // ZERO preloaded pictures! Empty by default.
  });

  // Field Scout & AI Scanner Mobile States
  const [scoutWalletGhs, setScoutWalletGhs] = useState(4200);
  const [activeScout, setActiveScout] = useState('Ama Mensah (Accra Lead)');
  const [scoutSubTab, setScoutSubTab] = useState('TASKS'); // TASKS, WORKBENCH, AI_SCAN
  const [activeAuditTask, setActiveAuditTask] = useState({
    id: 'task-gh-01',
    title: 'Luxury Cantonments Penthouse',
    neighborhood: 'Cantonments, Accra',
    w3w: '///luxury.stay.cantonments',
    host: 'Kwesi Appiah (+233 24 555 1212)',
    bountyGhs: 750
  });
  const [auditTelemetry, setAuditTelemetry] = useState({
    atsSwitchoverSeconds: 6.2,
    generatorNoiseDb: 38,
    starlinkMbps: 185,
    boreholeTdsPpm: 65,
    smartLockBattery: 94
  });
  const [scoutCertifiedSuccess, setScoutCertifiedSuccess] = useState(null);
  const [mobileAiScanning, setMobileAiScanning] = useState(false);
  const [mobileAiScanResult, setMobileAiScanResult] = useState(null);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        // Fallback photo sample
        const fallbackUrls = [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
        ];
        const nextUrl = fallbackUrls[hostForm.photos.length % fallbackUrls.length];
        setHostForm(prev => ({
          ...prev,
          photos: [...prev.photos, { uri: nextUrl, label: `Property Photo #${prev.photos.length + 1}` }]
        }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPics = result.assets.map((asset, i) => ({
          uri: asset.uri,
          label: `Property Photo #${hostForm.photos.length + i + 1}`
        }));
        setHostForm(prev => ({ ...prev, photos: [...prev.photos, ...newPics] }));
      }
    } catch (err) {
      console.log('Image picker error:', err);
      // Fallback
      setHostForm(prev => ({
        ...prev,
        photos: [...prev.photos, { uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80', label: `Property Photo #${prev.photos.length + 1}` }]
      }));
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert('Camera permission is required to take equipment photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setHostForm(prev => ({
          ...prev,
          photos: [...prev.photos, { uri: result.assets[0].uri, label: `Equipment Photo #${prev.photos.length + 1}` }]
        }));
      }
    } catch (err) {
      console.log('Camera capture error:', err);
    }
  };

  const handleHostSubmit = () => {
    const badges = [];
    if (hostForm.solar) badges.push('⚡ 24/7 Solar');
    if (hostForm.starlink) badges.push('🌐 Starlink 180M');
    if (hostForm.borehole) badges.push('💧 Borehole');
    if (hostForm.smartLock) badges.push('🔐 Smart Lock');

    const newProp = {
      id: Date.now(),
      title: hostForm.title || `${hostForm.neighborhood} Luxury Residence`,
      city: `${hostForm.city}, ${hostForm.city === 'Accra' ? 'Ghana' : hostForm.city === 'Lagos' ? 'Nigeria' : 'Kenya'}`,
      neighborhood: hostForm.neighborhood,
      priceGhs: Number(hostForm.priceGhs) || 4500,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      rating: 5.0,
      scout: hostForm.city === 'Accra' ? 'Ama (Senior Flex Guide)' : hostForm.city === 'Lagos' ? 'Chinedu (Lagos Lead)' : 'Njeri (Nairobi Lead)',
      badges: badges.length ? badges : ['⚡ 24/7 Solar', '🌐 Starlink 180M'],
      amenities: 'ATS < 6s • 38 dB Quiet • Dedicated Standing Desk'
    };

    setPropertyList(prev => [newProp, ...prev]);
    setHostSuccess({
      title: newProp.title,
      scout: newProp.scout,
      liftGhs: Math.round(newProp.priceGhs * 1.43),
      surgeGhs: Math.round(newProp.priceGhs * 1.43 * 1.85)
    });
  };

  const filteredProperties = propertyList.filter(p => {
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = activeCity === 'All' || p.city.toLowerCase().includes(activeCity.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.badges.some(b => b.includes(activeFilter));
    return matchesSearch && matchesCity && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Mobile Top Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLogoText}>FL</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Flex-Living</Text>
            <Text style={styles.brandSubtitle}>Verified Stays & SLA Guarantee</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Host Property Button */}
          <TouchableOpacity
            onPress={() => {
              setHostSuccess(null);
              setHostStep(1);
              setIsHostModalOpen(true);
            }}
            style={styles.hostHeaderBtn}
          >
            <Text style={styles.hostHeaderBtnText}>+ Host</Text>
          </TouchableOpacity>

          {/* Scout Mode Header Button */}
          <TouchableOpacity
            onPress={() => setActiveTab('SCOUT')}
            style={[
              styles.hostHeaderBtn,
              {
                backgroundColor: activeTab === 'SCOUT' ? '#E9A319' : '#0F2537',
                borderColor: '#E9A319'
              }
            ]}
          >
            <Text style={[styles.hostHeaderBtnText, { color: activeTab === 'SCOUT' ? '#0B1B26' : '#E9A319' }]}>
              🧭 Scout
            </Text>
          </TouchableOpacity>

          {/* Currency Switcher */}
          <View style={styles.currencyPill}>
            {['GHS', 'USD', 'NGN'].map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setCurrency(c)}
                style={[styles.currencyBtn, currency === c && styles.currencyBtnActive]}
              >
                <Text style={[styles.currencyBtnText, currency === c && styles.currencyBtnTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Screen Content */}
      <View style={{ flex: 1 }}>
        {/* TAB 1: EXPLORE / DISCOVERY */}
        {activeTab === 'EXPLORE' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Text style={{ fontSize: 16 }}>🔍</Text>
              <TextInput
                placeholder="Search Cantonments, Lekki, Kilimani..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={{ color: '#94A3B8', fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* City Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {['All', 'Accra', 'Lagos', 'Nairobi'].map(city => (
                <TouchableOpacity
                  key={city}
                  onPress={() => setActiveCity(city)}
                  style={[styles.filterChip, activeCity === city && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, activeCity === city && styles.filterChipTextActive]}>
                    📍 {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Infrastructure Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {['All', 'Solar', 'Starlink', 'Borehole', 'Smart Lock'].map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  style={[styles.infraChip, activeFilter === f && styles.infraChipActive]}
                >
                  <Text style={[styles.infraChipText, activeFilter === f && styles.infraChipTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Listing Cards */}
            {filteredProperties.map(prop => (
              <View key={prop.id} style={styles.card}>
                <Image source={{ uri: prop.image }} style={styles.cardImage} />
                <View style={styles.scoutBadge}>
                  <Text style={styles.scoutBadgeText}>✓ 200+ Point Audited</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {prop.rating}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardCity}>{prop.city}</Text>
                  <Text style={styles.cardTitle}>{prop.title}</Text>
                  
                  <View style={styles.badgeRow}>
                    {prop.badges.map((b, idx) => (
                      <View key={idx} style={styles.amenityBadge}>
                        <Text style={styles.amenityBadgeText}>{b}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardPrice}>
                        {formatPrice(prop.priceGhs)}
                        <Text style={styles.perMonth}> / mo</Text>
                      </Text>
                      <Text style={styles.flexAdvanceEligible}>🚀 Flex-Advance Eligible</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.bookBtn}
                      onPress={() => setActiveTab('KEY')}
                    >
                      <Text style={styles.bookBtnText}>View Stay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* TAB 2: SMART DIGITAL KEY */}
        {activeTab === 'KEY' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.heroCardDark}>
              <Text style={styles.heroTag}>CURRENT RESIDENCE</Text>
              <Text style={styles.heroTitle}>Luxury Cantonments Apartment</Text>
              <Text style={styles.heroSubtitle}>Unit 402 • Accra, Ghana</Text>

              {/* Digital Lock Controller */}
              <View style={styles.lockContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleUnlockDoor}
                  disabled={lockStatus === 'UNLOCKING'}
                  style={[
                    styles.lockButton,
                    lockStatus === 'UNLOCKED' ? styles.lockButtonUnlocked : styles.lockButtonLocked
                  ]}
                >
                  {lockStatus === 'UNLOCKING' ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={{ fontSize: 42 }}>{lockStatus === 'UNLOCKED' ? '🔓' : '🔒'}</Text>
                      <Text style={styles.lockButtonLabel}>
                        {lockStatus === 'UNLOCKED' ? 'DOOR OPEN' : 'TAP TO UNLOCK'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.lockHint}>
                  {lockStatus === 'UNLOCKED' 
                    ? 'Door unlocked! Auto-relocks in 8 seconds.'
                    : 'NFC & Encrypted BLE Handshake Ready'}
                </Text>
              </View>

              {/* Lock Battery & Security Status */}
              <View style={styles.lockMetaRow}>
                <View style={styles.lockMetaItem}>
                  <Text style={styles.lockMetaLabel}>Lock Battery</Text>
                  <Text style={styles.lockMetaVal}>94% (Lithium)</Text>
                </View>
                <View style={styles.lockMetaItem}>
                  <Text style={styles.lockMetaLabel}>Encryption</Text>
                  <Text style={styles.lockMetaVal}>AES-256 Bit</Text>
                </View>
                <View style={styles.lockMetaItem}>
                  <Text style={styles.lockMetaLabel}>Access Log</Text>
                  <Text style={styles.lockMetaVal}>3 entries today</Text>
                </View>
              </View>
            </View>

            {/* Fast WiFi Credentials */}
            <View style={styles.wifiCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F3460' }}>🌐 Starlink WiFi Access</Text>
                <View style={styles.livePill}>
                  <Text style={styles.livePillText}>180 Mbps</Text>
                </View>
              </View>
              <Text style={styles.wifiText}>SSID: <Text style={{ fontWeight: '700' }}>FlexLiving-Cantonments-5G</Text></Text>
              <Text style={styles.wifiText}>Pass: <Text style={{ fontWeight: '700' }}>Starlink@Accra2026</Text></Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 3: SLA & 2-HOUR TIMER */}
        {activeTab === 'SLA' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Geofence Verification Status */}
            <View style={styles.geofenceCard}>
              <Text style={{ fontSize: 20 }}>📍</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '700', color: '#0F3460', fontSize: 14 }}>Geofence: Cantonments, Accra</Text>
                <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '600' }}>✓ Verified: 38m from property (&lt; 500m)</Text>
              </View>
            </View>

            {/* SLA Active Breach Status */}
            {outageReported ? (
              <View style={styles.activeBreachCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 28, marginRight: 10 }}>⏱️</Text>
                  <View>
                    <Text style={{ color: '#E94560', fontWeight: '800', fontSize: 16 }}>2-HOUR SLA COUNTDOWN ACTIVE</Text>
                    <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 12 }}>Automated Host Escrow Guarantee</Text>
                  </View>
                </View>

                {/* Live Countdown Clock */}
                <View style={styles.timerBox}>
                  <Text style={styles.timerDisplay}>{formatTime(timeLeftSeconds)}</Text>
                  <Text style={styles.timerSubtext}>Time remaining until host penalty deduction</Text>
                </View>

                <View style={styles.escrowBox}>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 18 }}>
                    If power/internet is not restored within 2 hours, <Text style={{ fontWeight: 'bold', color: '#E9A319' }}>$35.00</Text> will be automatically transferred from the host's escrow to your account.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.cancelClaimBtn}
                  onPress={() => setOutageReported(false)}
                >
                  <Text style={styles.cancelClaimText}>Cancel Claim (Power Restored)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.reportCard}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🔌</Text>
                <Text style={styles.reportTitle}>Experiencing an Outage?</Text>
                <Text style={styles.reportSubtitle}>
                  Grid blackouts or fibre cuts? Tap below to start an automated SLA resolution.
                </Text>

                <TouchableOpacity 
                  style={styles.reportButton}
                  onPress={() => { setOutageReported(true); setTimeLeftSeconds(7200); }}
                >
                  <Text style={styles.reportButtonText}>Report Outage & Start 2-Hr Timer</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SLA Policy Summary */}
            <View style={styles.policyCard}>
              <Text style={{ fontWeight: '700', color: '#0F3460', marginBottom: 8, fontSize: 14 }}>99.5% Uptime Contract Guarantee</Text>
              <Text style={{ color: '#64748B', fontSize: 13, lineHeight: 18 }}>
                • 15% of all host payouts are retained in the Flex Escrow Reserve.{'\n'}
                • Field Scouts verify ATS switchover (&lt; 8 seconds) and borehole backup.{'\n'}
                • Caretakers submit daily WhatsApp pulse checks every morning.
              </Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: FLEX-ADVANCE PROFILE & KYC */}
        {activeTab === 'PROFILE' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* User KYC Card */}
            <View style={styles.kycCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatarCircle}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>KM</Text>
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F3460' }}>Kofi Mensah</Text>
                  <Text style={{ color: '#64748B', fontSize: 13 }}>+233 55 000 0001</Text>
                </View>
              </View>

              <View style={styles.tierPill}>
                <Text style={styles.tierPillText}>✓ Tier 2 Verified (Ghana Card: GHA-712839120-1)</Text>
              </View>
            </View>

            {/* Flex-Advance Credit Limit Card */}
            <View style={styles.creditCard}>
              <Text style={styles.creditTag}>FLEX-ADVANCE RENT FACILITY</Text>
              <Text style={styles.creditAmount}>GHS 24,000</Text>
              <Text style={styles.creditSubtext}>Approved Limit (40% Max Debt-to-Income)</Text>

              <View style={styles.creditDivider} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.creditStatLabel}>Monthly Repayment</Text>
                  <Text style={styles.creditStatVal}>GHS 4,000 / mo</Text>
                </View>
                <View>
                  <Text style={styles.creditStatLabel}>Upfront Cash Retained</Text>
                  <Text style={[styles.creditStatVal, { color: '#10B981' }]}>GHS 92,000 Saved</Text>
                </View>
              </View>
            </View>

            {/* Employer Payroll Deduction */}
            <View style={styles.payrollCard}>
              <Text style={{ fontWeight: '700', color: '#0F3460', marginBottom: 4 }}>Corporate Payroll Deduction</Text>
              <Text style={{ color: '#64748B', fontSize: 13 }}>Employer: Stanbic Bank Ghana Ltd</Text>
              <Text style={{ color: '#10B981', fontSize: 12, marginTop: 4, fontWeight: '600' }}>● Auto-deducted on 28th of every month</Text>
            </View>
          </ScrollView>
        )}

        {/* TAB 5: FIELD SCOUT PORTAL & 200-POINT AUDIT */}
        {activeTab === 'SCOUT' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Scout Header & Active Agent Selector */}
            <View style={{
              backgroundColor: '#0F3460',
              borderRadius: 20,
              padding: 16,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: '#E9A319'
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 24 }}>🧭</Text>
                  <View>
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Field Scout Portal</Text>
                    <Text style={{ color: '#E9A319', fontSize: 11, fontWeight: '700' }}>200-Point Physical Verification</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: 'rgba(233,163,25,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: '#E9A319', fontWeight: '800', fontSize: 10 }}>ACTIVE AGENT</Text>
                </View>
              </View>

              {/* Scout Selector Pills */}
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                {[
                  { name: 'Ama (Accra)', full: 'Ama Mensah (Accra Lead)' },
                  { name: 'Chinedu (Lagos)', full: 'Chinedu Okafor (Lagos Lead)' },
                  { name: 'Njeri (Nairobi)', full: 'Njeri Kamau (Nairobi Lead)' }
                ].map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveScout(s.full)}
                    style={{
                      flex: 1,
                      backgroundColor: activeScout === s.full ? '#E9A319' : 'rgba(255,255,255,0.1)',
                      paddingVertical: 6,
                      borderRadius: 10,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      color: activeScout === s.full ? '#0B1B26' : '#FFFFFF',
                      fontSize: 10,
                      fontWeight: '700'
                    }}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Scout Bounty Wallet Card */}
              <View style={{
                backgroundColor: 'rgba(16,185,129,0.15)',
                borderWidth: 1,
                borderColor: '#10B981',
                borderRadius: 14,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Scout Bounty Balance</Text>
                  <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 18 }}>
                    GHS {scoutWalletGhs.toLocaleString()}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>+GHS 750 ($50) per certified audit</Text>
                </View>
                <TouchableOpacity
                  onPress={() => alert(`Initiating MTN Mobile Money cashout of GHS ${scoutWalletGhs.toLocaleString()} to ${activeScout}...`)}
                  style={{
                    backgroundColor: '#10B981',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>MoMo Cashout</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sub-Navigation Switcher */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
              {[
                { id: 'TASKS', label: '📋 Task Queue' },
                { id: 'WORKBENCH', label: '🛠️ 200-Pt Audit' },
                { id: 'AI_SCAN', label: '🤖 AI Scanner' }
              ].map(st => (
                <TouchableOpacity
                  key={st.id}
                  onPress={() => setScoutSubTab(st.id)}
                  style={{
                    flex: 1,
                    backgroundColor: scoutSubTab === st.id ? '#0F3460' : '#FFFFFF',
                    paddingVertical: 8,
                    borderRadius: 12,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: scoutSubTab === st.id ? '#0F3460' : '#E2E8F0'
                  }}
                >
                  <Text style={{
                    color: scoutSubTab === st.id ? '#FFFFFF' : '#64748B',
                    fontWeight: '700',
                    fontSize: 11
                  }}>
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SUBTAB 1: INSPECTION TASKS QUEUE */}
            {scoutSubTab === 'TASKS' && (
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' }}>
                  Properties Awaiting Physical Verification
                </Text>
                {[
                  {
                    id: 'task-gh-01',
                    title: 'Luxury Cantonments Penthouse',
                    city: 'Accra, Ghana',
                    neighborhood: 'Cantonments',
                    w3w: '///luxury.stay.cantonments',
                    host: 'Kwesi Appiah (+233 24 555 1212)',
                    bountyGhs: 750,
                    status: 'PENDING_AUDIT'
                  },
                  {
                    id: 'task-gh-02',
                    title: 'Airport Residential Executive Villa',
                    city: 'Accra, Ghana',
                    neighborhood: 'Airport Residential',
                    w3w: '///airport.executive.villa',
                    host: 'Adwoa Boateng (+233 50 888 3434)',
                    bountyGhs: 750,
                    status: 'PENDING_AUDIT'
                  },
                  {
                    id: 'task-ng-01',
                    title: 'Banana Island Waterfront Villa',
                    city: 'Lagos, Nigeria',
                    neighborhood: 'Ikoyi (Banana Island)',
                    w3w: '///banana.waterfront.haven',
                    host: 'Emeka Nwosu (+234 80 123 4567)',
                    bountyGhs: 750,
                    status: 'CERTIFIED'
                  }
                ].map(task => (
                  <View key={task.id} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#E2E8F0'
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#E9A319' }}>{task.city} • {task.w3w}</Text>
                      <View style={{
                        backgroundColor: task.status === 'CERTIFIED' ? 'rgba(16,185,129,0.1)' : 'rgba(233,163,25,0.1)',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6
                      }}>
                        <Text style={{
                          fontSize: 9,
                          fontWeight: '800',
                          color: task.status === 'CERTIFIED' ? '#10B981' : '#E9A319'
                        }}>
                          ● {task.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F3460', marginBottom: 4 }}>
                      {task.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>
                      Host: {task.host} • Bounty: <Text style={{ color: '#10B981', fontWeight: 'bold' }}>GHS {task.bountyGhs}</Text>
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setActiveAuditTask(task);
                        setScoutSubTab('WORKBENCH');
                        setScoutCertifiedSuccess(null);
                      }}
                      style={{
                        backgroundColor: task.status === 'CERTIFIED' ? '#F1F5F9' : '#0F3460',
                        paddingVertical: 8,
                        borderRadius: 10,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{
                        color: task.status === 'CERTIFIED' ? '#64748B' : '#FFFFFF',
                        fontWeight: '800',
                        fontSize: 11
                      }}>
                        {task.status === 'CERTIFIED' ? '✓ Audit Certified (+43% Lift)' : 'Conduct 200-Point Audit →'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* SUBTAB 2: 200-POINT AUDIT WORKBENCH */}
            {scoutSubTab === 'WORKBENCH' && (
              <View>
                {/* Active Property Banner */}
                <View style={{
                  backgroundColor: 'rgba(233,163,25,0.1)',
                  borderWidth: 1,
                  borderColor: '#E9A319',
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 12
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#E9A319' }}>ACTIVE AUDIT TICKET</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F3460', marginTop: 2 }}>{activeAuditTask.title}</Text>
                  <Text style={{ fontSize: 11, color: '#64748B' }}>📍 {activeAuditTask.w3w} • Host: {activeAuditTask.host}</Text>
                </View>

                {scoutCertifiedSuccess ? (
                  <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 20,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#10B981'
                  }}>
                    <Text style={{ fontSize: 40, marginBottom: 8 }}>🏆</Text>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F3460', textAlign: 'center' }}>
                      Property Certified Successfully!
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 14 }}>
                      200-point physical verification confirmed. Gold Flex-Trust badges awarded & live catalog updated.
                    </Text>

                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, width: '100%', marginBottom: 14 }}>
                      <Text style={{ fontSize: 11, color: '#10B981', fontWeight: 'bold' }}>✓ ⚡ 24/7 Solar Backup (+18% Yield)</Text>
                      <Text style={{ fontSize: 11, color: '#10B981', fontWeight: 'bold', marginTop: 2 }}>✓ 🌐 Starlink Satellite (+12% Yield)</Text>
                      <Text style={{ fontSize: 11, color: '#10B981', fontWeight: 'bold', marginTop: 2 }}>✓ 💧 Pure Borehole Reserve (+8% Yield)</Text>
                      <Text style={{ fontSize: 11, color: '#10B981', fontWeight: 'bold', marginTop: 2 }}>✓ 🔐 Keyless Smart Deadbolt (+5% Yield)</Text>
                      <View style={{ borderTopWidth: 1, borderColor: '#E2E8F0', marginTop: 8, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 11, color: '#64748B' }}>Scout Bounty Credited:</Text>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#10B981' }}>+GHS 750.00</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => setScoutSubTab('TASKS')}
                      style={{
                        backgroundColor: '#0F3460',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 12
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>Back to Task Queue</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {/* Section 1: Power Switchover */}
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 12, marginBottom: 6 }}>
                        ⚡ Section A: Automatic Switchover Test (&lt; 8s)
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#64748B' }}>Multi-Meter ATS Time:</Text>
                        <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontWeight: '800', color: '#10B981', fontSize: 12 }}>6.2 Seconds (PASSED)</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>
                        Victron MultiPlus-II 10kVA with LiFePO4 batteries verified.
                      </Text>
                    </View>

                    {/* Section 2: Starlink Throughput */}
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 12, marginBottom: 6 }}>
                        🌐 Section B: Satellite Internet Probe (&gt; 50 Mbps)
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#64748B' }}>Measured Download Speed:</Text>
                        <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontWeight: '800', color: '#10B981', fontSize: 12 }}>185 Mbps / 26ms (PASSED)</Text>
                        </View>
                      </View>
                    </View>

                    {/* Section 3: Borehole Purity */}
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 12, marginBottom: 6 }}>
                        💧 Section C: Water Purity & Reserve (&lt; 150 PPM)
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#64748B' }}>TDS Probe Reading:</Text>
                        <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontWeight: '800', color: '#10B981', fontSize: 12 }}>65 PPM (Pure Drinking)</Text>
                        </View>
                      </View>
                    </View>

                    {/* Section 4: Smart Lock */}
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 12, marginBottom: 6 }}>
                        🔐 Section D: Digital Smart Deadbolt
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#64748B' }}>AES-256 Cloud Lock Battery:</Text>
                        <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontWeight: '800', color: '#10B981', fontSize: 12 }}>94% Battery Level</Text>
                        </View>
                      </View>
                    </View>

                    {/* Certify Button */}
                    <TouchableOpacity
                      onPress={() => {
                        setScoutWalletGhs(prev => prev + 750);
                        setScoutCertifiedSuccess(true);
                      }}
                      style={{
                        backgroundColor: '#E94560',
                        paddingVertical: 14,
                        borderRadius: 14,
                        alignItems: 'center',
                        shadowColor: '#E94560',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>
                        🏆 Certify Audit & Issue Flex-Trust Badges (+43% Lift)
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* SUBTAB 3: AI VISION SCANNER */}
            {scoutSubTab === 'AI_SCAN' && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 20 }}>🤖</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F3460' }}>
                    AI Vision Property Scanner
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
                  Computer vision model verifies inverter models, satellite antennas, and water reserve in 5 seconds.
                </Text>

                {/* Simulated Camera Viewfinder */}
                <View style={{
                  height: 180,
                  backgroundColor: '#0B1B26',
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: 14,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80' }}
                    style={{ width: '100%', height: '100%', opacity: 0.8 }}
                  />
                  {mobileAiScanning ? (
                    <View style={{ position: 'absolute', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#E9A319" />
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12, marginTop: 8 }}>
                        Running Multi-Modal OCR Heuristics...
                      </Text>
                    </View>
                  ) : mobileAiScanResult ? (
                    <View style={{
                      position: 'absolute',
                      inset: 12,
                      borderWidth: 2,
                      borderColor: '#10B981',
                      borderRadius: 10,
                      padding: 8,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{ backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 10 }}>95% AI CONFIDENCE</Text>
                      </View>
                      <View style={{ backgroundColor: 'rgba(15,52,96,0.85)', padding: 6, borderRadius: 6 }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 10 }}>Victron MultiPlus-II 10kVA Detected</Text>
                        <Text style={{ color: '#10B981', fontSize: 9 }}>Switchover: 0.008s • LiFePO4 Battery Pack</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{ position: 'absolute', alignItems: 'center' }}>
                      <Text style={{ fontSize: 32, marginBottom: 4 }}>📷</Text>
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>Point camera at equipment</Text>
                    </View>
                  )}
                </View>

                {mobileAiScanResult && (
                  <View style={{ backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                    <Text style={{ color: '#10B981', fontWeight: '800', fontSize: 12 }}>
                      ✓ AI Pre-Certification Approved (Fast-Track 5 Min)
                    </Text>
                    <Text style={{ color: '#0F3460', fontSize: 11, marginTop: 2 }}>
                      Quality Score: 100/100 • Dynamic Yield Lift: +43% Verified Premium
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  disabled={mobileAiScanning}
                  onPress={() => {
                    setMobileAiScanning(true);
                    setMobileAiScanResult(null);
                    setTimeout(() => {
                      setMobileAiScanning(false);
                      setMobileAiScanResult({
                        confidence: 95,
                        tier: 'AI_CERTIFIED_GOLD',
                        lift: '+43%'
                      });
                    }, 1800);
                  }}
                  style={{
                    backgroundColor: '#E94560',
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                    {mobileAiScanning ? 'Analyzing Equipment...' : '📸 Run Live AI Equipment Scan'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Modern 5-Tab Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('EXPLORE')}
        >
          <Text style={[styles.navIcon, activeTab === 'EXPLORE' && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'EXPLORE' && styles.navTextActive]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('SCOUT')}
        >
          <Text style={[styles.navIcon, activeTab === 'SCOUT' && styles.navIconActive]}>🧭</Text>
          <Text style={[styles.navText, activeTab === 'SCOUT' && styles.navTextActive]}>Scout Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('KEY')}
        >
          <Text style={[styles.navIcon, activeTab === 'KEY' && styles.navIconActive]}>🔐</Text>
          <Text style={[styles.navText, activeTab === 'KEY' && styles.navTextActive]}>Smart Key</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('SLA')}
        >
          <Text style={[styles.navIcon, activeTab === 'SLA' && styles.navIconActive]}>⚡</Text>
          <Text style={[styles.navText, activeTab === 'SLA' && styles.navTextActive]}>SLA & Outage</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('PROFILE')}
        >
          <Text style={[styles.navIcon, activeTab === 'PROFILE' && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navText, activeTab === 'PROFILE' && styles.navTextActive]}>Flex-Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Host Onboarding Modal */}
      <Modal visible={isHostModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 18 }}>🏡</Text>
                  <Text style={styles.modalTitle}>List Your Property</Text>
                </View>
                <Text style={styles.modalSubtitle}>4-Step Verified African Host Pipeline</Text>
              </View>
              <TouchableOpacity onPress={() => setIsHostModalOpen(false)} style={styles.modalCloseBtn}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#64748B' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {hostSuccess ? (
              <ScrollView style={{ padding: 20 }}>
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <View style={styles.successIconCircle}>
                    <Text style={{ fontSize: 32, color: '#10B981' }}>✓</Text>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F3460', textAlign: 'center', marginTop: 8 }}>
                    Property Submitted for Verification!
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4 }}>
                    Field Scout <Text style={{ fontWeight: 'bold', color: '#0F3460' }}>{hostSuccess.scout}</Text> has been dispatched to perform the 200-point physical inspection within 48 hours.
                  </Text>
                </View>

                {/* AI Yield Estimate Card */}
                <View style={styles.yieldCard}>
                  <Text style={styles.yieldCardTitle}>💰 AI DYNAMIC YIELD PROJECTION</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <View>
                      <Text style={styles.yieldLabel}>Baseline Rent</Text>
                      <Text style={styles.yieldVal}>GHS {hostForm.priceGhs.toLocaleString()}</Text>
                    </View>
                    <View>
                      <Text style={[styles.yieldLabel, { color: '#10B981' }]}>+43% Verified Lift</Text>
                      <Text style={[styles.yieldVal, { color: '#10B981' }]}>GHS {hostSuccess.liftGhs.toLocaleString()}</Text>
                    </View>
                    <View>
                      <Text style={[styles.yieldLabel, { color: '#E94560' }]}>Dec Detty Surge</Text>
                      <Text style={[styles.yieldVal, { color: '#E94560' }]}>GHS {hostSuccess.surgeGhs.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setIsHostModalOpen(false);
                    setActiveTab('EXPLORE');
                  }}
                  style={styles.primaryModalBtn}
                >
                  <Text style={styles.primaryModalBtnText}>View In Live Explore Feed</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <ScrollView style={{ padding: 20 }}>
                {/* Stepper Progress */}
                <View style={styles.stepperContainer}>
                  {[1, 2, 3, 4].map(stepNum => (
                    <View key={stepNum} style={{ flex: 1, alignItems: 'center' }}>
                      <View style={[styles.stepperBar, hostStep >= stepNum && styles.stepperBarActive]} />
                      <Text style={[styles.stepperLabel, hostStep === stepNum && styles.stepperLabelActive]}>
                        {stepNum === 1 ? 'Details' : stepNum === 2 ? 'Badges' : stepNum === 3 ? 'Photos' : 'Scout'}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* STEP 1: Title & Location */}
                {hostStep === 1 && (
                  <View>
                    <Text style={styles.stepHeader}>Step 1: Property Identity</Text>
                    
                    <Text style={styles.fieldLabel}>Property Title</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Cantonments Luxury Penthouse with Solar"
                      value={hostForm.title}
                      onChangeText={t => setHostForm({ ...hostForm, title: t })}
                    />

                    <Text style={styles.fieldLabel}>City Hub</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                      {['Accra', 'Lagos', 'Nairobi'].map(city => (
                        <TouchableOpacity
                          key={city}
                          onPress={() => setHostForm({ ...hostForm, city })}
                          style={[styles.cityPickerBtn, hostForm.city === city && styles.cityPickerBtnActive]}
                        >
                          <Text style={[styles.cityPickerText, hostForm.city === city && styles.cityPickerTextActive]}>
                            {city}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.fieldLabel}>Neighborhood</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Cantonments, Ikoyi, Kilimani"
                      value={hostForm.neighborhood}
                      onChangeText={t => setHostForm({ ...hostForm, neighborhood: t })}
                    />

                    <Text style={styles.fieldLabel}>📍 What3Words / Digital Address</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. ///luxury.stay.cantonments"
                      value={hostForm.w3w}
                      onChangeText={t => setHostForm({ ...hostForm, w3w: t })}
                    />

                    <TouchableOpacity onPress={() => setHostStep(2)} style={styles.primaryModalBtn}>
                      <Text style={styles.primaryModalBtnText}>Continue to Infrastructure →</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* STEP 2: Infrastructure Checkboxes */}
                {hostStep === 2 && (
                  <View>
                    <Text style={styles.stepHeader}>Step 2: Backup Infrastructure</Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
                      Select the systems installed. These will be load-tested by the Field Scout.
                    </Text>

                    {[
                      { key: 'solar', label: '⚡ 24/7 Solar Inverter (10kVA Victron/Deye)', badge: '+18% Price Lift' },
                      { key: 'starlink', label: '🌐 Starlink Gen 3 Satellite (180Mbps)', badge: '+12% Price Lift' },
                      { key: 'borehole', label: '💧 Deep Borehole & 5,000L Water Tank', badge: '+8% Price Lift' },
                      { key: 'smartLock', label: '🔐 Smart NFC/Digital Keypad Lock', badge: '+5% Price Lift' }
                    ].map(item => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setHostForm({ ...hostForm, [item.key]: !hostForm[item.key] })}
                        style={[styles.checkboxRow, hostForm[item.key] && styles.checkboxRowActive]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '700', color: '#0F3460', fontSize: 13 }}>{item.label}</Text>
                          <Text style={{ color: '#10B981', fontSize: 11, fontWeight: 'bold', marginTop: 2 }}>{item.badge}</Text>
                        </View>
                        <Text style={{ fontSize: 18 }}>{hostForm[item.key] ? '✅' : '⬜'}</Text>
                      </TouchableOpacity>
                    ))}

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                      <TouchableOpacity onPress={() => setHostStep(1)} style={styles.secondaryModalBtn}>
                        <Text style={styles.secondaryModalBtnText}>← Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setHostStep(3)} style={[styles.primaryModalBtn, { flex: 1 }]}>
                        <Text style={styles.primaryModalBtnText}>Continue to Photos →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* STEP 3: Photos & Infrastructure Proof */}
                {hostStep === 3 && (
                  <View>
                    <Text style={styles.stepHeader}>Step 3: Upload Photos & Proof</Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
                      Upload photos of your property and backup equipment. No photos are preloaded.
                    </Text>

                    {/* Dynamic Photo Grid (Empty by default) */}
                    {hostForm.photos.length === 0 ? (
                      <View style={{
                        backgroundColor: '#F8FAFC',
                        borderWidth: 2,
                        borderColor: '#CBD5E1',
                        borderStyle: 'dashed',
                        borderRadius: 16,
                        padding: 24,
                        alignItems: 'center',
                        marginBottom: 16
                      }}>
                        <Text style={{ fontSize: 36, marginBottom: 6 }}>🖼️</Text>
                        <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 14 }}>No photos added yet</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4 }}>
                          Tap below to browse your photo library or take photos of your space.
                        </Text>
                      </View>
                    ) : (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        {hostForm.photos.map((pic, idx) => (
                          <View key={idx} style={{
                            width: '48%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            overflow: 'hidden'
                          }}>
                            <View style={{ height: 85, position: 'relative' }}>
                              <Image source={{ uri: pic.uri || pic.url }} style={{ width: '100%', height: '100%' }} />
                              <TouchableOpacity
                                onPress={() => setHostForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))}
                                style={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  backgroundColor: 'rgba(233,69,96,0.9)',
                                  borderRadius: 10,
                                  paddingHorizontal: 6,
                                  paddingVertical: 2
                                }}
                              >
                                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>✕ Remove</Text>
                              </TouchableOpacity>
                            </View>
                            <Text style={{ padding: 6, fontSize: 11, fontWeight: '700', color: '#0F3460', textAlign: 'center' }}>
                              {pic.label || `Photo #${idx + 1}`}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Interactive Action Buttons for Real Photo Selection */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                      <TouchableOpacity
                        onPress={handlePickImage}
                        style={{
                          flex: 1,
                          backgroundColor: '#0F3460',
                          paddingVertical: 12,
                          borderRadius: 12,
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                          📁 Browse Library
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleTakePhoto}
                        style={{
                          flex: 1,
                          backgroundColor: '#E94560',
                          paddingVertical: 12,
                          borderRadius: 12,
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                          📸 Take Photo
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity onPress={() => setHostStep(2)} style={styles.secondaryModalBtn}>
                        <Text style={styles.secondaryModalBtnText}>← Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setHostStep(4)} style={[styles.primaryModalBtn, { flex: 1 }]}>
                        <Text style={styles.primaryModalBtnText}>Continue to Rent & Scout →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* STEP 4: Rent & Caretaker WhatsApp */}
                {hostStep === 4 && (
                  <View>
                    <Text style={styles.stepHeader}>Step 4: Base Rent & Caretaker Setup</Text>

                    <Text style={styles.fieldLabel}>Target Monthly Rent (GHS)</Text>
                    <TextInput
                      style={[styles.textInput, { fontSize: 18, fontWeight: '800', color: '#0F3460' }]}
                      keyboardType="numeric"
                      value={String(hostForm.priceGhs)}
                      onChangeText={t => setHostForm({ ...hostForm, priceGhs: Number(t) || 0 })}
                    />

                    <Text style={styles.fieldLabel}>Resident Caretaker Full Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Kofi Mensah"
                      value={hostForm.caretakerName}
                      onChangeText={t => setHostForm({ ...hostForm, caretakerName: t })}
                    />

                    <Text style={styles.fieldLabel}>📱 Caretaker WhatsApp Phone (Daily Morning Pulse)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="+233 55 123 4999"
                      value={hostForm.caretakerPhone}
                      onChangeText={t => setHostForm({ ...hostForm, caretakerPhone: t })}
                    />

                    <View style={styles.scoutNoticeBox}>
                      <Text style={{ fontWeight: '800', color: '#0F3460', fontSize: 12 }}>
                        🛡️ Certified Field Scout Dispatch
                      </Text>
                      <Text style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 15 }}>
                        Submitting will automatically assign an on-ground Scout ({hostForm.city === 'Accra' ? 'Ama' : hostForm.city === 'Lagos' ? 'Chinedu' : 'Njeri'}) to visit with an acoustic meter and power multi-meter.
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                      <TouchableOpacity onPress={() => setHostStep(2)} style={styles.secondaryModalBtn}>
                        <Text style={styles.secondaryModalBtnText}>← Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleHostSubmit} style={[styles.primaryModalBtn, { flex: 1, backgroundColor: '#E94560' }]}>
                        <Text style={styles.primaryModalBtnText}>🚀 Submit & Dispatch Scout</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Host Header Button
  hostHeaderBtn: {
    backgroundColor: '#0F3460',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E94560',
  },
  hostHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  // Host Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,27,38,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F3460',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stepperBar: {
    height: 4,
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 4,
  },
  stepperBarActive: {
    backgroundColor: '#E94560',
  },
  stepperLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  stepperLabelActive: {
    color: '#0F3460',
    fontWeight: '800',
  },
  stepHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F3460',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F3460',
    marginBottom: 12,
  },
  cityPickerBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cityPickerBtnActive: {
    backgroundColor: '#0F3460',
  },
  cityPickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  cityPickerTextActive: {
    color: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  checkboxRowActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16,185,129,0.04)',
  },
  scoutNoticeBox: {
    backgroundColor: '#F1F5F9',
    borderLeftWidth: 4,
    borderLeftColor: '#0F3460',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  primaryModalBtn: {
    backgroundColor: '#0F3460',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryModalBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryModalBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yieldCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 14,
    marginVertical: 14,
  },
  yieldCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  yieldLabel: {
    fontSize: 10,
    color: '#78350F',
    fontWeight: '600',
  },
  yieldVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0F3460',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3460',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  currencyPill: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2,
  },
  currencyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  currencyBtnActive: {
    backgroundColor: '#0F3460',
  },
  currencyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  currencyBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F3460',
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F3460',
    borderColor: '#0F3460',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  infraChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  infraChipActive: {
    backgroundColor: '#E94560',
  },
  infraChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  infraChipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F3460',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 190,
  },
  scoutBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoutBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3460',
  },
  cardBody: {
    padding: 14,
  },
  cardCity: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3460',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  amenityBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  amenityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#E94560',
  },
  perMonth: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  flexAdvanceEligible: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: '#0F3460',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  // Tab 2 Styles
  heroCardDark: {
    backgroundColor: '#0F3460',
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },
  heroTag: {
    color: '#E9A319',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    marginBottom: 20,
  },
  lockContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  lockButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
  },
  lockButtonLocked: {
    backgroundColor: 'rgba(233,69,96,0.2)',
    borderColor: '#E94560',
  },
  lockButtonUnlocked: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10B981',
  },
  lockButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    marginTop: 6,
  },
  lockHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  lockMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
  },
  lockMetaItem: {
    alignItems: 'center',
  },
  lockMetaLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  lockMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  wifiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  livePill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  wifiText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  // Tab 3 Styles
  geofenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3460',
    marginBottom: 6,
  },
  reportSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  reportButton: {
    backgroundColor: '#E94560',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  activeBreachCard: {
    backgroundColor: '#1A2238',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  timerBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E94560',
  },
  timerDisplay: {
    fontSize: 36,
    fontWeight: '900',
    color: '#E94560',
    fontFamily: 'Courier',
  },
  timerSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  escrowBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  cancelClaimBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelClaimText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  policyCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
  },
  // Tab 4 Styles
  kycCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F3460',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierPill: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tierPillText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
  },
  creditCard: {
    backgroundColor: '#0F3460',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },
  creditTag: {
    color: '#E9A319',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  creditAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  creditSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  creditDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  creditStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  creditStatVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  payrollCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  navTextActive: {
    color: '#E94560',
    fontWeight: '700',
  },
});
