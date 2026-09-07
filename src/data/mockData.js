// Realistic Mumbai Geospatial & Road Safety Mock Data (Prototype / Demo Data)

export const MUMBAI_CENTER = [19.1176, 72.8682]; // Andheri East / MIDC junction

export const HAZARD_TYPES = {
  WATERLOGGING: {
    id: 'waterlogging',
    label: 'Waterlogging & Flood',
    color: '#24D6E8',
    bgColor: 'rgba(36, 214, 232, 0.15)',
    borderColor: '#24D6E8',
    iconName: 'Droplets',
    severityLevels: ['Ankle Deep (3-6 in)', 'Knee Deep (1-2 ft)', 'Waist Deep (Hazardous)', 'Impassable (>3 ft)']
  },
  ACCIDENT: {
    id: 'accident',
    label: 'Road Accident',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    iconName: 'AlertTriangle',
    severityLevels: ['Minor Fender-Bender', 'Lane Blocked', 'Multi-Vehicle Pileup', 'Total Road Blockage']
  },
  CONSTRUCTION: {
    id: 'construction',
    label: 'Construction & Metro Work',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#F97316',
    iconName: 'Cone',
    severityLevels: ['Footpath Dug Up', 'Single Lane Restriction', 'Barricaded Section', 'Heavy Machinery Active']
  },
  ROAD_CLOSURE: {
    id: 'closure',
    label: 'Road Closure / Diversion',
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#DC2626',
    iconName: 'OctagonAlert',
    severityLevels: ['Advisory Diversion', 'One-Way Enforcement', 'Police Barricade', 'Full Closure']
  },
  OPEN_MANHOLE: {
    id: 'manhole',
    label: 'Open Manhole / Uncovered Drain',
    color: '#FACC15',
    bgColor: 'rgba(250, 204, 21, 0.15)',
    borderColor: '#FACC15',
    iconName: 'CircleDotDashed',
    severityLevels: ['Cover Missing (Unmarked)', 'Cover Ajar', 'Submerged Drain Open', 'Caved In Chamber']
  },
  FALLEN_TREE: {
    id: 'tree_fall',
    label: 'Fallen Tree / Heavy Branches',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
    iconName: 'Trees',
    severityLevels: ['Branch Blocking Footpath', 'One Lane Blocked', 'Both Lanes Blocked', 'Tree Down on Cables']
  },
  ELECTRICAL_HAZARD: {
    id: 'electrical',
    label: 'Electrical Hazard / Exposed Wire',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.18)',
    borderColor: '#EAB308',
    iconName: 'Zap',
    severityLevels: ['Sparking Transformer', 'Hanging Cable (<6ft)', 'Live Wire in Water', 'Leaning Utility Pole']
  }
};

