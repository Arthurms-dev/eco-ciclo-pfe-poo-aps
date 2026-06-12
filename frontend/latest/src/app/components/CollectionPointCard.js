import React from 'react';
import { MapPin, Trash2, ChevronRight, Zap } from 'lucide-react';

const CollectionPointCard = ({ point, onSelect }) => {
  const ocupacaoPercent = Math.min(Math.round((point.volumeAtual / point.capacidadeMax) * 100), 100);
  
  const getProgressColor = (percent) => {
    if (percent > 90) return 'bg-rose-500';
    if (percent > 75) return 'bg-amber-400';
    return 'bg-[#7fa17e]';
  };

  const residuosTags = (point.tiposResiduosAceitos || '').split(',').filter(Boolean).map(tag => tag.trim());

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 transition-all duration-300 hover:border-[#7fa17e]/30 hover:shadow-xl hover:shadow-[#7fa17e]/10 cursor-pointer group relative overflow-hidden"
      onClick={() => onSelect && onSelect(point.id)}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getProgressColor(ocupacaoPercent)} opacity-80`} />

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#7fa17e] transition-colors leading-tight">
              {point.nomeUnidade}
            </h3>
            {ocupacaoPercent < 50 && (
              <span className="flex items-center gap-0.5 text-[9px] font-black bg-[#7fa17e]/10 text-[#7fa17e] px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Zap size={8} /> Disponível
              </span>
            )}
          </div>
          <div className="flex items-center text-slate-400 text-xs">
            <MapPin size={12} className="mr-1 flex-shrink-0 text-[#7fa17e]" />
            <span className="truncate">{point.endereco}</span>
          </div>
        </div>
        <div className="text-slate-300 group-hover:text-[#7fa17e] transition-colors ml-2">
          <ChevronRight size={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {residuosTags.map((tag, i) => (
          <span 
            key={i} 
            className="px-2.5 py-0.5 bg-slate-50 text-[#7fa17e] text-[10px] font-bold rounded-md border border-[#7fa17e]/20 uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-1">
            <Trash2 size={12} className="text-slate-400" /> Status de Ocupação
          </span>
          <span className={`font-black ${ocupacaoPercent > 90 ? 'text-rose-500' : 'text-slate-700'}`}>
            {point.volumeAtual} / {point.capacidadeMax} kg ({ocupacaoPercent}%)
          </span>
        </div>
        
        <div className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-out shadow-sm ${getProgressColor(ocupacaoPercent)}`}
            style={{ width: `${ocupacaoPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionPointCard;