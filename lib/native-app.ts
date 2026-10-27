type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
};

/** True only inside the Capacitor Android shell, not in a browser tab. */
export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}
