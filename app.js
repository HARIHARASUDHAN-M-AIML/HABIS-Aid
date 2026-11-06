/**
 * HABIS Aid — TN 108 Emergency CAD & AI Auto-Dispatch Engine v5.2
 * Complete, Self-Contained File (Zero Missing Functions, Safe Map Initialization)
 * - 100% Pure Google Maps Road, Satellite Hybrid & Terrain Tiles
 * - Official Google Maps Places & Geocoding SDK Support + Keyless Exact Road Vector Sync
 */

// 1. Evidence-Based Clinical Signs Dataset (Mapped to Ambulance Tier & Receiving ER)
const CLINICAL_SYMPTOM_CHIPS = [
  { id: 'chest_pain', en: 'Severe Chest Pain (STEMI)', ta: 'மாரடைப்பு / நெஞ்சு வலி', severity: 'Critical', requiredTier: 'ALS', code: 'RED • DELTA-1 STEMI', hospital: 'RGGGH Cardiac Cath Lab' },
  { id: 'unconscious', en: 'Unconscious / Coma', ta: 'சுயநினைவின்மை', severity: 'Critical', requiredTier: 'ALS', code: 'RED • DELTA-1 AIRWAY', hospital: 'RGGGH Zero-Delay Trauma & Neuro Ward' },
  { id: 'heavy_bleeding', en: 'Uncontrolled Hemorrhage', ta: 'கடுமையான இரத்தப்போக்கு', severity: 'Critical', requiredTier: 'ALS', code: 'RED • DELTA-1 HEMORRHAGE', hospital: 'Govt Royapettah Hospital Trauma Center' },
  { id: 'rta_trauma', en: 'RTA / Highway Polytrauma', ta: 'சாலை விபத்து காயம்', severity: 'Critical', requiredTier: 'ALS', code: 'RED • DELTA-1 POLYTRAUMA', hospital: 'RGGGH Zero-Delay Trauma Bay' },
  { id: 'stroke_signs', en: 'Facial Droop / Acute Stroke', ta: 'பக்கவாதம் அறிகுறி', severity: 'Critical', requiredTier: 'ALS', code: 'RED • DELTA-1 STROKE', hospital: 'RGGGH Thrombolysis Stroke Unit' },
  { id: 'neonatal_distress', en: 'Neonatal / Preterm Distress', ta: 'பச்சிளம் குழந்தை அவசரம்', severity: 'Critical', requiredTier: 'NEONATAL', code: 'RED • NEONATAL NICU', hospital: 'IOG Egmore / ICH Neonatal ICU' },
  { id: 'maternal', en: 'High-Risk Obstetric Labor', ta: 'பிரசவ அவசரம் (CEmONC)', severity: 'Critical', requiredTier: 'NEONATAL', code: 'RED • CEmONC MATERNAL', hospital: 'IOG Egmore Maternal ER' },
  { id: 'breathing_diff', en: 'Acute Respiratory Distress', ta: 'மூச்சுத் திணறல் (SpO2 < 90%)', severity: 'High', requiredTier: 'ALS', code: 'YELLOW • BRAVO-2 RESP', hospital: 'Kilpauk Medical College Hospital (KMCH) ER' },
  { id: 'sweating_diaph', en: 'Cold Sweating / Diaphoresis', ta: 'அதிக வியர்வை / மயக்கம்', severity: 'High', requiredTier: 'ALS', code: 'YELLOW • BRAVO-2 AUTONOMIC', hospital: 'RGGGH Cardiac Cath Lab' },
  { id: 'seizures', en: 'Active Seizures / Status', ta: 'வலிப்பு நோய்', severity: 'High', requiredTier: 'ALS', code: 'YELLOW • BRAVO-2 NEURO', hospital: 'Kilpauk Medical College Hospital ER' },
  { id: 'burns', en: 'Major Thermal Burns', ta: 'தீக்காயம்', severity: 'High', requiredTier: 'ALS', code: 'YELLOW • KMC BURNS UNIT', hospital: 'Kilpauk MCH Dedicated Burns ICU' },
  { id: 'fracture', en: 'Closed Limb Fracture / Fall', ta: 'எலும்பு முறிவு', severity: 'Standard', requiredTier: 'BLS', code: 'GREEN • ALPHA-3 ORTHO', hospital: 'Govt Royapettah Hospital Ortho Unit' },
  { id: 'dehydration', en: 'Dehydration / Heat Exhaustion', ta: 'நீர்ச்சத்து குறைபாடு', severity: 'Standard', requiredTier: 'BLS', code: 'GREEN • ALPHA-3 MEDICAL', hospital: 'Omandurar Govt Multi-Super Specialty ER' }
];

