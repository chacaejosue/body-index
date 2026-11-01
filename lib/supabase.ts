/**
 * Capa de integración preparada para Supabase.
 *
 * Si NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY están definidos,
 * permite guardar historiales de cálculos, perfiles de usuario y auditorías.
 */

export interface SavedCalculationRecord {
  id?: string;
  created_at?: string;
  user_id?: string;
  perfil: any;
  resultado_imc: any;
  resultado_tmb: any;
  resultado_get: any;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Guarda una medición en la base de datos de Supabase si está configurada.
 */
export async function saveCalculationHistory(
  record: SavedCalculationRecord
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Si no está configurado, opera en modo local sin error
    return { success: false, error: "Supabase no está configurado aún en .env.local" };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = await fetch(`${supabaseUrl}/rest/v1/calculos_historial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const msg = await response.text();
      return { success: false, error: msg };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error al conectar con Supabase" };
  }
}
