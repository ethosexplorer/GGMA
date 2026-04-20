import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Reference: https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction
type LegalStatus = "fully_legal" | "medical_only" | "decriminalized" | "mixed" | "illegal";

interface StateData {
  id: string;
  state: string;
  status: LegalStatus;
  dispensaries: number;
  note: string;
}

const data: StateData[] = [
  { id: "01", state: "Alabama", status: "medical_only", dispensaries: 4, note: "Medical cannabis legal since 2021" },
  { id: "02", state: "Alaska", status: "fully_legal", dispensaries: 95, note: "Recreational & medical legal" },
  { id: "04", state: "Arizona", status: "fully_legal", dispensaries: 180, note: "Recreational & medical legal" },
  { id: "05", state: "Arkansas", status: "medical_only", dispensaries: 40, note: "Medical cannabis legal since 2016" },
  { id: "06", state: "California", status: "fully_legal", dispensaries: 1100, note: "Recreational & medical legal" },
  { id: "08", state: "Colorado", status: "fully_legal", dispensaries: 920, note: "Recreational & medical legal" },
  { id: "09", state: "Connecticut", status: "fully_legal", dispensaries: 50, note: "Recreational & medical legal" },
  { id: "10", state: "Delaware", status: "fully_legal", dispensaries: 12, note: "Recreational & medical legal" },
  { id: "11", state: "District of Columbia", status: "fully_legal", dispensaries: 18, note: "Recreational & medical legal; no commercial sales" },
  { id: "12", state: "Florida", status: "fully_legal", dispensaries: 680, note: "Recreational & medical legal (Updated 2026)" },
  { id: "13", state: "Georgia", status: "mixed", dispensaries: 0, note: "Low-THC oil only" },
  { id: "15", state: "Hawaii", status: "medical_only", dispensaries: 22, note: "Medical cannabis legal since 2000" },
  { id: "16", state: "Idaho", status: "illegal", dispensaries: 0, note: "Cannabis fully illegal" },
  { id: "17", state: "Illinois", status: "fully_legal", dispensaries: 230, note: "Recreational & medical legal" },
  { id: "18", state: "Indiana", status: "illegal", dispensaries: 0, note: "Cannabis fully illegal (CBD oil limited)" },
  { id: "19", state: "Iowa", status: "mixed", dispensaries: 5, note: "Limited medical program" },
  { id: "20", state: "Kansas", status: "medical_only", dispensaries: 15, note: "Medical cannabis newly approved (2026)" },
  { id: "21", state: "Kentucky", status: "medical_only", dispensaries: 0, note: "Medical cannabis legal (sales begin 2025)" },
  { id: "22", state: "Louisiana", status: "medical_only", dispensaries: 10, note: "Medical cannabis legal since 2015" },
  { id: "23", state: "Maine", status: "fully_legal", dispensaries: 200, note: "Recreational & medical legal" },
  { id: "24", state: "Maryland", status: "fully_legal", dispensaries: 120, note: "Recreational & medical legal" },
  { id: "25", state: "Massachusetts", status: "fully_legal", dispensaries: 310, note: "Recreational & medical legal" },
  { id: "26", state: "Michigan", status: "fully_legal", dispensaries: 600, note: "Recreational & medical legal" },
  { id: "27", state: "Minnesota", status: "fully_legal", dispensaries: 45, note: "Recreational & medical legal" },
  { id: "28", state: "Mississippi", status: "medical_only", dispensaries: 30, note: "Medical cannabis legal since 2022" },
  { id: "29", state: "Missouri", status: "fully_legal", dispensaries: 210, note: "Recreational & medical legal" },
  { id: "30", state: "Montana", status: "fully_legal", dispensaries: 110, note: "Recreational & medical legal" },
  { id: "31", state: "Nebraska", status: "illegal", dispensaries: 0, note: "Cannabis illegal (decriminalisation for possession)" },
  { id: "32", state: "Nevada", status: "fully_legal", dispensaries: 105, note: "Recreational & medical legal" },
  { id: "33", state: "New Hampshire", status: "decriminalized", dispensaries: 5, note: "Decriminalized; limited medical program" },
  { id: "34", state: "New Jersey", status: "fully_legal", dispensaries: 140, note: "Recreational & medical legal" },
  { id: "35", state: "New Mexico", status: "fully_legal", dispensaries: 130, note: "Recreational & medical legal" },
  { id: "36", state: "New York", status: "fully_legal", dispensaries: 120, note: "Recreational & medical legal" },
  { id: "37", state: "North Carolina", status: "decriminalized", dispensaries: 0, note: "Decriminalized; no medical program" },
  { id: "38", state: "North Dakota", status: "medical_only", dispensaries: 8, note: "Medical cannabis legal since 2016" },
  { id: "39", state: "Ohio", status: "fully_legal", dispensaries: 130, note: "Recreational & medical legal" },
  { id: "40", state: "Oklahoma", status: "medical_only", dispensaries: 2400, note: "Medical cannabis — one of the most open programs" },
  { id: "41", state: "Oregon", status: "fully_legal", dispensaries: 650, note: "Recreational & medical legal" },
  { id: "42", state: "Pennsylvania", status: "medical_only", dispensaries: 165, note: "Medical cannabis legal since 2016" },
  { id: "44", state: "Rhode Island", status: "fully_legal", dispensaries: 33, note: "Recreational & medical legal" },
  { id: "45", state: "South Carolina", status: "illegal", dispensaries: 0, note: "Cannabis illegal" },
  { id: "46", state: "South Dakota", status: "medical_only", dispensaries: 10, note: "Medical cannabis legal since 2020" },
  { id: "47", state: "Tennessee", status: "illegal", dispensaries: 0, note: "Cannabis illegal" },
  { id: "48", state: "Texas", status: "mixed", dispensaries: 3, note: "Very limited medical (Compassionate Use)" },
  { id: "49", state: "Utah", status: "medical_only", dispensaries: 15, note: "Medical cannabis legal since 2018" },
  { id: "50", state: "Vermont", status: "fully_legal", dispensaries: 55, note: "Recreational & medical legal" },
  { id: "51", state: "Virginia", status: "fully_legal", dispensaries: 30, note: "Recreational & medical legal" },
  { id: "53", state: "Washington", status: "fully_legal", dispensaries: 510, note: "Recreational & medical legal" },
  { id: "54", state: "West Virginia", status: "medical_only", dispensaries: 12, note: "Medical cannabis legal since 2017" },
  { id: "55", state: "Wisconsin", status: "illegal", dispensaries: 0, note: "Cannabis illegal" },
  { id: "56", state: "Wyoming", status: "illegal", dispensaries: 0, note: "Cannabis illegal" },
];