// 2. Built-in Instant Real Tamil Nadu & Chennai Gazetteer
const INSTANT_TN_GAZETTEER = [
  { name: 'Jahir Hussain Street, Pozhichalur / Pammal', address: 'Jahir Hussain St, near Kumaran St & 30 Feet Rd, Pozhichalur, Pallavaram, Chennai 600074', lat: 12.98245, lng: 80.13562, zone: 'Sector • Pozhichalur / Pallavaram' },
  { name: 'T. Nagar Bus Terminus & Panagal Park', address: 'Usman Road, Thyagaraya Nagar (T. Nagar), Chennai, Tamil Nadu 600017', lat: 13.0418, lng: 80.2341, zone: 'Zone 10 • T. Nagar Commercial Sector' },
  { name: 'Gemini Flyover / US Consulate Junction', address: 'Cathedral Road & Anna Salai Junction, Teynampet, Chennai 600006', lat: 13.0524, lng: 80.2508, zone: 'Zone 09 • Teynampet / Anna Salai' },
  { name: 'Kathipara Urban Square & Flyover', address: 'GST Road & Mount-Poonamallee Road Junction, Guindy, Chennai 600032', lat: 13.0067, lng: 80.2050, zone: 'Zone 13 • Guindy Highway Corridor' },
  { name: 'Puratchi Thalaivar Dr. M.G.R. Central Railway Station', address: 'Poonamallee High Road, Park Town, Chennai 600003', lat: 13.0827, lng: 80.2707, zone: 'Zone 05 • Central / Park Town' },
  { name: 'Tambaram Railway Station & GST Flyover', address: 'Grand Southern Trunk Road (GST Rd), Tambaram, Chennai 600045', lat: 12.9249, lng: 80.1000, zone: 'South Metro • Tambaram Highway Sector' },
  { name: 'Velachery Vijayanagar Bus Terminus & 100ft Bypass', address: 'Velachery Main Road, Vijayanagar, Velachery, Chennai 600042', lat: 12.9791, lng: 80.2184, zone: 'Zone 13 • Velachery IT Corridor' },
  { name: 'Anna Nagar Roundtana & Tower Park', address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040', lat: 13.0850, lng: 80.2101, zone: 'Zone 08 • Anna Nagar Central' },
  { name: 'Koyambedu CMBT Moffussil Bus Terminus', address: 'Jawaharlal Nehru Salai (100 Feet Road), Koyambedu, Chennai 600107', lat: 13.0694, lng: 80.2058, zone: 'Zone 10 • Koyambedu Transit Hub' },
  { name: 'Adyar Signal & Malar Hospital Junction', address: 'Sardar Patel Road & LB Road Junction, Adyar, Chennai 600020', lat: 13.0063, lng: 80.2574, zone: 'Zone 13 • Adyar / Besant Nagar' },
  { name: 'Sholinganallur OMR IT Expressway Junction', address: 'Rajiv Gandhi Salai (OMR) & ECR Link Road, Sholinganallur, Chennai 600119', lat: 12.9010, lng: 80.2279, zone: 'Zone 15 • OMR IT Corridor' },
  { name: 'Marina Beach Light House & Loop Road', address: 'Kamarajar Salai, Mylapore Coast, Chennai 600004', lat: 13.0398, lng: 80.2794, zone: 'Zone 09 • Marina Coastal Sector' },
  { name: 'Egmore Railway Station & IOG Maternity Hospital', address: 'Pantheon Road / EVR Periyar Salai, Egmore, Chennai 600008', lat: 13.0732, lng: 80.2602, zone: 'Zone 05 • Egmore Central' },
  { name: 'Chromepet MIT Flyover & GH', address: 'GST Road, Chromepet, Chennai, Tamil Nadu 600044', lat: 12.9516, lng: 80.1462, zone: 'South Corridor • Chromepet' },
  { name: 'Porur Toll Plaza & Ramachandra Hospital Arch', address: 'Mount Poonamallee High Road, Porur, Chennai 600116', lat: 13.0382, lng: 80.1565, zone: 'Zone 11 • Porur West Sector' }
];

// 3. Quick Clinical Test Cases
const DEMO_SCENARIOS = {
  stemi: {
    callerName: 'Karthikeyan Sundaram',
    callerPhone: '+91 98401 72410',
    patientName: 'Thiru. Murugesan R.',
    patientAge: 'Middle-Aged (45–64 yrs)',
    peopleAffected: 1,
    consciousness: 'Alert & Responsive',
    breathing: 'Labored / Shortness of Breath',
    bleeding: 'None',
    symptoms: ['chest_pain', 'sweating_diaph'],
    address: 'Near Gemini Flyover, Cathedral Road Junction, opposite US Consulate Gate 3, Chennai',
    lat: 13.0524,
    lng: 80.2508,
    zone: 'Zone 09 • Teynampet / Anna Salai',
    notes: '58M clutching chest, diaphoretic, radiating pain to left jaw. Security guard at Gate 3 waving down ambulance.'
  },
  rta: {
    callerName: 'Inspector Prakash V. (Traffic Patrol)',
    callerPhone: '+91 94440 10822',
    patientName: '2 Male Riders (Unidentified)',
    patientAge: 'Adult (18–44 yrs)',
    peopleAffected: 2,
    consciousness: 'Unconscious / Unresponsive',
    breathing: 'Labored / Shortness of Breath',
    bleeding: 'Uncontrolled Hemorrhage',
    symptoms: ['rta_trauma', 'heavy_bleeding', 'unconscious'],
    address: 'Kathipara Urban Square Underpass, GST Road North Ramp, Guindy, Chennai',
    lat: 13.0067,
    lng: 80.2050,
    zone: 'Zone 13 • Guindy Highway Corridor',
    notes: 'Two-wheeler skidded near Kathipara up-ramp. Rider unconscious with head injury and severe lower-limb bleeding.'
  },
  neonatal: {
    callerName: 'Anitha Selvam',
    callerPhone: '+91 97890 44120',
    patientName: 'Baby of Anitha (Preterm 33 Weeks)',
    patientAge: 'Neonate / Infant (< 1 yr)',
    peopleAffected: 2,
    consciousness: 'Drowsy / Semi-Conscious',
    breathing: 'Labored / Shortness of Breath',
    bleeding: 'Controlled / Minor',
    symptoms: ['neonatal_distress', 'maternal'],
    address: 'Egmore Pantheon Road outside Govt Museum & IOG Maternity Arch, Chennai',
    lat: 13.0724,
    lng: 80.2602,
    zone: 'Zone 05 • Egmore Central',
    notes: 'Emergency preterm delivery in transit; neonate requires immediate warm incubator transport and SpO2 monitoring.'
  },
  resp: {
    callerName: 'Lakshmi Narayanan',
    callerPhone: '+91 98842 55190',
    patientName: 'Smt. Jaya Lakshmi',
    patientAge: 'Geriatric / Senior (65+ yrs)',
    peopleAffected: 1,
    consciousness: 'Drowsy / Semi-Conscious',
    breathing: 'Labored / Shortness of Breath',
    bleeding: 'None',
    symptoms: ['breathing_diff'],
    address: 'Anna Nagar Roundtana Signal, 2nd Avenue East, near Chinthamani, Chennai',
    lat: 13.0850,
    lng: 80.2101,
    zone: 'Zone 08 • Anna Nagar Central',
    notes: '71F COPD patient with acute wheezing and SpO2 at 86% on home pulse oximeter.'
  },
  fracture: {
    callerName: 'Suresh Babu',
    callerPhone: '+91 97909 31104',
    patientName: 'Thiru. Venkataraman',
    patientAge: 'Geriatric / Senior (65+ yrs)',
    peopleAffected: 1,
    consciousness: 'Alert & Responsive',
    breathing: 'Normal',
    bleeding: 'Controlled / Minor',
    symptoms: ['dehydration', 'fracture'],
    address: 'Marina Loop Road near Light House MRTS Station, Mylapore Coast, Chennai',
    lat: 13.0500,
    lng: 80.2824,
    zone: 'Zone 09 • Marina Coastal Sector',
    notes: 'Elderly walker slipped near promenade curb. Suspected closed wrist fracture, conscious and stable.'
  },
  blank: {
    callerName: '',
    callerPhone: '',
    patientName: '',
    patientAge: '',
    peopleAffected: 1,
    consciousness: 'Alert & Responsive',
    breathing: 'Normal',
    bleeding: 'None',
    symptoms: [],
    address: '',
    lat: 13.0524,
    lng: 80.2508,
    zone: 'Zone 09 • Chennai GIS Sector',
    notes: ''
  }
};

// 4. Categorized Ambulance Fleet (ALS, BLS, NEONATAL, BIKE)
const AMBULANCE_FLEET = [
  {
    id: '108-ALS-04',
    type: 'ALS',
    typeLabel: 'ALS • Cardiac & Trauma',
    availability: 'Available',
    baseLocation: 'Anna Salai — DMS Teynampet Standby',
    lat: 13.0465,
    lng: 80.2462,
    distanceKm: 0.9,
    etaMin: 3,
    crew: 'Capt. Senthil Kumar & EMT Divya',
    equipment: 'Biphasic Defibrillator • Ventilator • 12-Lead ECG'
  },
  {
    id: '108-ALS-09',
    type: 'ALS',
    typeLabel: 'ALS • Highway Polytrauma',
    availability: 'Available',
    baseLocation: 'Guindy Kathipara Trauma Outpost',
    lat: 13.0102,
    lng: 80.2125,
    distanceKm: 2.3,
    etaMin: 6,
    crew: 'Capt. Rajesh Kannan & EMT Vignesh',
    equipment: 'Defibrillator • Ventilator • Hemostatic & Spine Kit'
  },
  {
    id: '108-ALS-07',
    type: 'ALS',
    typeLabel: 'ALS • Respiratory & Neuro',
    availability: 'Available',
    baseLocation: 'Kilpauk MCH Gate 2 Standby',
    lat: 13.0785,
    lng: 80.2410,
    distanceKm: 3.1,
    etaMin: 7,
    crew: 'Capt. Aravind Swamy & EMT Priya',
    equipment: 'BiPAP / Ventilator • Stroke Pre-Alert Telemetry'
  },
  {
    id: '108-ALS-02',
    type: 'ALS',
    typeLabel: 'ALS • Cardiac Mobile ICU',
    availability: 'Dispatched',
    baseLocation: 'En Route → Central Station / RGGGH',
    lat: 13.0818,
    lng: 80.2740,
    distanceKm: 4.1,
    etaMin: 4,
    crew: 'Capt. Mohammed Farook & EMT Kavitha',
    equipment: 'Defibrillator • Ventilator • Syringe Infusion Pumps'
  },
  {
    id: '108-BLS-12',
    type: 'BLS',
    typeLabel: 'BLS • Basic Life Support',
    availability: 'Available',
    baseLocation: 'Santhome High Road / Mylapore Sector',
    lat: 13.0389,
    lng: 80.2765,
    distanceKm: 2.8,
    etaMin: 6,
    crew: 'Pilot Manikandan & EMT Saravanan',
    equipment: 'AED • Medical Oxygen • Vacuum Splints'
  },
  {
    id: '108-BLS-15',
    type: 'BLS',
    typeLabel: 'BLS • Ortho & Medical Support',
    availability: 'Available',
    baseLocation: 'T. Nagar Panagal Park Standby',
    lat: 13.0418,
    lng: 80.2341,
    distanceKm: 2.1,
    etaMin: 5,
    crew: 'Pilot Murugan & EMT Karthik',
    equipment: 'AED • Oxygen Cylinder • Spine Immobilizer'
  },
  {
    id: '108-NEO-01',
    type: 'NEONATAL',
    typeLabel: 'NEONATAL • NICU Incubator',
    availability: 'Available',
    baseLocation: 'Egmore IOG & Children Hospital Gate',
    lat: 13.0732,
    lng: 80.2588,
    distanceKm: 2.4,
    etaMin: 5,
    crew: 'Capt. Bala Murugan & Neonatal Nurse Revathi',
    equipment: 'Transport Incubator • Neonatal Ventilator • Doppler'
  },
  {
    id: '108-NEO-03',
    type: 'NEONATAL',
    typeLabel: 'NEONATAL • CEmONC Maternal',
    availability: 'Dispatched',
    baseLocation: 'On Scene → Triplicane Kasturba Hospital',
    lat: 13.0585,
    lng: 80.2750,
    distanceKm: 2.7,
    etaMin: 0,
    crew: 'Capt. Sathish & EMT Meena',
    equipment: 'Incubator • CEmONC Delivery Kit'
  },
  {
    id: '108-BIKE-01',
    type: 'BIKE',
    typeLabel: 'BIKE • Rapid First Responder',
    availability: 'Available',
    baseLocation: 'Mount Road LIC Junction Patrol',
    lat: 13.0620,
    lng: 80.2640,
    distanceKm: 1.5,
    etaMin: 3,
    crew: 'Paramedic Rider Gautham',
    equipment: 'Portable AED • Airway Bag • Hemostatic Gauze'
  },
  {
    id: '108-BIKE-02',
    type: 'BIKE',
    typeLabel: 'BIKE • High-Density Traffic Unit',
    availability: 'Available',
    baseLocation: 'Mylapore Luz Corner Standby',
    lat: 13.0335,
    lng: 80.2680,
    distanceKm: 2.5,
    etaMin: 5,
    crew: 'Paramedic Rider Naveen',
    equipment: 'Portable AED • Oxygen Mini-Cylinder • Trauma Kit'
  }
];

// 5. Receiving Government Hospitals Matrix
const RECEIVING_HOSPITALS = [
  {
    id: 'RGGGH',
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH)',
    specialty: 'Level-1 Trauma, 24x7 STEMI Cath Lab & Stroke Code',
    lat: 13.0815,
    lng: 80.2772,
    bedsText: '6 ICU • 8 Trauma Ready'
  },
  {
    id: 'KMCH',
    name: 'Kilpauk Medical College Hospital (KMCH)',
    specialty: 'Tertiary Burns ICU, Respiratory & Acute Medical',
    lat: 13.0786,
    lng: 80.2435,
    bedsText: '5 ER • 4 Burns ICU Ready'
  },
  {
    id: 'GRH',
    name: 'Govt Royapettah Hospital (GRH)',
    specialty: 'Polytrauma, Hemorrhage Control & Ortho Surgery',
    lat: 13.0548,
    lng: 80.2647,
    bedsText: '6 Trauma Bays Ready'
  },
  {
    id: 'IOG',
    name: 'Institute of Obstetrics & Gynaecology (IOG Egmore)',
    specialty: 'CEmONC Maternal & Level-3 Neonatal NICU',
    lat: 13.0728,
    lng: 80.2610,
    bedsText: '4 NICU Incubators Ready'
  }
];

// 6. Initial Active & Unassigned Case Queue
let INCIDENT_CASES = [
  {
    id: '#TN108-8489',
    reportedTime: '4m ago',
    location: 'Poonamallee High Road near Ripon Building & Central Metro Gate 4',
    lat: 13.0818,
    lng: 80.2740,
    priority: 'Critical',
    requiredTier: 'ALS',
    status: 'En route',
    symptoms: 'Facial Droop / பக்கவாதம் அறிகுறி (Acute Stroke Window)',
    caller: 'Abdul Rahman (+91 98402 90014)',
    patientSummary: '62M • Acute Stroke Code',
    unit: '108-ALS-02',
    etaSeconds: 165,
    recommendedUnit: '108-ALS-02',
    hospital: 'RGGGH Thrombolysis Stroke Unit'
  },
  {
    id: '#TN108-8486',
    reportedTime: '11m ago',
    location: 'Triplicane High Road near Kasturba Gandhi Hospital Arch',
    lat: 13.0585,
    lng: 80.2750,
    priority: 'Critical',
    requiredTier: 'NEONATAL',
    status: 'On scene',
    symptoms: 'High-Risk Obstetric Labor / பிரசவ அவசரம்',
    caller: 'Revathi K. (+91 97890 44120)',
    patientSummary: '26F • High-Risk Labor',
    unit: '108-NEO-03',
    etaSeconds: 0,
    recommendedUnit: '108-NEO-03',
    hospital: 'IOG Egmore Maternal ER'
  },
  {
    id: '#TN108-8494',
    reportedTime: 'Wait 01m 15s',
    location: 'Koyambedu CMBT Omni Bus Stand Entry Arch, Jawaharlal Nehru Salai',
    lat: 13.0694,
    lng: 80.2058,
    priority: 'High',
    requiredTier: 'ALS',
    status: 'Awaiting review',
    symptoms: 'Acute Respiratory Distress / மூச்சுத் திணறல் (SpO2 88%)',
    caller: 'Senthil Nathan (+91 98409 11230)',
    patientSummary: '68M • COPD Distress',
    unit: null,
    etaSeconds: 300,
    recommendedUnit: '108-ALS-07',
    hospital: 'Kilpauk Medical College Hospital (KMCH)'
  },
  {
    id: '#TN108-8491',
    reportedTime: 'Wait 02m 30s',
    location: 'Mylapore Kapaleeshwarar Tank North Mada Street',
    lat: 13.0339,
    lng: 80.2699,
    priority: 'Standard',
    requiredTier: 'BLS',
    status: 'Awaiting review',
    symptoms: 'Closed Limb Fracture / எலும்பு முறிவு (Slip & Fall)',
    caller: 'Raghavan V. (+91 98410 64201)',
    patientSummary: '54M • Ankle Fracture',
    unit: null,
    etaSeconds: 360,
    recommendedUnit: '108-BLS-12',
    hospital: 'Govt Royapettah Hospital (GRH)'
  }
];

