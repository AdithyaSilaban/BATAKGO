import React, { useState } from 'react';
import { Globe, Terminal, Code2, ArrowRight, CheckCircle2, Play, Copy, Check } from 'lucide-react';
import { fetchOpenDictionary, calculatePartuturanApi, transliterateAksaraApi } from '../utils/apiClient';

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
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-800/40 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600/40 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" /> Interconnected Web Ecosystem
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            BATAKGO Open Cultural Knowledge API
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
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
          className={`px-5 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
            activeEndpoint === 'dictionary'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-2 border-stone-200'
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
          className={`px-5 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
            activeEndpoint === 'partuturan'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-2 border-stone-200'
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
          className={`px-5 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
            activeEndpoint === 'aksara'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border-2 border-stone-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Transliterasi Surat Batak API</span>
        </button>
      </div>

      {/* API Console Box */}
      <div className="bg-stone-900 rounded-3xl p-6 shadow-2xl border-4 border-stone-800 text-stone-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2 font-mono text-sm bg-stone-950 px-4 py-2 rounded-xl border border-stone-700 text-emerald-400 w-full sm:w-auto overflow-x-auto">
            <span className="text-amber-400 font-bold">GET</span>
            <span className="text-stone-300">{currentUrl.replace('GET ', '')}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Copy URL'}</span>
            </button>
            <button
              onClick={handleExecuteApi}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer ml-auto sm:ml-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Mengirim...' : 'Uji Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Param Editor */}
        <div className="py-4 border-b border-stone-800 flex items-center gap-3">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Parameter Query:
          </label>
          <input
            type="text"
            value={paramInput}
            onChange={e => setParamInput(e.target.value)}
            placeholder="Masukkan nilai query..."
            className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Response JSON Output */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 mb-2">
            <span>Response Payload (JSON)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Status: 200 OK • Laravel 13 & MySQL
            </span>
          </div>

          <pre className="bg-stone-950 p-4 rounded-2xl font-mono text-xs text-amber-200 overflow-x-auto max-h-72 border border-stone-800 leading-relaxed">
            {loading ? (
              <span className="text-stone-400 animate-pulse">Menghubungi endpoint Laravel API...</span>
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

