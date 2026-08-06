import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Building, BookOpen, Cpu, Coffee } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function CampusMap() {
  const [locations, setLocations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.8151, 90.4256]); // Default center: IUB Bashundhara R/A Campus

  useEffect(() => {
    fetch('/api/campus/locations')
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        if (data.length > 0) setSelectedLocation(data[0]);
      })
      .catch(() => {
        const defaults = [
          {
            id: 'loc-1',
            name: 'Main Academic Building',
            category: 'academic',
            building_no: 'Building A',
            latitude: 23.777172,
            longitude: 90.399452,
            description: 'Houses CSE, EEE, and Civil Engineering Departments, Dean Office, and Central Lecture Halls.',
            floors: '1st - 8th Floor',
            image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'loc-2',
            name: 'Central Library & Resource Center',
            category: 'library',
            building_no: 'Building B',
            latitude: 23.77765,
            longitude: 90.3989,
            description: '3-story silent reading halls, digital e-library stations, discussion rooms, and journal archives.',
            floors: 'Ground - 3rd Floor',
            image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'loc-3',
            name: 'Advanced Computer Science Labs',
            category: 'lab',
            building_no: 'Annex 1',
            latitude: 23.7768,
            longitude: 90.4001,
            description: 'AI & Robotics Lab, Software Engineering Studio, Cybersecurity Center, and Networking Labs.',
            floors: '2nd & 3rd Floor',
            image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'loc-4',
            name: 'Campus Central Canteen & Cafe',
            category: 'canteen',
            building_no: 'Student Complex',
            latitude: 23.7781,
            longitude: 90.3999,
            description: 'Food court offering snacks, lunch, tea/coffee bar, and open-air student lounge.',
            floors: 'Ground Floor',
            image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
          }
        ];
        setLocations(defaults);
        setSelectedLocation(defaults[0]);
      });
  }, []);

  const categories = [
    { id: 'all', label: 'All Places', icon: MapPin },
    { id: 'academic', label: 'Academic', icon: Building },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'lab', label: 'Labs', icon: Cpu },
    { id: 'canteen', label: 'Canteen', icon: Coffee },
  ];

  const filteredLocations = locations.filter((loc) => {
    const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.building_no.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setMapCenter([loc.latitude, loc.longitude]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '600px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={20} color="#6366f1" /> Campus Explorer
          </h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search building, lab, canteen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: isSelected ? '#6366f1' : '#334155',
                  color: isSelected ? '#ffffff' : '#cbd5e1'
                }}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleSelectLocation(loc)}
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: selectedLocation?.id === loc.id ? 'rgba(99, 102, 241, 0.2)' : '#0f172a',
                border: selectedLocation?.id === loc.id ? '1px solid #6366f1' : '1px solid #1e293b',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#f8fafc' }}>{loc.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                📍 {loc.building_no} • {loc.floors}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <MapContainer
          center={mapCenter}
          zoom={16}
          style={{ width: '100%', height: '100%', minHeight: '450px', background: '#0f172a' }}
        >
          <ChangeView center={mapCenter} zoom={16} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{ click: () => setSelectedLocation(loc) }}
            >
              <Popup>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{loc.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{loc.building_no}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {selectedLocation && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #334155',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <img
              src={selectedLocation.image_url}
              alt={selectedLocation.name}
              style={{ width: '90px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', background: '#6366f1', color: '#fff' }}>
                {selectedLocation.category}
              </span>
              <h4 style={{ margin: '4px 0', fontSize: '1.05rem', color: '#fff', fontWeight: '700' }}>{selectedLocation.name}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>{selectedLocation.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
