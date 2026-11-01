export interface Patient {
  id: string;
  name: string;
  nik: string; // Kemenkes SatuSehat integration requires NIK
  dob: string;
  gender: 'Laki-laki' | 'Perempuan';
  phone: string;
  address: string;
  bloodType?: string;
  allergies?: string;
  createdAt: string;
  lastAccessAt?: string; // ISO string of last time patient accessed/opened app
  lastAccessAction?: string; // Description of the last activity
  accessCount?: number; // Total number of times patient opened or interacted with app
}

export interface SOAPExam {
  id: string;
  patientId: string;
  date: string;
  dentistName: string;
  // SOAP elements conforming to Kemenkes Electronic Medical Record (RME)
  subjective: string; // Patient complaints, pain, history
  objective: {
    generalStatus: string; // Tensi, Nadi, Respirasi
    extraOral: string; // Facial symmetry, TMJ, profile
    intraOral: string; // Oral hygiene, gingival health
    malocclusionClass: 'Angle Class I' | 'Angle Class II Div 1' | 'Angle Class II Div 2' | 'Angle Class III' | 'Normal';
    overjet: number; // in mm
    overbite: number; // in mm
    crowdingUpper: boolean;
    crowdingLower: boolean;
    spacingUpper: boolean;
    spacingLower: boolean;
    odontogramNotes: string;
    pcrScore?: number;
    pcrTeethCount?: number;
    pcrPlaqueSurfacesCount?: number;
    pcrInterpretation?: 'Baik' | 'Buruk';
  };
  assessment: string; // Orthodontic diagnosis
  plan: {
    treatmentStage: 'Inisiasi' | 'Leveling & Alignment' | 'Retraksi & Penutupan Ruang' | 'Finishing & Oklusi' | 'Retensi (Retention)';
    procedure: string; // Wire changes, elastics, extractions, etc.
    prescription: string; // Painkillers, wax, orthodontic products
    nextVisitDate: string;
  };
}

export interface MonitoringLog {
  id: string;
  patientId: string;
  date: string;
  alignerWearHours?: number; // for clear aligners or elastics (0-24)
  elasticsCompliant?: boolean; // elastic band wear
  painLevel: number; // 0 (none) - 10 (severe)
  brushedCount: number; // how many times brushed teeth today (standard is >3 for braces)
  waxUsed: boolean; // dental wax applied
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface EduSubTopic {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageCaption?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoOriginalUrl?: string;
  keyPoints: string[];
  theoryContent: string;
  practicalSteps?: string[];
  clinicalNote?: string;
  dosAndDonts?: {
    dos: string[];
    donts: string[];
  };
}

export interface EduArticle {
  id: string;
  title: string;
  category: 'Braces Care' | 'Diet' | 'Emergency';
  summary: string;
  content: string;
  estimatedReadTime: string;
  iconName: string;
  imageUrl?: string;
  subTopics?: EduSubTopic[];
}

export interface AppUser {
  username: string;
  password?: string;
  role: 'dentist' | 'patient';
  patientId?: string;
  fullName: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface PatientAccessLog {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: string; // ISO 8601 string
  action: 'login' | 'open_app' | 'view_rekam_medis' | 'fill_monitoring' | 'read_education' | 'ask_ai' | 'view_dashboard';
  actionLabel: string;
  module: string;
  device?: 'mobile' | 'desktop';
  deviceInfo?: string;
  details?: string;
}


