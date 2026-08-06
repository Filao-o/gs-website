"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight, ArrowLeft, Car, Phone, MapPin,
  Calendar, CheckCircle, Clock, ChevronRight, Loader2, Users, Wind, Droplets
} from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { calculerPrix, type PrixResult } from "@/lib/pricing";
import AddressAutocomplete from "./AddressAutocomplete";
import RouteMap from "./RouteMap";

/* ─── Types ─── */
type TripType = "AS" | "AR" | null;
type Vehicle  = "suv";

interface FormData {
  firstName:          string;
  lastName:           string;
  phoneCountry:       string;
  phone:              string;
  email:              string;
  tripType:           TripType;
  vehicle:            Vehicle;
  pickup:             string;
  destination:        string;
  returnPickup:       string;
  returnDestination:  string;
  customDescription:  string;
  customName:         string;
  customPhone:        string;
}

const INITIAL: FormData = {
  firstName: "", lastName: "", phoneCountry: "+262", phone: "", email: "",
  tripType: null, vehicle: "suv",
  pickup: "", destination: "", returnPickup: "", returnDestination: "",
  customDescription: "", customName: "", customPhone: "",
};

/* ─── Dial codes ─── */
const DIAL_CODES = [
  { code: "+262", flag: "🇷🇪", label: "Réunion",          country: "RE" },
  { code: "+33",  flag: "🇫🇷", label: "France",           country: "FR" },
  { code: "+230", flag: "🇲🇺", label: "Maurice",          country: "MU" },
  { code: "+269", flag: "🇾🇹", label: "Mayotte",          country: "YT" },
  { code: "+261", flag: "🇲🇬", label: "Madagascar",       country: "MG" },
  { code: "+241", flag: "🇬🇦", label: "Gabon",            country: "GA" },
  { code: "+237", flag: "🇨🇲", label: "Cameroun",         country: "CM" },
  { code: "+221", flag: "🇸🇳", label: "Sénégal",          country: "SN" },
  { code: "+225", flag: "🇨🇮", label: "Côte d'Ivoire",    country: "CI" },
  { code: "+212", flag: "🇲🇦", label: "Maroc",            country: "MA" },
  { code: "+213", flag: "🇩🇿", label: "Algérie",          country: "DZ" },
  { code: "+216", flag: "🇹🇳", label: "Tunisie",          country: "TN" },
  { code: "+44",  flag: "🇬🇧", label: "Royaume-Uni",      country: "GB" },
  { code: "+49",  flag: "🇩🇪", label: "Allemagne",        country: "DE" },
  { code: "+34",  flag: "🇪🇸", label: "Espagne",          country: "ES" },
  { code: "+39",  flag: "🇮🇹", label: "Italie",           country: "IT" },
  { code: "+31",  flag: "🇳🇱", label: "Pays-Bas",         country: "NL" },
  { code: "+32",  flag: "🇧🇪", label: "Belgique",         country: "BE" },
  { code: "+41",  flag: "🇨🇭", label: "Suisse",           country: "CH" },
  { code: "+351", flag: "🇵🇹", label: "Portugal",         country: "PT" },
  { code: "+352", flag: "🇱🇺", label: "Luxembourg",       country: "LU" },
  { code: "+1",   flag: "🇺🇸", label: "États-Unis/Canada",country: "US" },
  { code: "+61",  flag: "🇦🇺", label: "Australie",        country: "AU" },
  { code: "+81",  flag: "🇯🇵", label: "Japon",            country: "JP" },
  { code: "+82",  flag: "🇰🇷", label: "Corée du Sud",     country: "KR" },
  { code: "+86",  flag: "🇨🇳", label: "Chine",            country: "CN" },
  { code: "+91",  flag: "🇮🇳", label: "Inde",             country: "IN" },
  { code: "+971", flag: "🇦🇪", label: "Émirats Arabes",   country: "AE" },
  { code: "+966", flag: "🇸🇦", label: "Arabie Saoudite",  country: "SA" },
  { code: "+27",  flag: "🇿🇦", label: "Afrique du Sud",   country: "ZA" },
  { code: "+55",  flag: "🇧🇷", label: "Brésil",           country: "BR" },
  { code: "+52",  flag: "🇲🇽", label: "Mexique",          country: "MX" },
  { code: "+54",  flag: "🇦🇷", label: "Argentine",        country: "AR" },
];

/* ─── Timezones ─── */
const TIMEZONES = [
  { label: "🇷🇪 La Réunion",          offset: +4,    id: "RE" },
  { label: "🇫🇷 Paris (hiver)",        offset: +1,    id: "FR-W" },
  { label: "🇫🇷 Paris (été)",          offset: +2,    id: "FR-S" },
  { label: "🇬🇧 Londres (GMT)",        offset:  0,    id: "GB" },
  { label: "🇾🇹 Mayotte",             offset: +3,    id: "YT" },
  { label: "🇲🇬 Madagascar",          offset: +3,    id: "MG" },
  { label: "🇲🇺 Maurice",             offset: +4,    id: "MU" },
  { label: "🇦🇪 Dubaï",               offset: +4,    id: "AE" },
  { label: "🇮🇳 Inde",                offset: +5.5,  id: "IN" },
  { label: "🇨🇳 Chine / Singapour",   offset: +8,    id: "CN" },
  { label: "🇯🇵 Japon",               offset: +9,    id: "JP" },
  { label: "🇦🇺 Australie (Est)",     offset: +10,   id: "AU" },
  { label: "🇿🇦 Afrique du Sud",      offset: +2,    id: "ZA" },
  { label: "🇧🇷 Brésil (Brasilia)",   offset: -3,    id: "BR" },
  { label: "🇺🇸 New York (EST)",      offset: -5,    id: "US-E" },
  { label: "🇺🇸 Los Angeles (PST)",   offset: -8,    id: "US-W" },
  { label: "🇨🇦 Montréal",            offset: -5,    id: "CA" },
];

