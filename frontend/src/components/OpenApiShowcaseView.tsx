import React, { useState } from 'react';
import { Globe, Terminal, Code2, CheckCircle2, Play, Copy, Check } from 'lucide-react';
import { fetchOpenDictionary, calculatePartuturanApi, transliterateAksaraApi } from '../utils/apiClient';
import { PitaTenun } from './GorgaEmblem';

export const OpenApiShowcaseView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<'dictionary' | 'partuturan' | 'aksara'>('dictionary');
  const [paramInput, setParamInput] = useState('horas');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecuteApi = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      let res = null;
      if (activeEndpoint === 'dictionary') {
        res = await fetchOpenDictionary(paramInput);
      } else if (activeEndpoint === 'partuturan') {
        res = await calculatePartuturanApi('male', paramInput || 'saudara_laki_ibu');
      } else {
        res = await transliterateAksaraApi(paramInput || 'horas');
      }
      setApiResponse(res);
    } catch (err: any) {
      setApiResponse({ error: err.message || 'Gagal memanggil API' });
    } finally {
      setLoading(false);
    }
  };

  const currentUrl =
    activeEndpoint === 'dictionary'
      ? `GET /api/v1/open/dictionary?q=${encodeURIComponent(paramInput)}`
      : activeEndpoint === 'partuturan'
      ? `GET /api/v1/open/partuturan?my_gender=male&relation=${encodeURIComponent(paramInput)}`
      : `GET /api/v1/open/aksara?text=${encodeURIComponent(paramInput)}`;

  const handleCopy = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${origin}${currentUrl.replace('GET ', '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="card-batak-dark bg-[#1E1A17] text-[#F4EDE0] p-6 sm:p-8 mb-8 relative overflow-hidden">
        <PitaTenun />
        <div className="relative z-10 mt-3">
          <div className="inline-flex items-center gap-2 bg-[#A62B1F]/30 border border-[#A62B1F] px-3 py-1 rounded-[4px] text-xs font-bold text-[#D9A21B] uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" /> Interconnected Web Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-[#F4EDE0]">
            BATAKGO Open Cultural Knowledge API
          </h1>
          <p className="text-[#F4EDE0]/80 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-body">
            Menjawab tema UINIC 8.0: <i>"Engineering Interconnected Web Solutions"</i>, BATAKGO tidak hanya menjadi platform edukasi, melainkan juga bertindak sebagai <b>Data Provider</b> budaya Batak pertama yang menyediakan RESTful API terbuka bagi ekosistem digital nasional.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => {
            setActiveEndpoint('dictionary');
            setParamInput('horas');
            setApiResponse(null);
          }}
          className={`px-4 py-2.5 rounded-[4px] font-bold text-sm transition flex items-center gap-2 cursor-pointer border-[1.5px] border-b-[3px] ${
            activeEndpoint === 'dictionary'
              ? 'btn-secang'
              : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] hover:bg-[#EADBCE]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Kamus Leksikon API</span>
        </button>

        <button
          onClick={() => {
            setActiveEndpoint('partuturan');
            setParamInput('saudara_laki_ibu');
            setApiResponse(null);
          }}
          className={`px-4 py-2.5 rounded-[4px] font-bold text-sm transition flex items-center gap-2 cursor-pointer border-[1.5px] border-b-[3px] ${
            activeEndpoint === 'partuturan'
              ? 'btn-secang'
              : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] hover:bg-[#EADBCE]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Kalkulator Partuturan API</span>
        </button>

        <button
          onClick={() => {
            setActiveEndpoint('aksara');
            setParamInput('horas');
            setApiResponse(null);
          }}
          className={`px-4 py-2.5 rounded-[4px] font-bold text-sm transition flex items-center gap-2 cursor-pointer border-[1.5px] border-b-[3px] ${
            activeEndpoint === 'aksara'
              ? 'btn-secang'
              : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] hover:bg-[#EADBCE]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Transliterasi Surat Batak API</span>
        </button>
      </div>

      {/* API Console Box */}
      <div className="card-batak-dark bg-[#1E1A17] p-6 text-[#F4EDE0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2420]">
          <div className="flex items-center gap-2 font-mono text-sm bg-[#141210] px-4 py-2 rounded-[4px] border border-[#2A2420] text-[#D9A21B] w-full sm:w-auto overflow-x-auto">
            <span className="text-[#A62B1F] font-bold">GET</span>
            <span className="text-[#F4EDE0]/80">{currentUrl.replace('GET ', '')}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-[4px] border border-[#F4EDE0]/30 hover:border-[#F4EDE0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer text-[#F4EDE0]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#D9A21B]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Copy URL'}</span>
            </button>
            <button
              onClick={handleExecuteApi}
              disabled={loading}
              className="btn-indigo px-4 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Mengirim...' : 'Uji Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Param Editor */}
        <div className="py-4 border-b border-[#2A2420] flex items-center gap-3">
          <label className="text-xs font-bold text-[#F4EDE0]/70 uppercase tracking-wider shrink-0">
            Parameter Query:
          </label>
          <input
            type="text"
            value={paramInput}
            onChange={e => setParamInput(e.target.value)}
            placeholder="Masukkan nilai query..."
            className="flex-1 bg-[#141210] border border-[#2A2420] rounded-[4px] px-3 py-1.5 text-sm text-[#F4EDE0] font-mono focus:outline-none focus:border-[#23365A]"
          />
        </div>

        {/* Response JSON Output */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#F4EDE0]/70 mb-2">
            <span>Response Payload (JSON)</span>
            <span className="text-[#D9A21B] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Status: 200 OK • Laravel 13 & MySQL
            </span>
          </div>

          <pre className="bg-[#141210] p-4 rounded-[4px] font-mono text-xs text-[#D9A21B] overflow-x-auto max-h-72 border border-[#2A2420] leading-relaxed">
            {loading ? (
              <span className="text-[#F4EDE0]/50 animate-pulse">Menghubungi endpoint Laravel API...</span>
            ) : apiResponse ? (
              JSON.stringify(apiResponse, null, 2)
            ) : (
              `Klik tombol "Uji Endpoint" di atas untuk mencoba integrasi API langsung ke database MySQL.`
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};
