export const formatNumberInput = (v: number | string): string =>
  v === "" || v == null ? "" : Number(v).toLocaleString("ko-KR");

export const parseNumberInput = (v: string): number | string => {
  const cleaned = v.replace(/[^0-9]/g, "");
  return cleaned === "" ? "" : Number(cleaned);
};
