"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Car, Phone, MapPin,
  Calendar, CheckCircle, Clock, Send, ChevronRight, Loader2
} from "lucide-react";
import { calculerPrix, type PrixResult } from "@/lib/pricing";
import AddressAutocomplete from "./AddressAutocomplete";

/* ─── Types ─── */
type Path = "standard" | "custom" | null;
type TripType = "AS" | "AR" | null;

interface FormData {
  path: Path;
  tripType: TripType;
  firstName: string;
  lastName: string;
  phone: string;
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
  phone: "",
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

/* ─── Mock slots ─── */
const DAYS = ["Lun 21", "Mar 22", "Mer 23", "Jeu 24", "Ven 25", "Sam 26", "Dim 27"];
const HOURS = ["05:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
const AVAILABLE: Record<string, string[]> = {
  "Lun 21": ["05:00", "08:00", "14:00", "20:00"],
  "Mar 22": ["06:00", "10:00", "16:00", "22:00"],
  "Mer 23": ["05:00", "12:00", "18:00"],
  "Jeu 24": ["08:00", "14:00", "20:00"],
  "Ven 25": ["06:00", "10:00", "16:00"],
  "Sam 26": ["05:00", "08:00", "12:00", "22:00"],
  "Dim 27": ["10:00", "18:00"],
};

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

function AddressInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA]" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl pl-9 pr-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
        />
      </div>
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

/* ─── Main component ─── */
export default function ReservationTool() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [customSent, setCustomSent] = useState(false);
  const [prix, setPrix] = useState<PrixResult | null>(null);
  const [loadingPrix, setLoadingPrix] = useState(false);
  const [erreurPrix, setErreurPrix] = useState<string | null>(null);
  const [heureDepart, setHeureDepart] = useState(9);
  const [jourSemaine, setJourSemaine] = useState(new Date().getDay());

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
    if (step === 4) calculerDistance();
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
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1FA3BA]" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="+262 6XX XX XX XX"
                className="w-full bg-[#F5F4F0] border border-[#091424]/10 rounded-xl pl-9 pr-4 py-3 text-sm text-[#091424] placeholder-[#091424]/30 focus:outline-none focus:border-[#1FA3BA] focus:ring-2 focus:ring-[#1FA3BA]/15 transition-all"
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

  /* ── STEP 3 — Trajet + Véhicule ── */
  if (step === 3) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={3} total={5} />
        <StepHeader title="Votre trajet" sub="Renseignez les adresses de prise en charge et de destination." />

        {/* Véhicule */}
        <div className="flex items-center gap-4 bg-[#091424] rounded-2xl px-5 py-4 mb-6">
          <div className="w-10 h-10 bg-[#1FA3BA]/20 rounded-xl flex items-center justify-center shrink-0">
            <Car size={18} className="text-[#1FA3BA]" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">SUV Premium — GS Transport</p>
            <p className="text-white/50 text-xs mt-0.5">4 passagers · Climatisée · Bagages inclus</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[#1FA3BA] font-bold text-sm">5★</span>
            <span className="text-white/40 text-xs">+50 avis</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AddressAutocomplete
            label="Adresse de prise en charge"
            value={form.pickup}
            onChange={v => set("pickup", v)}
            placeholder="Ex : Aéroport Roland Garros, Sainte-Marie"
          />
          <AddressAutocomplete
            label="Destination"
            value={form.destination}
            onChange={v => set("destination", v)}
            placeholder="Ex : Hôtel Iloha, Saint-Leu"
          />

          {form.tripType === "AR" && (
            <div className="border-t border-[#091424]/8 pt-4 mt-1">
              <p className="text-xs font-medium text-[#091424]/50 uppercase tracking-wide mb-4">Trajet retour</p>
              <div className="flex flex-col gap-4">
                <AddressAutocomplete
                  label="Adresse de prise en charge (retour)"
                  value={form.returnPickup}
                  onChange={v => set("returnPickup", v)}
                  placeholder="Ex : Hôtel Iloha, Saint-Leu"
                />
                <AddressAutocomplete
                  label="Destination (retour)"
                  value={form.returnDestination}
                  onChange={v => set("returnDestination", v)}
                  placeholder="Ex : Aéroport Roland Garros"
                />
              </div>
            </div>
          )}
        </div>

        <NavButtons
          onBack={back}
          onNext={next}
          nextDisabled={!form.pickup || !form.destination}
        />
      </div>
    </div>
  );

  /* ── STEP 4 — Prix estimé ── */
  if (step === 4) return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
        <Progress step={4} total={5} />
        <StepHeader title="Estimation du tarif" sub="Prix calculé selon la distance réelle. Paiement à bord." />

        {/* Résumé trajet */}
        <div className="bg-[#F5F4F0] rounded-2xl p-5 mb-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#1FA3BA] mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-[#091424]/40 uppercase tracking-wide">Départ</p>
              <p className="text-sm text-[#091424] font-medium">{form.pickup}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#091424] mt-1.5 shrink-0" />
            <div>
              <p className="text-xs text-[#091424]/40 uppercase tracking-wide">Arrivée</p>
              <p className="text-sm text-[#091424] font-medium">{form.destination}</p>
            </div>
          </div>
        </div>

        {/* Heure de départ */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">
            Heure de départ prévue
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0} max={23} step={1}
              value={heureDepart}
              onChange={e => setHeureDepart(Number(e.target.value))}
              className="flex-1 accent-[#1FA3BA]"
            />
            <span className="text-[#091424] font-medium text-sm w-12 text-right">
              {String(heureDepart).padStart(2, "0")}h00
            </span>
          </div>
          {(heureDepart >= 22 || heureDepart < 5) && (
            <p className="text-xs text-[#1FA3BA]">Majoration nuit +25% appliquée</p>
          )}
        </div>

        {/* Jour */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-xs font-medium text-[#091424]/60 uppercase tracking-wide">Jour de la course</label>
          <div className="flex gap-1.5 flex-wrap">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((j, i) => (
              <button
                key={j}
                onClick={() => setJourSemaine(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  jourSemaine === i
                    ? "bg-[#091424] text-white border-[#091424]"
                    : "bg-[#F5F4F0] text-[#091424]/60 border-[#091424]/10 hover:border-[#091424]/30"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
          {jourSemaine === 0 && (
            <p className="text-xs text-[#1FA3BA]">Supplément dimanche +10€ appliqué</p>
          )}
        </div>

        {/* Recalculer si heure/jour changé */}
        <button
          onClick={calculerDistance}
          className="w-full mb-4 py-2 text-xs text-[#1FA3BA] border border-[#1FA3BA]/20 rounded-xl hover:bg-[#1FA3BA]/5 transition-all"
        >
          Recalculer le prix
        </button>

        {/* Prix */}
        {loadingPrix && (
          <div className="bg-[#091424] rounded-2xl p-8 mb-4 text-center">
            <Loader2 size={28} className="text-white/40 mx-auto animate-spin" />
            <p className="text-white/40 text-xs mt-3">Calcul de la distance en cours…</p>
          </div>
        )}

        {erreurPrix && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 text-center">
            <p className="text-red-600 text-sm">{erreurPrix}</p>
            <button onClick={calculerDistance} className="text-xs text-red-400 mt-2 underline">Réessayer</button>
          </div>
        )}

        {prix && !loadingPrix && (
          <div className="bg-[#091424] rounded-2xl p-6 mb-4">
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

            {/* Détail */}
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

        <div className="flex items-center gap-3 bg-[#1FA3BA]/8 border border-[#1FA3BA]/20 rounded-xl px-4 py-3">
          <CheckCircle size={15} className="text-[#1FA3BA] shrink-0" />
          <p className="text-sm text-[#091424]/70">Le paiement s'effectue directement auprès du chauffeur à bord du véhicule.</p>
        </div>

        <NavButtons onBack={back} onNext={next} nextDisabled={!prix} />
      </div>
    </div>
  );

  /* ── STEP 5 — Créneaux ── */
  if (step === 5) {
    if (confirmed) return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-14 shadow-sm border border-[#091424]/5 text-center">
          <div className="w-16 h-16 bg-[#1FA3BA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={30} className="text-[#1FA3BA]" />
          </div>
          <h3 className="font-heading text-[#091424] text-2xl lg:text-3xl font-light mb-3">
            Réservation confirmée !
          </h3>
          <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            Sébastien a bien reçu votre demande. Vous recevrez une confirmation par SMS au <span className="text-[#091424] font-medium">{form.phone}</span> dans les 15 minutes.
          </p>
          <div className="bg-[#F5F4F0] rounded-2xl p-5 text-left flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Client</span>
              <span className="text-[#091424] font-medium">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Créneau</span>
              <span className="text-[#091424] font-medium">{form.slot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Trajet</span>
              <span className="text-[#091424] font-medium">{form.tripType === "AR" ? "Aller-retour" : "Aller simple"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#091424]/50">Paiement</span>
              <span className="text-[#091424] font-medium">À bord</span>
            </div>
          </div>
          <button onClick={() => { setStep(0); setForm(INITIAL); setConfirmed(false); setSelectedDay(null); }}
            className="text-[#091424]/40 hover:text-[#091424] text-sm transition-colors">
            Faire une nouvelle réservation
          </button>
        </div>
      </div>
    );

    if (form.noDate) return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-14 shadow-sm border border-[#091424]/5 text-center">
          <div className="w-16 h-16 bg-[#091424]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-[#091424]/40" />
          </div>
          <h3 className="font-heading text-[#091424] text-2xl font-light mb-3">
            Pas de problème
          </h3>
          <p className="text-[#091424]/50 text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Sébastien vous contactera au <span className="text-[#091424] font-medium">{form.phone}</span> pour convenir d'un créneau ensemble.
            <br /><br />
            <span className="text-[#091424]/70">Il est recommandé de réserver au minimum <strong className="text-[#091424]">24h à l'avance</strong> pour garantir la disponibilité.</span>
          </p>
          <a href="tel:+262693512282"
            className="inline-flex items-center gap-2 bg-[#091424] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#091424]/85 transition-all">
            <Phone size={14} /> Appeler Sébastien
          </a>
          <div className="mt-6">
            <button onClick={() => { setStep(0); setForm(INITIAL); setConfirmed(false); }}
              className="text-[#091424]/40 hover:text-[#091424] text-sm transition-colors">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#091424]/5">
          <Progress step={5} total={5} />
          <StepHeader title="Choisissez votre créneau" sub="Sélectionnez le jour et l'heure qui vous convient." />

          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => { setSelectedDay(d); set("slot", null); }}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  selectedDay === d
                    ? "bg-[#091424] text-white border-[#091424]"
                    : "bg-[#F5F4F0] text-[#091424]/60 border-[#091424]/8 hover:border-[#091424]/20"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Hours */}
          {selectedDay ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
              {HOURS.map(h => {
                const avail = AVAILABLE[selectedDay]?.includes(h);
                const selected = form.slot === `${selectedDay} · ${h}`;
                return (
                  <button
                    key={h}
                    disabled={!avail}
                    onClick={() => set("slot", `${selectedDay} · ${h}`)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      !avail
                        ? "bg-[#F5F4F0]/50 text-[#091424]/20 border-transparent cursor-not-allowed"
                        : selected
                        ? "bg-[#1FA3BA] text-white border-[#1FA3BA]"
                        : "bg-[#F5F4F0] text-[#091424] border-[#091424]/8 hover:border-[#1FA3BA]/40"
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#F5F4F0] rounded-2xl py-10 text-center mb-6">
              <Calendar size={24} className="text-[#091424]/20 mx-auto mb-2" />
              <p className="text-[#091424]/40 text-sm">Sélectionnez un jour</p>
            </div>
          )}

          {/* No date option */}
          <button
            onClick={() => set("noDate", true)}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-[#091424]/20 rounded-xl py-3 text-sm text-[#091424]/50 hover:text-[#091424] hover:border-[#091424]/40 transition-all mb-2"
          >
            <Clock size={14} /> Je ne connais pas encore mes dates
          </button>

          <NavButtons
            onBack={back}
            onNext={() => setConfirmed(true)}
            nextLabel="Confirmer la réservation"
            nextDisabled={!form.slot}
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