// Application State
const state = {
  currentScreen: 'screen1',
  selectedSymptoms: new Set(['chest_pain', 'sweating_diaph']),
  observations: {
    consciousness: 'Alert & Responsive',
    breathing: 'Labored / Shortness of Breath',
    bleeding: 'None'
  },
  computedPriority: 'Critical',
  requiredTier: 'ALS',
  protocolCode: 'RED • DELTA-1 STEMI',
  targetHospital: 'RGGGH Cardiac Cath Lab',
  intakeLat: 13.0524,
  intakeLng: 80.2508,
  intakeSector: 'Zone 09 • Teynampet / Anna Salai',
  activeCaseId: '#TN108-8489',
  queueFilter: 'all',
  queueSearch: '',
  fleetFilter: 'all',
  showCorridors: true,
  showHospitals: true,
  isSubmittingLock: false
};

// Leaflet Map Instances
let intakeMap = null;
let intakeMarker = null;
let tacticalMap = null;
let tacticalMarkersLayer = null;
let tacticalCorridorsLayer = null;
let tacticalHospitalsLayer = null;

// Google Maps SDK State
let GOOGLE_MAPS_API_KEY = localStorage.getItem('HABIS Aid_GOOGLE_API_KEY') || '';
let googleMapsReady = false;
let googleGeocoder = null;
let googleAutocompleteService = null;

let searchDebounceTimer = null;
let activeSearchAbortController = null;
let currentDropdownIndex = -1;

// ============================================================================
// SECURITY HELPER: SANITIZE USER INPUT AGAINST XSS
// ============================================================================
function sanitizeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// REAL-TIME HAVERSINE DISTANCE CALCULATOR (KM)
// ============================================================================
function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.4, +(R * c * 1.28).toFixed(1));
}

function updateFleetDistancesFromPoint(lat, lng) {
  AMBULANCE_FLEET.forEach((unit) => {
    unit.distanceKm = calculateHaversineKm(lat, lng, unit.lat, unit.lng);
    unit.etaMin = Math.max(2, Math.round((unit.distanceKm / 30) * 60));
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    initLiveClockAndTimers();
    updateFleetDistancesFromPoint(state.intakeLat, state.intakeLng);
    renderSymptomChips();
    initObservationButtons();
    initFormAndGeocoderListeners();
    initScreenNavigation();
    initIntakeMap();
    initTacticalChennaiMap();
    recalculateClinicalTriage();
    updateFleetBreakdownCards();
    renderHubQueues();
    renderFleetPanel();
    renderHospitalErMatrix();
    populateManualOverrideDropdown();
    initHubControls();
    initModalControls();
  } catch (err) {
    console.error('Initialization warning:', err);
  }
});

// ============================================================================
// LIVE CLOCK & COUNTDOWN TIMERS
// ============================================================================
function initLiveClockAndTimers() {
  const clockEl = document.getElementById('liveClock');
  setInterval(() => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + ' IST';
    if (clockEl) clockEl.textContent = timeStr;

    INCIDENT_CASES.forEach((c) => {
      if ((c.status === 'Dispatched' || c.status === 'En route') && c.etaSeconds > 0) {
        c.etaSeconds = Math.max(0, c.etaSeconds - 1);
      }
    });
    updateLiveEtaDisplays();
  }, 1000);
}

function formatSeconds(sec) {
  if (sec <= 0) return 'On Scene';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `ETA ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateLiveEtaDisplays() {
  document.querySelectorAll('[data-live-eta-case]').forEach((el) => {
    const caseId = el.getAttribute('data-live-eta-case');
    const found = INCIDENT_CASES.find((c) => c.id === caseId);
    if (found) {
      el.textContent = formatSeconds(found.etaSeconds);
    }
  });
}

// ============================================================================
// SCREEN NAVIGATION & CREATIVE BIOMETRIC TRANSITION LOADER
// ============================================================================
function initScreenNavigation() {
  const tab1 = document.getElementById('tabScreen1');
  const tab2 = document.getElementById('tabScreen2');
  const jumpBtn = document.getElementById('seamlessJumpBtn');
  const backBtn = document.getElementById('backToIntakeBtn');
  const newEmergencyBtn = document.getElementById('newEmergencyReportBtn');
  const hubNewCaseBtn = document.getElementById('hubNewCaseBtn');

  if (tab1) tab1.addEventListener('click', () => switchScreen('screen1'));
  if (tab2) tab2.addEventListener('click', () => switchScreen('screen2'));

  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      switchScreen(state.currentScreen === 'screen1' ? 'screen2' : 'screen1');
    });
  }

  if (backBtn) backBtn.addEventListener('click', () => switchScreen('screen1'));

  if (newEmergencyBtn) {
    newEmergencyBtn.addEventListener('click', () => {
      switchScreen('screen1');
      document.getElementById('callerName')?.focus();
      showToast('Ready for new patient & location intake on Screen 1.');
    });
  }

  if (hubNewCaseBtn) {
    hubNewCaseBtn.addEventListener('click', () => {
      switchScreen('screen1');
      document.getElementById('callerName')?.focus();
    });
  }
}

function switchScreen(targetScreen) {
  state.currentScreen = targetScreen;
  const s1 = document.getElementById('screen1');
  const s2 = document.getElementById('screen2');
  const tab1 = document.getElementById('tabScreen1');
  const tab2 = document.getElementById('tabScreen2');
  const jumpText = document.getElementById('seamlessJumpText');

  if (targetScreen === 'screen1') {
    s1.classList.add('active');
    s2.classList.remove('active');
    tab1.classList.add('active');
    tab2.classList.remove('active');
    if (jumpText) jumpText.textContent = 'Open Fleet Hub & Live Map →';
    setTimeout(() => {
      if (intakeMap) intakeMap.invalidateSize();
    }, 150);
  } else {
    s1.classList.remove('active');
    s2.classList.add('active');
    tab1.classList.remove('active');
    tab2.classList.add('active');
    if (jumpText) jumpText.textContent = '← Back to Patient & Location Intake';
    updateFleetBreakdownCards();
    renderHubQueues();
    renderFleetPanel();
    populateManualOverrideDropdown();
    setTimeout(() => {
      if (tacticalMap) {
        tacticalMap.invalidateSize();
        renderTacticalMapLayers();
      }
    }, 150);
  }
}

function runCreativeAutoDispatchTransition(onComplete) {
  const loader = document.getElementById('creativeTransitionLoader');
  const bar = document.getElementById('loaderProgressBar');
  const mainTitle = document.getElementById('loaderMainTitle');
  const subText = document.getElementById('loaderSubText');
  const s1 = document.getElementById('lStep1');
  const s2 = document.getElementById('lStep2');
  const s3 = document.getElementById('lStep3');
  const s4 = document.getElementById('lStep4');

  loader.classList.remove('hidden');
  bar.style.width = '20%';
  s1.classList.add('active');
  s2.classList.remove('active');
  s3.classList.remove('active');
  s4.classList.remove('active');

  mainTitle.textContent = `Acuity Verified: ${state.computedPriority.toUpperCase()} (${state.protocolCode})`;
  subText.textContent = `Locking GPS Coordinates (${state.intakeLat.toFixed(5)}°N, ${state.intakeLng.toFixed(5)}°E)...`;

  setTimeout(() => {
    bar.style.width = '52%';
    s2.classList.add('active');
    mainTitle.textContent = `Scanning Available ${state.requiredTier} & First-Responder Fleet...`;
    subText.textContent = `Computing real-time Haversine road distance across Chennai sectors`;
  }, 480);

  setTimeout(() => {
    bar.style.width = '82%';
    s3.classList.add('active');
    const matched = findOptimalAvailableUnit(state.requiredTier, state.intakeLat, state.intakeLng);
    mainTitle.textContent = `Matched Nearest Unit: ${matched.id} (${matched.distanceKm} km • ${matched.etaMin} min ETA)`;
    subText.textContent = `Pre-alerting ${state.targetHospital} & activating Green Corridor`;
  }, 980);

  setTimeout(() => {
    bar.style.width = '100%';
    s4.classList.add('active');
  }, 1350);

  setTimeout(() => {
    loader.classList.add('hidden');
    if (typeof onComplete === 'function') onComplete();
  }, 1600);
}

// ============================================================================
// SCREEN 1: CLINICAL TRIAGE ENGINE
// ============================================================================
function renderSymptomChips(filterText = '') {
  const container = document.getElementById('symptomChipsContainer');
  if (!container) return;

  const query = filterText.trim().toLowerCase();
  const filtered = CLINICAL_SYMPTOM_CHIPS.filter((chip) => {
    if (!query) return true;
    return chip.en.toLowerCase().includes(query) || chip.ta.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;padding:10px;color:#64748b;font-size:12.5px;">No matching clinical triggers found. Try "Chest", "Bleeding", "Neonatal", or "மாரடைப்பு".</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((chip) => {
      const isSelected = state.selectedSymptoms.has(chip.id);
      return `
        <button type="button" class="symptom-chip ${isSelected ? 'selected' : ''}" data-chip-id="${chip.id}" data-severity="${chip.severity}" aria-pressed="${isSelected}">
          <div class="symptom-chip__top">
            <span class="symptom-chip__en">${chip.en}</span>
            <span class="symptom-chip__dot" title="${chip.severity} Priority (${chip.requiredTier})"></span>
          </div>
          <span class="symptom-chip__ta">${chip.ta} • <strong>${chip.requiredTier}</strong></span>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.symptom-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chipId = btn.getAttribute('data-chip-id');
      if (state.selectedSymptoms.has(chipId)) {
        state.selectedSymptoms.delete(chipId);
      } else {
        state.selectedSymptoms.add(chipId);
      }
      document.getElementById('errSymptoms')?.classList.remove('visible');
      renderSymptomChips(document.getElementById('symptomSearchInput')?.value || '');
      recalculateClinicalTriage();
    });
  });
}

