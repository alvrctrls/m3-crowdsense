import {
  DayType,
  PassengerObservation,
  SaccoOperator,
  TimePeriod,
  TransportRoute,
  TransportStage,
} from '../types/transport';

export const NAIROBI_STAGES: TransportStage[] = [
  {
    id: 'stg-kencom',
    code: 'CBD-KCM',
    name: 'Kencom / Ambassador',
    corridor: 'CBD Central · Moi Ave',
    neighbourhood: 'Nairobi CBD',
    coordinates: { lat: -1.2858, lng: 36.8249 },
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa', 'sacco-2nk'],
    routeIds: ['rt-105-westlands', 'rt-111-ngong', 'rt-45-roysambu', 'rt-125-rongai'],
    baselineHourlyCapacity: 420,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Primary multi-corridor boarding bay along Moi Avenue; constrained kerbside queuing space during evening peak.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-railways',
    code: 'CBD-RLW',
    name: 'Railways Bus Terminus',
    corridor: 'CBD South · Haile Selassie',
    neighbourhood: 'Nairobi CBD South',
    coordinates: { lat: -1.2908, lng: 36.8282 },
    saccoIds: ['sacco-citihoppa', 'sacco-embassava', 'sacco-forward'],
    routeIds: ['rt-33-embakasi', 'rt-11-southb', 'rt-125-rongai', 'rt-58-buruburu'],
    baselineHourlyCapacity: 460,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'High-volume southern and eastern corridor terminus adjacent to Nairobi Central Railway Station.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-odeon',
    code: 'CBD-ODN',
    name: 'Odeon / Tom Mboya',
    corridor: 'CBD North · Latema Rd',
    neighbourhood: 'Nairobi CBD North',
    coordinates: { lat: -1.2821, lng: 36.8245 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk', 'sacco-latema'],
    routeIds: ['rt-45-roysambu', 'rt-105-westlands', 'rt-46-kawangware'],
    baselineHourlyCapacity: 380,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Dense northern CBD staging zone serving Thika Road, Waiyaki Way, and Kiambu feeder routes.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-westlands',
    code: 'WAI-WST',
    name: 'Westlands Stage (Sarit / Ring Rd)',
    corridor: 'Waiyaki Way Corridor',
    neighbourhood: 'Westlands',
    coordinates: { lat: -1.2647, lng: 36.8028 },
    saccoIds: ['sacco-supermetro', 'sacco-latema', 'sacco-citihoppa'],
    routeIds: ['rt-105-westlands', 'rt-23-kangemi'],
    baselineHourlyCapacity: 310,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Commercial employment hub with strong bidirectional commuter flow and highway underpass pedestrian access.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-roysambu',
    code: 'THK-RYS',
    name: 'Roysambu / TRM Stage',
    corridor: 'Thika Superhighway',
    neighbourhood: 'Roysambu / Zimmerman',
    coordinates: { lat: -1.2185, lng: 36.8872 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    routeIds: ['rt-45-roysambu', 'rt-17b-kasarani'],
    baselineHourlyCapacity: 360,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Service-lane stage near footbridge; high morning inbound boarding from Zimmerman and Mirema estates.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kasarani',
    code: 'THK-KSR',
    name: 'Kasarani / Mwiki Junction',
    corridor: 'Thika Road · Mwiki Feeder',
    neighbourhood: 'Kasarani',
    coordinates: { lat: -1.2214, lng: 36.8975 },
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    routeIds: ['rt-17b-kasarani', 'rt-45-roysambu'],
    baselineHourlyCapacity: 280,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Primary transfer point for Mwiki and Seasons residential commuters connecting to Thika Highway trunk buses.',
    dataStatus: 'partial_sensor_demo',
    missingFieldsNote: 'Feeder shuttle turnaround counts after 20:00 are interpolated from historical evening ratios.',
  },
  {
    id: 'stg-ngong-prestige',
    code: 'NGG-PRS',
    name: 'Prestige / Adams Arcade',
    corridor: 'Ngong Road Corridor',
    neighbourhood: 'Kilimani / Adams',
    coordinates: { lat: -1.3004, lng: 36.7846 },
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    routeIds: ['rt-111-ngong', 'rt-46-kawangware'],
    baselineHourlyCapacity: 290,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Mid-corridor stage along Ngong Road; experiences through-bus full load conditions during morning peak.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kawangware',
    code: 'WST-KWG',
    name: 'Kawangware 46 / Gatina',
    corridor: 'Naivasha Rd / West Feeder',
    neighbourhood: 'Kawangware',
    coordinates: { lat: -1.2842, lng: 36.7458 },
    saccoIds: ['sacco-latema', 'sacco-citihoppa'],
    routeIds: ['rt-46-kawangware', 'rt-23-kangemi'],
    baselineHourlyCapacity: 270,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'High-density residential origin stage; essential public transport link for daily wage and school commuters.',
    dataStatus: 'partial_sensor_demo',
    missingFieldsNote: 'Midday informal feeder boarding counts have ~84% sample coverage in the demonstration log.',
  },
  {
    id: 'stg-buruburu',
    code: 'JGO-BRB',
    name: 'Buruburu / Donholm Roundabout',
    corridor: 'Jogoo Road Corridor',
    neighbourhood: 'Buruburu / Donholm',
    coordinates: { lat: -1.2895, lng: 36.8831 },
    saccoIds: ['sacco-forward', 'sacco-embassava'],
    routeIds: ['rt-58-buruburu', 'rt-33-embakasi'],
    baselineHourlyCapacity: 390,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Major Eastlands convergence point; high boarding volumes during morning inbound and evening outbound windows.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-embakasi-nyayo',
    code: 'OTR-NYO',
    name: 'Nyayo Gate B / Fedha Stage',
    corridor: 'Outering / Airport North',
    neighbourhood: 'Embakasi / Fedha',
    coordinates: { lat: -1.3148, lng: 36.8962 },
    saccoIds: ['sacco-embassava', 'sacco-forward'],
    routeIds: ['rt-33-embakasi', 'rt-58-buruburu'],
    baselineHourlyCapacity: 350,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Serves dense Embakasi residential estates and industrial area shift commuters along Outering Road.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-south-b',
    code: 'MBS-STB',
    name: 'South B / Capital Centre',
    corridor: 'Mombasa Rd / Lusaka Rd',
    neighbourhood: 'South B / Industrial Area',
    coordinates: { lat: -1.3092, lng: 36.8435 },
    saccoIds: ['sacco-citihoppa', 'sacco-embassava'],
    routeIds: ['rt-11-southb', 'rt-33-embakasi'],
    baselineHourlyCapacity: 260,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Connects South B residential zone and Industrial Area employment corridor with CBD Railways.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-rongai-galleria',
    code: 'LGT-GAL',
    name: 'Bomas / Galleria Junction',
    corridor: 'Langata / Magadi Rd',
    neighbourhood: 'Karen / Langata South',
    coordinates: { lat: -1.3456, lng: 36.7649 },
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa'],
    routeIds: ['rt-125-rongai', 'rt-111-ngong'],
    baselineHourlyCapacity: 240,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Southern gateway transfer node serving Ongata Rongai, Kiserian, and Karen peripheral corridors.',
    dataStatus: 'interpolated_demo',
    missingFieldsNote: 'Weekend headway intervals are estimated from scheduled SACCO dispatch tables.',
  },
];

export const NAIROBI_SACCOS: SaccoOperator[] = [
  {
    id: 'sacco-supermetro',
    code: 'SMET',
    name: 'Super Metro Demo Fleet',
    primaryCorridors: ['Thika Superhighway', 'Waiyaki Way Corridor', 'Ngong Road Corridor'],
    routeIds: ['rt-45-roysambu', 'rt-105-westlands', 'rt-111-ngong', 'rt-125-rongai', 'rt-17b-kasarani'],
    stageIds: ['stg-kencom', 'stg-odeon', 'stg-westlands', 'stg-roysambu', 'stg-kasarani', 'stg-ngong-prestige', 'stg-rongai-galleria'],
    demoActiveVehicles: 145,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'High-capacity commuter coach operator across northern, western, and southern trunk corridors (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-citihoppa',
    code: 'CHOP',
    name: 'Citi Hoppa Demo Transit',
    primaryCorridors: ['CBD Central · Moi Ave', 'Ngong Road Corridor', 'Mombasa Rd / Lusaka Rd'],
    routeIds: ['rt-111-ngong', 'rt-11-southb', 'rt-105-westlands', 'rt-46-kawangware', 'rt-125-rongai'],
    stageIds: ['stg-kencom', 'stg-railways', 'stg-westlands', 'stg-ngong-prestige', 'stg-kawangware', 'stg-south-b', 'stg-rongai-galleria'],
    demoActiveVehicles: 118,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Cross-city stage bus network linking CBD hubs with Kilimani, South B, and Kawangware (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-forward',
    code: 'FRWD',
    name: 'Forward Travellers Demo',
    primaryCorridors: ['Jogoo Road Corridor', 'Outering / Airport North'],
    routeIds: ['rt-58-buruburu', 'rt-33-embakasi'],
    stageIds: ['stg-railways', 'stg-buruburu', 'stg-embakasi-nyayo'],
    demoActiveVehicles: 96,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Eastlands trunk operator connecting Buruburu, Donholm, and Outering estates to CBD South (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-2nk',
    code: '2NKD',
    name: '2NK / Thika Corridor Demo',
    primaryCorridors: ['Thika Superhighway', 'CBD North · Latema Rd'],
    routeIds: ['rt-45-roysambu', 'rt-17b-kasarani'],
    stageIds: ['stg-kencom', 'stg-odeon', 'stg-roysambu', 'stg-kasarani'],
    demoActiveVehicles: 84,
    typicalVehicleCapacity: 14,
    serviceCoverageNote: 'High-frequency shuttle and matatu service along Thika Superhighway and Kasarani feeder links (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-embassava',
    code: 'EMBS',
    name: 'Embassava Demo Operations',
    primaryCorridors: ['Outering / Airport North', 'Jogoo Road Corridor', 'Mombasa Rd / Lusaka Rd'],
    routeIds: ['rt-33-embakasi', 'rt-11-southb', 'rt-58-buruburu'],
    stageIds: ['stg-railways', 'stg-buruburu', 'stg-embakasi-nyayo', 'stg-south-b'],
    demoActiveVehicles: 108,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Embakasi, Nyayo Estate, and Industrial Area commuter network terminating at Railways (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-latema',
    code: 'LATM',
    name: 'Latema / Waiyaki Demo SACCO',
    primaryCorridors: ['Waiyaki Way Corridor', 'Naivasha Rd / West Feeder'],
    routeIds: ['rt-105-westlands', 'rt-46-kawangware', 'rt-23-kangemi'],
    stageIds: ['stg-odeon', 'stg-westlands', 'stg-kawangware'],
    demoActiveVehicles: 76,
    typicalVehicleCapacity: 25,
    serviceCoverageNote: 'Western residential feeder operator serving Odeon, Westlands, Kangemi, and Kawangware (Synthetic Demo Profile).',
  },
];

export const NAIROBI_ROUTES: TransportRoute[] = [
  {
    id: 'rt-45-roysambu',
    routeNumber: 'Route 45',
    name: 'CBD (Odeon / Kencom) ↔ Roysambu / Githurai',
    corridor: 'Thika Superhighway',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-roysambu',
    stageIds: ['stg-kencom', 'stg-odeon', 'stg-roysambu', 'stg-kasarani'],
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    scheduledHeadwayMinutes: { morning_peak: 4, midday: 9, evening_peak: 5 },
    distanceKm: 13.4,
  },
  {
    id: 'rt-17b-kasarani',
    routeNumber: 'Route 17B',
    name: 'CBD (Odeon) ↔ Roysambu ↔ Kasarani / Mwiki',
    corridor: 'Thika Road · Mwiki Feeder',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-kasarani',
    stageIds: ['stg-odeon', 'stg-roysambu', 'stg-kasarani'],
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 11, evening_peak: 6 },
    distanceKm: 15.8,
  },
  {
    id: 'rt-105-westlands',
    routeNumber: 'Route 105 / 23',
    name: 'CBD (Kencom / Odeon) ↔ Westlands ↔ Waiyaki Way',
    corridor: 'Waiyaki Way Corridor',
    originStageId: 'stg-kencom',
    destinationStageId: 'stg-westlands',
    stageIds: ['stg-kencom', 'stg-odeon', 'stg-westlands'],
    saccoIds: ['sacco-supermetro', 'sacco-latema', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 8, evening_peak: 5 },
    distanceKm: 6.2,
  },
  {
    id: 'rt-23-kangemi',
    routeNumber: 'Route 23W',
    name: 'Westlands ↔ Kawangware / Kangemi Link',
    corridor: 'Waiyaki / Naivasha Feeder',
    originStageId: 'stg-westlands',
    destinationStageId: 'stg-kawangware',
    stageIds: ['stg-westlands', 'stg-kawangware'],
    saccoIds: ['sacco-latema'],
    scheduledHeadwayMinutes: { morning_peak: 7, midday: 14, evening_peak: 8 },
    distanceKm: 7.5,
  },
  {
    id: 'rt-111-ngong',
    routeNumber: 'Route 111',
    name: 'CBD (Kencom) ↔ Prestige / Adams ↔ Karen / Ngong',
    corridor: 'Ngong Road Corridor',
    originStageId: 'stg-kencom',
    destinationStageId: 'stg-ngong-prestige',
    stageIds: ['stg-kencom', 'stg-ngong-prestige', 'stg-rongai-galleria'],
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 10, evening_peak: 6 },
    distanceKm: 11.2,
  },
  {
    id: 'rt-46-kawangware',
    routeNumber: 'Route 46',
    name: 'CBD (Odeon) ↔ Adams ↔ Kawangware 46',
    corridor: 'Naivasha Rd / West Feeder',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-kawangware',
    stageIds: ['stg-odeon', 'stg-ngong-prestige', 'stg-kawangware'],
    saccoIds: ['sacco-latema', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 12, evening_peak: 7 },
    distanceKm: 10.6,
  },
  {
    id: 'rt-58-buruburu',
    routeNumber: 'Route 58 / 23E',
    name: 'Railways Terminus ↔ Jogoo Rd ↔ Buruburu / Donholm',
    corridor: 'Jogoo Road Corridor',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-buruburu',
    stageIds: ['stg-railways', 'stg-buruburu', 'stg-embakasi-nyayo'],
    saccoIds: ['sacco-forward', 'sacco-embassava'],
    scheduledHeadwayMinutes: { morning_peak: 4, midday: 9, evening_peak: 5 },
    distanceKm: 9.8,
  },
  {
    id: 'rt-33-embakasi',
    routeNumber: 'Route 33',
    name: 'Railways ↔ South B / Lusaka Rd ↔ Nyayo / Fedha',
    corridor: 'Outering / Airport North',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-embakasi-nyayo',
    stageIds: ['stg-railways', 'stg-south-b', 'stg-buruburu', 'stg-embakasi-nyayo'],
    saccoIds: ['sacco-embassava', 'sacco-forward'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 10, evening_peak: 6 },
    distanceKm: 14.1,
  },
  {
    id: 'rt-11-southb',
    routeNumber: 'Route 11',
    name: 'Railways Terminus ↔ Industrial Area ↔ South B',
    corridor: 'Mombasa Rd / Lusaka Rd',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-south-b',
    stageIds: ['stg-railways', 'stg-south-b'],
    saccoIds: ['sacco-citihoppa', 'sacco-embassava'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 11, evening_peak: 7 },
    distanceKm: 5.4,
  },
  {
    id: 'rt-125-rongai',
    routeNumber: 'Route 125 / 126',
    name: 'CBD (Railways / Kencom) ↔ Bomas / Galleria ↔ Ongata Rongai',
    corridor: 'Langata / Magadi Rd',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-rongai-galleria',
    stageIds: ['stg-kencom', 'stg-railways', 'stg-rongai-galleria'],
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 13, evening_peak: 7 },
    distanceKm: 16.5,
  },
];

/**
 * Stage-specific demand profiles (passengers per 30-min observation window)
 * reflecting Nairobi's commuter directionality:
 * - Outer residential stages (Roysambu, Kasarani, Buruburu, Embakasi, Kawangware)
 *   experience their sharpest spike in the Morning Peak (inbound to CBD/Westlands),
 *   moderate midday, and high evening transfer activity.
 * - CBD & Commercial hubs (Kencom, Railways, Odeon, Westlands) have high morning
 *   arrivals/transfers and their highest boarding queues in the Evening Peak.
 */
export interface StageDemandSignature {
  morningBase: number;
  middayBase: number;
  eveningBase: number;
  morningHeadwayMin: number;
  middayHeadwayMin: number;
  eveningHeadwayMin: number;
  dwellBaseSec: number;
  completeness: number;
}

export const STAGE_SIGNATURES: Record<string, StageDemandSignature> = {
  'stg-kencom': {
    morningBase: 315,
    middayBase: 225,
    eveningBase: 465,
    morningHeadwayMin: 4.5,
    middayHeadwayMin: 7.5,
    eveningHeadwayMin: 6.8,
    dwellBaseSec: 98,
    completeness: 0.98,
  },
  'stg-railways': {
    morningBase: 350,
    middayBase: 245,
    eveningBase: 490,
    morningHeadwayMin: 4.2,
    middayHeadwayMin: 8.0,
    eveningHeadwayMin: 7.2,
    dwellBaseSec: 112,
    completeness: 0.97,
  },
  'stg-odeon': {
    morningBase: 295,
    middayBase: 210,
    eveningBase: 410,
    morningHeadwayMin: 4.8,
    middayHeadwayMin: 8.5,
    eveningHeadwayMin: 6.4,
    dwellBaseSec: 94,
    completeness: 0.96,
  },
  'stg-westlands': {
    morningBase: 255,
    middayBase: 190,
    eveningBase: 335,
    morningHeadwayMin: 5.2,
    middayHeadwayMin: 8.2,
    eveningHeadwayMin: 6.5,
    dwellBaseSec: 78,
    completeness: 0.96,
  },
  'stg-roysambu': {
    morningBase: 425,
    middayBase: 195,
    eveningBase: 340,
    morningHeadwayMin: 5.8,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 6.2,
    dwellBaseSec: 88,
    completeness: 0.95,
  },
  'stg-kasarani': {
    morningBase: 320,
    middayBase: 135,
    eveningBase: 255,
    morningHeadwayMin: 6.8,
    middayHeadwayMin: 11.5,
    eveningHeadwayMin: 7.4,
    dwellBaseSec: 82,
    completeness: 0.88,
  },
  'stg-ngong-prestige': {
    morningBase: 235,
    middayBase: 165,
    eveningBase: 270,
    morningHeadwayMin: 5.5,
    middayHeadwayMin: 9.5,
    eveningHeadwayMin: 6.6,
    dwellBaseSec: 68,
    completeness: 0.94,
  },
  'stg-kawangware': {
    morningBase: 310,
    middayBase: 140,
    eveningBase: 230,
    morningHeadwayMin: 7.2,
    middayHeadwayMin: 12.0,
    eveningHeadwayMin: 8.1,
    dwellBaseSec: 92,
    completeness: 0.84,
  },
  'stg-buruburu': {
    morningBase: 430,
    middayBase: 205,
    eveningBase: 365,
    morningHeadwayMin: 5.4,
    middayHeadwayMin: 9.2,
    eveningHeadwayMin: 6.5,
    dwellBaseSec: 96,
    completeness: 0.95,
  },
  'stg-embakasi-nyayo': {
    morningBase: 385,
    middayBase: 175,
    eveningBase: 315,
    morningHeadwayMin: 6.1,
    middayHeadwayMin: 10.4,
    eveningHeadwayMin: 7.0,
    dwellBaseSec: 90,
    completeness: 0.93,
  },
  'stg-south-b': {
    morningBase: 215,
    middayBase: 130,
    eveningBase: 245,
    morningHeadwayMin: 6.0,
    middayHeadwayMin: 10.8,
    eveningHeadwayMin: 6.9,
    dwellBaseSec: 65,
    completeness: 0.94,
  },
  'stg-rongai-galleria': {
    morningBase: 265,
    middayBase: 115,
    eveningBase: 275,
    morningHeadwayMin: 7.5,
    middayHeadwayMin: 13.0,
    eveningHeadwayMin: 8.6,
    dwellBaseSec: 84,
    completeness: 0.81,
  },
};

function mapHourToTimePeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour <= 9) return 'morning_peak';
  if (hour >= 16 && hour <= 20) return 'evening_peak';
  return 'midday';
}