const REUNION_OFFSET = +4;

function toRéunionTime(time: string, fromOffset: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + (REUNION_OFFSET - fromOffset) * 60;
  const norm = ((totalMin % 1440) + 1440) % 1440;
  return `${String(Math.floor(norm / 60)).padStart(2,"0")}:${String(norm % 60).padStart(2,"0")}`;
}

/* ─── Date helpers ─── */
const MOIS_LONG_FR = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const JOURS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS_FR  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function formatDateFr(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return `${d} ${MOIS_LONG_FR[mo - 1]} ${y}`;
}

/* ─── DateTimePicker ─── */
function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++)
    for (const m of [0, 15, 30, 45])
      slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  return slots;
}
const TIME_SLOTS = buildTimeSlots();

function parseManualTime(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return null;
  let h: number, m: number;
  if (digits.length <= 2) {
    h = parseInt(digits, 10); m = 0;
  } else if (digits.length === 3) {
    h = parseInt(digits[0], 10); m = parseInt(digits.slice(1), 10);
  } else {
    h = parseInt(digits.slice(0, 2), 10); m = parseInt(digits.slice(2, 4), 10);
  }
  if (h > 23 || m > 59) return null;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function DateTimePicker({ value, onChange }: { value: { date: string; time: string }; onChange: (v: { date: string; time: string }) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [calYear,    setCalYear]    = useState(today.getFullYear());
  const [calMonth,   setCalMonth]   = useState(today.getMonth());
  const [tzId,       setTzId]       = useState("RE");
  const [manualTime, setManualTime] = useState(value.time);
  const timeListRef  = useRef<HTMLDivElement>(null);

  const tz        = TIMEZONES.find(t => t.id === tzId) ?? TIMEZONES[0];
  const isLocalTz = tz.offset === REUNION_OFFSET;

  useEffect(() => {
    const el = timeListRef.current?.querySelector("[data-selected=true]") as HTMLElement | null;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [value.time]);

  const firstDay    = new Date(calYear, calMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isPast     = (day: number) => new Date(calYear, calMonth, day) < today;
  const isSelected = (day: number) => `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}` === value.date;
  const selectDay  = (day: number) => {
    if (isPast(day)) return;
    onChange({ ...value, date: `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}` });
  };

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); } else setCalMonth(m => m+1); };
  const canGoPrev = calYear > today.getFullYear() || calMonth > today.getMonth();

  const selectedLabel = (() => {
    if (!value.date) return null;
    const [y, mo, d] = value.date.split("-").map(Number);
    const dt  = new Date(y, mo-1, d);
    const dow = JOURS_FR[(dt.getDay()+6)%7];
    return `${dow} ${d} ${MOIS_FR[mo-1]} à ${value.time}`;
  })();

  const handleManualTimeChange = (raw: string) => {
    setManualTime(raw);
    const parsed = parseManualTime(raw);
    if (parsed) {
      const reunionTime = isLocalTz ? parsed : toRéunionTime(parsed, tz.offset);
      onChange({ ...value, time: reunionTime });
    }
  };

  const handleManualBlur = () => {
    const parsed = parseManualTime(manualTime);
    if (parsed) {
      setManualTime(parsed);
    } else {
      setManualTime(value.time);
    }
  };

  return (
    <div className="rounded-2xl border border-[#091424]/10 overflow-hidden bg-[#091424]/4">

      {/* ── Calendrier ── */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} disabled={!canGoPrev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#091424]/6 transition-colors disabled:opacity-20">
            <ArrowLeft size={14} className="text-[#091424]" />
          </button>
          <span className="text-sm font-medium text-[#091424]">{MOIS_FR[calMonth]} {calYear}</span>
          <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#091424]/6 transition-colors">
            <ArrowRight size={14} className="text-[#091424]" />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {JOURS_FR.map(j => <div key={j} className="text-center text-[10px] font-medium text-[#091424]/40 py-1">{j}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const past = isPast(day); const sel = isSelected(day);
            return (
              <button key={day} onClick={() => selectDay(day)} disabled={past}
                className={`aspect-square w-full max-w-[36px] mx-auto flex items-center justify-center rounded-full text-xs transition-all font-medium ${
                  sel
                    ? "bg-[#091424] text-white"
                    : past
                    ? "bg-[#091424]/6 text-[#091424]/25 cursor-not-allowed"
                    : "text-[#091424] hover:bg-[#091424]/8"
                }`}>
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Heure ── */}
      <div className="border-t border-[#091424]/8 bg-white">
        {/* Saisie manuelle */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#091424]/6">
          <span className="text-xs font-medium text-[#091424]/50 shrink-0">Heure</span>
          <input
            type="text"
            value={manualTime}
            onChange={e => handleManualTimeChange(e.target.value)}
            onBlur={handleManualBlur}
            placeholder="09:00"
            maxLength={5}
            className="text-sm font-semibold text-[#091424] placeholder-[#091424]/25 bg-transparent outline-none w-16"
          />
        </div>
        {/* Créneaux défilables horizontalement */}
        <div ref={timeListRef} className="flex overflow-x-auto gap-1.5 px-4 py-3 scrollbar-none">
          {TIME_SLOTS.map(slot => {
            const reunionTime = isLocalTz ? slot : toRéunionTime(slot, tz.offset);
            const sel = reunionTime === value.time;
            return (
              <button key={slot} data-selected={sel}
                onClick={() => { onChange({ ...value, time: reunionTime }); setManualTime(reunionTime); }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sel ? "bg-[#091424] text-white" : "bg-[#091424]/6 text-[#091424]/60 hover:bg-[#091424]/10 hover:text-[#091424]"
                }`}>
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Fuseau + résumé ── */}
      <div className="border-t border-[#091424]/8 px-4 py-3 bg-[#091424]/2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-[#091424]/50 shrink-0">Fuseau :</span>
          <select value={tzId} onChange={e => setTzId(e.target.value)}
            className="text-xs text-[#091424]/70 bg-transparent border-none outline-none cursor-pointer truncate max-w-[160px]">
            {TIMEZONES.map(t => (
              <option key={t.id} value={t.id}>{t.label} (UTC{t.offset >= 0 ? "+" : ""}{t.offset})</option>
            ))}
          </select>
        </div>
        {selectedLabel && !isLocalTz && (
          <p className="text-xs text-[#1FA3BA] shrink-0">
            = <span className="font-medium">{value.time}</span> heure Réunion
          </p>
        )}
        {selectedLabel && isLocalTz && (
          <p className="text-xs text-[#091424]/50 shrink-0 font-medium">{selectedLabel}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Step IDs ─── */
type StepId =
  | "intro"
  | "firstName" | "lastName" | "phone" | "email"
  | "tripType" | "vehicle"
  | "pickup" | "destination"
  | "returnDestination" | "returnPickup"
  | "datetime" | "retourDatetime"
  | "price" | "confirmed"
  | "custom";

/* ─── Thread entry ─── */
interface ThreadEntry { question: string; answer: string; }

/* ─── Progress steps ─── */
const STEPS_AS: StepId[] = ["firstName","lastName","phone","tripType","pickup","destination","datetime","price"];
const STEPS_AR: StepId[] = ["firstName","lastName","phone","tripType","pickup","datetime","destination","returnDestination","retourDatetime","price"];

/* ─── Continue button ─── */
function ContinueBtn({ onClick, disabled = false, label = "Continuer" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 bg-[#091424] text-white text-sm font-medium pl-5 pr-4 py-3 rounded-full hover:bg-[#091424]/85 transition-all disabled:opacity-30 disabled:cursor-not-allowed group mt-6"
    >
      {label}
      <span className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors">
        <ArrowRight size={13} />
      </span>
    </button>
  );
}

/* ─── Question label ─── */
function Question({ text }: { text: string }) {
  return (
    <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light leading-snug mb-6">
      {text}
    </h3>
  );
}

/* ─── Main component ─── */
export default function ReservationTool({ heroVariant = "dark" }: { heroVariant?: "dark" | "image" }) {
  const [step,      setStep]      = useState<StepId>("intro");
  const [form,      setForm]      = useState<FormData>(INITIAL);
  const [thread,    setThread]    = useState<ThreadEntry[]>([]);
  const [prix,      setPrix]      = useState<PrixResult | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [erreur,    setErreur]    = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const createCalendarEvent = async () => {
    try {
      await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: `${form.phoneCountry} ${form.phone}`,
          email: form.email,
          pickup: form.pickup,
          destination: form.destination,
          tripType: form.tripType,
          vehicle: form.vehicle,
          departDatetime: `${departDatetime.date} à ${departDatetime.time}`,
          retourDatetime: form.tripType === "AR" ? `${retourDatetime.date} à ${retourDatetime.time}` : null,
          prix: prix?.prixFinal ?? null,
          distanceKm: prix?.distanceKm ?? null,
          dureeMin: prix?.dureeMin ?? null,
        }),
      });
    } catch (e) {
      console.error("Calendar event error:", e);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const [departDatetime, setDepartDatetime] = useState({ date: todayStr, time: "09:00" });
  const [retourDatetime, setRetourDatetime] = useState({ date: todayStr, time: "12:00" });

  const [pickupValid,            setPickupValid]            = useState(false);
  const [destinationValid,       setDestinationValid]       = useState(false);
  const [returnDestinationValid, setReturnDestinationValid] = useState(false);
  const [returnPickupValid,      setReturnPickupValid]      = useState(false);
  const [showReturnPickup,       setShowReturnPickup]       = useState(false);

  const containerRef      = useRef<HTMLDivElement>(null);
  const departDatetimeRef = useRef(departDatetime);
  const retourDatetimeRef = useRef(retourDatetime);
  const formRef           = useRef(form);

  useEffect(() => { departDatetimeRef.current = departDatetime; }, [departDatetime]);
  useEffect(() => { retourDatetimeRef.current = retourDatetime; }, [retourDatetime]);
  useEffect(() => { formRef.current = form; }, [form]);

  const set = (key: keyof FormData, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    if (step === "intro") return;
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (step === "returnDestination" && !form.returnDestination && form.pickup) {
      setForm(f => ({ ...f, returnDestination: f.pickup }));
      setReturnDestinationValid(true);
    }
  }, [step]);

  const heureDepart = parseInt(departDatetime.time.split(":")[0], 10);
  const jourSemaine = new Date(`${departDatetime.date}T${departDatetime.time}`).getDay();
  const heureRetour = parseInt(retourDatetime.time.split(":")[0], 10);
  const jourRetour  = new Date(`${retourDatetime.date}T${retourDatetime.time}`).getDay();

  const dialEntry  = DIAL_CODES.find(d => d.code === form.phoneCountry) ?? DIAL_CODES[0];
  const fullPhone  = `${form.phoneCountry}${form.phone}`;
  const phoneValid = form.phone.length >= 4 && (() => {
    try { return isValidPhoneNumber(fullPhone, dialEntry.country as never); }
    catch { return false; }
  })();

  const push = useCallback((question: string, answer: string, next: StepId) => {
    (document.activeElement as HTMLElement)?.blur();
    setThread(t => [...t, { question, answer }]);
    setStep(next);
  }, []);

  const calculerDistance = async () => {
    // Lire depuis les refs pour éviter les closures périmées
    const dt    = departDatetimeRef.current;
    const f     = formRef.current;
    const heure = parseInt(dt.time.split(":")[0], 10);
    const jour  = new Date(`${dt.date}T${dt.time}`).getDay();

    setLoading(true); setErreur(null); setPrix(null);
    try {
      const params = new URLSearchParams({ origine: f.pickup, destination: f.destination });
      const res  = await fetch(`/api/distance?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur calcul");
      const result = calculerPrix(f.pickup, f.destination, data.distanceKm, data.dureeMin, heure, jour, f.tripType === "AR");
      setPrix(result);
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : "Erreur inconnue");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (step === "price") calculerDistance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ─── INTRO ───
  if (step === "intro") return (
    <div ref={containerRef}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#091424]/5">
        {heroVariant === "image" ? (
          <div className="relative px-8 pt-10 pb-8 lg:px-12 lg:pt-14 lg:pb-10 overflow-hidden min-h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Hero/Card Hero/road.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-[#091424]/70 backdrop-blur-[2px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1FA3BA]/20 rounded-xl flex items-center justify-center">
                  <Car size={20} className="text-[#1FA3BA]" />
                </div>
                <span className="text-white/60 text-sm font-medium">GS Transport · Réservation</span>
              </div>
              <h2 className="font-heading text-white text-3xl lg:text-4xl font-light leading-snug mb-3">
                Planifiez votre trajet<br />en quelques instants.
              </h2>
              <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                Répondez à quelques questions et obtenez une estimation du tarif immédiatement.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#091424] px-8 pt-10 pb-8 lg:px-12 lg:pt-14 lg:pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#1FA3BA]/20 rounded-xl flex items-center justify-center">
                <Car size={20} className="text-[#1FA3BA]" />
              </div>
              <span className="text-white/50 text-sm font-medium">GS Transport · Réservation</span>
            </div>
            <h2 className="font-heading text-white text-3xl lg:text-4xl font-light leading-snug mb-3">
              Planifiez votre trajet<br />en quelques instants.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Répondez à quelques questions et obtenez une estimation du tarif immédiatement.
            </p>
          </div>
        )}
        <div className="px-8 py-8 lg:px-12">
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <button
              onClick={() => setStep("firstName")}
              className="flex items-center gap-2 bg-[#091424] text-white text-sm font-medium pl-6 pr-4 h-12 rounded-full hover:bg-[#091424]/85 transition-all group shrink-0"
            >
              Commencer
              <span className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <ArrowRight size={14} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStep("custom")}
              className="flex items-center gap-2 border border-[#091424]/12 text-[#091424]/50 hover:text-[#091424] hover:border-[#091424]/25 text-sm font-medium px-6 h-12 rounded-full transition-all shrink-0"
            >
              Trajet personnalisé <ChevronRight size={14} />
            </button>
          </div>
          <p className="text-xs text-[#091424]/30 mt-4">Contacter le chauffeur directement pour un besoin spécifique.</p>
          <p className="text-xs text-[#091424]/25 mt-1">Prend moins de 2 minutes · Paiement à bord</p>

          {/* Présentation véhicule */}
          <div className="mt-6 pt-6 border-t border-[#091424]/6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#091424]/35 mb-3">Votre véhicule</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Users size={12} />, label: "4 passagers" },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>, label: "4 valises standard" },
                { icon: <Wind size={12} />, label: "Climatisé" },
                { icon: <Droplets size={12} />, label: "Eau offerte" },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-[#091424]/55 bg-[#091424]/4 rounded-full px-3 py-1.5">
                  <span className="text-[#1FA3BA]">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── CONFIRMED ───
  if (confirmed) return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5 text-center">
        <div className="w-16 h-16 bg-[#1FA3BA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={30} className="text-[#1FA3BA]" />
        </div>
        <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light mb-3">Demande envoyée !</h3>
        <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Sébastien va vous contacter au <span className="text-[#091424] font-medium">{form.phoneCountry} {form.phone}</span> pour confirmer votre réservation.
        </p>
        <div className="bg-[#091424]/4 rounded-2xl p-5 text-left flex flex-col gap-3 mb-8">
          {[
            ["Client", `${form.firstName} ${form.lastName}`],
            ["Départ", `${formatDateFr(departDatetime.date)} à ${departDatetime.time}`],
            ...(form.tripType === "AR" ? [["Retour", `${formatDateFr(retourDatetime.date)} à ${retourDatetime.time}`]] : []),
            ["Véhicule", "SUV Premium — 4 places"],
            ["Trajet", form.tripType === "AR" ? "Aller-retour" : "Aller simple"],
            ...(prix ? [["Estimation", `${prix.prixFinal} €`]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-[#091424]/50">{k}</span>
              <span className="text-[#091424] font-medium">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#091424]/30 mb-6 leading-relaxed">
          Pour annuler ou modifier votre course, appelez directement Sébastien au{" "}
          <a href="tel:+262693512282" className="text-[#091424]/50 hover:text-[#1FA3BA] transition-colors">+262 693 51 22 82</a>.
        </p>
        <button onClick={() => { setStep("intro"); setForm(INITIAL); setThread([]); setPrix(null); setConfirmed(false); }}
          className="text-[#091424]/40 hover:text-[#091424] text-sm transition-colors">
          Faire une nouvelle réservation
        </button>
      </div>
    </div>
  );

  // ─── CUSTOM ───
  if (step === "custom") return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <button onClick={() => setStep("intro")} className="flex items-center gap-2 text-[#091424]/40 hover:text-[#091424] text-sm transition-colors mb-8">
          <ArrowLeft size={14} /> Retour
        </button>
        <Question text="Décrivez-nous votre projet." />
        <div className="flex flex-col gap-4">
          <input type="text" value={form.customName} onChange={e => set("customName", e.target.value)} placeholder="Votre nom"
            className="w-full bg-[#091424]/4 border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all" />
          <input type="tel" inputMode="numeric" value={form.customPhone} onChange={e => set("customPhone", e.target.value.replace(/[^0-9]/g, ""))} placeholder="Votre téléphone"
            className="w-full bg-[#091424]/4 border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all" />
          <textarea value={form.customDescription} onChange={e => set("customDescription", e.target.value)} placeholder="Décrivez votre trajet, vos dates, vos besoins…" rows={4}
            className="w-full bg-[#091424]/4 border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all resize-none" />
        </div>
        <ContinueBtn label="Envoyer ma demande" onClick={() => setConfirmed(true)} disabled={!form.customName || !form.customPhone || !form.customDescription} />
      </div>
    </div>
  );

  // ─── CONVERSATIONAL STEPS ───
  const renderStep = () => {
    // ── Prénom ──
    if (step === "firstName") return (
      <>
        <Question text="Bonjour ! Quel est votre prénom ?" />
        <input autoFocus type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && form.firstName.trim()) push("Quel est votre prénom ?", form.firstName, "lastName"); }}
          placeholder="Marie"
          className="w-full bg-[#091424]/4 border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all" />
        <ContinueBtn disabled={!form.firstName.trim()} onClick={() => push("Quel est votre prénom ?", form.firstName, "lastName")} />
      </>
    );

    // ── Nom ──
    if (step === "lastName") return (
      <>
        <Question text={`Et votre nom de famille, ${form.firstName} ?`} />
        <input autoFocus type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && form.lastName.trim()) push(`Et votre nom de famille, ${form.firstName} ?`, form.lastName, "phone"); }}
          placeholder="Dupont"
          className="w-full bg-[#091424]/4 border border-[#091424]/10 rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all" />
        <ContinueBtn disabled={!form.lastName.trim()} onClick={() => push(`Et votre nom de famille, ${form.firstName} ?`, form.lastName, "phone")} />
      </>
    );

    // ── Téléphone ──
    if (step === "phone") return (
      <>
        <Question text="À quel numéro pouvons-nous vous joindre ?" />
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1FA3BA] pointer-events-none" />
            <select value={form.phoneCountry} onChange={e => set("phoneCountry", e.target.value)}
              className="bg-[#091424]/4 border border-[#091424]/10 rounded-xl pl-8 pr-3 py-3 text-sm text-[#091424] focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all appearance-none cursor-pointer">
              {DIAL_CODES.map(d => <option key={d.code} value={d.code}>{d.flag} {d.code}</option>)}
            </select>
          </div>
          <input autoFocus type="tel" inputMode="numeric" value={form.phone}
            onChange={e => set("phone", e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={e => {
              const allowed = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Enter"];
              if (e.key === "Enter" && phoneValid) push("À quel numéro pouvons-nous vous joindre ?", `${form.phoneCountry} ${form.phone}`, "tripType");
              else if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key)) e.preventDefault();
            }}
            placeholder="0692 XX XX XX"
            className={`flex-1 bg-[#091424]/4 border rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:ring-2 transition-all ${
              form.phone && !phoneValid ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-[#091424]/10 focus:border-[#1FA3BA] focus:ring-[#1FA3BA]/15"
            }`} />
        </div>
        {form.phone && !phoneValid && (
          <p className="text-xs text-red-500 mt-2">Numéro invalide pour {dialEntry.label} ({form.phoneCountry})</p>
        )}
        {phoneValid && (
          <p className="text-xs text-[#1FA3BA] mt-2 flex items-center gap-1"><CheckCircle size={12} /> Numéro vérifié</p>
        )}
        <ContinueBtn disabled={!phoneValid} onClick={() => push("À quel numéro pouvons-nous vous joindre ?", `${form.phoneCountry} ${form.phone}`, "tripType")} />
      </>
    );

    // ── Type de trajet ──
    if (step === "tripType") return (
      <>
        <Question text="Quel type de trajet souhaitez-vous ?" />
        <div className="grid sm:grid-cols-2 gap-3">
          {([
            { val: "AS" as TripType, label: "Aller simple", desc: "D'un point A vers un point B.", icon: <ArrowRight size={18} className="text-[#1FA3BA]" /> },
            { val: "AR" as TripType, label: "Aller-retour", desc: "Sébastien vous attend et vous ramène.", icon: <><ArrowRight size={16} className="text-[#1FA3BA]" /><ArrowLeft size={16} className="text-[#1FA3BA]" /></> },
          ]).map(o => (
            <button key={o.val} onClick={() => set("tripType", o.val)}
              className={`text-left rounded-2xl p-5 border-2 transition-all ${form.tripType === o.val ? "border-[#1FA3BA] bg-[#1FA3BA]/5" : "border-[#091424]/8 bg-[#091424]/4 hover:border-[#1FA3BA]/40"}`}>
              <div className="flex items-center gap-1.5 mb-3">{o.icon}</div>
              <p className="font-semibold text-[#091424] text-sm mb-1">{o.label}</p>
              <p className="text-[#091424]/50 text-xs">{o.desc}</p>
              {/* Reserve space to avoid layout shift */}
              <CheckCircle size={16} className={`mt-3 transition-opacity ${form.tripType === o.val ? "text-[#1FA3BA] opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
        <ContinueBtn disabled={!form.tripType} onClick={() => push("Quel type de trajet souhaitez-vous ?", form.tripType === "AS" ? "Aller simple" : "Aller-retour", "pickup")} />
      </>
    );

    // ── Véhicule ──
    if (step === "vehicle") return (
      <>
        <Question text="Votre véhicule ?" />
        <div className="flex flex-col gap-3">
          {([
            { val: "suv" as Vehicle, name: "SUV Premium", specs: "4 passagers · Climatisé · Bagages inclus", badge: "Le plus demandé", Icon: Car },
            { val: "van" as Vehicle, name: "Van Premium",  specs: "8 passagers · Climatisé · Grand coffre",  badge: "Groupes & familles", Icon: Users },
          ]).map(v => (
            <button key={v.val} onClick={() => set("vehicle", v.val)}
              className={`text-left flex items-center gap-4 rounded-2xl p-5 border-2 transition-all ${form.vehicle === v.val ? "border-[#1FA3BA] bg-[#1FA3BA]/5" : "border-[#091424]/8 bg-[#091424]/4 hover:border-[#1FA3BA]/40"}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${form.vehicle === v.val ? "bg-[#1FA3BA]/15" : "bg-[#091424]/6"}`}>
                <v.Icon size={20} className={form.vehicle === v.val ? "text-[#1FA3BA]" : "text-[#091424]/50"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[#091424] text-sm">{v.name} — GS Transport</p>
                  <span className="text-[10px] font-medium bg-[#1FA3BA]/10 text-[#1FA3BA] px-2 py-0.5 rounded-full shrink-0">{v.badge}</span>
                </div>
                <p className="text-[#091424]/50 text-xs">{v.specs}</p>
              </div>
              {form.vehicle === v.val && <CheckCircle size={18} className="text-[#1FA3BA] shrink-0" />}
            </button>
          ))}
        </div>
        <ContinueBtn onClick={() => push("Votre véhicule ?", form.vehicle === "suv" ? "SUV Premium — 4 places" : "Van Premium — 8 places", "pickup")} />
      </>
    );

    // ── Pickup ──
    if (step === "pickup") return (
      <>
        <Question text="Vous partez d'où ?" />
        <AddressAutocomplete key="pickup" label="" value={form.pickup} onChange={v => set("pickup", v)} onValidated={setPickupValid}
          placeholder="Ex : Aéroport Roland Garros, Sainte-Marie" showGeolocate />
        <ContinueBtn disabled={!pickupValid} onClick={() => push("Vous partez d'où ?", form.pickup, form.tripType === "AR" ? "datetime" : "destination")} />
      </>
    );

    // ── Destination ──
    if (step === "destination") return (
      <>
        <Question text="Et votre destination ?" />
        <AddressAutocomplete key="destination" label="" value={form.destination} onChange={v => set("destination", v)} onValidated={setDestinationValid}
          placeholder="Ex : Hôtel Iloha, Saint-Leu" />
        <ContinueBtn disabled={!destinationValid} onClick={() => {
          push("Et votre destination ?", form.destination, form.tripType === "AR" ? "returnDestination" : "datetime");
        }} />
      </>
    );

    // ── Destination retour (AR) ──
    if (step === "returnDestination") return (
      <>
        <Question text="Et la destination de votre retour ?" />
        <AddressAutocomplete label="" value={form.returnDestination} onChange={v => set("returnDestination", v)} onValidated={setReturnDestinationValid}
          placeholder={form.pickup || "Ex : Adresse de départ"} />
        {!showReturnPickup && (
          <button type="button" onClick={() => setShowReturnPickup(true)}
            className="flex items-center gap-2 text-xs text-[#091424]/40 hover:text-[#1FA3BA] transition-colors mt-3 border border-dashed border-[#091424]/15 hover:border-[#1FA3BA]/30 rounded-lg px-3 py-2">
            <span className="text-base leading-none">+</span> La prise en charge du retour est différente de ma destination
          </button>
        )}
        {showReturnPickup && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#091424]/50 uppercase tracking-wide">Prise en charge retour</p>
              <button type="button"
                onClick={() => { setShowReturnPickup(false); set("returnPickup", ""); setReturnPickupValid(false); }}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#091424]/6 hover:bg-red-50 text-[#091424]/40 hover:text-red-400 transition-colors text-sm leading-none">
                ×
              </button>
            </div>
            <AddressAutocomplete label="" value={form.returnPickup} onChange={v => set("returnPickup", v)} onValidated={setReturnPickupValid}
              placeholder="Ex : Centre commercial, Saint-Paul" showGeolocate />
          </div>
        )}
        <ContinueBtn disabled={!returnDestinationValid || (showReturnPickup && !returnPickupValid)}
          onClick={() => {
            const pickupLabel = showReturnPickup ? ` · départ depuis ${form.returnPickup}` : "";
            push("Et la destination de votre retour ?", form.returnDestination + pickupLabel, "retourDatetime");
          }} />
      </>
    );

    // ── Date & heure aller ──
    if (step === "datetime") return (
      <>
        <Question text={form.tripType === "AR" ? "Pour quand est l'aller ?" : "Pour quand ?"} />
        <DateTimePicker value={departDatetime} onChange={setDepartDatetime} />
        <div className="flex flex-col gap-1 mt-2">
          {(heureDepart >= 22 || heureDepart < 5) && <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]"><Clock size={12} /> Majoration nuit +25% sera appliquée</p>}
          {jourSemaine === 0 && <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]"><Calendar size={12} /> Supplément dimanche +10€ sera appliqué</p>}
        </div>
        <ContinueBtn onClick={() => push(form.tripType === "AR" ? "Pour quand est l'aller ?" : "Pour quand ?", `${departDatetime.date} à ${departDatetime.time}`, form.tripType === "AR" ? "destination" : "price")} />
      </>
    );

    // ── Date & heure retour (AR) ──
    if (step === "retourDatetime") return (
      <>
        <Question text="Et pour le retour ?" />
        <DateTimePicker value={retourDatetime} onChange={setRetourDatetime} />
        <div className="flex flex-col gap-1 mt-2">
          {(heureRetour >= 22 || heureRetour < 5) && <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]"><Clock size={12} /> Majoration nuit +25% sera appliquée au retour</p>}
          {jourRetour === 0 && <p className="flex items-center gap-1.5 text-xs text-[#1FA3BA]"><Calendar size={12} /> Supplément dimanche +10€ sera appliqué au retour</p>}
        </div>
        <ContinueBtn onClick={() => push("Et pour le retour ?", `${retourDatetime.date} à ${retourDatetime.time}`, "price")} />
      </>
    );

    // ── Prix ──
    if (step === "price") return (
      <>
        <Question text="Voici votre estimation." />

        {/* Résumé client — compact */}
        <div className="border border-[#091424]/8 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
          <span className="text-xs text-[#091424]/40">Client</span>
          <span className="text-sm font-medium text-[#091424]">{form.firstName} {form.lastName}</span>
        </div>

        {/* Résumé trajet — compact */}
        <div className="border border-[#091424]/8 rounded-xl px-4 py-3 mb-6 flex flex-col gap-2.5">
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#091424]/40 shrink-0">Type</span>
            <span className="text-[#091424]/80 font-medium text-right">{form.tripType === "AR" ? "Aller-retour" : "Aller simple"}</span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#091424]/40 shrink-0">Départ</span>
            <span className="text-[#091424]/80 font-medium text-right text-xs leading-snug">{form.pickup}</span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#091424]/40 shrink-0">Destination</span>
            <span className="text-[#091424]/80 font-medium text-right text-xs leading-snug">{form.destination}</span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#091424]/40 shrink-0">Date aller</span>
            <span className="text-[#091424]/80 font-medium text-right">{formatDateFr(departDatetime.date)} à {departDatetime.time}</span>
          </div>
          {form.tripType === "AR" && (
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#091424]/40 shrink-0">Date retour</span>
              <span className="text-[#091424]/80 font-medium text-right">{formatDateFr(retourDatetime.date)} à {retourDatetime.time}</span>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="mb-6">
          <RouteMap origin={form.pickup} destination={form.destination} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[#091424] rounded-2xl p-10 mb-4 text-center">
            <Loader2 size={32} className="text-white/40 mx-auto animate-spin" />
            <p className="text-white/40 text-xs mt-3">Calcul en cours…</p>
          </div>
        )}

        {/* Erreur */}
        {erreur && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 text-center">
            <p className="text-red-600 text-sm">{erreur}</p>
            <button onClick={calculerDistance} className="text-xs text-red-400 mt-2 underline">Réessayer</button>
          </div>
        )}

        {/* Prix */}
        {prix && !loading && (
          <div className="bg-[#091424] rounded-2xl p-6 mb-4">
            {/* Top row: Estimation label + km/durée en blanc */}
            <div className="flex items-start justify-between mb-1 gap-4">
              <p className="text-white text-xs uppercase tracking-widest">Estimation</p>
              <div className="text-right shrink-0">
                <p className="text-white text-xs">Distance : {prix.distanceKm} km</p>
                <p className="text-white text-xs">Durée estimée : {prix.dureeMin} min</p>
              </div>
            </div>
            <p className="font-heading text-white text-5xl font-light mb-4">{prix.prixFinal} €</p>
            {(prix.majoration || prix.supplements.length > 0) && (
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                {prix.majoration && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-white/50">{prix.majoration}</span>
                    <span className="text-white/40 text-xs">inclus</span>
                  </div>
                )}
                {prix.supplements.map(s => (
                  <div key={s.label} className="flex justify-between text-sm items-center">
                    <span className="text-white/50">{s.label}</span>
                    <span className="text-white/70 text-xs">+{s.montant} € · inclus</span>
                  </div>
                ))}
                <p className="text-amber-400/70 text-xs mt-1 leading-relaxed border-t border-white/8 pt-3">
                  Le tarif affiché est le total final — toutes majorations déjà comprises.
                </p>
              </div>
            )}
          </div>
        )}

        {prix && !loading && (() => {
          const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
          return (
            <>
              {/* Champ email facultatif */}
              <div className="mb-4">
                <p className="text-sm text-[#091424]/60 mb-1 leading-relaxed">
                  Recevoir un mail de confirmation ?
                  <span className="text-[#091424]/30"> (facultatif)</span>
                </p>
                <input
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="exemple@mail.com"
                  className={`w-full bg-[#091424]/4 border rounded-xl px-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:ring-2 transition-all ${
                    form.email && !emailValid
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : emailValid
                      ? "border-[#1FA3BA]/50 focus:border-[#1FA3BA] focus:ring-[#1FA3BA]/15"
                      : "border-[#091424]/10 focus:border-[#1FA3BA] focus:ring-[#1FA3BA]/15"
                  }`}
                />
                {form.email && !emailValid && <p className="text-xs text-red-500 mt-1.5">Adresse email invalide</p>}
                {emailValid && <p className="text-xs text-[#1FA3BA] mt-1.5 flex items-center gap-1"><CheckCircle size={12} /> Email vérifié</p>}
              </div>

              <div className="flex items-center gap-3 bg-[#1FA3BA]/8 border border-[#1FA3BA]/20 rounded-xl px-4 py-3 mb-2">
                <CheckCircle size={15} className="text-[#1FA3BA] shrink-0" />
                <p className="text-sm text-[#091424]/70">Paiement directement auprès du chauffeur à bord.</p>
              </div>
              <ContinueBtn
                label="Envoyer ma demande"
                disabled={form.email !== "" && !emailValid}
                onClick={() => { setConfirmed(true); createCalendarEvent(); }}
              />
            </>
          );
        })()}
      </>
    );

    return null;
  };

  // ─── CONVERSATIONAL SHELL ───
  const isFirstConvStep = step === "firstName";
  const activeSteps = form.tripType === "AR" ? STEPS_AR : STEPS_AS;
  const currentIdx  = activeSteps.indexOf(step as StepId);
  const progress    = currentIdx >= 0 ? (currentIdx + 1) / activeSteps.length : 1 / STEPS_AS.length;

  return (
    <div ref={containerRef}>
      <div className="bg-white rounded-3xl shadow-sm border border-[#091424]/5">

        {/* Progress bar */}
        <div className="h-0.5 bg-[#091424]/6">
          <div className="h-full bg-[#1FA3BA] transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* Question active */}
        <div className="px-8 py-8 lg:px-12 lg:py-10">
          {!isFirstConvStep && (
            <button onClick={() => {
              const prev = thread[thread.length - 1];
              if (!prev) { setStep("intro"); return; }
              setThread(t => t.slice(0,-1));
              const steps: StepId[] = ["firstName","lastName","phone","tripType","pickup","datetime","destination","returnDestination","retourDatetime","price"];
              const idx = steps.indexOf(step as StepId);
              setStep(idx > 0 ? steps[idx-1] : "intro");
            }} className="flex items-center gap-2 text-sm font-medium text-[#091424]/70 hover:text-[#091424] transition-colors mb-8 border border-[#091424]/10 hover:border-[#091424]/25 rounded-full px-4 py-2 w-fit">
              <ArrowLeft size={15} /> Retour
            </button>
          )}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