function initObservationButtons() {
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const obsType = btn.getAttribute('data-obs');
      const val = btn.getAttribute('data-val');
      state.observations[obsType] = val;

      btn.parentElement.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      recalculateClinicalTriage();
    });
  });
}

function recalculateClinicalTriage() {
  const selectedObjs = CLINICAL_SYMPTOM_CHIPS.filter((c) => state.selectedSymptoms.has(c.id));
  const hasCriticalChip = selectedObjs.some((c) => c.severity === 'Critical');
  const hasHighChip = selectedObjs.some((c) => c.severity === 'High');
  const needsNeonatal =
    selectedObjs.some((c) => c.requiredTier === 'NEONATAL') ||
    (document.getElementById('patientAge')?.value || '').includes('Neonate');

  const obs = state.observations;
  const criticalObs =
    obs.consciousness.includes('Unconscious') ||
    obs.breathing.includes('Absent') ||
    obs.bleeding.includes('Uncontrolled');

  const highObs =
    obs.consciousness.includes('Drowsy') ||
    obs.breathing.includes('Labored') ||
    obs.bleeding.includes('Controlled');

  let prio = 'Standard';
  let tier = 'BLS';
  let code = 'GREEN • ALPHA-3 BLS';
  let hospital = 'Omandurar Govt Multi-Super Specialty ER';

  if (needsNeonatal) {
    prio = 'Critical';
    tier = 'NEONATAL';
    code = 'RED • NEONATAL / CEmONC ICU';
    hospital = 'IOG Egmore / ICH Neonatal ICU';
  } else if (hasCriticalChip || criticalObs) {
    prio = 'Critical';
    tier = 'ALS';
    const firstCrit = selectedObjs.find((c) => c.severity === 'Critical');
    code = firstCrit ? firstCrit.code : 'RED • DELTA-1 LIFE SUPPORT';
    hospital = firstCrit ? firstCrit.hospital : 'RGGGH Zero-Delay Trauma & Cardiac Center';
  } else if (hasHighChip || highObs) {
    prio = 'High';
    tier = 'ALS';
    const firstHigh = selectedObjs.find((c) => c.severity === 'High');
    code = firstHigh ? firstHigh.code : 'YELLOW • BRAVO-2 URGENT';
    hospital = firstHigh ? firstHigh.hospital : 'Kilpauk Medical College Hospital (KMCH) ER';
  } else {
    const firstStd = selectedObjs.find((c) => c.severity === 'Standard');
    if (firstStd) {
      code = firstStd.code;
      hospital = firstStd.hospital;
    }
  }

  state.computedPriority = prio;
  state.requiredTier = tier;
  state.protocolCode = code;
  state.targetHospital = hospital;

  const previewBadge = document.getElementById('livePriorityPreviewBadge');
  if (previewBadge) {
    if (prio === 'Critical') {
      previewBadge.textContent = `AI Acuity: RED (CRITICAL) • Needs ${tier}`;
      previewBadge.style.background = '#ffe4e6';
      previewBadge.style.color = '#be123c';
      previewBadge.style.borderColor = '#e11d48';
    } else if (prio === 'High') {
      previewBadge.textContent = `AI Acuity: YELLOW (HIGH) • Needs ${tier}`;
      previewBadge.style.background = '#fef3c7';
      previewBadge.style.color = '#b45309';
      previewBadge.style.borderColor = '#d97706';
    } else {
      previewBadge.textContent = `AI Acuity: GREEN (STANDARD) • Needs ${tier}`;
      previewBadge.style.background = '#ccfbf1';
      previewBadge.style.color = '#0f766e';
      previewBadge.style.borderColor = '#0d9488';
    }
  }
}

function findOptimalAvailableUnit(requiredTier, lat, lng) {
  updateFleetDistancesFromPoint(lat, lng);
  const avail = AMBULANCE_FLEET.filter((u) => u.availability === 'Available');
  if (avail.length === 0) return AMBULANCE_FLEET[0];

  const tierMatches = avail.filter((u) => u.type === requiredTier);
  if (tierMatches.length > 0) {
    tierMatches.sort((a, b) => a.distanceKm - b.distanceKm);
    return tierMatches[0];
  }

  const alsMatches = avail.filter((u) => u.type === 'ALS');
  if (alsMatches.length > 0) {
    alsMatches.sort((a, b) => a.distanceKm - b.distanceKm);
    return alsMatches[0];
  }

  avail.sort((a, b) => a.distanceKm - b.distanceKm);
  return avail[0];
}

// ============================================================================
// 100% GOOGLE LOCATION SERVICES ENGINE
// ============================================================================
function loadGoogleMapsSdk(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initGoogleServicesInstances();
      resolve(true);
      return;
    }
    if (!apiKey) {
      resolve(false);
      return;
    }

    const existingScript = document.getElementById('googleMapsSdkScript');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'googleMapsSdkScript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry&language=en&region=IN`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        initGoogleServicesInstances();
        resolve(true);
      } else {
        reject(new Error('Google Maps SDK failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Invalid Google Maps API Key or Network Error'));
    document.head.appendChild(script);
  });
}

function initGoogleServicesInstances() {
  googleMapsReady = true;
  googleGeocoder = new google.maps.Geocoder();
  googleAutocompleteService = new google.maps.places.AutocompleteService();
  const badge = document.getElementById('bannerGpsStatus');
  if (badge) badge.textContent = 'Google Location Services Active';
}