/**
 * Deterministic pseudo-hash for reproducible synthetic fluctuation without Math.random()
 */
function deterministicOffset(stageIdx: number, dayOfWeek: number, hour: number): number {
  const seed = (stageIdx + 1) * 37 + dayOfWeek * 19 + hour * 13;
  const wave = Math.sin(seed * 0.73) * 0.06 + Math.cos(seed * 0.41) * 0.03;
  return wave;
}

/**
 * Generates a deterministic set of synthetic historical passenger observations
 * across 7 days of the week and 3 key operational hours per day for all 12 stages.
 * 12 stages * 7 days * 6 representative hours = 504 deterministic historical records.
 */
function buildSyntheticObservations(): PassengerObservation[] {
  const observations: PassengerObservation[] = [];
  const sampleHours = [7, 8, 12, 14, 17, 18];

  NAIROBI_STAGES.forEach((stage, stageIdx) => {
    const sig = STAGE_SIGNATURES[stage.id];
    const primaryRouteId = stage.routeIds[0];
    const primarySaccoId = stage.saccoIds[0];

    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
      const dayType: DayType =
        dayOfWeek === 6 ? 'saturday' : dayOfWeek === 7 ? 'sunday' : 'weekday';
      const dayMultiplier =
        dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 0.78 : 0.58;

      sampleHours.forEach((hour) => {
        const timePeriod = mapHourToTimePeriod(hour);
        const periodBase =
          timePeriod === 'morning_peak'
            ? sig.morningBase
            : timePeriod === 'evening_peak'
            ? sig.eveningBase
            : sig.middayBase;

        // Peak sharpening at 7am and 18pm
        const hourSharpener =
          hour === 7 || hour === 18 ? 1.07 : hour === 12 ? 0.94 : 1.0;

        const noise = deterministicOffset(stageIdx, dayOfWeek, hour);
        const passengerCount = Math.max(
          35,
          Math.round(periodBase * dayMultiplier * hourSharpener * (1 + noise))
        );

        const baseHeadway =
          timePeriod === 'morning_peak'
            ? sig.morningHeadwayMin
            : timePeriod === 'evening_peak'
            ? sig.eveningHeadwayMin
            : sig.middayHeadwayMin;

        const weekendHeadwayFactor =
          dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 1.18 : 1.35;

        const busArrivalIntervalMinutes = Number(
          (baseHeadway * weekendHeadwayFactor * (1 + noise * 0.4)).toFixed(1)
        );

        const dwellTimeSeconds = Math.round(
          sig.dwellBaseSec *
            (passengerCount / Math.max(120, sig.middayBase)) *
            0.75 +
            25
        );

        const dayStr = String(19 + dayOfWeek).padStart(2, '0');
        const hourStr = String(hour).padStart(2, '0');

        observations.push({
          id: `obs-${stage.id}-d${dayOfWeek}-h${hour}`,
          stageId: stage.id,
          routeId: primaryRouteId,
          saccoId: primarySaccoId,
          timestamp: `2026-10-${dayStr}T${hourStr}:00:00+03:00`,
          dayOfWeek,
          dayType,
          hour,
          timePeriod,
          passengerCount,
          busArrivalIntervalMinutes,
          dwellTimeSeconds,
          dataCompleteness: sig.completeness,
        });
      });
    }
  });

  return observations;
}

export const SYNTHETIC_OBSERVATIONS: PassengerObservation[] =
  buildSyntheticObservations();