const statusColors: Record<LegalStatus, string> = {
  fully_legal: "#1a4731",
  medical_only: "#5e7a4f",
  decriminalized: "#a3b18a",
  mixed: "#cbd5e1",
  illegal: "#f1f5f9",
};

const statusLabels: Record<LegalStatus, string> = {
  fully_legal: "Fully Legal",
  medical_only: "Medical Only",
  decriminalized: "Decriminalized",
  mixed: "Mixed / Limited",
  illegal: "Illegal",
};

const statusOrder: LegalStatus[] = ["fully_legal", "medical_only", "decriminalized", "mixed", "illegal"];

export default function MapChart() {
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    dispensaries: number;
    status: LegalStatus;
    note: string;
    x: number;
    y: number;
  } | null>(null);

  const totalDispensaries = data.reduce((sum, s) => sum + s.dispensaries, 0);
  const fullyLegalCount = data.filter(s => s.status === "fully_legal").length;

  return (
    <div className="relative w-full h-full" onMouseLeave={() => setHoveredState(null)}>
      {/* Stats Strip */}
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap items-center gap-3 md:gap-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-slate-200">
          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Total Dispensaries</div>
          <div className="text-xl font-black text-[#1a4731]">{totalDispensaries.toLocaleString()}</div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-slate-200">
          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Fully Legal States</div>
          <div className="text-xl font-black text-[#1a4731]">{fullyLegalCount}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-md border border-slate-200">
        <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-2">Cannabis Legality</div>
        <div className="flex flex-col gap-1.5">
          {statusOrder.map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm border border-slate-300" style={{ backgroundColor: statusColors[s] }} />
              <span className="text-[11px] font-medium text-slate-600">{statusLabels[s]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Source Reference */}
      <div className="absolute bottom-2 right-2 z-10">
        <a
          href="https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-200 text-[10px] font-medium text-slate-500 hover:text-[#1a4731] transition-colors flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Wikipedia Source
        </a>
      </div>

      {/* Map */}
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(s => s.id === geo.id);
              const fillColor = cur ? statusColors[cur.status] : "#f8fafc";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  onMouseEnter={(e: any) => {
                    setHoveredState({
                      name: geo.properties.name,
                      dispensaries: cur ? cur.dispensaries : 0,
                      status: cur ? cur.status : "illegal",
                      note: cur ? cur.note : "No data",
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                  onMouseMove={(e: any) => {
                    setHoveredState({
                      name: geo.properties.name,
                      dispensaries: cur ? cur.dispensaries : 0,
                      status: cur ? cur.status : "illegal",
                      note: cur ? cur.note : "No data",
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => {
                    const stateName = geo.properties.name?.replace(/ /g, '_');
                    window.open(`https://en.wikipedia.org/wiki/Cannabis_in_${stateName}`, '_blank');
                  }}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#4FC3F7", outline: "none", cursor: "pointer" },
                    pressed: { fill: "#0288D1", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {hoveredState && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900/95 text-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-1.5 transform -translate-x-1/2 -translate-y-[120%] max-w-[260px]"
          style={{ top: hoveredState.y, left: hoveredState.x }}
        >
          <span className="font-bold text-sm bg-white/10 px-3 py-1 rounded-full text-white tracking-wide border border-white/5">
            {hoveredState.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors[hoveredState.status] }} />
            <span className="text-xs font-semibold text-slate-300">{statusLabels[hoveredState.status]}</span>
          </div>
          <span className="text-3xl font-black text-[#a3b18a] drop-shadow-md">
            {hoveredState.dispensaries.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Dispensaries</span>
          <span className="text-[10px] text-slate-400 mt-1 text-center leading-snug italic">{hoveredState.note}</span>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-900/95 rotate-45 border-b border-r border-white/5" />
        </div>
      )}
    </div>
  );
}
