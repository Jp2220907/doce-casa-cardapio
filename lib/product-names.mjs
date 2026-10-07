const languages = new Set(['pt-BR', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT']);
const cached = new Map();
const pending = new Map();
let retryAfter = 0;

export function nameSource(product) {
  const entries = product.translations || {};
  // Older products created in a foreign language already carry that entry.
  const language = languages.has(entries._source?.language) ? entries._source.language
    : entries['pt-BR']?.name === product.name ? 'pt-BR'
    : Object.keys(entries).find(key => languages.has(key) && entries[key]?.name === product.name) || 'pt-BR';
  return { name: product.name, language };
}

export function validLanguage(language) { return languages.has(language); }

export async function translateName(name, source, target, fetcher = fetch) {
  if (!validLanguage(source) || !validLanguage(target)) throw new Error('Invalid language');
  if (source === target) return name;
  if (!name || Buffer.byteLength(name, 'utf8') > 500) throw new Error('Name too long');
  const key = JSON.stringify([name, source, target]);
  const hit = cached.get(key);
  if (hit && hit.expires > Date.now()) return hit.name;
  if (pending.has(key)) return pending.get(key);
  if (Date.now() < retryAfter || pending.size >= 8) throw new Error('Translation busy');
  const job = (async () => {
    const url = new URL('https://api.mymemory.translated.net/get');
    url.searchParams.set('q', name);
    url.searchParams.set('langpair', `${source}|${target}`);
    const response = await fetcher(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Translation unavailable');
    const data = await response.json();
    if (data.quotaFinished || Number(data.responseStatus) === 429) {
      retryAfter = Date.now() + 60_000;
      throw new Error('Translation quota reached');
    }
    const translated = data.responseData?.translatedText;
    if (Number(data.responseStatus) !== 200 || typeof translated !== 'string' || !translated.trim() || translated.length > 500) throw new Error('Invalid translation');
    // Keep results as text. Neither the client nor server interprets provider HTML.
    if (cached.size >= 500) cached.delete(cached.keys().next().value);
    cached.set(key, {name:translated.trim(), expires:Date.now() + 86400_000});
    return translated.trim();
  })();
  pending.set(key, job);
  try { return await job; } finally { pending.delete(key); }
}