export const INITIAL_HAZARDS = [
  {
    id: 'hz-101',
    type: 'waterlogging',
    title: 'Knee-Level Waterlogging at Andheri Subway',
    locationName: 'Andheri Subway, Western Express Highway Access',
    coordinates: [19.1198, 72.8465],
    severity: 'High',
    severityLabel: 'Knee Deep (1.5 ft water)',
    reportedTime: '8 mins ago',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: 'verified', // 'unverified' | 'verified' | 'resolved'
    verificationCount: 34,
    disputeCount: 1,
    description: 'Subway completely flooded due to heavy downpour. Two auto-rickshaws stalled inside. Pedestrian underpass is closed. Avoid underpass completely.',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Walk', 'Two-Wheeler', 'Car', 'Bus'],
    recommendedAction: 'Use Gokhale Flyover bridge instead.',
    lifecycle: 'Verified',
    reportedBy: 'Commuter Priya S. (Level 4 Scout)'
  },
  {
    id: 'hz-102',
    type: 'accident',
    title: 'Multi-Vehicle Collision Blocking 2 Lanes',
    locationName: 'Mahakali Caves Road, near Paper Box Junction',
    coordinates: [19.1235, 72.8631],
    severity: 'Critical',
    severityLabel: 'Lane Blocked (2 of 3 lanes)',
    reportedTime: '15 mins ago',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'verified',
    verificationCount: 22,
    disputeCount: 0,
    description: 'Collision between delivery truck and tempo. Ambulance and traffic wardens on scene. Traffic backed up 1.2 km toward Western Express Highway.',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Car', 'Bus', 'Two-Wheeler'],
    recommendedAction: 'Divert via Holy Family High School lane or Central Way.',
    lifecycle: 'Prioritised',
    reportedBy: 'Karan M. (Delivery Partner)'
  },
  {
    id: 'hz-103',
    type: 'construction',
    title: 'Storm Drainage Trench Construction',
    locationName: 'MIDC Central Cross Road, near Seepz Gate 1',
    coordinates: [19.1205, 72.8790],
    severity: 'Moderate',
    severityLabel: 'Barricaded Section (1 lane open)',
    reportedTime: '42 mins ago',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: 'verified',
    verificationCount: 19,
    disputeCount: 2,
    description: 'Deep trench dug for monsoon flood pipe relay. Loose gravel and mud on roadway. Narrow single-file traffic with flaggers present.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Two-Wheeler', 'Car', 'Wheelchair User'],
    recommendedAction: 'Proceed with low speed under 20 km/h.',
    lifecycle: 'In Progress',
    reportedBy: 'BMC Volunteer Desk'
  },
  {
    id: 'hz-104',
    type: 'manhole',
    title: 'Uncovered Open Manhole on Pedestrian Footpath',
    locationName: 'Makhwana Road, 100m from Marol Naka Metro Exit 2',
    coordinates: [19.1118, 72.8821],
    severity: 'Critical',
    severityLabel: 'Cover Missing (Submerged Hazard)',
    reportedTime: '3 mins ago',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: 'unverified',
    verificationCount: 7,
    disputeCount: 0,
    description: 'Manhole lid washed away by water pressure. Local fruit vendors placed a wooden stick with plastic bag, but it is invisible in murky rainwater.',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Walk', 'Wheelchair User', 'Senior Citizen', 'Two-Wheeler'],
    recommendedAction: 'Keep strictly to the center of the asphalt road. Do NOT walk along the left curb.',
    lifecycle: 'Reported',
    reportedBy: 'Rohit Deshmukh (Student)'
  },
  {
    id: 'hz-105',
    type: 'electrical',
    title: 'Sparks from Hanging Low-Tension Wire',
    locationName: 'Chakala Junction, near JB Nagar Metro Pillar 44',
    coordinates: [19.1129, 72.8655],
    severity: 'Critical',
    severityLabel: 'Live Wire near Puddle (<5ft)',
    reportedTime: '12 mins ago',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'verified',
    verificationCount: 41,
    disputeCount: 0,
    description: 'Snapped overhead power connection dangling within 4 feet of flooded pavement. Fire brigade notified. Maintain minimum 15-meter safety radius.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Walk', 'Two-Wheeler', 'Wheelchair User'],
    recommendedAction: 'Divert across the opposite street concourse immediately.',
    lifecycle: 'Prioritised',
    reportedBy: 'Traffic Warden Ajay K.'
  },
  {
    id: 'hz-106',
    type: 'tree_fall',
    title: 'Gulmohar Tree Branch Blocking Footpath',
    locationName: 'Sahar Road, near Leela Business Park',
    coordinates: [19.1090, 72.8698],
    severity: 'Moderate',
    severityLabel: 'Footpath Blocked',
    reportedTime: '55 mins ago',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status: 'verified',
    verificationCount: 15,
    disputeCount: 1,
    description: 'Large bough fallen across pedestrian walkway. Pedestrians forced into vehicle lane. Tree removal team en route.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Walk', 'Wheelchair User', 'Parent with Child'],
    recommendedAction: 'Walk on the opposite north sidewalk.',
    lifecycle: 'In Progress',
    reportedBy: 'Local Resident Anand V.'
  },
  {
    id: 'hz-107',
    type: 'closure',
    title: 'Waterlogging Diversion - Marol Church Road',
    locationName: 'Marol Maroshi Road, near St. John the Baptist',
    coordinates: [19.1242, 72.8860],
    severity: 'High',
    severityLabel: 'Police Barricade / Full Diversion',
    reportedTime: '28 mins ago',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    status: 'verified',
    verificationCount: 26,
    disputeCount: 0,
    description: 'Police have barricaded the low-lying culvert due to backflow from Mithi River tributary. All traffic directed toward Military Road.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    affectedModes: ['Walk', 'Two-Wheeler', 'Car', 'Bus'],
    recommendedAction: 'Follow green detour arrows along Military Road.',
    lifecycle: 'Verified',
    reportedBy: 'Mumbai Traffic Police Alert Monitor'
  }
];

