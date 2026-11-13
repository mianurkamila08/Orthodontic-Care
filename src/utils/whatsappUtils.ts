import { Patient } from "../types";

export const formatWhatsAppPhone = (phone?: string): string => {
  const cleanPhone = (phone || "").replace(/\D/g, "");
  if (!cleanPhone) return "";
  if (cleanPhone.startsWith("0")) {
    return "62" + cleanPhone.slice(1);
  }
  if (cleanPhone.startsWith("8")) {
    return "62" + cleanPhone;
  }
  return cleanPhone;
};

export const buildPatientWaReminderMessage = (patientName: string): string => {
  const safeName = patientName.trim() || "Pasien";
  return (
    `Halo Kak ${safeName}, apa kabar giginya minggu ini? Semoga kawat giginya terasa nyaman ya! ✨\n\n` +
    `Kami melihat Kakak belum sempat mengisi Buku Harian Gigi di aplikasi Orthodontic Care selama seminggu terakhir. ` +
    `Pengisian jurnal mandiri dan foto berkala sangat membantu dokter memantau pergerakan gigi serta menjaga gusi tetap sehat selama masa perawatan.`
  );
};

export const buildPatientWaUrl = (patient: Pick<Patient, "name" | "phone">): string => {
  const formattedPhone = formatWhatsAppPhone(patient.phone);
  const msg = buildPatientWaReminderMessage(patient.name);
  const encodedMsg = encodeURIComponent(msg);
  return formattedPhone
    ? `https://wa.me/${formattedPhone}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;
};
