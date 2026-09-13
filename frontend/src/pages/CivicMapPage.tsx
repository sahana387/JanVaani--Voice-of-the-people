import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api';
import { Ward, Policy } from '../types';
import { 
  MapPin, Building2, Layers, AlertCircle, 
  ArrowRight, ShieldCheck, Users, Compass, ChevronRight, X
} from 'lucide-react';

export const CivicMapPage: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [wardPolicies, setWardPolicies] = useState<any[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'zoning' | 'transit' | 'waste'>('all');

  useEffect(() => {
    const loadWards = async () => {
      try {
        const res = await api.getWards();
        setWards(res.wards || []);
        if (res.wards && res.wards.length > 0) {
          handleSelectWard(res.wards[0]);
        }
      } catch (err) {
        console.error("Failed to load map wards", err);
      }
    };
    loadWards();
  }, []);

  const handleSelectWard = async (ward: Ward) => {
    setSelectedWard(ward);
    setLoadingPolicies(true);
    try {
      const res = await api.getWardPolicies(ward.ward_number);
      setWardPolicies(res.policies || []);
    } catch (err) {
      console.error(err);
      setWardPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

  // Pre-defined realistic ward polygon coordinates [lat, lng]
  const getWardCoordinates = (wardNumber: number): [number, number][] => {
    switch (wardNumber) {
      case 80: // Indiranagar
        return [[12.970, 77.632], [12.986, 77.633], [12.988, 77.652], [12.972, 77.650]];
      case 151: // Koramangala
        return [[12.925, 77.615], [12.945, 77.616], [12.946, 77.638], [12.926, 77.636]];
      case 174: // HSR Layout
        return [[12.902, 77.632], [12.922, 77.634], [12.924, 77.658], [12.903, 77.656]];
      case 84: // Whitefield
        return [[12.955, 77.735], [12.985, 77.736], [12.986, 77.768], [12.956, 77.765]];
      case 45: // Malleshwaram
        return [[12.993, 77.555], [13.014, 77.556], [13.015, 77.575], [12.994, 77.573]];
      case 168: // Jayanagar
        return [[12.920, 77.573], [12.940, 77.574], [12.941, 77.595], [12.921, 77.593]];
      default:
        return [[12.970, 77.632], [12.986, 77.633], [12.988, 77.652], [12.972, 77.650]];
    }
  };

  const getWardColor = (wardNumber: number) => {
    if (selectedWard?.ward_number === wardNumber) return '#2563eb'; // active blue
    switch (wardNumber) {
      case 80: return '#f97316'; // orange
      case 151: return '#8b5cf6'; // purple
      case 174: return '#059669'; // emerald
      case 84: return '#0284c7'; // sky
      case 45: return '#d97706'; // amber
      case 168: return '#e11d48'; // rose
      default: return '#3b82f6';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>GIS Municipal Spatial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interactive Civic Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Click on any municipal ward boundary or select from the list to see verified policy impacts, zoning allowances, and infrastructure corridors.
          </p>
        </div>

        {/* Layer Filter Chips */}
        <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded-2xl border border-white/15 backdrop-blur-sm self-start md:self-center">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'all' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-200 hover:text-white'
            }`}
          >
            All Layers
          </button>
          <button
            onClick={() => setActiveLayer('zoning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'zoning' ? 'bg-amber-400 text-slate-900 shadow-md' : 'text-slate-200 hover:text-white'
            }`}
          >
            Zoning 24m Zones
          </button>
          <button
            onClick={() => setActiveLayer('transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLayer === 'transit' ? 'bg-emerald-400 text-slate-900 shadow-md' : 'text-slate-200 hover:text-white'
            }`}
          >
            Transit Corridors
          </button>
        </div>
      </div>

      {/* Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaflet Map Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm h-[560px] relative overflow-hidden">
          <MapContainer
            center={[12.9550, 77.6350]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {wards.map((ward) => {
              const coords = getWardCoordinates(ward.ward_number);
              const color = getWardColor(ward.ward_number);
              const isSelected = selectedWard?.ward_number === ward.ward_number;

              return (
                <Polygon
                  key={ward.ward_number}
                  positions={coords}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.45 : 0.25,
                    weight: isSelected ? 3.5 : 2
                  }}
                  eventHandlers={{
                    click: () => handleSelectWard(ward)
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <strong className="text-slate-900 font-bold block">
                        Ward {ward.ward_number}: {ward.name}
                      </strong>
                      <span className="text-slate-600 block">Zone: {ward.zone}</span>
                      <button
                        onClick={() => handleSelectWard(ward)}
                        className="text-[11px] font-bold text-blue-600 hover:underline pt-1 block"
                      >
                        Inspect Impacted Policies →
                      </button>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>

          {/* Floating Ward Quick Buttons */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-wrap gap-1.5 max-w-md">
            {wards.map((w) => (
              <button
                key={w.ward_number}
                onClick={() => handleSelectWard(w)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  selectedWard?.ward_number === w.ward_number
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Ward {w.ward_number}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ward Impact Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 h-[560px] overflow-y-auto">
          {selectedWard ? (
            <div className="space-y-5">
              {/* Ward Title & Meta */}
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    BBMP Ward {selectedWard.ward_number}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Zone: {selectedWard.zone}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 pt-1">
                  {selectedWard.name}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    ~{selectedWard.population?.toLocaleString()} residents
                  </span>
                  <span>{selectedWard.area_sq_km} sq.km</span>
                </div>
              </div>

              {/* Impact Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Policies Affecting This Ward ({wardPolicies.length})
                  </h3>
                  <span className="text-[11px] text-blue-600 font-bold">
                    Spatial Match
                  </span>
                </div>

                {loadingPolicies ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                    Loading ward policy mappings...
                  </div>
                ) : wardPolicies.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                    No active municipal policy impacts recorded for this ward.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
                    {wardPolicies.map((pol) => (
                      <div
                        key={pol.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-blue-900">{pol.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            pol.impact_level === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {pol.impact_level || 'High'} Impact
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {pol.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {pol.impact_summary || pol.summary_simple}
                        </p>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <Link
                            to={`/citizen-response?policy_id=${pol.id}&ward=${encodeURIComponent(selectedWard.name)}`}
                            className="font-bold text-amber-700 hover:text-amber-900"
                          >
                            Draft Response
                          </Link>
                          <Link
                            to={`/policies/${pol.id}`}
                            className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            View Details <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p>Click any ward on the map to inspect its municipal impact details.</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              to="/for-you"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Personalize My Ward Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