export const MOCK_ROUTE_ANDHERI_TO_MIDC = {
  origin: {
    name: 'Andheri Railway Station (East)',
    coordinates: [19.1197, 72.8464]
  },
  destination: {
    name: 'MIDC Central Road, Andheri East',
    coordinates: [19.1220, 72.8765]
  },
  // Default unsafe route coordinates (via flooded Andheri Subway and congested Mahakali road)
  unsafeRouteCoordinates: [
    [19.1197, 72.8464],
    [19.1198, 72.8520],
    [19.1215, 72.8580],
    [19.1235, 72.8631], // accident point
    [19.1218, 72.8690],
    [19.1205, 72.8790], // drainage construction point
    [19.1220, 72.8765]
  ],
  // Recommended safe alternate route (via elevated Gokhale flyover and Sahar bypass)
  safeRouteCoordinates: [
    [19.1197, 72.8464],
    [19.1165, 72.8490],
    [19.1140, 72.8575], // Flyover elevated road (no waterlogging)
    [19.1129, 72.8680], // High elevation road
    [19.1160, 72.8730],
    [19.1220, 72.8765]
  ],
  decision: {
    recommendation: 'USE ALTERNATE ROUTE',
    statusClass: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    riskScore: 72,
    maxScore: 100,
    confidence: '94%',
    primarySummary: 'High flood & collision risk on standard route. Diverting via Gokhale Flyover Bypass saves 29 minutes and avoids 2 severe hazards.'
  },
  reasons: [
    {
      id: 'r-1',
      title: 'Knee-level waterlogging near Andheri Subway (Exit A)',
      severity: 'Danger',
      icon: 'Droplets',
      detail: 'Estimated +35 mins stall time, water depth 1.5 ft. Risk of vehicle stall or electrocution near low poles.'
    },
    {
      id: 'r-2',
      title: 'Accident causing partial lane blockage on Mahakali Caves Rd',
      severity: 'High',
      icon: 'AlertTriangle',
      detail: '2 lanes blocked. Emergency response vehicles active. Traffic moving at < 4 km/h.'
    },
    {
      id: 'r-3',
      title: 'Active storm drainage construction ahead at Seepz Junction',
      severity: 'Moderate',
      icon: 'Cone',
      detail: 'Loose metal sheets and open trench. Unsafe for two-wheelers and wheelchairs.'
    }
  ],
  defaultRouteStats: {
    distance: '3.4 km',
    duration: '48 mins',
    delay: '+29 mins',
    safetyRating: 'Unsafe (28/100)'
  },
  safeRouteStats: {
    distance: '4.1 km',
    duration: '19 mins',
    delay: '0 mins',
    safetyRating: 'Safe (91/100)',
    safetyAdvantage: '+63% safer'
  },
  lastMileGuidance: {
    stationExit: 'Use Andheri East Exit 3 (Skywalk Concourse) — Avoid ground-level Subway Exit A & B.',
    footpathRating: 'Safe, elevated skywalk with handrails and LED floodlighting.',
    wheelchairStatus: 'Elevator active at Exit 3; ramp access clear to auto stand.',
    safeHubNearby: 'MIDC Police Station Community Hall (Dry zone with first aid & drinking water)'
  }
};

export const EMERGENCY_SERVICES = {
  helplines: [
    { name: 'National Emergency Helpline', number: '112', description: 'Single emergency contact for Police, Fire, and Ambulance dispatch.' },
    { name: 'Disaster Management Cell', number: '108', description: 'Immediate flood evacuation and medical trauma ambulances.' },
    { name: 'Mumbai Police Control', number: '100', description: 'Traffic division, road diversions, and distress SOS.' },
    { name: 'Fire Control Command', number: '101', description: 'Tree clearing, structural falls, and flood rescue boats.' }
  ],
  nearbyHospitals: [
    { name: 'Holy Family Hospital & Trauma Center', distance: '1.2 km away', phone: '+91 22 2684 0000', beds: 'Trauma ICU Open', dryAccess: true, address: 'Near Holy Family Church, Andheri East' },
    { name: 'Criticare Asia Multispecialty Hospital', distance: '1.8 km away', phone: '+91 22 6825 8000', beds: 'Emergency 24/7', dryAccess: true, address: 'Main Marol Road, Andheri East' },
    { name: 'SevenHills Hospital Emergency', distance: '2.4 km away', phone: '+91 22 6767 6767', beds: 'Flood Disaster Center', dryAccess: true, address: 'Marol Maroshi Road' }
  ],
  safeWaitingPoints: [
    { name: 'Andheri East Metro Station Concourse', type: 'Elevated Dry Concourse', distance: '400m', capacity: '200+ capacity', features: 'Power charging, drinking water, security desk, zero waterlogging' },
    { name: 'MIDC Central Fire Command Hall', type: 'Civic Community Shelter', distance: '900m', capacity: '120 capacity', features: 'Dry floor, basic first aid, emergency VHF communications' },
    { name: 'Marol Municipal School Ground High-Platform', type: 'Disaster Assembly Zone', distance: '1.1 km', capacity: '350 capacity', features: 'Generator backup, warm tea & dry rations distribution' }
  ],
  pharmacies247: [
    { name: 'Apollo Pharmacy 24/7', distance: '350m', phone: '+91 22 2838 1204', address: 'Opposite Railway Station East' },
    { name: 'Noble Chemist All-Night', distance: '750m', phone: '+91 22 2821 5566', address: 'Chakala Road Junction' }
  ],
  safetyChecklist: [
    { id: 'c1', text: 'Stay at least 15 meters away from electrical poles, hanging cables, or vibrating junction boxes.' },
    { id: 'c2', text: 'Never walk or drive into murky water where road surface or open manholes cannot be seen.' },
    { id: 'c3', text: 'Turn your headlights on and drive in the crown (highest center portion) of the road.' },
    { id: 'c4', text: 'Share your live safety status with family or trusted contacts before starting travel.' },
    { id: 'c5', text: 'If water rises above tire wheel hubs, turn engine off and evacuate to higher ground.' }
  ]
};

export const ADMIN_METRICS = {
  activeHazards: 34,
  criticalHazards: 8,
  pendingVerification: 12,
  resolvedToday: 19,
  totalCrowdScouts: 4128,
  avgResponseMins: 4.8
};