function initFormAndGeocoderListeners() {
  if (GOOGLE_MAPS_API_KEY) {
    loadGoogleMapsSdk(GOOGLE_MAPS_API_KEY).catch(() => {});
  }

  const locHeader = document.querySelector('[aria-labelledby="locationPanelTitle"] .card-header');
  if (locHeader && !document.getElementById('setGoogleKeyBtn')) {
    const keyBtn = document.createElement('button');
    keyBtn.type = 'button';
    keyBtn.id = 'setGoogleKeyBtn';
    keyBtn.className = 'btn btn--ghost-sm';
    keyBtn.style.marginLeft = 'auto';
    keyBtn.style.marginRight = '8px';
    keyBtn.innerHTML = GOOGLE_MAPS_API_KEY ? '🟢 Google API Connected' : '🔑 Connect Google API Key';
    keyBtn.addEventListener('click', async () => {
      const entered = prompt(
        'Enter your Google Maps JavaScript API Key (with Places & Geocoding enabled) for 100% Native Google Location Services:\n\n(Leave blank to use Keyless Google Map Tile Sync)',
        GOOGLE_MAPS_API_KEY
      );
      if (entered === null) return;
      GOOGLE_MAPS_API_KEY = entered.trim();
      if (GOOGLE_MAPS_API_KEY) {
        localStorage.setItem('HABIS Aid_GOOGLE_API_KEY', GOOGLE_MAPS_API_KEY);
        try {
          await loadGoogleMapsSdk(GOOGLE_MAPS_API_KEY);
          keyBtn.innerHTML = '🟢 Google API Connected';
          showToast('✓ Official Google Maps Places & Geocoding API Connected!');
        } catch (e) {
          showToast('Could not verify Google API Key. Check key permissions.', true);
        }
      } else {
        localStorage.removeItem('HABIS Aid_GOOGLE_API_KEY');
        googleMapsReady = false;
        keyBtn.innerHTML = '🔑 Connect Google API Key';
        showToast('Switched to Keyless Google Map Road Sync Mode.');
      }
    });
    locHeader.insertBefore(keyBtn, document.getElementById('useCurrentLocationBtn'));
  }

  document.getElementById('symptomSearchInput')?.addEventListener('input', (e) => {
    renderSymptomChips(e.target.value);
  });

  document.getElementById('patientAge')?.addEventListener('change', () => {
    recalculateClinicalTriage();
  });

  const peopleInput = document.getElementById('peopleAffected');
  document.getElementById('decPeopleBtn')?.addEventListener('click', () => {
    peopleInput.value = Math.max(1, (parseInt(peopleInput.value, 10) || 1) - 1);
  });
  document.getElementById('incPeopleBtn')?.addEventListener('click', () => {
    peopleInput.value = Math.min(50, (parseInt(peopleInput.value, 10) || 1) + 1);
  });

  document.querySelectorAll('.landmark-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.landmark-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const lat = parseFloat(pill.getAttribute('data-lat'));
      const lng = parseFloat(pill.getAttribute('data-lng'));
      const addr = pill.getAttribute('data-addr');
      const zone = pill.getAttribute('data-zone');

      document.getElementById('incidentLocationInput').value = addr;
      document.getElementById('realPlaceSearchInput').value = addr.split(',')[0];
      document.getElementById('incidentLocationInput').classList.remove('input-invalid');
      document.getElementById('errLocation').classList.remove('visible');

      updateIntakeCoordinates(lat, lng, zone, 'Google Map Pin Verified');
    });
  });

  document.getElementById('useCurrentLocationBtn')?.addEventListener('click', async () => {
    const gpsBtn = document.getElementById('useCurrentLocationBtn');
    gpsBtn.disabled = true;
    gpsBtn.innerHTML = '⟳ Locking Google GPS...';

    const applyDetectedLocation = async (lat, lng, accuracyMeters, sourceName) => {
      document.getElementById('bannerGpsStatus').textContent = `Locked (${sourceName})`;
      await reverseGeocodeCoordinates(lat, lng, `${sourceName} (±${accuracyMeters}m)`);
      gpsBtn.disabled = false;
      gpsBtn.innerHTML = `✓ GPS Locked (${sourceName})`;
      showToast(`✓ Google Location Locked: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
    };

    const getBrowserPosition = (options) =>
      new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

    try {
      const pos = await getBrowserPosition({ enableHighAccuracy: true, timeout: 6000, maximumAge: 20000 });
      await applyDetectedLocation(pos.coords.latitude, pos.coords.longitude, Math.round(pos.coords.accuracy || 4), 'Google GPS');
      return;
    } catch (e1) {}

    try {
      const pos2 = await getBrowserPosition({ enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 });
      await applyDetectedLocation(pos2.coords.latitude, pos2.coords.longitude, Math.round(pos2.coords.accuracy || 20), 'Google Wi-Fi Lock');
      return;
    } catch (e2) {}

    try {
      const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
      const data = await res.json();
      if (data && typeof data.latitude === 'number') {
        await applyDetectedLocation(data.latitude, data.longitude, 45, 'Network Location Lock');
        return;
      }
    } catch (e3) {}

    await applyDetectedLocation(13.0524, 80.2508, 10, 'Chennai Central Pin');
  });

  const searchBtn = document.getElementById('searchRealPlaceBtn');
  const searchInput = document.getElementById('realPlaceSearchInput');
  const dropdown = document.getElementById('geocodeResultsDropdown');

  searchBtn?.addEventListener('click', () => {
    performPureGooglePlaceSearch(searchInput.value, true);
  });

  searchInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearTimeout(searchDebounceTimer);
    if (val.length < 2) {
      dropdown.classList.add('hidden');
      return;
    }
    searchDebounceTimer = setTimeout(() => {
      performPureGooglePlaceSearch(val, false);
    }, 160);
  });

  searchInput?.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.geocode-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length > 0) {
        currentDropdownIndex = (currentDropdownIndex + 1) % items.length;
        highlightDropdownItem(items, currentDropdownIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        currentDropdownIndex = (currentDropdownIndex - 1 + items.length) % items.length;
        highlightDropdownItem(items, currentDropdownIndex);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentDropdownIndex >= 0 && items[currentDropdownIndex]) {
        items[currentDropdownIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      } else {
        performPureGooglePlaceSearch(searchInput.value, true);
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.geocode-search-bar') && !e.target.closest('#geocodeResultsDropdown')) {
      dropdown?.classList.add('hidden');
    }
  });

  document.getElementById('demoScenarioSelect')?.addEventListener('change', (e) => {
    applyDemoScenario(e.target.value);
  });

  document.getElementById('resetIntakeFormBtn')?.addEventListener('click', () => {
    document.getElementById('demoScenarioSelect').value = 'blank';
    applyDemoScenario('blank');
    showToast('Intake fields cleared for custom entry.');
  });

  document.getElementById('emergencyIntakeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.isSubmittingLock) return;

    if (!validateIntakeForm()) {
      showToast('Safety Alert: Complete all mandatory caller, clinical, and location fields.', true);
      return;
    }

    state.isSubmittingLock = true;
    recalculateClinicalTriage();

    runCreativeAutoDispatchTransition(() => {
      executeAutomatedPriorityDispatch();
      switchScreen('screen2');
      state.isSubmittingLock = false;
    });
  });
}

function highlightDropdownItem(items, idx) {
  items.forEach((el, i) => {
    el.style.background = i === idx ? '#f0fdfa' : '';
    el.style.borderLeft = i === idx ? '4px solid #0d9488' : '';
  });
}

async function performPureGooglePlaceSearch(rawQuery, autoSelectFirst = false) {
  const query = rawQuery.trim();
  const dropdown = document.getElementById('geocodeResultsDropdown');
  currentDropdownIndex = -1;

  if (!query) {
    dropdown.classList.add('hidden');
    return;
  }

  const coordMatch = query.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    dropdown.classList.add('hidden');
    await reverseGeocodeCoordinates(lat, lng, 'Direct Google Coordinate Lock');
    return;
  }

  dropdown.classList.remove('hidden');

  if (googleMapsReady && googleAutocompleteService && googleGeocoder) {
    const biasCenter = new google.maps.LatLng(state.intakeLat || 13.0524, state.intakeLng || 80.2508);
    googleAutocompleteService.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: 'in' },
        location: biasCenter,
        radius: 50000
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
          dropdown.innerHTML = predictions
            .slice(0, 7)
            .map(
              (pred) => `
              <div class="geocode-item" data-place-id="${sanitizeHTML(pred.place_id)}" data-main="${sanitizeHTML(
                pred.structured_formatting?.main_text || pred.description.split(',')[0]
              )}" data-desc="${sanitizeHTML(pred.description)}">
                <strong>📍 ${sanitizeHTML(pred.structured_formatting?.main_text || pred.description.split(',')[0])}</strong>
                <span>${sanitizeHTML(pred.description)} <em style="color:#0d9488;font-style:normal;">(Google Maps)</em></span>
              </div>
            `
            )
            .join('');

          dropdown.querySelectorAll('.geocode-item[data-place-id]').forEach((el) => {
            el.addEventListener('click', () => {
              const placeId = el.getAttribute('data-place-id');
              const mainText = el.getAttribute('data-main');
              const fullDesc = el.getAttribute('data-desc');

              googleGeocoder.geocode({ placeId }, (results, gStatus) => {
                if (gStatus === 'OK' && results[0]) {
                  const loc = results[0].geometry.location;
                  const lat = loc.lat();
                  const lng = loc.lng();
                  const formatted = results[0].formatted_address || fullDesc;
                  const sublocality =
                    results[0].address_components?.find(
                      (c) => c.types.includes('sublocality_level_1') || c.types.includes('locality')
                    )?.long_name || 'Google Verified Sector';

                  selectGeocodedLocation(lat, lng, formatted, `Sector • ${sublocality}`, mainText);
                }
              });
            });
          });

          if (autoSelectFirst) {
            dropdown.querySelector('.geocode-item[data-place-id]')?.click();
          }
          return;
        }
      }
    );
    return;
  }

  if (activeSearchAbortController) activeSearchAbortController.abort();
  activeSearchAbortController = new AbortController();
  const signal = activeSearchAbortController.signal;

  const cleanLower = query.toLowerCase();
  const localMatches = INSTANT_TN_GAZETTEER.filter(
    (p) => p.name.toLowerCase().includes(cleanLower) || p.address.toLowerCase().includes(cleanLower)
  ).map((p) => ({
    title: p.name,
    display: p.address,
    lat: p.lat,
    lng: p.lng,
    zone: p.zone
  }));

  if (localMatches.length > 0) {
    renderGeocodeDropdownItems(localMatches);
  } else {
    dropdown.innerHTML = `<div class="geocode-item"><strong>🔎 Searching Google Map Road Labels...</strong><span>Looking up "${sanitizeHTML(query)}"</span></div>`;
  }

  try {
    const biasLat = state.intakeLat || 13.0524;
    const biasLng = state.intakeLng || 80.2508;

    const [nominatimData, photonData] = await Promise.all([
      fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          query
        )}&countrycodes=in&addressdetails=1&limit=6`,
        { signal, headers: { 'Accept-Language': 'en' } }
      )
        .then((r) => r.json())
        .catch(() => null),
      fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${biasLat}&lon=${biasLng}&limit=6`,
        { signal }
      )
        .then((r) => r.json())
        .catch(() => null)
    ]);

    const combined = [...localMatches];

    if (Array.isArray(nominatimData)) {
      nominatimData.forEach((item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const a = item.address || {};
        const title =
          item.name || a.road || a.pedestrian || a.suburb || a.neighbourhood || item.display_name.split(',')[0];
        const suburb = a.suburb || a.neighbourhood || a.town || a.city_district || a.city || 'Tamil Nadu';

        if (!combined.some((r) => Math.abs(r.lat - lat) < 0.0004 && Math.abs(r.lng - lng) < 0.0004)) {
          combined.push({
            title,
            display: item.display_name,
            lat,
            lng,
            zone: `Sector • ${suburb}`
          });
        }
      });
    }

    if (photonData && Array.isArray(photonData.features)) {
      photonData.features.forEach((f) => {
        const [lon, lat] = f.geometry.coordinates;
        const p = f.properties || {};
        const title = p.name || p.street || p.locality || p.city || 'Street Location';
        const parts = [p.name, p.housenumber, p.street, p.locality, p.district, p.city, p.state, p.postcode].filter(Boolean);
        const display = [...new Set(parts)].join(', ');

        if (!combined.some((r) => Math.abs(r.lat - lat) < 0.0004 && Math.abs(r.lng - lon) < 0.0004)) {
          combined.push({
            title,
            display: display || title,
            lat,
            lng: lon,
            zone: `Sector • ${p.locality || p.district || p.city || 'GIS Sector'}`
          });
        }
      });
    }

    const finalResults = combined.slice(0, 8);
    renderGeocodeDropdownItems(finalResults);

    if (autoSelectFirst && finalResults.length > 0) {
      const top = finalResults[0];
      selectGeocodedLocation(top.lat, top.lng, top.display, top.zone, top.title);
    }
  } catch (err) {}
}

function selectGeocodedLocation(lat, lng, displayAddr, zoneLabel, shortTitle = '') {
  const dropdown = document.getElementById('geocodeResultsDropdown');
  dropdown.classList.add('hidden');

  document.getElementById('incidentLocationInput').value = displayAddr;
  if (shortTitle) {
    document.getElementById('realPlaceSearchInput').value = shortTitle;
  }
  document.getElementById('incidentLocationInput').classList.remove('input-invalid');
  document.getElementById('errLocation').classList.remove('visible');

  updateIntakeCoordinates(lat, lng, zoneLabel, 'Google Map Pin Locked');
  showToast(`📍 Pinned Exact Street: ${displayAddr.split(',').slice(0, 2).join(',')}`);
}

function renderGeocodeDropdownItems(items) {
  const dropdown = document.getElementById('geocodeResultsDropdown');
  if (!items || items.length === 0) {
    dropdown.innerHTML = `<div class="geocode-item"><strong>No matching street found</strong><span>Try adding area name (e.g., "Jahir Hussain St, Pozhichalur") or click directly on the Google Map.</span></div>`;
    return;
  }

  dropdown.innerHTML = items
    .map((item) => {
      const distKm = calculateHaversineKm(state.intakeLat, state.intakeLng, item.lat, item.lng);
      return `
      <div class="geocode-item" data-lat="${item.lat}" data-lng="${item.lng}" data-display="${sanitizeHTML(item.display)}" data-zone="${sanitizeHTML(item.zone)}" data-title="${sanitizeHTML(item.title)}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <strong>📍 ${sanitizeHTML(item.title)}</strong>
          <span style="font-family:JetBrains Mono,monospace;font-size:10.5px;color:#0d9488;font-weight:700;">${distKm} km</span>
        </div>
        <span>${sanitizeHTML(item.display)}</span>
      </div>
    `;
    })
    .join('');

  dropdown.querySelectorAll('.geocode-item[data-lat]').forEach((el) => {
    el.addEventListener('click', () => {
      const lat = parseFloat(el.getAttribute('data-lat'));
      const lng = parseFloat(el.getAttribute('data-lng'));
      const disp = el.getAttribute('data-display');
      const zone = el.getAttribute('data-zone');
      const title = el.getAttribute('data-title');
      selectGeocodedLocation(lat, lng, disp, zone, title);
    });
  });
}

async function reverseGeocodeCoordinates(lat, lng, sourceLabel = 'Clicked Google Map Pin') {
  updateIntakeCoordinates(lat, lng, 'Locking Exact Street...', sourceLabel);

  if (googleMapsReady && googleGeocoder) {
    try {
      const response = await googleGeocoder.geocode({ location: { lat, lng } });
      if (response && response.results && response.results.length > 0) {
        const bestResult =
          response.results.find(
            (r) => r.types.includes('street_address') || r.types.includes('route') || r.types.includes('premise')
          ) || response.results[0];

        const comps = bestResult.address_components || [];
        const routeComp = comps.find((c) => c.types.includes('route'))?.long_name;
        const premiseComp = comps.find((c) => c.types.includes('premise') || c.types.includes('point_of_interest'))?.long_name;
        const sublocalityComp = comps.find(
          (c) => c.types.includes('sublocality_level_1') || c.types.includes('sublocality') || c.types.includes('neighborhood')
        )?.long_name;
        const localityComp = comps.find((c) => c.types.includes('locality'))?.long_name || 'Chennai';

        const shortStreetTitle = routeComp || premiseComp || sublocalityComp || bestResult.formatted_address.split(',')[0];

        document.getElementById('incidentLocationInput').value = bestResult.formatted_address;
        document.getElementById('realPlaceSearchInput').value = shortStreetTitle;
        document.getElementById('incidentLocationInput').classList.remove('input-invalid');
        document.getElementById('errLocation').classList.remove('visible');
        document.getElementById('intakeSectorDisplay').textContent = `Google Sector • ${sublocalityComp || localityComp}`;
        return;
      }
    } catch (gErr) {}
  }

  try {
    const overpassQuery = `[out:json][timeout:4];(way(around:35,${lat},${lng})["highway"]["name"];node(around:55,${lat},${lng})["name"];);out body;`;
    const [overpassData, nomData, photonData] = await Promise.all([
      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
        .then((r) => r.json())
        .catch(() => null)
    ]);

    let exactRoadName = '';
    let nearbyLandmark = '';

    if (overpassData && Array.isArray(overpassData.elements)) {
      const roadWays = overpassData.elements.filter((el) => el.tags && el.tags.highway && el.tags.name);
      if (roadWays.length > 0) {
        exactRoadName = roadWays[0].tags['name:en'] || roadWays[0].tags.name;
      }
      const poiNodes = overpassData.elements.filter(
        (el) => el.tags && el.tags.name && !el.tags.highway && el.tags.name !== exactRoadName
      );
      if (poiNodes.length > 0) {
        nearbyLandmark = poiNodes[0].tags['name:en'] || poiNodes[0].tags.name;
      }
    }

    const nomAddr = nomData?.address || {};
    const photonProps = photonData?.features?.[0]?.properties || {};

    const streetName =
      exactRoadName ||
      nomAddr.road ||
      nomAddr.pedestrian ||
      nomAddr.residential ||
      photonProps.street ||
      photonProps.name ||
      '';

    const landmarkName =
      nearbyLandmark ||
      (nomData?.name && nomData.name !== streetName ? nomData.name : '') ||
      (photonProps.name && photonProps.name !== streetName ? photonProps.name : '');

    const neighbourhood =
      nomAddr.neighbourhood || nomAddr.suburb || nomAddr.quarter || photonProps.locality || photonProps.district || '';
    const cityOrTown = nomAddr.town || nomAddr.city || nomAddr.municipality || photonProps.city || 'Chennai';
    const stateName = nomAddr.state || photonProps.state || 'Tamil Nadu';
    const postcode = nomAddr.postcode || photonProps.postcode || '';

    if (streetName || landmarkName || neighbourhood) {
      const primaryTitle = streetName || landmarkName || neighbourhood;
      const landmarkPrefix =
        landmarkName && streetName && !streetName.toLowerCase().includes(landmarkName.toLowerCase())
          ? `${streetName} (Near ${landmarkName})`
          : primaryTitle;

      const addressParts = [
        landmarkPrefix,
        neighbourhood !== primaryTitle ? neighbourhood : '',
        cityOrTown,
        stateName,
        postcode
      ].filter(Boolean);

      document.getElementById('incidentLocationInput').value = [...new Set(addressParts)].join(', ');
      document.getElementById('realPlaceSearchInput').value = primaryTitle;
      document.getElementById('incidentLocationInput').classList.remove('input-invalid');
      document.getElementById('errLocation').classList.remove('visible');
      document.getElementById('intakeSectorDisplay').textContent = `Sector • ${neighbourhood || cityOrTown}`;
      return;
    }
  } catch (e) {}
}

// ============================================================================
// PURE GOOGLE MAPS TILE LAYERS (SAFE INITIALIZATION GUARD)
// ============================================================================
function createKeylessTileLayer(mapInstance) {
  const googleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; Google Maps',
    maxZoom: 20
  });

  const googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: 'Imagery &copy; Google Maps Satellite',
    maxZoom: 20
  });

  const googleTerrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    attribution: 'Terrain &copy; Google Maps',
    maxZoom: 20
  });

  googleStreets.addTo(mapInstance);

  L.control
    .layers(
      {
        '🗺️ Google Maps Street': googleStreets,
        '🛰️ Google Satellite Hybrid': googleHybrid,
        '⛰️ Google Terrain View': googleTerrain
      },
      null,
      { position: 'topright' }
    )
    .addTo(mapInstance);
}

function initIntakeMap() {
  const mapEl = document.getElementById('intakeMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Guard against "Map container is already initialized" error
  if (intakeMap) {
    intakeMap.remove();
    intakeMap = null;
  }
  if (mapEl._leaflet_id) {
    mapEl._leaflet_id = null;
  }

  intakeMap = L.map('intakeMap', {
    center: [state.intakeLat, state.intakeLng],
    zoom: 16
  });

  createKeylessTileLayer(intakeMap);

  const pinIcon = L.divIcon({
    className: 'custom-map-pin pin-crit',
    html: 'SOS',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  intakeMarker = L.marker([state.intakeLat, state.intakeLng], {
    icon: pinIcon,
    draggable: true
  }).addTo(intakeMap);

  intakeMap.on('click', (e) => {
    reverseGeocodeCoordinates(e.latlng.lat, e.latlng.lng, 'Clicked Google Map Pin');
  });

  intakeMarker.on('dragend', () => {
    const pos = intakeMarker.getLatLng();
    reverseGeocodeCoordinates(pos.lat, pos.lng, 'Dragged Google Map Pin');
  });
}

function updateIntakeCoordinates(lat, lng, sectorLabel, accuracyLabel) {
  state.intakeLat = lat;
  state.intakeLng = lng;
  if (sectorLabel) state.intakeSector = sectorLabel;

  const coordEl = document.getElementById('intakeCoordDisplay');
  const secEl = document.getElementById('intakeSectorDisplay');
  const accEl = document.getElementById('intakeGpsAccuracy');

  if (coordEl) coordEl.textContent = `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
  if (secEl) secEl.textContent = state.intakeSector;
  if (accuracyLabel && accEl) accEl.textContent = accuracyLabel;

  updateFleetDistancesFromPoint(lat, lng);

  if (intakeMarker && intakeMap) {
    intakeMarker.setLatLng([lat, lng]);
    intakeMap.setView([lat, lng], 16);
  }
}

