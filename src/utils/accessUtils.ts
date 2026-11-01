// Helper utilities for Patient Access & Activity Tracking

export type AccessStatusType = 'online' | 'today' | 'recent' | 'inactive' | 'never';

export interface AccessStatusInfo {
  status: AccessStatusType;
  label: string;
  shortLabel: string;
  badgeClass: string;
  dotClass: string;
  textClass: string;
  isRecent: boolean;
}

/**
 * Calculates access status based on the ISO timestamp of last access.
 * Reference date defaults to standard local context or current browser time.
 */
export function getPatientAccessStatus(lastAccessAt?: string): AccessStatusInfo {
  if (!lastAccessAt) {
    return {
      status: 'never',
      label: 'Belum Pernah Akses',
      shortLabel: 'Belum Ada',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
      dotClass: 'bg-gray-400',
      textClass: 'text-gray-500',
      isRecent: false
    };
  }

  const accessDate = new Date(lastAccessAt);
  if (isNaN(accessDate.getTime())) {
    return {
      status: 'never',
      label: 'Format Tidak Valid',
      shortLabel: 'N/A',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
      dotClass: 'bg-gray-400',
      textClass: 'text-gray-500',
      isRecent: false
    };
  }

  // Use current time
  const now = new Date();
  const diffMs = now.getTime() - accessDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // If accessed less than 60 minutes ago
  if (diffMinutes >= 0 && diffMinutes < 60) {
    return {
      status: 'online',
      label: 'Online / Baru Saja',
      shortLabel: 'Online',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs',
      dotClass: 'bg-emerald-500 animate-pulse',
      textClass: 'text-emerald-700 font-bold',
      isRecent: true
    };
  }

  // If accessed within today (24 hours)
  if (diffHours < 24) {
    return {
      status: 'today',
      label: 'Aktif Hari Ini',
      shortLabel: 'Hari Ini',
      badgeClass: 'bg-emerald-50/80 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700 font-semibold',
      isRecent: true
    };
  }

  // If accessed within 7 days
  if (diffDays <= 7) {
    return {
      status: 'recent',
      label: `Aktif ${diffDays} Hari Lalu`,
      shortLabel: `${diffDays}h lalu`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-700',
      isRecent: false
    };
  }

  // Older than 7 days
  return {
    status: 'inactive',
    label: `Tidak Aktif (>7 hari)`,
    shortLabel: 'Pasif',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-600 font-medium',
    isRecent: false
  };
}

/**
 * Format relative time in conversational Indonesian
 */
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "Belum pernah";

  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "Tidak diketahui";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return `Kemarin, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/**
 * Format full Indonesian timestamp
 */
export function formatFullIndoDateTime(isoString?: string): string {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) + ", " + d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  }) + " WIB";
}
