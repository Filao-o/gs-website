"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, ArrowLeft, Car, Phone, MapPin,
  Calendar, CheckCircle, Clock, Send, ChevronRight, Loader2
} from "lucide-react";
import { calculerPrix, type PrixResult } from "@/lib/pricing";
import AddressAutocomplete from "./AddressAutocomplete";
import RouteMap from "./RouteMap";

/* ─── Types ─── */
type Path = "standard" | "custom" | null;
type TripType = "AS" | "AR" | null;

type Vehicle = "suv" | "van";

interface FormData {
  path: Path;
  tripType: TripType;
  firstName: string;
  lastName: string;
  phoneCountry: string;
  phone: string;
  vehicle: Vehicle;
  pickup: string;
  destination: string;
  returnPickup: string;
  returnDestination: string;
  slot: string | null;
  noDate: boolean;
  customDescription: string;
  customName: string;
  customPhone: string;
}

const INITIAL: FormData = {
  path: null,
  tripType: null,
  firstName: "",
  lastName: "",
  phoneCountry: "+262",
  phone: "",
  vehicle: "suv",
  pickup: "",
  destination: "",
  returnPickup: "",
  returnDestination: "",
  slot: null,
  noDate: false,
  customDescription: "",
  customName: "",
  customPhone: "",
};

/* ─── Country dial codes ─── */
const DIAL_CODES = [
  { code: "+262", flag: "🇷🇪", label: "Réunion" },
  { code: "+33",  flag: "🇫🇷", label: "France" },
  { code: "+230", flag: "🇲🇺", label: "Maurice" },
  { code: "+269", flag: "🇾🇹", label: "Mayotte" },
  { code: "+261", flag: "🇲🇬", label: "Madagascar" },
  { code: "+241", flag: "🇬🇦", label: "Gabon" },
  { code: "+237", flag: "🇨🇲", label: "Cameroun" },
  { code: "+221", flag: "🇸🇳", label: "Sénégal" },
  { code: "+225", flag: "🇨🇮", label: "Côte d'Ivoire" },
  { code: "+212", flag: "🇲🇦", label: "Maroc" },
  { code: "+213", flag: "🇩🇿", label: "Algérie" },
  { code: "+216", flag: "🇹🇳", label: "Tunisie" },
  { code: "+44",  flag: "🇬🇧", label: "Royaume-Uni" },
  { code: "+49",  flag: "🇩🇪", label: "Allemagne" },
  { code: "+34",  flag: "🇪🇸", label: "Espagne" },
  { code: "+39",  flag: "🇮🇹", label: "Italie" },
  { code: "+31",  flag: "🇳🇱", label: "Pays-Bas" },
  { code: "+32",  flag: "🇧🇪", label: "Belgique" },
  { code: "+41",  flag: "🇨🇭", label: "Suisse" },
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+352", flag: "🇱🇺", label: "Luxembourg" },
  { code: "+1",   flag: "🇺🇸", label: "États-Unis / Canada" },
  { code: "+61",  flag: "🇦🇺", label: "Australie" },
  { code: "+81",  flag: "🇯🇵", label: "Japon" },
  { code: "+82",  flag: "🇰🇷", label: "Corée du Sud" },
  { code: "+86",  flag: "🇨🇳", label: "Chine" },
  { code: "+91",  flag: "🇮🇳", label: "Inde" },
  { code: "+971", flag: "🇦🇪", label: "Émirats Arabes Unis" },
  { code: "+966", flag: "🇸🇦", label: "Arabie Saoudite" },
  { code: "+27",  flag: "🇿🇦", label: "Afrique du Sud" },
  { code: "+55",  flag: "🇧🇷", label: "Brésil" },
  { code: "+52",  flag: "🇲🇽", label: "Mexique" },
  { code: "+54",  flag: "🇦🇷", label: "Argentine" },
];

/* ─── Sub-components ─── */
function StepHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light">{title}</h3>
      {sub && <p className="text-[#091424]/50 text-sm mt-1">{sub}</p>}
    </div>
  );
}

function NavButtons({
  onBack, onNext, nextLabel = "Continuer", nextDisabled = false, onBackLabel = "Retour"
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  onBackLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#091424]/10">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-2 text-[#091424]/50 hover:text-[#091424] text-sm transition-colors">
          <ArrowLeft size={15} /> {onBackLabel}
        </button>
      ) : <div />}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex items-center gap-2 bg-[#091424] text-white text-sm font-medium pl-5 pr-4 py-2.5 rounded-full hover:bg-[#091424]/85 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          {nextLabel}
          <span className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <ArrowRight size={13} />
          </span>
        </button>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
      />
    </div>
  );
}


