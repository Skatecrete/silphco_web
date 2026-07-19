// ========== APP STATE ==========
export interface AppState {
  isUnlocked: boolean;
}

// ========== USER SESSION (matches Android) ==========
export interface UserSession {
  userName: string;
  userIgn: string;
  userDisplay: string;
  isLoggedIn: boolean;
  isGuest: boolean;
}

// ========== PASSWORD GATE ==========
export interface PasswordGateProps {
  onSuccess: () => void;
}

// ========== DIAL TILE ==========
export interface DialTileData {
  id: string;
  label: string;
  image: string;
  route: string;
}

// ========== SHARED TYPES ==========
export interface Pokemon {
  id: number;
  name: string;
  spawnRate: number;
  isShiny: boolean;
  shinyRate: string;
  isRegional: boolean;
  isTopGreatLeague: boolean;
  isTopUltraLeague: boolean;
  isTopMasterLeague: boolean;
  isTopPremierCup: boolean;
  isTopUltraPremier: boolean;
  imageUrl: string;
}