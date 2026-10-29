import {
  DayType,
  PassengerObservation,
  SaccoOperator,
  TimePeriod,
  TransportRoute,
  TransportStage,
} from '../types/transport';

export const NAIROBI_STAGES: TransportStage[] = [
  // --- CENTRAL / INNER RING ---
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
    routeIds: ['rt-45-roysambu', 'rt-105-westlands', 'rt-46-kawangware', 'rt-100-kiambu'],
    baselineHourlyCapacity: 410,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Dense northern CBD staging zone serving Thika Road, Waiyaki Way, and Kiambu feeder routes.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-upperhill-knh',
    code: 'UHL-KNH',
    name: 'Upper Hill / KNH Gate',
    corridor: 'Hospital & Financial District',
    neighbourhood: 'Upper Hill / Ngong Rd',
    coordinates: { lat: -1.2988, lng: 36.8085 },
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    routeIds: ['rt-111-ngong', 'rt-46-kawangware'],
    baselineHourlyCapacity: 340,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Serves hospital visitors, medical staff, and Upper Hill daytime office workers.',
    dataStatus: 'complete_demo',
  },

  // --- NORTH & NORTHEAST (THIKA SUPERHIGHWAY & KIAMBU CORRIDOR) ---
  {
    id: 'stg-pangani-muthaiga',
    code: 'THK-utg',
    name: 'Muthaiga / Pangani Underpass',
    corridor: 'Thika Superhighway Inner',
    neighbourhood: 'Pangani / Muthaiga',
    coordinates: { lat: -1.2602, lng: 36.8448 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    routeIds: ['rt-45-roysambu', 'rt-100-kiambu'],
    baselineHourlyCapacity: 320,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Express highway slip-road stop with steady through-bus capacity.',
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
    baselineHourlyCapacity: 380,
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
    coordinates: { lat: -1.2214, lng: 36.9065 },
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    routeIds: ['rt-17b-kasarani', 'rt-45-roysambu'],
    baselineHourlyCapacity: 310,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Primary transfer point for Mwiki and Seasons residential commuters connecting to Thika Highway trunk buses.',
    dataStatus: 'partial_sensor_demo',
    missingFieldsNote: 'Feeder shuttle turnaround counts after 20:00 are interpolated from historical evening ratios.',
  },
  {
    id: 'stg-githurai-45',
    code: 'THK-G45',
    name: 'Githurai 45 Roundabout',
    corridor: 'Thika Superhighway North',
    neighbourhood: 'Githurai',
    coordinates: { lat: -1.2015, lng: 36.9165 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    routeIds: ['rt-45-roysambu'],
    baselineHourlyCapacity: 440,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Major northern metropolitan gateway with intense morning inbound and evening outbound commuter queues.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kahawa-sukari',
    code: 'THK-KHW',
    name: 'Kahawa Sukari / KU Junction',
    corridor: 'Thika Superhighway Outer',
    neighbourhood: 'Kahawa / Kenyatta Univ.',
    coordinates: { lat: -1.1812, lng: 36.9325 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    routeIds: ['rt-45-roysambu'],
    baselineHourlyCapacity: 320,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'University and suburban residential stop along outer Thika Superhighway.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-ruiru-bypass',
    code: 'THK-RUR',
    name: 'Ruiru Town / Eastern Bypass',
    corridor: 'Northern Metro · Ruiru',
    neighbourhood: 'Ruiru Municipality',
    coordinates: { lat: -1.1485, lng: 36.9605 },
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    routeIds: ['rt-45-roysambu'],
    baselineHourlyCapacity: 350,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Northern satellite town hub connecting Eastern Bypass and Thika Highway services.',
    dataStatus: 'partial_sensor_demo',
    missingFieldsNote: 'Midday off-peak observations aggregated from 60-minute dispatch logs.',
  },
  {
    id: 'stg-kiambu-ridgeways',
    code: 'KMB-RDG',
    name: 'Ridgeways / Ciata Mall Stage',
    corridor: 'Kiambu Road Corridor',
    neighbourhood: 'Ridgeways / Muthaiga North',
    coordinates: { lat: -1.2245, lng: 36.8415 },
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    routeIds: ['rt-100-kiambu'],
    baselineHourlyCapacity: 280,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Low-to-moderate density corridor stop along Kiambu Road with smooth kerbside bay.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kiambu-town',
    code: 'KMB-TWN',
    name: 'Kiambu Terminus / Ndumberi',
    corridor: 'Kiambu Road North',
    neighbourhood: 'Kiambu Town',
    coordinates: { lat: -1.1715, lng: 36.8355 },
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    routeIds: ['rt-100-kiambu'],
    baselineHourlyCapacity: 320,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Northern county terminus with strong morning departures and calmer evening arrivals.',
    dataStatus: 'complete_demo',
  },

  // --- WEST & NORTHWEST (WAIYAKI WAY, LIMURU RD, NAIVASHA RD) ---
  {
    id: 'stg-westlands',
    code: 'WAI-WST',
    name: 'Westlands Stage (Sarit / Ring Rd)',
    corridor: 'Waiyaki Way Corridor',
    neighbourhood: 'Westlands',
    coordinates: { lat: -1.2647, lng: 36.8028 },
    saccoIds: ['sacco-supermetro', 'sacco-latema', 'sacco-citihoppa'],
    routeIds: ['rt-105-westlands', 'rt-23-kangemi', 'rt-107-ruaka'],
    baselineHourlyCapacity: 350,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Commercial employment hub with strong bidirectional commuter flow and highway underpass pedestrian access.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-ruaka-tworivers',
    code: 'LMR-RKA',
    name: 'Ruaka / Two Rivers Junction',
    corridor: 'Limuru Rd / Northern Bypass',
    neighbourhood: 'Ruaka / Rosslyn',
    coordinates: { lat: -1.2055, lng: 36.7785 },
    saccoIds: ['sacco-supermetro', 'sacco-latema'],
    routeIds: ['rt-107-ruaka'],
    baselineHourlyCapacity: 330,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Rapidly growing northwestern residential hub connecting Limuru Road and Northern Bypass.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kangemi-mountainview',
    code: 'WAI-KGM',
    name: 'Kangemi / Mountain View',
    corridor: 'Waiyaki Way West',
    neighbourhood: 'Kangemi',
    coordinates: { lat: -1.2635, lng: 36.7515 },
    saccoIds: ['sacco-supermetro', 'sacco-latema'],
    routeIds: ['rt-105-westlands', 'rt-23-kangemi'],
    baselineHourlyCapacity: 310,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Western trunk highway stage serving Kangemi and Uthiru residential estates.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-kikuyu-regen',
    code: 'WAI-KKY',
    name: 'Kikuyu / Muthiga Terminus',
    corridor: 'Waiyaki Way Outer West',
    neighbourhood: 'Kikuyu / Kinoo',
    coordinates: { lat: -1.2465, lng: 36.6895 },
    saccoIds: ['sacco-supermetro', 'sacco-latema'],
    routeIds: ['rt-105-westlands'],
    baselineHourlyCapacity: 360,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Far-western metropolitan terminus serving Kikuyu, Regen, and Kinoo commuters.',
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
    baselineHourlyCapacity: 300,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'High-density residential origin stage; essential public transport link for daily wage and school commuters.',
    dataStatus: 'partial_sensor_demo',
    missingFieldsNote: 'Midday informal feeder boarding counts have ~84% sample coverage in the demonstration log.',
  },

  // --- SOUTHWEST & SOUTH (NGONG RD, KAREN, LANG'ATA, RONGAI) ---
  {
    id: 'stg-ngong-prestige',
    code: 'NGG-PRS',
    name: 'Prestige / Adams Arcade',
    corridor: 'Ngong Road Corridor',
    neighbourhood: 'Kilimani / Adams',
    coordinates: { lat: -1.3004, lng: 36.7846 },
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    routeIds: ['rt-111-ngong', 'rt-46-kawangware'],
    baselineHourlyCapacity: 310,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Mid-corridor stage along Ngong Road; experiences moderate steady commercial demand.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-karen-shopping',
    code: 'NGG-KRN',
    name: 'Karen Crossroads / Shopping Ctr',
    corridor: 'Ngong Rd / Karen Outer',
    neighbourhood: 'Karen',
    coordinates: { lat: -1.3215, lng: 36.7045 },
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    routeIds: ['rt-111-ngong'],
    baselineHourlyCapacity: 290,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Low-density southwestern suburban interchange with calm off-peak headways.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-ngong-milele',
    code: 'NGG-TWN',
    name: 'Ngong Town Bus Terminus',
    corridor: 'Ngong Hills Southwest',
    neighbourhood: 'Ngong Town',
    coordinates: { lat: -1.3615, lng: 36.6585 },
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa'],
    routeIds: ['rt-111-ngong'],
    baselineHourlyCapacity: 350,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Southwestern metro boundary terminus with concentrated early-morning boarding.',
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
    baselineHourlyCapacity: 280,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Southern gateway transfer node serving Ongata Rongai, Kiserian, and Karen peripheral corridors.',
    dataStatus: 'interpolated_demo',
    missingFieldsNote: 'Weekend headway intervals are estimated from scheduled SACCO dispatch tables.',
  },
  {
    id: 'stg-ongata-rongai',
    code: 'MGD-RNG',
    name: 'Ongata Rongai / Kware Stage',
    corridor: 'Magadi Road South',
    neighbourhood: 'Ongata Rongai',
    coordinates: { lat: -1.3965, lng: 36.7465 },
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa'],
    routeIds: ['rt-125-rongai'],
    baselineHourlyCapacity: 390,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'High-volume southern commuter town along Magadi Road corridor.',
    dataStatus: 'complete_demo',
  },

  // --- EAST & SOUTHEAST (JOGOO RD, OUTERING, EMBAKASI, MOMBASA RD / SYOKIMAU) ---
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
    id: 'stg-kayole-spine',
    code: 'JGO-KYL',
    name: 'Kayole Spine Road / Naivas',
    corridor: 'Kangundo / Spine Rd East',
    neighbourhood: 'Kayole / Komarock',
    coordinates: { lat: -1.2745, lng: 36.9185 },
    saccoIds: ['sacco-forward', 'sacco-embassava'],
    routeIds: ['rt-58-buruburu'],
    baselineHourlyCapacity: 370,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Dense eastern residential terminus serving Kayole, Jacaranda, and Spine Road estates.',
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
    id: 'stg-utawala-shooters',
    code: 'EBK-UTW',
    name: 'Utawala / Benedicta Stage',
    corridor: 'Eastern Bypass East',
    neighbourhood: 'Utawala / Mihango',
    coordinates: { lat: -1.2815, lng: 36.9685 },
    saccoIds: ['sacco-embassava', 'sacco-supermetro'],
    routeIds: ['rt-33-embakasi'],
    baselineHourlyCapacity: 330,
    isHub: false,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Far-eastern Eastern Bypass residential corridor with strong morning peak and calm midday flow.',
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
    baselineHourlyCapacity: 300,
    isHub: false,
    accessibilityPriority: 'standard',
    infrastructureNotes: 'Connects South B residential zone and Industrial Area employment corridor with CBD Railways.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-cabanas-jkia',
    code: 'MBS-CBN',
    name: 'Cabanas / Airport South Jct',
    corridor: 'Mombasa Road Highway',
    neighbourhood: 'Imara Daima / Pipeline',
    coordinates: { lat: -1.3385, lng: 36.8985 },
    saccoIds: ['sacco-embassava', 'sacco-supermetro'],
    routeIds: ['rt-33-embakasi', 'rt-110-kitengela'],
    baselineHourlyCapacity: 380,
    isHub: true,
    accessibilityPriority: 'major_interchange',
    infrastructureNotes: 'Major Mombasa Road and Airport North Road interchange serving Pipeline, Imara Daima, and JKIA link.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-syokimau-sgr',
    code: 'MBS-SYK',
    name: 'Syokimau / SGR Rail Terminus',
    corridor: 'Mombasa Road Southeast',
    neighbourhood: 'Syokimau / Katani',
    coordinates: { lat: -1.3595, lng: 36.9315 },
    saccoIds: ['sacco-supermetro', 'sacco-embassava'],
    routeIds: ['rt-110-kitengela'],
    baselineHourlyCapacity: 340,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Southeastern metropolitan multimodal transfer hub linking commuter rail and Mombasa Road buses.',
    dataStatus: 'complete_demo',
  },
  {
    id: 'stg-mlolongo-kitengela',
    code: 'MBS-MLL',
    name: 'Mlolongo / Kitengela Junction',
    corridor: 'Mombasa Road Outer South',
    neighbourhood: 'Mlolongo / Athi River',
    coordinates: { lat: -1.3945, lng: 36.9445 },
    saccoIds: ['sacco-supermetro', 'sacco-embassava'],
    routeIds: ['rt-110-kitengela'],
    baselineHourlyCapacity: 370,
    isHub: true,
    accessibilityPriority: 'essential_community_link',
    infrastructureNotes: 'Far-southeastern highway gateway serving Mlolongo, Sabaki, and Kitengela commuters.',
    dataStatus: 'complete_demo',
  },
];

export const NAIROBI_SACCOS: SaccoOperator[] = [
  {
    id: 'sacco-supermetro',
    code: 'SMET',
    name: 'Super Metro Demo Fleet',
    primaryCorridors: [
      'Thika Superhighway (Ruiru / Githurai / Roysambu)',
      'Waiyaki Way (Westlands / Kikuyu)',
      'Ngong Rd & Mombasa Rd (Syokimau / Mlolongo)',
    ],
    routeIds: [
      'rt-45-roysambu',
      'rt-105-westlands',
      'rt-111-ngong',
      'rt-125-rongai',
      'rt-17b-kasarani',
      'rt-100-kiambu',
      'rt-107-ruaka',
      'rt-110-kitengela',
    ],
    stageIds: [
      'stg-kencom',
      'stg-odeon',
      'stg-upperhill-knh',
      'stg-pangani-muthaiga',
      'stg-roysambu',
      'stg-kasarani',
      'stg-githurai-45',
      'stg-kahawa-sukari',
      'stg-ruiru-bypass',
      'stg-kiambu-ridgeways',
      'stg-kiambu-town',
      'stg-westlands',
      'stg-ruaka-tworivers',
      'stg-kangemi-mountainview',
      'stg-kikuyu-regen',
      'stg-ngong-prestige',
      'stg-karen-shopping',
      'stg-ngong-milele',
      'stg-rongai-galleria',
      'stg-ongata-rongai',
      'stg-utawala-shooters',
      'stg-cabanas-jkia',
      'stg-syokimau-sgr',
      'stg-mlolongo-kitengela',
    ],
    demoActiveVehicles: 195,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Metropolitan-wide commuter coach operator across northern, western, southern, and southeastern trunk corridors (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-citihoppa',
    code: 'CHOP',
    name: 'Citi Hoppa Demo Transit',
    primaryCorridors: ['CBD Central · Moi Ave', 'Ngong Road / Karen', 'Mombasa Rd / South B'],
    routeIds: ['rt-111-ngong', 'rt-11-southb', 'rt-105-westlands', 'rt-46-kawangware', 'rt-125-rongai'],
    stageIds: [
      'stg-kencom',
      'stg-railways',
      'stg-upperhill-knh',
      'stg-westlands',
      'stg-kawangware',
      'stg-ngong-prestige',
      'stg-karen-shopping',
      'stg-ngong-milele',
      'stg-rongai-galleria',
      'stg-ongata-rongai',
      'stg-south-b',
    ],
    demoActiveVehicles: 132,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Cross-city stage bus network linking CBD hubs with Upper Hill, Kilimani, Karen, Ngong, and South B (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-forward',
    code: 'FRWD',
    name: 'Forward Travellers Demo',
    primaryCorridors: ['Jogoo Road Corridor', 'Kayole Spine Rd', 'Outering / Airport North'],
    routeIds: ['rt-58-buruburu', 'rt-33-embakasi'],
    stageIds: ['stg-railways', 'stg-buruburu', 'stg-kayole-spine', 'stg-embakasi-nyayo'],
    demoActiveVehicles: 112,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Eastlands trunk operator connecting Buruburu, Donholm, Kayole, and Outering estates to CBD South (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-2nk',
    code: '2NKD',
    name: '2NK / Thika & Kiambu Demo',
    primaryCorridors: ['Thika Superhighway (Ruiru / Githurai)', 'Kiambu Road Corridor'],
    routeIds: ['rt-45-roysambu', 'rt-17b-kasarani', 'rt-100-kiambu'],
    stageIds: [
      'stg-kencom',
      'stg-odeon',
      'stg-pangani-muthaiga',
      'stg-roysambu',
      'stg-kasarani',
      'stg-githurai-45',
      'stg-kahawa-sukari',
      'stg-ruiru-bypass',
      'stg-kiambu-ridgeways',
      'stg-kiambu-town',
    ],
    demoActiveVehicles: 105,
    typicalVehicleCapacity: 14,
    serviceCoverageNote: 'High-frequency shuttle and matatu service along Thika Superhighway, Ruiru, and Kiambu Road links (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-embassava',
    code: 'EMBS',
    name: 'Embassava Demo Operations',
    primaryCorridors: ['Outering / Embakasi / Utawala', 'Mombasa Rd / Cabanas / Syokimau'],
    routeIds: ['rt-33-embakasi', 'rt-11-southb', 'rt-58-buruburu', 'rt-110-kitengela'],
    stageIds: [
      'stg-railways',
      'stg-buruburu',
      'stg-kayole-spine',
      'stg-embakasi-nyayo',
      'stg-utawala-shooters',
      'stg-south-b',
      'stg-cabanas-jkia',
      'stg-syokimau-sgr',
      'stg-mlolongo-kitengela',
    ],
    demoActiveVehicles: 128,
    typicalVehicleCapacity: 33,
    serviceCoverageNote: 'Embakasi, Utawala, Cabanas, and Mombasa Road commuter network terminating at Railways (Synthetic Demo Profile).',
  },
  {
    id: 'sacco-latema',
    code: 'LATM',
    name: 'Latema / Waiyaki Demo SACCO',
    primaryCorridors: ['Waiyaki Way (Westlands / Kangemi / Kikuyu)', 'Limuru Rd / Ruaka', 'Kawangware'],
    routeIds: ['rt-105-westlands', 'rt-46-kawangware', 'rt-23-kangemi', 'rt-107-ruaka'],
    stageIds: [
      'stg-odeon',
      'stg-westlands',
      'stg-ruaka-tworivers',
      'stg-kangemi-mountainview',
      'stg-kikuyu-regen',
      'stg-kawangware',
    ],
    demoActiveVehicles: 92,
    typicalVehicleCapacity: 25,
    serviceCoverageNote: 'Western and northwestern feeder operator serving Odeon, Westlands, Ruaka, Kangemi, Kikuyu, and Kawangware (Synthetic Demo Profile).',
  },
];

export const NAIROBI_ROUTES: TransportRoute[] = [
  {
    id: 'rt-45-roysambu',
    routeNumber: 'Route 45 / 237',
    name: 'CBD ↔ Roysambu ↔ Githurai 45 ↔ Kahawa ↔ Ruiru',
    corridor: 'Thika Superhighway',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-ruiru-bypass',
    stageIds: [
      'stg-kencom',
      'stg-odeon',
      'stg-pangani-muthaiga',
      'stg-roysambu',
      'stg-githurai-45',
      'stg-kahawa-sukari',
      'stg-ruiru-bypass',
    ],
    saccoIds: ['sacco-supermetro', 'sacco-2nk'],
    scheduledHeadwayMinutes: { morning_peak: 4, midday: 8, evening_peak: 5 },
    distanceKm: 24.5,
  },
  {
    id: 'rt-17b-kasarani',
    routeNumber: 'Route 17B',
    name: 'CBD (Odeon) ↔ Roysambu ↔ Kasarani / Mwiki',
    corridor: 'Thika Road · Mwiki Feeder',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-kasarani',
    stageIds: ['stg-odeon', 'stg-pangani-muthaiga', 'stg-roysambu', 'stg-kasarani'],
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 10, evening_peak: 6 },
    distanceKm: 15.8,
  },
  {
    id: 'rt-100-kiambu',
    routeNumber: 'Route 100',
    name: 'CBD (Odeon) ↔ Muthaiga ↔ Ridgeways ↔ Kiambu Town',
    corridor: 'Kiambu Road Corridor',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-kiambu-town',
    stageIds: ['stg-odeon', 'stg-pangani-muthaiga', 'stg-kiambu-ridgeways', 'stg-kiambu-town'],
    saccoIds: ['sacco-2nk', 'sacco-supermetro'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 11, evening_peak: 7 },
    distanceKm: 16.2,
  },
  {
    id: 'rt-105-westlands',
    routeNumber: 'Route 105',
    name: 'CBD (Kencom / Odeon) ↔ Westlands ↔ Kangemi ↔ Kikuyu',
    corridor: 'Waiyaki Way Corridor',
    originStageId: 'stg-kencom',
    destinationStageId: 'stg-kikuyu-regen',
    stageIds: [
      'stg-kencom',
      'stg-odeon',
      'stg-westlands',
      'stg-kangemi-mountainview',
      'stg-kikuyu-regen',
    ],
    saccoIds: ['sacco-supermetro', 'sacco-latema', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 8, evening_peak: 5 },
    distanceKm: 20.4,
  },
  {
    id: 'rt-107-ruaka',
    routeNumber: 'Route 106 / 107',
    name: 'CBD (Odeon) ↔ Westlands ↔ Two Rivers / Ruaka',
    corridor: 'Limuru Road Corridor',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-ruaka-tworivers',
    stageIds: ['stg-odeon', 'stg-westlands', 'stg-ruaka-tworivers'],
    saccoIds: ['sacco-supermetro', 'sacco-latema'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 10, evening_peak: 6 },
    distanceKm: 14.3,
  },
  {
    id: 'rt-23-kangemi',
    routeNumber: 'Route 23W',
    name: 'Westlands ↔ Kangemi ↔ Kawangware 46 Link',
    corridor: 'Waiyaki / Naivasha Feeder',
    originStageId: 'stg-westlands',
    destinationStageId: 'stg-kawangware',
    stageIds: ['stg-westlands', 'stg-kangemi-mountainview', 'stg-kawangware'],
    saccoIds: ['sacco-latema'],
    scheduledHeadwayMinutes: { morning_peak: 7, midday: 13, evening_peak: 8 },
    distanceKm: 9.2,
  },
  {
    id: 'rt-111-ngong',
    routeNumber: 'Route 111',
    name: 'CBD (Kencom) ↔ Upper Hill ↔ Adams ↔ Karen ↔ Ngong Town',
    corridor: 'Ngong Road Corridor',
    originStageId: 'stg-kencom',
    destinationStageId: 'stg-ngong-milele',
    stageIds: [
      'stg-kencom',
      'stg-upperhill-knh',
      'stg-ngong-prestige',
      'stg-karen-shopping',
      'stg-ngong-milele',
    ],
    saccoIds: ['sacco-citihoppa', 'sacco-supermetro'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 10, evening_peak: 6 },
    distanceKm: 22.8,
  },
  {
    id: 'rt-46-kawangware',
    routeNumber: 'Route 46',
    name: 'CBD (Odeon) ↔ Upper Hill ↔ Adams ↔ Kawangware 46',
    corridor: 'Naivasha Rd / West Feeder',
    originStageId: 'stg-odeon',
    destinationStageId: 'stg-kawangware',
    stageIds: ['stg-odeon', 'stg-upperhill-knh', 'stg-ngong-prestige', 'stg-kawangware'],
    saccoIds: ['sacco-latema', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 11, evening_peak: 7 },
    distanceKm: 11.4,
  },
  {
    id: 'rt-58-buruburu',
    routeNumber: 'Route 58 / 19',
    name: 'Railways Terminus ↔ Jogoo Rd ↔ Buruburu ↔ Kayole Spine',
    corridor: 'Jogoo Road Corridor',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-kayole-spine',
    stageIds: ['stg-railways', 'stg-buruburu', 'stg-kayole-spine'],
    saccoIds: ['sacco-forward', 'sacco-embassava'],
    scheduledHeadwayMinutes: { morning_peak: 4, midday: 8, evening_peak: 5 },
    distanceKm: 14.6,
  },
  {
    id: 'rt-33-embakasi',
    routeNumber: 'Route 33 / 145',
    name: 'Railways ↔ South B ↔ Nyayo / Fedha ↔ Cabanas ↔ Utawala',
    corridor: 'Outering / Eastern Bypass',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-utawala-shooters',
    stageIds: [
      'stg-railways',
      'stg-south-b',
      'stg-buruburu',
      'stg-embakasi-nyayo',
      'stg-cabanas-jkia',
      'stg-utawala-shooters',
    ],
    saccoIds: ['sacco-embassava', 'sacco-forward'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 10, evening_peak: 6 },
    distanceKm: 19.5,
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
    id: 'rt-110-kitengela',
    routeNumber: 'Route 110 / SGR',
    name: 'Railways ↔ South B ↔ Cabanas ↔ Syokimau ↔ Mlolongo',
    corridor: 'Mombasa Road Southeast',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-mlolongo-kitengela',
    stageIds: [
      'stg-railways',
      'stg-south-b',
      'stg-cabanas-jkia',
      'stg-syokimau-sgr',
      'stg-mlolongo-kitengela',
    ],
    saccoIds: ['sacco-supermetro', 'sacco-embassava'],
    scheduledHeadwayMinutes: { morning_peak: 6, midday: 11, evening_peak: 6 },
    distanceKm: 23.2,
  },
  {
    id: 'rt-125-rongai',
    routeNumber: 'Route 125 / 126',
    name: 'CBD (Railways / Kencom) ↔ Bomas / Galleria ↔ Ongata Rongai',
    corridor: 'Langata / Magadi Rd',
    originStageId: 'stg-railways',
    destinationStageId: 'stg-ongata-rongai',
    stageIds: ['stg-kencom', 'stg-railways', 'stg-rongai-galleria', 'stg-ongata-rongai'],
    saccoIds: ['sacco-supermetro', 'sacco-citihoppa'],
    scheduledHeadwayMinutes: { morning_peak: 5, midday: 11, evening_peak: 6 },
    distanceKm: 21.8,
  },
];

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

/**
 * Carefully calibrated stage signatures across all 30 Greater Nairobi stages so that:
 * - In Morning Peak, Midday, AND Evening Peak, there is a rich, realistic geographical diversity
 *   of HIGH, MODERATE, and LOW demand stages spread across North, South, East, West, and Central Nairobi.
 */
export const STAGE_SIGNATURES: Record<string, StageDemandSignature> = {
  // --- CENTRAL / INNER RING (4 stages) ---
  'stg-kencom': {
    // Morning: Moderate | Midday: High | Evening: High
    morningBase: 215,
    middayBase: 345,
    eveningBase: 455,
    morningHeadwayMin: 4.5,
    middayHeadwayMin: 6.5,
    eveningHeadwayMin: 6.8,
    dwellBaseSec: 98,
    completeness: 0.98,
  },
  'stg-railways': {
    // Morning: High | Midday: High | Evening: High
    morningBase: 385,
    middayBase: 375,
    eveningBase: 485,
    morningHeadwayMin: 4.8,
    middayHeadwayMin: 6.8,
    eveningHeadwayMin: 7.2,
    dwellBaseSec: 112,
    completeness: 0.97,
  },
  'stg-odeon': {
    // Morning: Moderate | Midday: Moderate | Evening: High
    morningBase: 220,
    middayBase: 225,
    eveningBase: 395,
    morningHeadwayMin: 4.6,
    middayHeadwayMin: 7.2,
    eveningHeadwayMin: 6.4,
    dwellBaseSec: 94,
    completeness: 0.96,
  },
  'stg-upperhill-knh': {
    // Morning: Low | Midday: High | Evening: Moderate
    morningBase: 115,
    middayBase: 335,
    eveningBase: 210,
    morningHeadwayMin: 4.8,
    middayHeadwayMin: 7.5,
    eveningHeadwayMin: 5.6,
    dwellBaseSec: 72,
    completeness: 0.95,
  },

  // --- NORTH & NORTHEAST: THIKA & KIAMBU CORRIDOR (8 stages) ---
  'stg-pangani-muthaiga': {
    // Morning: Low | Midday: Low | Evening: Low
    morningBase: 110,
    middayBase: 105,
    eveningBase: 115,
    morningHeadwayMin: 4.2,
    middayHeadwayMin: 6.5,
    eveningHeadwayMin: 4.6,
    dwellBaseSec: 45,
    completeness: 0.96,
  },
  'stg-roysambu': {
    // Morning: High | Midday: Moderate | Evening: High
    morningBase: 410,
    middayBase: 220,
    eveningBase: 355,
    morningHeadwayMin: 5.8,
    middayHeadwayMin: 8.0,
    eveningHeadwayMin: 6.5,
    dwellBaseSec: 88,
    completeness: 0.95,
  },
  'stg-kasarani': {
    // Morning: Moderate | Midday: Low | Evening: Low (Inbound evening alighting)
    morningBase: 215,
    middayBase: 115,
    eveningBase: 120,
    morningHeadwayMin: 5.6,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 5.2,
    dwellBaseSec: 72,
    completeness: 0.88,
  },
  'stg-githurai-45': {
    // Morning: High | Midday: High | Evening: High
    morningBase: 440,
    middayBase: 355,
    eveningBase: 410,
    morningHeadwayMin: 5.5,
    middayHeadwayMin: 7.5,
    eveningHeadwayMin: 6.8,
    dwellBaseSec: 105,
    completeness: 0.96,
  },
  'stg-kahawa-sukari': {
    // Morning: Moderate | Midday: Low | Evening: Low
    morningBase: 205,
    middayBase: 110,
    eveningBase: 115,
    morningHeadwayMin: 5.0,
    middayHeadwayMin: 8.2,
    eveningHeadwayMin: 5.0,
    dwellBaseSec: 58,
    completeness: 0.94,
  },
  'stg-ruiru-bypass': {
    // Morning: High | Midday: Moderate | Evening: Moderate
    morningBase: 365,
    middayBase: 205,
    eveningBase: 215,
    morningHeadwayMin: 6.0,
    middayHeadwayMin: 8.5,
    eveningHeadwayMin: 5.8,
    dwellBaseSec: 84,
    completeness: 0.89,
  },
  'stg-kiambu-ridgeways': {
    // Morning: Low | Midday: Moderate | Evening: Low
    morningBase: 105,
    middayBase: 195,
    eveningBase: 110,
    morningHeadwayMin: 5.2,
    middayHeadwayMin: 8.0,
    eveningHeadwayMin: 5.2,
    dwellBaseSec: 50,
    completeness: 0.95,
  },
  'stg-kiambu-town': {
    // Morning: High | Midday: Low | Evening: Moderate
    morningBase: 335,
    middayBase: 120,
    eveningBase: 205,
    morningHeadwayMin: 6.2,
    middayHeadwayMin: 9.2,
    eveningHeadwayMin: 6.0,
    dwellBaseSec: 80,
    completeness: 0.93,
  },

  // --- WEST & NORTHWEST: WAIYAKI WAY, RUAKA, KIKUYU, KAWANGWARE (5 stages) ---
  'stg-westlands': {
    // Morning: Moderate | Midday: High | Evening: High
    morningBase: 215,
    middayBase: 330,
    eveningBase: 375,
    morningHeadwayMin: 5.0,
    middayHeadwayMin: 7.0,
    eveningHeadwayMin: 6.6,
    dwellBaseSec: 82,
    completeness: 0.96,
  },
  'stg-ruaka-tworivers': {
    // Morning: High | Midday: Moderate | Evening: Low
    morningBase: 340,
    middayBase: 200,
    eveningBase: 115,
    morningHeadwayMin: 6.0,
    middayHeadwayMin: 8.2,
    eveningHeadwayMin: 5.0,
    dwellBaseSec: 74,
    completeness: 0.94,
  },
  'stg-kangemi-mountainview': {
    // Morning: Low | Midday: Low | Evening: Moderate
    morningBase: 120,
    middayBase: 115,
    eveningBase: 205,
    morningHeadwayMin: 5.2,
    middayHeadwayMin: 8.6,
    eveningHeadwayMin: 5.8,
    dwellBaseSec: 65,
    completeness: 0.93,
  },
  'stg-kikuyu-regen': {
    // Morning: High | Midday: Moderate | Evening: Low
    morningBase: 355,
    middayBase: 205,
    eveningBase: 120,
    morningHeadwayMin: 6.2,
    middayHeadwayMin: 8.8,
    eveningHeadwayMin: 5.2,
    dwellBaseSec: 82,
    completeness: 0.92,
  },
  'stg-kawangware': {
    // Morning: Moderate | Midday: Moderate | Evening: High
    morningBase: 225,
    middayBase: 200,
    eveningBase: 335,
    morningHeadwayMin: 6.0,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 7.0,
    dwellBaseSec: 90,
    completeness: 0.84,
  },

  // --- SOUTHWEST & SOUTH: NGONG, KAREN, LANG'ATA, RONGAI (5 stages) ---
  'stg-ngong-prestige': {
    // Morning: Low | Midday: Moderate | Evening: Moderate
    morningBase: 115,
    middayBase: 205,
    eveningBase: 215,
    morningHeadwayMin: 5.0,
    middayHeadwayMin: 7.8,
    eveningHeadwayMin: 5.8,
    dwellBaseSec: 64,
    completeness: 0.94,
  },
  'stg-karen-shopping': {
    // Morning: Low | Midday: Low | Evening: Low
    morningBase: 105,
    middayBase: 115,
    eveningBase: 110,
    morningHeadwayMin: 5.4,
    middayHeadwayMin: 8.6,
    eveningHeadwayMin: 5.4,
    dwellBaseSec: 48,
    completeness: 0.95,
  },
  'stg-ngong-milele': {
    // Morning: High | Midday: Low | Evening: Moderate
    morningBase: 350,
    middayBase: 120,
    eveningBase: 210,
    morningHeadwayMin: 6.4,
    middayHeadwayMin: 9.6,
    eveningHeadwayMin: 6.0,
    dwellBaseSec: 84,
    completeness: 0.92,
  },
  'stg-rongai-galleria': {
    // Morning: Low | Midday: Low | Evening: Moderate
    morningBase: 115,
    middayBase: 110,
    eveningBase: 195,
    morningHeadwayMin: 5.4,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 6.2,
    dwellBaseSec: 64,
    completeness: 0.81,
  },
  'stg-ongata-rongai': {
    // Morning: High | Midday: Moderate | Evening: High
    morningBase: 395,
    middayBase: 220,
    eveningBase: 350,
    morningHeadwayMin: 6.5,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 7.0,
    dwellBaseSec: 96,
    completeness: 0.93,
  },

  // --- EAST & SOUTHEAST: JOGOO, KAYOLE, EMBAKASI, UTAWALA, MOMBASA RD (8 stages) ---
  'stg-buruburu': {
    // Morning: High | Midday: Moderate | Evening: High
    morningBase: 410,
    middayBase: 215,
    eveningBase: 355,
    morningHeadwayMin: 5.4,
    middayHeadwayMin: 8.2,
    eveningHeadwayMin: 6.4,
    dwellBaseSec: 96,
    completeness: 0.95,
  },
  'stg-kayole-spine': {
    // Morning: High | Midday: High | Evening: Moderate
    morningBase: 380,
    middayBase: 330,
    eveningBase: 220,
    morningHeadwayMin: 5.8,
    middayHeadwayMin: 8.0,
    eveningHeadwayMin: 6.0,
    dwellBaseSec: 90,
    completeness: 0.91,
  },
  'stg-embakasi-nyayo': {
    // Morning: Moderate | Midday: Low | Evening: High
    morningBase: 220,
    middayBase: 120,
    eveningBase: 345,
    morningHeadwayMin: 5.6,
    middayHeadwayMin: 9.0,
    eveningHeadwayMin: 6.8,
    dwellBaseSec: 88,
    completeness: 0.93,
  },
  'stg-utawala-shooters': {
    // Morning: Moderate | Midday: Low | Evening: Low
    morningBase: 225,
    middayBase: 110,
    eveningBase: 115,
    morningHeadwayMin: 5.8,
    middayHeadwayMin: 9.5,
    eveningHeadwayMin: 5.2,
    dwellBaseSec: 74,
    completeness: 0.90,
  },
  'stg-south-b': {
    // Morning: Low | Midday: Moderate | Evening: Low
    morningBase: 115,
    middayBase: 195,
    eveningBase: 115,
    morningHeadwayMin: 5.2,
    middayHeadwayMin: 8.0,
    eveningHeadwayMin: 5.2,
    dwellBaseSec: 56,
    completeness: 0.94,
  },
  'stg-cabanas-jkia': {
    // Morning: Moderate | Midday: High | Evening: High
    morningBase: 230,
    middayBase: 340,
    eveningBase: 380,
    morningHeadwayMin: 5.5,
    middayHeadwayMin: 7.2,
    eveningHeadwayMin: 6.6,
    dwellBaseSec: 94,
    completeness: 0.95,
  },
  'stg-syokimau-sgr': {
    // Morning: Low | Midday: Low | Evening: Moderate
    morningBase: 115,
    middayBase: 115,
    eveningBase: 205,
    morningHeadwayMin: 5.2,
    middayHeadwayMin: 8.8,
    eveningHeadwayMin: 5.8,
    dwellBaseSec: 70,
    completeness: 0.96,
  },
  'stg-mlolongo-kitengela': {
    // Morning: High | Midday: Moderate | Evening: Moderate
    morningBase: 370,
    middayBase: 215,
    eveningBase: 225,
    morningHeadwayMin: 6.2,
    middayHeadwayMin: 8.8,
    eveningHeadwayMin: 6.0,
    dwellBaseSec: 92,
    completeness: 0.92,
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
  const wave = Math.sin(seed * 0.73) * 0.05 + Math.cos(seed * 0.41) * 0.025;
  return wave;
}

/**
 * Generates a deterministic set of synthetic historical passenger observations
 * across 7 days of the week and 6 representative hours per day for all 30 Greater Nairobi stages.
 * 30 stages * 7 days * 6 representative hours = 1,260 deterministic historical records.
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
        dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 0.82 : 0.68;

      sampleHours.forEach((hour) => {
        const timePeriod = mapHourToTimePeriod(hour);
        const periodBase =
          timePeriod === 'morning_peak'
            ? sig.morningBase
            : timePeriod === 'evening_peak'
            ? sig.eveningBase
            : sig.middayBase;

        const hourSharpener =
          hour === 7 || hour === 18 ? 1.05 : hour === 12 ? 0.96 : 1.0;

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
          dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 1.15 : 1.28;

        const busArrivalIntervalMinutes = Number(
          (baseHeadway * weekendHeadwayFactor * (1 + noise * 0.35)).toFixed(1)
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
