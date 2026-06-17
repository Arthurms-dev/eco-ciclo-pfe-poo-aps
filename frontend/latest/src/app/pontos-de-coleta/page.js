'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import CollectionPointCard from '../components/CollectionPointCard';
import { usePontoStore } from '../store/usePontoStore';
import { Search, Leaf, X, Filter, Layers, List } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const fetcher = (url) => api.get(url).then(res => res.data);

export default function PontosDeColetaPage() {
  
  const { 
    searchTerm, 
    setSearchTerm, 
    clearSearch, 
    pontoSelecionadoId, 
    setPontoSelecionadoId,
    mapMode,
    toggleMapMode,
    mapCenter,
    mapZoom,
    setMapPosition
  } = usePontoStore();
  
  const [map, setMap] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const apiUrl = searchTerm
    ? `/collection-points/search/by-type?tipoResiduo=${searchTerm}`
    : `/collection-points`;

  const { data: pontos = [], error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 3000,
    dedupingInterval: 2000,
  });

  useEffect(() => {
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    const salvarPosicaoAtual = () => {
      const centro = map.getCenter();
      const zoom = map.getZoom();
      setMapPosition([centro.lat, centro.lng], zoom);
    };

    map.on('moveend', salvarPosicaoAtual);
    map.on('zoomend', salvarPosicaoAtual);

    return () => {
      map.off('moveend', salvarPosicaoAtual);
      map.off('zoomend', salvarPosicaoAtual);
    };
  }, [map, setMapPosition]);

  const centralizarNoMapa = (id, lat, lng) => {
    setPontoSelecionadoId(id);
    if (map) {
      map.flyTo([lat, lng], 15);
      setMapPosition([lat, lng], 15);
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const tileUrl = mapMode === 'default'
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  const attributionUrl = mapMode === 'default'
    ? '&copy; OpenStreetMap contributors'
    : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

  return (
    <div className="relative w-full h-screen bg-white font-sans overflow-hidden">
    
      <div className="absolute inset-0 z-0 bg-[#eef4ec] transition-colors duration-500">
        <MapContainer 
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            key={mapMode}
            url={tileUrl}
            attribution={attributionUrl}
          />
          {pontos.map(ponto => (
            <Marker key={ponto.id} position={[ponto.latitude, ponto.longitude]}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px] max-w-[240px] space-y-1.5">
                  <h4 className="font-bold text-slate-900 m-0 text-sm tracking-tight">
                    {ponto.nomeUnidade}
                  </h4>
                  
                  <p className="text-[10px] text-slate-600 m-0 leading-relaxed">
                    {ponto.endereco}
                  </p>

                  {ponto.pontoReferencia && (
                    <p className="text-[10px] text-slate-400 m-0 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="font-semibold not-italic text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Ref:</span>
                      "{ponto.pontoReferencia}"
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100">
                    {(ponto.tiposResiduosAceitos || '').split(',').filter(Boolean).map((t, i) => (
                      <span key={i} className="text-[8px] bg-slate-100 text-[#7fa17e] px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] bg-[#7fa17e] text-white px-6 py-3 rounded-full shadow-xl shadow-[#7fa17e]/40 font-bold tracking-wide flex items-center gap-2 animate-bounce border-2 border-white/20"
      >
        <List size={20} />
        Ver Ecopontos
      </button>

      <aside className={`absolute top-0 md:top-4 left-0 md:left-4 bottom-0 md:bottom-4 w-full md:max-w-[420px] z-[1000] flex flex-col transition-transform duration-300 ease-in-out pointer-events-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm md:rounded-[32px] shadow-2xl shadow-slate-900/10 flex flex-col h-full pointer-events-auto overflow-hidden border border-white/50 w-full h-full">

          <div className="p-6 md:p-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7fa17e] rounded-[14px] flex items-center justify-center text-white shadow-md shadow-[#7fa17e]/32">
                  <Leaf size={20} strokeWidth={2.5} />
                </div>
                EcoCiclo
              </h1>
              
              <div className="flex gap-2">
                <button 
                  onClick={toggleMapMode}
                  title="Alternar entre Mapa e Satélite"
                  className={`p-2 rounded-full transition-all duration-300 shadow-sm border ${
                    mapMode === 'satellite' 
                      ? 'bg-[#7fa17e] text-white border-[#7fa17e]' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-transparent'
                  }`}
                >
                  <Layers size={18} />
                </button>

                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                placeholder="Filtrar por tipo (ex: vidro, papel...)"
                className="w-full pl-12 pr-12 py-4 bg-slate-100 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#7fa17e] focus:ring-0 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#7fa17e] transition-colors" size={20} />
              {searchTerm && (
                <button type="button" onClick={clearSearch} className="absolute right-4 top-4 text-slate-300 hover:text-rose-500">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unidades de Coleta</span>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{pontos.length} ATIVOS</span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300 animate-pulse">
                <div className="w-10 h-10 border-4 border-[#7fa17e] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest">Sincronizando Banco (SWR)...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-50 rounded-3xl p-6 text-center border border-rose-100">
                <p className="text-rose-600 font-bold text-sm">Falha na conexão com o servidor de dados.</p>
              </div>
            ) : pontos.length > 0 ? (
              pontos.map(ponto => (
                <CollectionPointCard 
                  key={ponto.id} 
                  point={ponto} 
                  isSelect={ponto.id === pontoSelecionadoId}
                  onSelect={() => centralizarNoMapa(ponto.id, ponto.latitude, ponto.longitude)}
                />
              ))
            ) : (
              <div className="bg-slate-50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-sm">Nenhum ponto encontrado para "{searchTerm}"</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button className="flex items-center gap-2 text-[11px] font-black text-[#7fa17e] uppercase tracking-widest hover:opacity-80 transition-colors">
              <Filter size={14} /> Refinar Busca
            </button>
            <span className="text-[10px] text-slate-300 font-medium italic">EcoCiclo v1.0</span>
          </div>
        </div>
      </aside>
    </div>
  );
}