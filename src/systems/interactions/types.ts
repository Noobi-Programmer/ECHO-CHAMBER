// Interaction and inspection type definitions for ECHO//CHAMBER

export interface InspectStateContent {
  description: string[];
  textureKey?: string;
  details?: string;
  placeholderNote?: string;
  badge?: string;
  source?: string;
}

export interface InspectConfig {
  id: string;
  title: string;
  source?: string;
  category?: 'EVIDENCE' | 'EQUIPMENT' | 'PERSONAL' | 'ENVIRONMENT' | 'RESTRICTED';
  present: InspectStateContent;
  echo?: InspectStateContent;
  initialEcho?: boolean;
  onStateChange?: (echo: boolean) => void;
  canMagnify?: boolean;
}

export interface CrtMenuItem {
  id: string;
  label: string;
  response: string | string[];
  status?: string;
}

export interface CrtConfig {
  title: string;
  systemTag: string;
  statusLines?: string[];
  menuPrompt?: string;
  items?: CrtMenuItem[];
  allowStepAway?: boolean;
  onSelect?: (id: string) => Promise<void> | void;
}

export interface RecorderTrack {
  id: string;
  tag: string;
  speaker: string;
  cycle: string;
  sealed?: boolean;
  sealedMessage?: string;
  lines: string[];
}

export interface EvidenceOption {
  id: string;
  label: string;
  details?: string;
  validFor?: string;
}

export interface ContestedMemoryConfig {
  title: string;
  versionM: {
    id: string;
    speaker: string;
    timestamp: string;
    quote: string;
    summary: string;
    status: 'CONTESTED' | 'CORROBORATED';
  };
  versionV: {
    id: string;
    speaker: string;
    timestamp: string;
    quote: string;
    summary: string;
    status: 'CONTESTED' | 'INVALIDATED';
  };
  evidenceList: EvidenceOption[];
  correctMemoryId: string;
  correctEvidenceId: string;
  onCorroborated: () => Promise<void> | void;
}