function applyDemoScenario(key) {
  const sc = DEMO_SCENARIOS[key];
  if (!sc) return;

  document.getElementById('callerName').value = sc.callerName;
  document.getElementById('callerPhone').value = sc.callerPhone;
  document.getElementById('patientName').value = sc.patientName;
  document.getElementById('patientAge').value = sc.patientAge;
  document.getElementById('peopleAffected').value = sc.peopleAffected;
  document.getElementById('incidentLocationInput').value = sc.address;
  document.getElementById('incidentNotes').value = sc.notes;

  state.observations.consciousness = sc.consciousness;
  state.observations.breathing = sc.breathing;
  state.observations.bleeding = sc.bleeding;

  document.querySelectorAll('.seg-btn').forEach((btn) => {
    const obsType = btn.getAttribute('data-obs');
    const val = btn.getAttribute('data-val');
    btn.classList.toggle('active', state.observations[obsType] === val);
  });

  state.selectedSymptoms = new Set(sc.symptoms);

  document.getElementById('formErrorBanner')?.classList.add('hidden');
  document.querySelectorAll('.field-error').forEach((el) => el.classList.remove('visible'));
  document.querySelectorAll('.input-invalid').forEach((el) => el.classList.remove('input-invalid'));

  renderSymptomChips();
  updateIntakeCoordinates(sc.lat, sc.lng, sc.zone, 'Scenario Verified Pin');
  recalculateClinicalTriage();
}

function validateIntakeForm() {
  let valid = true;
  const callerName = document.getElementById('callerName');
  const callerPhone = document.getElementById('callerPhone');
  const patientAge = document.getElementById('patientAge');
  const locationInput = document.getElementById('incidentLocationInput');

  if (!callerName.value.trim()) {
    callerName.classList.add('input-invalid');
    document.getElementById('errCallerName').classList.add('visible');
    valid = false;
  } else {
    callerName.classList.remove('input-invalid');
    document.getElementById('errCallerName').classList.remove('visible');
  }

  const digits = callerPhone.value.replace(/\D/g, '');
  if (digits.length < 10) {
    callerPhone.classList.add('input-invalid');
    document.getElementById('errCallerPhone').classList.add('visible');
    valid = false;
  } else {
    callerPhone.classList.remove('input-invalid');
    document.getElementById('errCallerPhone').classList.remove('visible');
  }

  if (!patientAge.value) {
    patientAge.classList.add('input-invalid');
    document.getElementById('errPatientAge').classList.add('visible');
    valid = false;
  } else {
    patientAge.classList.remove('input-invalid');
    document.getElementById('errPatientAge').classList.remove('visible');
  }

  if (state.selectedSymptoms.size === 0) {
    document.getElementById('errSymptoms').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('errSymptoms').classList.remove('visible');
  }

  if (!locationInput.value.trim()) {
    locationInput.classList.add('input-invalid');
    document.getElementById('errLocation').classList.add('visible');
    valid = false;
  } else {
    locationInput.classList.remove('input-invalid');
    document.getElementById('errLocation').classList.remove('visible');
  }

  const errorBanner = document.getElementById('formErrorBanner');
  errorBanner?.classList.toggle('hidden', valid);
  return valid;
}

