// net-utils.ts

/**
 * Realiza una petición POST con control de timeout y reintentos.
 * @param url URL completa del endpoint.
 * @param body Cuerpo del mensaje (por ejemplo, 'sql=...').
 * @param maxRetries Número máximo de reintentos automáticos.
 * @param timeoutMs Tiempo máximo de espera por intento (en milisegundos).
 * @returns Promesa que resuelve con el JSON recibido.
 */
/**
 * Realiza una petición POST con control de timeout y reintentos.
 * Aplica sanitización básica de SQL si detecta que el body contiene sql=
 */
export async function postConControl(
  url: string,
  body: string,
  maxRetries = 2,
  timeoutMs = 10000
): Promise<any> {
  // 🧠 Detectar y procesar SQL si aplica
  if (body.startsWith('sql=')) {
    let sql = decodeURIComponent(body.substring(4)); // extraer el SQL puro

    // 💡 Sanitizar SQL
    sql = sanitizeSql(sql);

    // 💡 Reemplazar + si es UPDATE o SET
    if (/UPDATE\s+/i.test(sql) || /SET\s+/i.test(sql)) {
      sql = sql.replace(/\+/g, '%2B');
    }
  
    // Reasignar el body procesado
    body = 'sql=' + encodeURIComponent(sql);
  }
  // 🌐 Hacer la petición normal
  for (let intento = 1; intento <= maxRetries + 1; intento++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body,
      });

      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();

    } catch (err: any) {
      clearTimeout(timeout);
      if (intento > maxRetries) throw err;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return { success: false, total: 0, Error: 'Error desconocido en red' };
}

/**
 * Limpia valores inválidos del SQL antes de enviarlo.
 */
function sanitizeSql(sql: string): string {
  if (!sql || typeof sql !== 'string') return sql;

  return sql
    .replace(/(['"])?\b(null|undefined)\b\1?/gi, 'NULL')
    .replace(/''/g, 'NULL')
    .replace(/""/g, 'NULL');
}
