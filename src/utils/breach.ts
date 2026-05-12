/**
 * Breach Monitoring Utility using HaveIBeenPwned API (k-anonymity)
 */

export async function checkPasswordBreach(password: string): Promise<number> {
  const sha1 = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
  const hashArray = Array.from(new Uint8Array(sha1));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  
  const prefix = hashHex.substring(0, 5);
  const suffix = hashHex.substring(5);
  
  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) throw new Error("HIBP API error");
    
    const text = await response.text();
    const lines = text.split("\n");
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(":");
      if (hashSuffix === suffix) {
        return parseInt(count);
      }
    }
  } catch (error) {
    console.error("Breach check failed", error);
  }
  
  return 0;
}