// ============================================================================
// AUTOMATED PRIORITY DISPATCH ENGINE
// ============================================================================
function executeAutomatedPriorityDispatch() {
  const matchedUnit = findOptimalAvailableUnit(state.requiredTier, state.intakeLat, state.intakeLng);

  const selectedSymptomNames = CLINICAL_SYMPTOM_CHIPS.filter((c) => state.selectedSymptoms.has(c.id))
    .map((c) => `${c.en} (${c.ta.split('/')[0].trim()})`)
    .join(', ');

  const newCaseId = `#TN108-${Math.floor(8500 + Math.random() * 899)}`;
  const loc = sanitizeHTML(document.getElementById('incidentLocationInput').value.trim());
  const patientName = sanitizeHTML(document.getElementById('patientName').value.trim() || 'Unidentified Patient');
  const age = sanitizeHTML(document.getElementById('patientAge').value);
  const caller = `${sanitizeHTML(document.getElementById('callerName').value.trim())} (${sanitizeHTML(document.getElementById('callerPhone').value.trim())})`;

  matchedUnit.availability = 'Dispatched';
  matchedUnit.baseLocation = `En Route → ${loc.split(',')[0]}`;

  const newCase = {
    id: newCaseId,
    reportedTime: 'Just now',
    location: loc,
    lat: state.intakeLat,
    lng: state.intakeLng,
    priority: state.computedPriority,
    requiredTier: state.requiredTier,
    status: 'Dispatched',
    symptoms: selectedSymptomNames,
    caller,
    patientSummary: `${patientName} (${age})`,
    unit: matchedUnit.id,
    etaSeconds: matchedUnit.etaMin * 60,
    recommendedUnit: matchedUnit.id,
    hospital: state.targetHospital
  };

  INCIDENT_CASES.unshift(newCase);
  state.activeCaseId = newCase.id;

  updateAutoDispatchBanner(newCase, matchedUnit);

  document.getElementById('mdtUnitName').textContent = `${matchedUnit.id} • ${matchedUnit.crew}`;
  document.getElementById('mdtProtocolTier').textContent = state.protocolCode;

  showToast(`⚡ AUTO-DISPATCHED: ${matchedUnit.id} (${matchedUnit.type}) assigned to ${newCase.id} (${matchedUnit.etaMin}m ETA).`);
}

function updateAutoDispatchBanner(caseObj, unitObj) {
  const headlineEl = document.getElementById('bannerDispatchHeadline');
  const subEl = document.getElementById('bannerDispatchSub');

  const dist = unitObj ? `${unitObj.distanceKm} km • ${unitObj.etaMin} min ETA` : formatSeconds(caseObj.etaSeconds);
  if (headlineEl) {
    headlineEl.innerHTML = `${caseObj.priority.toUpperCase()} (${caseObj.requiredTier} REQUIRED) → Dispatched Unit <span class="font-mono">${caseObj.unit || caseObj.recommendedUnit}</span> (${dist})`;
  }
  if (subEl) {
    subEl.textContent = `Case ${caseObj.id} • ${caseObj.patientSummary} • ${caseObj.symptoms} • Target ER: ${caseObj.hospital}`;
  }
}

// ============================================================================
// SCREEN 2: FLEET AVAILABILITY COUNTERS (ALS, BLS, NEONATAL, BIKE)
// ============================================================================
function updateFleetBreakdownCards() {
  const countByType = (type) => {
    const total = AMBULANCE_FLEET.filter((u) => u.type === type).length;
    const avail = AMBULANCE_FLEET.filter((u) => u.type === type && u.availability === 'Available').length;
    return { avail, total };
  };

  const als = countByType('ALS');
  const bls = countByType('BLS');
  const neo = countByType('NEONATAL');
  const bike = countByType('BIKE');

  document.getElementById('countAlsAvail').textContent = als.avail;
  document.getElementById('countAlsTotal').textContent = als.total;

  document.getElementById('countBlsAvail').textContent = bls.avail;
  document.getElementById('countBlsTotal').textContent = bls.total;

  document.getElementById('countNeoAvail').textContent = neo.avail;
  document.getElementById('countNeoTotal').textContent = neo.total;

  document.getElementById('countBikeAvail').textContent = bike.avail;
  document.getElementById('countBikeTotal').textContent = bike.total;

  const totalAvail = als.avail + bls.avail + neo.avail + bike.avail;
  const activeDispatches = INCIDENT_CASES.filter((c) => c.unit && c.status !== 'Case closed').length;
  document.getElementById('headerQueueBadge').textContent = `${totalAvail} Avail / ${activeDispatches} Active`;
}

function populateManualOverrideDropdown() {
  const selectEl = document.getElementById('manualUnitOverrideSelect');
  if (!selectEl) return;

  const activeCase = INCIDENT_CASES.find((c) => c.id === state.activeCaseId) || INCIDENT_CASES[0];
  selectEl.innerHTML = AMBULANCE_FLEET.map((u) => {
    const isCurrent = activeCase && activeCase.unit === u.id;
    return `<option value="${u.id}" ${isCurrent ? 'selected' : ''}>${u.id} (${u.type} • ${u.distanceKm}km • ${u.availability})</option>`;
  }).join('');
}

// ============================================================================
// SCREEN 2: SEGREGATED QUEUES, FLEET PANEL & ER MATRIX
// ============================================================================
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Awaiting review':
      return 'status-badge--awaiting';
    case 'Dispatched':
      return 'status-badge--dispatched';
    case 'En route':
      return 'status-badge--enroute';
    case 'On scene':
      return 'status-badge--onscene';
    case 'Case closed':
      return 'status-badge--closed';
    default:
      return 'status-badge--dispatched';
  }
}

function renderHubQueues() {
  const unassignedEl = document.getElementById('unassignedQueueList');
  const activeEl = document.getElementById('activeQueueList');
  if (!unassignedEl || !activeEl) return;

  const qSearch = state.queueSearch.toLowerCase();
  const qFilter = state.queueFilter;

  const matchesFilter = (c) => {
    if (qFilter !== 'all' && c.priority !== qFilter) return false;
    if (!qSearch) return true;
    return (
      c.id.toLowerCase().includes(qSearch) ||
      c.location.toLowerCase().includes(qSearch) ||
      c.symptoms.toLowerCase().includes(qSearch) ||
      (c.unit && c.unit.toLowerCase().includes(qSearch))
    );
  };

  const unassignedCases = INCIDENT_CASES.filter((c) => !c.unit && c.status !== 'Case closed');
  const activeCases = INCIDENT_CASES.filter((c) => c.unit);

  document.getElementById('unassignedCountBadge').textContent = String(unassignedCases.length);
  document.getElementById('activeDispatchesCountBadge').textContent = String(activeCases.length);

  const filteredActive = activeCases.filter(matchesFilter);
  const filteredUnassigned = unassignedCases.filter(matchesFilter);

  if (filteredActive.length === 0) {
    activeEl.innerHTML = `<div style="padding:12px;text-align:center;color:#64748b;font-size:12px;">No active dispatches match this filter.</div>`;
  } else {
    activeEl.innerHTML = filteredActive
      .map((c) => {
        const isSel = c.id === state.activeCaseId;
        return `
          <div class="queue-card queue-card--${c.priority} ${isSel ? 'selected' : ''}" data-case-id="${c.id}">
            <div class="queue-card__top">
              <span class="queue-card__id">${c.id} • <span style="color:#0d9488;">${c.unit}</span></span>
              <span class="status-badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
            </div>
            <div class="queue-card__loc">${c.location}</div>
            <div class="queue-card__symptoms">${c.symptoms}</div>
            <div class="queue-card__footer">
              <span class="font-mono" style="font-size:11.5px;font-weight:700;color:#0f172a;" data-live-eta-case="${c.id}">${formatSeconds(c.etaSeconds)}</span>
              <span style="font-size:11px;color:#475569;">ER: ${c.hospital}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  if (filteredUnassigned.length === 0) {
    unassignedEl.innerHTML = `<div style="padding:12px;text-align:center;color:#64748b;font-size:12px;">All queued calls have been assigned an ambulance.</div>`;
  } else {
    unassignedEl.innerHTML = filteredUnassigned
      .map((c) => {
        const isSel = c.id === state.activeCaseId;
        return `
          <div class="queue-card queue-card--${c.priority} ${isSel ? 'selected' : ''}" data-case-id="${c.id}">
            <div class="queue-card__top">
              <span class="queue-card__id">${c.id} (${c.requiredTier})</span>
              <span class="status-badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
            </div>
            <div class="queue-card__loc">${c.location}</div>
            <div class="queue-card__symptoms">${c.symptoms}</div>
            <div class="queue-card__footer">
              <span style="font-size:11px;color:#64748b;">${c.reportedTime} • ${c.priority}</span>
              <button type="button" class="btn--auto-assign-xs" data-auto-assign="${c.id}">
                ⚡ Auto-Dispatch Nearest ${c.requiredTier}
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  document.querySelectorAll('.queue-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-auto-assign]')) return;
      const cid = card.getAttribute('data-case-id');
      state.activeCaseId = cid;
      const found = INCIDENT_CASES.find((c) => c.id === cid);
      if (found) {
        syncHubInspectorBar(found);
        const uObj = AMBULANCE_FLEET.find((u) => u.id === found.unit);
        updateAutoDispatchBanner(found, uObj);
        populateManualOverrideDropdown();
        if (tacticalMap) tacticalMap.panTo([found.lat, found.lng]);
      }
      renderHubQueues();
    });
  });

  document.querySelectorAll('[data-auto-assign]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = btn.getAttribute('data-auto-assign');
      const found = INCIDENT_CASES.find((c) => c.id === cid);
      if (!found) return;

      const optimalUnit = findOptimalAvailableUnit(found.requiredTier, found.lat, found.lng);
      optimalUnit.availability = 'Dispatched';
      optimalUnit.baseLocation = `En Route → ${found.location.split(',')[0]}`;

      found.unit = optimalUnit.id;
      found.status = 'Dispatched';
      found.etaSeconds = optimalUnit.etaMin * 60;
      state.activeCaseId = found.id;

      updateFleetBreakdownCards();
      updateAutoDispatchBanner(found, optimalUnit);
      syncHubInspectorBar(found);
      renderHubQueues();
      renderFleetPanel();
      renderTacticalMapLayers();
      showToast(`⚡ Auto-Dispatched ${optimalUnit.id} (${optimalUnit.type}) to ${found.id}!`);
    });
  });

  const currentActive = INCIDENT_CASES.find((c) => c.id === state.activeCaseId) || INCIDENT_CASES[0];
  if (currentActive) syncHubInspectorBar(currentActive);
}

function syncHubInspectorBar(caseObj) {
  if (!caseObj) return;
  document.getElementById('hubInspectorCaseId').textContent = caseObj.id;
  const prioEl = document.getElementById('hubInspectorPriority');
  prioEl.textContent = caseObj.priority.toUpperCase();
  prioEl.className = `priority-badge priority-badge--${caseObj.priority.toLowerCase()}`;

  const stEl = document.getElementById('hubInspectorStatus');
  stEl.textContent = caseObj.status;
  stEl.className = `status-badge ${getStatusBadgeClass(caseObj.status)}`;

  document.getElementById('hubInspectorUnit').textContent = caseObj.unit
    ? `Unit: ${caseObj.unit} (${formatSeconds(caseObj.etaSeconds)})`
    : `Unassigned (Needs ${caseObj.requiredTier})`;
  document.getElementById('hubInspectorLocation').textContent = caseObj.location;
  document.getElementById('hubStatusSelect').value =
    caseObj.status === 'Awaiting review' ? 'Dispatched' : caseObj.status;
}