/* ─── Progress bar ─── */
function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < step ? "bg-[#1FA3BA]" : "bg-[#091424]/10"}`} />
      ))}
    </div>
  );
}

/* ─── DateTimePicker ─── */
const JOURS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS_FR  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 5; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    }
  }
  return slots;
}
const TIME_SLOTS = buildTimeSlots();

function DateTimePicker({
  value, onChange,
}: {
  value: { date: string; time: string };
  onChange: (v: { date: string; time: string }) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const timeListRef = useRef<HTMLDivElement>(null);

  // Scroll to selected time on mount / time change
  useEffect(() => {
    const el = timeListRef.current?.querySelector("[data-selected=true]") as HTMLElement | null;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [value.time]);

  // Calendar grid
  const firstDay = new Date(calYear, calMonth, 1);
  // Monday = 0 offset
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isPast = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    return d < today;
  };

  const isSelected = (day: number) => {
    const iso = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return iso === value.date;
  };

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    const iso = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange({ ...value, date: iso });
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const canGoPrev = calYear > today.getFullYear() || calMonth > today.getMonth();

  // Friendly label
  const selectedLabel = (() => {
    if (!value.date) return null;
    const [y, mo, d] = value.date.split("-").map(Number);
    const dt = new Date(y, mo - 1, d);
    const dow = JOURS_FR[(dt.getDay() + 6) % 7];
    return `${dow} ${d} ${MOIS_FR[mo - 1]} à ${value.time}`;
  })();

  return (
    <div className="rounded-2xl border border-[#091424]/10 overflow-hidden bg-[#F5F4F0]">
      <div className="flex divide-x divide-[#091424]/8" style={{ minHeight: 280 }}>

        {/* Calendar */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#091424]/6 transition-colors disabled:opacity-20"
            >
              <ArrowLeft size={14} className="text-[#091424]" />
            </button>
            <span className="text-sm font-medium text-[#091424]">
              {MOIS_FR[calMonth]} {calYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#091424]/6 transition-colors"
            >
              <ArrowRight size={14} className="text-[#091424]" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {JOURS_FR.map(j => (
              <div key={j} className="text-center text-[10px] font-medium text-[#091424]/40 py-1">{j}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const past = isPast(day);
              const sel  = isSelected(day);
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  disabled={past}
                  className={`aspect-square w-full max-w-[36px] mx-auto flex items-center justify-center rounded-full text-xs transition-all font-medium ${
                    sel
                      ? "bg-[#091424] text-white"
                      : past
                      ? "text-[#091424]/20 line-through cursor-not-allowed"
                      : "text-[#091424] hover:bg-[#091424]/8"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div ref={timeListRef} className="w-28 overflow-y-auto" style={{ maxHeight: 280 }}>
          {TIME_SLOTS.map(slot => {
            const sel = slot === value.time;
            return (
              <button
                key={slot}
                data-selected={sel}
                onClick={() => onChange({ ...value, time: slot })}
                className={`w-full px-3 py-2.5 text-sm font-medium text-center transition-all ${
                  sel
                    ? "bg-white text-[#091424] shadow-sm"
                    : "text-[#091424]/60 hover:bg-[#091424]/5 hover:text-[#091424]"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary bar */}
      {selectedLabel && (
        <div className="border-t border-[#091424]/8 px-4 py-3 bg-white">
          <p className="text-sm text-[#091424]/70">
            Départ prévu le <span className="text-[#091424] font-medium">{selectedLabel}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
export default function ReservationTool() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [confirmed, setConfirmed] = useState(false);
  const [customSent, setCustomSent] = useState(false);
  const [prix, setPrix] = useState<PrixResult | null>(null);
  const [loadingPrix, setLoadingPrix] = useState(false);
  const [erreurPrix, setErreurPrix] = useState<string | null>(null);
  const todayStr = new Date().toISOString().split("T")[0];
  const [departDatetime, setDepartDatetime] = useState({ date: todayStr, time: "09:00" });
  const heureDepart = parseInt(departDatetime.time.split(":")[0], 10);
  const jourSemaine = new Date(`${departDatetime.date}T${departDatetime.time}`).getDay();
  const [pickupValid, setPickupValid]           = useState(false);
  const [destinationValid, setDestinationValid] = useState(false);
  const [returnPickupValid, setReturnPickupValid]           = useState(false);
  const [returnDestinationValid, setReturnDestinationValid] = useState(false);

  const set = (key: keyof FormData, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const calculerDistance = async () => {
    setLoadingPrix(true);
    setErreurPrix(null);
    setPrix(null);
    try {
      const params = new URLSearchParams({
        origine: form.pickup,
        destination: form.destination,
      });
      const res  = await fetch(`/api/distance?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur calcul");
      const result = calculerPrix(
        form.pickup,
        form.destination,
        data.distanceKm,
        data.dureeMin,
        heureDepart,
        jourSemaine,
        form.tripType === "AR"
      );
      setPrix(result);
    } catch (e: unknown) {
      setErreurPrix(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoadingPrix(false);
    }
  };

  useEffect(() => {
    if (step === 5) calculerDistance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* ── STEP 0 — Bienvenue ── */
  if (step === 0) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#1FA3BA]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Car size={26} className="text-[#1FA3BA]" />
          </div>
          <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light mb-3">
            Bienvenue sur la réservation
          </h3>
          <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto">
            Pour garantir la qualité de service, GS Transport fonctionne
            <span className="text-[#091424] font-medium"> uniquement sur réservation</span>.
            Merci de réserver en avance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => { set("path", "standard"); next(); }}
            className="group text-left bg-[#F5F4F0] hover:bg-[#091424] border border-[#091424]/8 rounded-2xl p-6 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#1FA3BA]/10 group-hover:bg-[#1FA3BA]/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <MapPin size={18} className="text-[#1FA3BA]" />
            </div>
            <p className="font-semibold text-[#091424] group-hover:text-white text-base mb-1 transition-colors">Trajet standard</p>
            <p className="text-[#091424]/50 group-hover:text-white/50 text-sm transition-colors">
              Aéroport, hôtel, soirée, rendez-vous — un point A vers un point B.
            </p>
            <div className="flex items-center gap-1 mt-4 text-[#1FA3BA] text-sm font-medium">
              Réserver <ChevronRight size={14} />
            </div>
          </button>

          <button
            onClick={() => { set("path", "custom"); setStep(10); }}
            className="group text-left bg-[#F5F4F0] hover:bg-[#091424] border border-[#091424]/8 rounded-2xl p-6 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-[#1FA3BA]/10 group-hover:bg-[#1FA3BA]/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <Calendar size={18} className="text-[#1FA3BA]" />
            </div>
            <p className="font-semibold text-[#091424] group-hover:text-white text-base mb-1 transition-colors">Trajet personnalisé</p>
            <p className="text-[#091424]/50 group-hover:text-white/50 text-sm transition-colors">
              Itinéraire sur mesure, mise à disposition, journée entière.
            </p>
            <div className="flex items-center gap-1 mt-4 text-[#1FA3BA] text-sm font-medium">
              Me contacter <ChevronRight size={14} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  /* ── STEP 1 — Type de trajet ── */
  if (step === 1) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={1} total={5} />
        <StepHeader title="Type de trajet" sub="Aller simple ou aller-retour ?" />

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { val: "AS", label: "Aller simple", desc: "D'un point A vers un point B, une seule fois." },
            { val: "AR", label: "Aller-retour", desc: "Départ et retour au même endroit. Sébastien vous attend." },
          ].map(o => (
            <button
              key={o.val}
              onClick={() => set("tripType", o.val as TripType)}
              className={`text-left rounded-2xl p-6 border-2 transition-all ${
                form.tripType === o.val
                  ? "border-[#1FA3BA] bg-[#1FA3BA]/5"
                  : "border-[#091424]/8 bg-[#F5F4F0] hover:border-[#1FA3BA]/40"
              }`}
            >
              <p className={`font-semibold text-base mb-2 ${form.tripType === o.val ? "text-[#091424]" : "text-[#091424]"}`}>{o.label}</p>
              <p className="text-[#091424]/50 text-sm">{o.desc}</p>
              {form.tripType === o.val && (
                <CheckCircle size={18} className="text-[#1FA3BA] mt-3" />
              )}
            </button>
          ))}
        </div>

        <NavButtons onBack={() => setStep(0)} onNext={next} nextDisabled={!form.tripType} />
      </div>
    </div>
  );

  /* ── STEP 2 — Infos client ── */
  if (step === 2) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={2} total={5} />
        <StepHeader title="Vos informations" sub="Sébastien vous contactera à ce numéro pour confirmer." />

        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Prénom" value={form.firstName} onChange={v => set("firstName", v)} placeholder="Marie" />
            <Input label="Nom" value={form.lastName} onChange={v => set("lastName", v)} placeholder="Dupont" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">Téléphone</label>
            <div className="flex gap-2">
              <div className="relative shrink-0">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1FA3BA] pointer-events-none" />
                <select
                  value={form.phoneCountry}
                  onChange={e => set("phoneCountry", e.target.value)}
                  className="bg-[#F5F4F0] border border-[#091424]/10 rounded-xl pl-8 pr-3 py-3 text-sm text-[#091424] focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all appearance-none cursor-pointer"
                >
                  {DIAL_CODES.map(d => (
                    <option key={d.code} value={d.code}>{d.flag} {d.code}</option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={e => {
                  const allowed = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Enter"];
                  if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
                placeholder="0692 XX XX XX"
                className="flex-1 bg-[#F5F4F0] border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
              />
            </div>
          </div>
        </div>

        <NavButtons
          onBack={back}
          onNext={next}
          nextDisabled={!form.firstName || !form.lastName || !form.phone}
        />
      </div>
    </div>
  );

  /* ── STEP 3 — Véhicule ── */
  if (step === 3) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={3} total={5} />
        <StepHeader title="Votre véhicule" sub="Choisissez le véhicule adapté à votre trajet." />

        <div className="flex flex-col gap-4">
          {[
            {
              val: "suv" as Vehicle,
              name: "SUV Premium",
              specs: "4 passagers · Climatisé · Bagages inclus",
              badge: "Le plus demandé",
            },
            {
              val: "van" as Vehicle,
              name: "Van Premium",
              specs: "8 passagers · Climatisé · Grand coffre",
              badge: "Groupes & familles",
            },
          ].map(v => (
            <button
              key={v.val}
              onClick={() => set("vehicle", v.val)}
              className={`text-left flex items-center gap-5 rounded-2xl p-5 border-2 transition-all ${
                form.vehicle === v.val
                  ? "border-[#1FA3BA] bg-[#1FA3BA]/5"
                  : "border-[#091424]/8 bg-[#F5F4F0] hover:border-[#1FA3BA]/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                form.vehicle === v.val ? "bg-[#1FA3BA]/15" : "bg-[#091424]/6"
              }`}>
                <Car size={22} className={form.vehicle === v.val ? "text-[#1FA3BA]" : "text-[#091424]/60"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[#091424] text-sm">{v.name} — GS Transport</p>
                  <span className="text-[10px] font-medium bg-[#1FA3BA]/10 text-[#1FA3BA] px-2 py-0.5 rounded-full shrink-0">{v.badge}</span>
                </div>
                <p className="text-[#091424]/50 text-xs">{v.specs}</p>
                <p className="text-[#1FA3BA] font-medium text-xs mt-1">5★ · +50 avis vérifiés</p>
              </div>
              {form.vehicle === v.val && (
                <CheckCircle size={20} className="text-[#1FA3BA] shrink-0" />
              )}
            </button>
          ))}
        </div>

        <NavButtons onBack={back} onNext={next} />
      </div>
    </div>
  );

  /* ── STEP 4 — Trajet : adresses + map + date/heure ── */
  if (step === 4) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={4} total={5} />
        <StepHeader title="Votre trajet" sub="Renseignez les adresses de prise en charge et de destination." />

        {/* Résumé véhicule */}
        <div className="flex items-center gap-4 bg-[#091424] rounded-2xl px-5 py-3.5 mb-6">
          <div className="w-8 h-8 bg-[#1FA3BA]/20 rounded-lg flex items-center justify-center shrink-0">
            <Car size={16} className="text-[#1FA3BA]" />
          </div>
          <p className="text-white/80 text-sm">
            {form.vehicle === "suv" ? "SUV Premium — 4 passagers" : "Van Premium — 8 passagers"}
          </p>
          <button onClick={back} className="ml-auto text-[#1FA3BA] text-xs hover:text-[#1FA3BA]/70 transition-colors shrink-0">
            Changer
          </button>
        </div>

        {/* Adresses */}
        <div className="flex flex-col gap-4 mb-6">
          <AddressAutocomplete
            label="Adresse de prise en charge"
            value={form.pickup}
            onChange={v => set("pickup", v)}
            onValidated={setPickupValid}
            placeholder="Ex : Aéroport Roland Garros, Sainte-Marie"
            showGeolocate
          />
          <AddressAutocomplete
            label="Destination"
            value={form.destination}
            onChange={v => set("destination", v)}
            onValidated={setDestinationValid}
            placeholder="Ex : Hôtel Iloha, Saint-Leu"
          />

          {form.tripType === "AR" && (
            <div className="border-t border-[#091424]/8 pt-4 mt-1">
              <p className="text-xs font-medium text-[#091424]/50 uppercase tracking-wide mb-4">Trajet retour</p>
              <div className="flex flex-col gap-4">
                <AddressAutocomplete
                  label="Prise en charge (retour)"
                  value={form.returnPickup}
                  onChange={v => set("returnPickup", v)}
                  onValidated={setReturnPickupValid}
                  placeholder="Ex : Hôtel Iloha, Saint-Leu"
                  showGeolocate
                />
                <AddressAutocomplete
                  label="Destination (retour)"
                  value={form.returnDestination}
                  onChange={v => set("returnDestination", v)}
                  onValidated={setReturnDestinationValid}
                  placeholder="Ex : Aéroport Roland Garros"
                />
              </div>
            </div>
          )}
        </div>

        {/* Carte itinéraire — s'affiche dès que les deux adresses sont validées */}
        {pickupValid && destinationValid && (
          <div className="mb-6">
            <RouteMap origin={form.pickup} destination={form.destination} />
          </div>
        )}

        {/* Date & heure de départ */}
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">
            Date et heure de départ
          </label>
          <DateTimePicker value={departDatetime} onChange={setDepartDatetime} />
          <div className="flex flex-col gap-1 mt-1">
            {(heureDepart >= 22 || heureDepart < 5) && (
              <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]">
                <Clock size={12} /> Majoration nuit +25% sera appliquée
              </p>
            )}
            {jourSemaine === 0 && (
              <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]">
                <Calendar size={12} /> Supplément dimanche +10€ sera appliqué
              </p>
            )}
          </div>
        </div>

        <NavButtons
          onBack={back}
          onNext={next}
          nextDisabled={
            !pickupValid || !destinationValid ||
            (form.tripType === "AR" && (!returnPickupValid || !returnDestinationValid))
          }
        />
      </div>
    </div>
  );

  /* ── STEP 5 — Estimation du tarif ── */
  if (step === 5) {
    if (confirmed) return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-14 shadow-sm border border-[#091424]/5 text-center">
          <div className="w-16 h-16 bg-[#1FA3BA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={30} className="text-[#1FA3BA]" />
          </div>
          <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light mb-3">
            Demande envoyée !
          </h3>
          <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            Sébastien va vous contacter au <span className="text-[#091424] font-medium">{form.phoneCountry} {form.phone}</span> pour confirmer votre réservation.
          </p>
          <div className="bg-[#F5F4F0] rounded-2xl p-5 text-left flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Client</span>
              <span className="text-[#091424] font-medium">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Date</span>
              <span className="text-[#091424] font-medium">{departDatetime.date} à {departDatetime.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Véhicule</span>
              <span className="text-[#091424] font-medium">{form.vehicle === "suv" ? "SUV Premium" : "Van Premium"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Trajet</span>
              <span className="text-[#091424] font-medium">{form.tripType === "AR" ? "Aller-retour" : "Aller simple"}</span>
            </div>
            {prix && (
              <div className="flex justify-between text-sm border-t border-[#091424]/8 pt-3 mt-1">
                <span className="text-[#091424]/50">Estimation</span>
                <span className="text-[#1FA3BA] font-semibold">{prix.prixFinal} €</span>
              </div>
            )}
          </div>
          <button onClick={() => { setStep(0); setForm(INITIAL); setConfirmed(false); setPrix(null); }}
            className="text-[#091424]/40 hover:text-[#091424] text-sm transition-colors">
            Faire une nouvelle réservation
          </button>
        </div>
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
          <Progress step={5} total={5} />
          <StepHeader title="Estimation du tarif" sub="Prix calculé selon la distance réelle. Paiement à bord." />

          {/* Loading */}
          {loadingPrix && (
            <div className="bg-[#091424] rounded-2xl p-10 mb-6 text-center">
              <Loader2 size={32} className="text-white/40 mx-auto animate-spin" />
              <p className="text-white/40 text-xs mt-3">Calcul de la distance en cours…</p>
            </div>
          )}

          {/* Erreur */}
          {erreurPrix && !loadingPrix && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-center">
              <p className="text-red-600 text-sm">{erreurPrix}</p>
              <button onClick={calculerDistance} className="text-xs text-red-400 mt-2 underline">Réessayer</button>
            </div>
          )}

          {/* Prix */}
          {prix && !loadingPrix && (
            <div className="bg-[#091424] rounded-2xl p-6 mb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Estimation</p>
                  <p className="font-heading text-white text-5xl font-light">{prix.prixFinal} €</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs">{prix.distanceKm} km</p>
                  <p className="text-white/40 text-xs">{prix.dureeMin} min</p>
                  <p className="text-white/40 text-xs">{prix.prixParKm} €/km</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Base ({form.tripType === "AR" ? "aller-retour" : "aller simple"})</span>
                  <span className="text-white">{prix.prixBase} €</span>
                </div>
                {prix.majoration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">{prix.majoration}</span>
                    <span className="text-[#1FA3BA]">inclus</span>
                  </div>
                )}
                {prix.supplements.map(s => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-white/50">{s.label}</span>
                    <span className="text-[#1FA3BA]">+{s.montant} €</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium border-t border-white/10 pt-2 mt-1">
                  <span className="text-white">Total</span>
                  <span className="text-[#1FA3BA] text-base">{prix.prixFinal} €</span>
                </div>
              </div>
            </div>
          )}

          {/* Résumé trajet */}
          {prix && !loadingPrix && (
            <div className="bg-[#F5F4F0] rounded-2xl p-4 mb-6 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1FA3BA] shrink-0" />
                <p className="text-sm text-[#091424]">{form.pickup}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#091424] shrink-0" />
                <p className="text-sm text-[#091424]">{form.destination}</p>
              </div>
              <div className="border-t border-[#091424]/8 pt-2.5 flex flex-wrap gap-x-6 gap-y-1">
                <span className="text-xs text-[#091424]/50">{departDatetime.date} · {departDatetime.time}</span>
                <span className="text-xs text-[#091424]/50">{form.vehicle === "suv" ? "SUV 4 places" : "Van 8 places"}</span>
                <span className="text-xs text-[#091424]/50">{form.tripType === "AR" ? "Aller-retour" : "Aller simple"}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#1FA3BA]/8 border border-[#1FA3BA]/20 rounded-xl px-4 py-3 mb-2">
            <CheckCircle size={15} className="text-[#1FA3BA] shrink-0" />
            <p className="text-sm text-[#091424]/70">Le paiement s'effectue directement auprès du chauffeur à bord du véhicule.</p>
          </div>

          <NavButtons
            onBack={back}
            onNext={() => setConfirmed(true)}
            nextLabel="Envoyer ma demande"
            nextDisabled={!prix || loadingPrix}
          />
        </div>
      </div>
    );
  }

  /* ── STEP 10 — Trajet personnalisé ── */
  if (step === 10) {
    if (customSent) return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-14 shadow-sm border border-[#091424]/5 text-center">
          <div className="w-16 h-16 bg-[#1FA3BA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={26} className="text-[#1FA3BA]" />
          </div>
          <h3 className="font-heading text-[#091424] text-2xl font-light mb-3">
            Demande envoyée !
          </h3>
          <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            Sébastien va vous rappeler au <span className="text-[#091424] font-medium">{form.customPhone}</span> pour construire votre itinéraire sur mesure.
          </p>
          <button onClick={() => { setStep(0); setForm(INITIAL); setCustomSent(false); }}
            className="text-[#091424]/40 hover:text-[#091424] text-sm transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
          <StepHeader
            title="Trajet personnalisé"
            sub="Décrivez votre besoin, Sébastien vous rappelle pour organiser ça ensemble."
          />

          <div className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Prénom & Nom" value={form.customName} onChange={v => set("customName", v)} placeholder="Marie Dupont" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">Téléphone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA]" />
                  <input
                    type="tel"
                    value={form.customPhone}
                    onChange={e => set("customPhone", e.target.value)}
                    placeholder="+262 6XX XX XX XX"
                    className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl pl-9 pr-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">Décrivez votre trajet</label>
              <textarea
                value={form.customDescription}
                onChange={e => set("customDescription", e.target.value)}
                placeholder="Ex : Journée complète le 15 juillet pour un mariage à Saint-Gilles, transferts multiples entre 3 lieux..."
                rows={5}
                className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all resize-none"
              />
            </div>
          </div>

          <NavButtons
            onBack={() => setStep(0)}
            onNext={() => setCustomSent(true)}
            nextLabel="Envoyer la demande"
            nextDisabled={!form.customName || !form.customPhone || !form.customDescription}
          />
        </div>
      </div>
    );
  }

  return null;
}