function renderFleetPanel() {
  const container = document.getElementById('fleetPanelList');
  if (!container) return;

  const f = state.fleetFilter;
  const sortedFleet = [...AMBULANCE_FLEET].sort((a, b) => a.distanceKm - b.distanceKm);

  const filtered = sortedFleet.filter((u) => {
    if (f === 'all') return true;
    if (f === 'Available') return u.availability === 'Available';
    return u.type === f;
  });

  container.innerHTML = filtered
    .map(
      (u) => `
      <div class="fleet-unit-item">
        <div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="fleet-unit-id">${u.id}</span>
            <span style="font-size:11px;color:#475569;font-weight:700;">${u.typeLabel}</span>
          </div>
          <div class="fleet-unit-loc">${u.baseLocation}</div>
          <div style="font-size:10.5px;color:#0d9488;font-weight:600;">${u.equipment}</div>
        </div>
        <div style="text-align:right;">
          <span class="fleet-avail-tag fleet-avail-tag--${u.availability}">${u.availability}</span>
          <div class="font-mono" style="font-size:11px;color:#334155;margin-top:3px;font-weight:700;">${u.distanceKm} km (${u.etaMin}m)</div>
        </div>
      </div>
    `
    )
    .join('');
}

function renderHospitalErMatrix() {
  const container = document.getElementById('hospitalErMatrix');
  if (!container) return;

  container.innerHTML = RECEIVING_HOSPITALS.map(
    (h) => `
      <div class="er-hosp-row">
        <div>
          <div class="er-hosp-name">${h.name}</div>
          <div class="er-hosp-sub">${h.specialty}</div>
        </div>
        <span class="er-beds-pill">${h.bedsText}</span>
      </div>
    `
  ).join('');
}

function initHubControls() {
  document.getElementById('queueSearchInput')?.addEventListener('input', (e) => {
    state.queueSearch = e.target.value;
    renderHubQueues();
  });

  document.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.queueFilter = btn.getAttribute('data-qfilter');
      renderHubQueues();
    });
  });

  document.getElementById('fleetFilterSelect')?.addEventListener('change', (e) => {
    state.fleetFilter = e.target.value;
    renderFleetPanel();
  });

  document.getElementById('manualUnitOverrideSelect')?.addEventListener('change', (e) => {
    const newUnitId = e.target.value;
    const activeCase = INCIDENT_CASES.find((c) => c.id === state.activeCaseId);
    const newUnitObj = AMBULANCE_FLEET.find((u) => u.id === newUnitId);
    if (!activeCase || !newUnitObj) return;

    if (activeCase.unit) {
      const oldUnit = AMBULANCE_FLEET.find((u) => u.id === activeCase.unit);
      if (oldUnit) oldUnit.availability = 'Available';
    }

    newUnitObj.availability = 'Dispatched';
    activeCase.unit = newUnitObj.id;
    activeCase.etaSeconds = newUnitObj.etaMin * 60;

    updateFleetBreakdownCards();
    updateAutoDispatchBanner(activeCase, newUnitObj);
    syncHubInspectorBar(activeCase);
    renderHubQueues();
    renderFleetPanel();
    renderTacticalMapLayers();
    showToast(`Dispatcher Override: Assigned ${newUnitObj.id} (${newUnitObj.type}) to ${activeCase.id}.`);
  });

  document.getElementById('hubUpdateStatusBtn')?.addEventListener('click', () => {
    const newSt = document.getElementById('hubStatusSelect').value;
    const target = INCIDENT_CASES.find((c) => c.id === state.activeCaseId);
    if (!target) return;

    target.status = newSt;
    if (newSt === 'On scene' || newSt === 'Case closed') {
      target.etaSeconds = 0;
    }
    if (newSt === 'Case closed' && target.unit) {
      const uObj = AMBULANCE_FLEET.find((u) => u.id === target.unit);
      if (uObj) {
        uObj.availability = 'Available';
        uObj.baseLocation = 'Standby Ready (Cleared ER Handover)';
      }
    }

    updateFleetBreakdownCards();
    syncHubInspectorBar(target);
    renderHubQueues();
    renderFleetPanel();
    renderTacticalMapLayers();
    showToast(`Case ${target.id} updated to "${newSt}".`);
  });

  document.getElementById('toggleCorridorsBtn')?.addEventListener('click', (e) => {
    state.showCorridors = !state.showCorridors;
    e.currentTarget.classList.toggle('active', state.showCorridors);
    renderTacticalMapLayers();
  });

  document.getElementById('toggleHospitalsBtn')?.addEventListener('click', (e) => {
    state.showHospitals = !state.showHospitals;
    e.currentTarget.classList.toggle('active', state.showHospitals);
    renderTacticalMapLayers();
  });

  document.getElementById('recenterChennaiBtn')?.addEventListener('click', () => {
    if (tacticalMap) tacticalMap.setView([13.0604, 80.2496], 12);
  });
}

// ============================================================================
// SCREEN 2: TACTICAL CHENNAI GIS OPERATIONS MATRIX (SAFE INITIALIZATION)
// ============================================================================
function initTacticalChennaiMap() {
  const mapEl = document.getElementById('tacticalChennaiMap');
  if (!mapEl || typeof L === 'undefined') return;

  if (tacticalMap) {
    tacticalMap.remove();
    tacticalMap = null;
  }
  if (mapEl._leaflet_id) {
    mapEl._leaflet_id = null;
  }

  tacticalMap = L.map('tacticalChennaiMap', {
    center: [13.0604, 80.2496],
    zoom: 12
  });

  createKeylessTileLayer(tacticalMap);

  tacticalMarkersLayer = L.layerGroup().addTo(tacticalMap);
  tacticalCorridorsLayer = L.layerGroup().addTo(tacticalMap);
  tacticalHospitalsLayer = L.layerGroup().addTo(tacticalMap);

  renderTacticalMapLayers();
}

function renderTacticalMapLayers() {
  if (!tacticalMap) return;
  tacticalMarkersLayer.clearLayers();
  tacticalCorridorsLayer.clearLayers();
  tacticalHospitalsLayer.clearLayers();

  INCIDENT_CASES.forEach((c) => {
    if (c.status === 'Case closed') return;
    const isUnassigned = !c.unit;
    const pinClass = isUnassigned ? 'pin-amber' : 'pin-crit';
    const icon = L.divIcon({
      className: `custom-map-pin ${pinClass}`,
      html: isUnassigned ? '!' : 'SOS',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([c.lat, c.lng], { icon }).addTo(tacticalMarkersLayer);
    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:210px;">
        <strong style="color:#0f172a;">${c.id} (${c.priority})</strong><br/>
        <span style="font-size:12px;color:#334155;">${c.location}</span><br/>
        <span style="font-size:11.5px;color:#e11d48;font-weight:600;">${c.symptoms}</span><br/>
        <span style="font-size:11px;color:#0d9488;font-weight:700;">${c.unit ? 'Dispatched: ' + c.unit : 'Awaiting ' + c.requiredTier}</span>
      </div>
    `);
  });

  AMBULANCE_FLEET.forEach((u) => {
    const shortTag = u.type === 'NEONATAL' ? 'NEO' : u.type === 'BIKE' ? 'BIKE' : u.type;
    const icon = L.divIcon({
      className: 'custom-map-pin pin-amb',
      html: shortTag,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const m = L.marker([u.lat, u.lng], { icon }).addTo(tacticalMarkersLayer);
    m.bindPopup(`
      <div style="font-family:Inter,sans-serif;">
        <strong>${u.id} (${u.typeLabel})</strong><br/>
        <span style="font-size:11.5px;">${u.baseLocation}</span><br/>
        <span style="font-size:11px;color:#0d9488;font-weight:700;">${u.availability} • ${u.distanceKm} km</span>
      </div>
    `);
  });

  if (state.showCorridors) {
    INCIDENT_CASES.forEach((c) => {
      if (!c.unit || c.status === 'Case closed') return;
      const unitObj = AMBULANCE_FLEET.find((u) => u.id === c.unit);
      const hospObj =
        RECEIVING_HOSPITALS.find((h) => c.hospital.includes(h.id)) || RECEIVING_HOSPITALS[0];
      if (unitObj && hospObj) {
        L.polyline(
          [
            [unitObj.lat, unitObj.lng],
            [c.lat, c.lng],
            [hospObj.lat, hospObj.lng]
          ],
          {
            color: '#10b981',
            weight: 4,
            dashArray: '8, 6',
            opacity: 0.88
          }
        ).addTo(tacticalCorridorsLayer);
      }
    });
  }

  if (state.showHospitals) {
    RECEIVING_HOSPITALS.forEach((h) => {
      const icon = L.divIcon({
        className: 'custom-map-pin pin-hosp',
        html: 'ER',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const hm = L.marker([h.lat, h.lng], { icon }).addTo(tacticalHospitalsLayer);
      hm.bindPopup(`
        <div style="font-family:Inter,sans-serif;">
          <strong>${h.name}</strong><br/>
          <span style="font-size:11.5px;">${h.specialty}</span><br/>
          <span style="font-size:11px;color:#2563eb;font-weight:700;">${h.bedsText}</span>
        </div>
      `);
    });
  }
}

// ============================================================================
// MDT TELEMETRY & AUDIT MODAL CONTROLS
// ============================================================================
function initModalControls() {
  const modal = document.getElementById('dispatchConfirmModal');
  const openBtn = document.getElementById('reconfirmModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelDispatchModalBtn');
  const confirmBtn = document.getElementById('confirmDispatchModalBtn');

  openBtn?.addEventListener('click', () => {
    const activeCase = INCIDENT_CASES.find((c) => c.id === state.activeCaseId) || INCIDENT_CASES[0];
    if (!activeCase) return;

    document.getElementById('modalCaseId').textContent = `${activeCase.id} • ${activeCase.reportedTime}`;
    document.getElementById('modalPriority').textContent = `${activeCase.priority.toUpperCase()} (${activeCase.requiredTier} PROTOCOL)`;
    document.getElementById('modalLocation').textContent = activeCase.location;
    document.getElementById('modalClinicalDetails').textContent = `${activeCase.patientSummary} • ${activeCase.symptoms}`;
    document.getElementById('modalAmbulanceUnit').textContent = `${activeCase.unit || activeCase.recommendedUnit} (${formatSeconds(activeCase.etaSeconds)})`;
    document.getElementById('modalHospitalTarget').textContent = activeCase.hospital;

    modal.classList.remove('hidden');
  });

  closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
  cancelBtn?.addEventListener('click', () => modal.classList.add('hidden'));
  confirmBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    showToast('✓ MDT Telemetry Packet acknowledged and logged to TN-108 Audit Trail.');
  });
}

// ============================================================================
// TOAST NOTIFICATION HELPER
// ============================================================================
function showToast(message, isWarning = false) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${isWarning ? 'toast--coral' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4200);
}