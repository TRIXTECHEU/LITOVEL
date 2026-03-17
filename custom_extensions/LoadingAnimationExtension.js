/* TrixTech s.r.o. @2026 */
;(function () {
  'use strict';

  const PHRASES = {
    cs: {
      search: [
        'Ověřuji záznamy v databázi {place}...',
        'Prohledávám dokumenty {place}...',
        'Získávám aktuální data {place}...',
        'Procházím informační systém {place}...',
        'Načítám relevantní záznamy {place}...',
        'Komunikuji s databází {place}...',
        'Analyzuji váš dotaz...',
        'Kontroluji dostupné dokumenty...',
        'Hledám odpověď v dostupných zdrojích...',
        'Přistupuji ke znalostní bázi...'
      ],
      thinking: [
        'Zpracovávám záznamy {place}...',
        'Vyhodnocuji informace {place}...',
        'Připravuji přehled pro {place}...',
        'Sestavuji odpověď na základě dat {place}...',
        'Zpracovávám nalezené informace...',
        'Formuluji odpověď...',
        'Ověřuji správnost informací...',
        'Sestavuji srozumitelný výstup...',
        'Finalizuji výsledek...',
        'Generuji odpověď pro vás...'
      ],
      done: 'Vyhledávání dokončeno',
      a11y: 'Asistent připravuje odpověď'
    },
    sk: {
      search: [
        'Overujem záznamy v databáze {place}...',
        'Prehľadávam dokumenty {place}...',
        'Získavam aktuálne dáta {place}...',
        'Prechádzam informačný systém {place}...',
        'Načítavam relevantné záznamy {place}...',
        'Komunikujem s databázou {place}...',
        'Analyzujem vašu otázku...',
        'Kontrolujem dostupné dokumenty...',
        'Hľadám odpoveď v dostupných zdrojoch...',
        'Pristupujem k znalostnej báze...'
      ],
      thinking: [
        'Spracúvam záznamy {place}...',
        'Vyhodnocujem informácie {place}...',
        'Pripravujem prehľad pre {place}...',
        'Skladám odpoveď na základe dát {place}...',
        'Spracúvam nájdené informácie...',
        'Formulujem odpoveď...',
        'Overujem správnosť informácií...',
        'Zostavujem zrozumiteľný výstup...',
        'Finalizujem výsledok...',
        'Generujem odpoveď pre vás...'
      ],
      done: 'Vyhľadávanie dokončené',
      a11y: 'Asistent pripravuje odpoveď'
    },
    en: {
      search: [
        'Verifying records in the {place} database...',
        'Scanning documents of {place}...',
        'Retrieving current data from {place}...',
        'Browsing the {place} information system...',
        'Loading relevant records from {place}...',
        'Connecting to the {place} database...',
        'Analysing your query...',
        'Checking available documents...',
        'Searching available sources...',
        'Accessing the knowledge base...'
      ],
      thinking: [
        'Processing records from {place}...',
        'Evaluating information from {place}...',
        'Preparing an overview for {place}...',
        'Compiling a response based on {place} data...',
        'Processing found information...',
        'Formulating a response...',
        'Verifying information accuracy...',
        'Composing a clear output...',
        'Finalising the result...',
        'Generating a response for you...'
      ],
      done: 'Search complete',
      a11y: 'Assistant is preparing a response'
    },
    de: {
      search: [
        'Einträge in der Datenbank {place} werden geprüft...',
        'Dokumente von {place} werden durchsucht...',
        'Aktuelle Daten von {place} werden abgerufen...',
        'Das Informationssystem {place} wird durchsucht...',
        'Relevante Einträge aus {place} werden geladen...',
        'Verbindung zur Datenbank {place} wird hergestellt...',
        'Ihre Anfrage wird analysiert...',
        'Verfügbare Dokumente werden geprüft...',
        'Verfügbare Quellen werden durchsucht...',
        'Auf die Wissensdatenbank wird zugegriffen...'
      ],
      thinking: [
        'Einträge aus {place} werden verarbeitet...',
        'Informationen aus {place} werden ausgewertet...',
        'Übersicht für {place} wird vorbereitet...',
        'Antwort auf Basis der Daten von {place} wird erstellt...',
        'Gefundene Informationen werden verarbeitet...',
        'Eine Antwort wird formuliert...',
        'Richtigkeit der Informationen wird geprüft...',
        'Klare Ausgabe wird zusammengestellt...',
        'Ergebnis wird abgeschlossen...',
        'Antwort für Sie wird generiert...'
      ],
      done: 'Suche abgeschlossen',
      a11y: 'Assistent bereitet eine Antwort vor'
    },
    pl: {
      search: [
        'Weryfikuję wpisy w bazie danych {place}...',
        'Przeszukuję dokumenty {place}...',
        'Pobieram aktualne dane {place}...',
        'Przeglądamo system informacyjny {place}...',
        'Wczytuję odpowiednie rekordy z {place}...',
        'Łączę się z bazą danych {place}...',
        'Analizuję Twoje pytanie...',
        'Sprawdzam dostępne dokumenty...',
        'Przeszukuję dostępne źródła...',
        'Uzyskuję dostęp do bazy wiedzy...'
      ],
      thinking: [
        'Przetwarzam rekordy z {place}...',
        'Analizuję informacje z {place}...',
        'Przygotowuję przegląd dla {place}...',
        'Składam odpowiedź na podstawie danych {place}...',
        'Przetwarzam znalezione informacje...',
        'Formułuję odpowiedź...',
        'Weryfikuję poprawność informacji...',
        'Tworzę jasną odpowiedź...',
        'Finalizuję wynik...',
        'Generuję odpowiedź dla Ciebie...'
      ],
      done: 'Wyszukiwanie zakończone',
      a11y: 'Asystent przygotowuje odpowiedź'
    },
    uk: {
      search: [
        'Перевіряю записи в базі даних {place}...',
        'Переглядаю документи {place}...',
        'Отримую актуальні дані {place}...',
        'Переглядаю інформаційну систему {place}...',
        'Завантажую відповідні записи з {place}...',
        'Підключаюся до бази даних {place}...',
        'Аналізую ваш запит...',
        'Перевіряю доступні документи...',
        'Шукаю у доступних джерелах...',
        'Звертаюся до бази знань...'
      ],
      thinking: [
        'Опрацьовую записи з {place}...',
        'Аналізую інформацію з {place}...',
        'Готую огляд для {place}...',
        'Складаю відповідь на основі даних {place}...',
        'Опрацьовую знайдену інформацію...',
        'Формулюю відповідь...',
        'Перевіряю правильність інформації...',
        'Готую зрозумілий результат...',
        'Завершую результат...',
        'Генерую відповідь для вас...'
      ],
      done: 'Пошук завершено',
      a11y: 'Асистент готує відповідь'
    },
    hu: {
      search: [
        'Ellenőrzöm a bejegyzéseket a(z) {place} adatbázisában...',
        'Átnézem a(z) {place} dokumentumait...',
        'Lekérem a(z) {place} aktuális adatait...',
        'Böngészem a(z) {place} információs rendszerét...',
        'Betöltöm a(z) {place} releváns rekordjait...',
        'Kapcsolódom a(z) {place} adatbázisához...',
        'Elemzem a kérdését...',
        'Ellenőrzöm az elérhető dokumentumokat...',
        'Keresem az elérhető forrásokban...',
        'Hozzáférek a tudásbázishoz...'
      ],
      thinking: [
        'Feldolgozom a(z) {place} rekordjait...',
        'Kiértékelem a(z) {place} információit...',
        'Összefoglalót készítek a(z) {place} számára...',
        'Választ állítok össze a(z) {place} adatai alapján...',
        'Feldolgozom a talált információkat...',
        'Megfogalmazom a választ...',
        'Ellenőrzöm az információk pontosságát...',
        'Összeállítom az érthető kimenetet...',
        'Véglegesítem az eredményt...',
        'Választ generálok Önnek...'
      ],
      done: 'Keresés kész',
      a11y: 'Az asszisztens választ készít elő'
    }
  };

  const PLACE_LABELS = {
    cs: { city: 'města',      town: 'obce'         },
    sk: { city: 'mesta',      town: 'obce'         },
    en: { city: 'the city',   town: 'the town'     },
    de: { city: 'der Stadt',  town: 'der Gemeinde' },
    pl: { city: 'miasta',     town: 'gminy'        },
    uk: { city: 'міста',      town: 'громади'      },
    hu: { city: 'város',      town: 'község'       }
  };

  function normalizeLang(value) {
    const raw = String(value || '').toLowerCase().trim().slice(0, 5);
    let nav = '';
    try { nav = String(navigator.language || '').toLowerCase().slice(0, 5); } catch (e) {}
    const s = raw || nav || '';
    if (s.startsWith('cs') || s.startsWith('cz')) return 'cs';
    if (s.startsWith('sk'))                        return 'sk';
    if (s.startsWith('de'))                        return 'de';
    if (s.startsWith('pl'))                        return 'pl';
    if (s.startsWith('uk') || s.startsWith('ua')) return 'uk';
    if (s.startsWith('hu'))                        return 'hu';
    if (s.startsWith('en'))                        return 'en';
    return 'en';
  }

  function normalizePlaceType(value) {
    const t = String(value || '').toLowerCase().trim();
    return (t === 'city' || t === 'town') ? t : 'other';
  }

  function normalizeVariant(value) {
    const v = String(value || '').toLowerCase().trim();
    return (v === 'compact' || v === 'minimal') ? v : 'default';
  }

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  function randomBetween(lo, hi) {
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function fmt(template, vars) {
    return String(template)
      .replace(/\{(\w+)\}/g, (_, key) => (vars && vars[key] != null) ? String(vars[key]) : '')
      .replace(/\s+/g, ' ')
      .replace(/\s([.,!?;:])/g, '$1')
      .trim();
  }

  function resolveNum(payloadVal, globalVal, defaultVal) {
    const fromPayload = parseFloat(payloadVal); if (!isNaN(fromPayload)) return fromPayload;
    const fromGlobal  = parseFloat(globalVal);  if (!isNaN(fromGlobal))  return fromGlobal;
    return defaultVal;
  }

  function resolveBool(payloadVal, globalVal, defaultVal) {
    if (payloadVal != null) return !!payloadVal;
    if (globalVal  != null) return !!globalVal;
    return defaultVal;
  }

  function resolveStr(payloadVal, globalVal, defaultVal) {
    if (payloadVal != null && payloadVal !== '') return String(payloadVal);
    if (globalVal  != null && globalVal  !== '') return String(globalVal);
    return defaultVal;
  }

  window.LoadingAnimationExtension = {
    name: 'LoadingAnimation',
    type: 'response',

    match({ trace }) {
      return (
        trace.type === 'ext_loadingAnimation' ||
        trace.payload?.name === 'ext_loadingAnimation' ||
        trace.payload?.type === 'ext_loadingAnimation'
      );
    },

    render({ trace, element }) {
      const payload      = trace?.payload ?? {};
      const globalConfig = (window.LoadingAnimationConfig && typeof window.LoadingAnimationConfig === 'object')
                           ? window.LoadingAnimationConfig : {};
      const globalTheme  = globalConfig.theme ?? {};

      const fixedDurationMs = payload.duration
        ? parseFloat(payload.duration) * 1000
        : globalConfig.durationMs ? parseFloat(globalConfig.durationMs) : null;

      const minDurationMs        = resolveNum(payload.minDurationMs,       globalConfig.minDurationMs,       4000);
      const maxDurationMs        = resolveNum(payload.maxDurationMs,       globalConfig.maxDurationMs,       9000);
      const phaseSplit           = clamp(resolveNum(payload.phaseSplit,    globalConfig.phaseSplit,          0.42), 0.1, 0.9);
      const typingMsPerChar      = resolveNum(payload.typingMsPerChar,     globalConfig.typingMsPerChar,     24);
      const typingJitterMs       = resolveNum(payload.typingJitterMs,      globalConfig.typingJitterMs,      16);
      const deleteMsPerChar      = resolveNum(payload.deleteMsPerChar,     globalConfig.deleteMsPerChar,     9);
      const pauseAfterTypedMs    = resolveNum(payload.pauseAfterTypedMs,   globalConfig.pauseAfterTypedMs,   900);
      const pauseBetweenPhasesMs = resolveNum(payload.pauseBetweenPhasesMs,globalConfig.pauseBetweenPhasesMs,280);
      const endingMinMs          = resolveNum(payload.endingMinMs,         globalConfig.endingMinMs,         700);

      const safeMin       = Math.max(1000, minDurationMs);
      const safeMax       = Math.max(safeMin + 500, maxDurationMs);
      const totalDuration = fixedDurationMs ?? randomBetween(safeMin, safeMax);
      const searchPhaseMs = totalDuration * phaseSplit;

      let rawLang = payload.lang;
      if (rawLang && typeof rawLang === 'object') rawLang = rawLang.lang ?? rawLang.language;
      const lang       = normalizeLang(rawLang ?? globalConfig.lang);
      const placeType  = normalizePlaceType(resolveStr(payload.placeType, globalConfig.placeType, 'other'));
      const variant    = normalizeVariant(resolveStr(payload.variant, globalConfig.variant, 'default'));
      const showIcon   = resolveBool(payload.showIcon,         globalConfig.showIcon,         true);
      const showDone   = resolveBool(payload.showSuccessState, globalConfig.showSuccessState, true);
      const useRandom  = resolveBool(payload.useRandomPhrases, globalConfig.useRandomPhrases, true);
      const a11yLabel  = resolveStr(payload.a11yLabel, globalConfig.a11yLabel, null);

      const fontSize = resolveStr(payload.fontSize, globalTheme.fontSize, variant === 'compact' ? '11.5px' : '12px');
      const theme = {
        bg:             resolveStr(payload.bg,             globalTheme.bg,             'linear-gradient(145deg,#FFFFFF 0%,#F9FAFB 100%)'),
        border:         resolveStr(payload.border,         globalTheme.border,         '#E5E7EB'),
        shadow:         resolveStr(payload.shadow,         globalTheme.shadow,         '0 2px 6px rgba(0,0,0,.05)'),
        borderRadius:   resolveStr(payload.borderRadius,   globalTheme.borderRadius,   '12px'),
        fontSize,
        fontFamily:     resolveStr(payload.fontFamily,     globalTheme.fontFamily,     'var(--_1bof89na,sans-serif)'),
        text:           resolveStr(payload.text,           globalTheme.text,           '#334155'),
        textThinking:   resolveStr(payload.textThinking,   globalTheme.textThinking,   '#0284C7'),
        textSuccess:    resolveStr(payload.textSuccess,    globalTheme.textSuccess,    '#059669'),
        accent:         resolveStr(payload.accent,         globalTheme.accent,         '#006FB9'),
        accentAlt:      resolveStr(payload.accentAlt,      globalTheme.accentAlt,      '#0EA5E9'),
        borderThinking: resolveStr(payload.borderThinking, globalTheme.borderThinking, '#7DD3FC'),
        borderSuccess:  resolveStr(payload.borderSuccess,  globalTheme.borderSuccess,  '#86EFAC'),
        bgSuccess:      resolveStr(payload.bgSuccess,      globalTheme.bgSuccess,      '#F0FDF4')
      };

      const customPhrases = payload.customPhrases ?? globalConfig.customPhrases ?? {};
      const basePhrases   = PHRASES[lang] ?? PHRASES.en;
      const dict = {
        search:   customPhrases[lang]?.search   ?? basePhrases.search,
        thinking: customPhrases[lang]?.thinking ?? basePhrases.thinking,
        done:     customPhrases[lang]?.done     ?? basePhrases.done,
        a11y:     customPhrases[lang]?.a11y     ?? basePhrases.a11y
      };

      const placeLabels   = PLACE_LABELS[lang] ?? PLACE_LABELS.en;
      const placeLabel    = placeType !== 'other' ? (placeLabels[placeType] ?? '') : '';
      const searchPhrase  = fmt(useRandom ? pickRandom(dict.search)   : dict.search[0],   { place: placeLabel });
      const thinkPhrase   = fmt(useRandom ? pickRandom(dict.thinking) : dict.thinking[0], { place: placeLabel });
      const donePhrase    = dict.done;

      let isReducedMotion = false;
      try { isReducedMotion = window.matchMedia?.('(prefers-reduced-motion:reduce)').matches ?? false; }
      catch (e) {}

      if (!document.getElementById('vfrc-la-styles')) {
        const globalStyles = document.createElement('style');
        globalStyles.id = 'vfrc-la-styles';
        globalStyles.textContent = `
          .vfrc-message.vfrc-message--extension.LoadingAnimation {
            width: 100%; display: block;
            margin-bottom: 2px !important; padding-bottom: 0 !important;
          }
          .LoadingAnimation .la-box {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 14px; width: 100%; box-sizing: border-box;
            background: var(--la-bg); border-radius: var(--la-r);
            border: 1px solid var(--la-bd); box-shadow: var(--la-sh);
            position: relative; overflow: hidden;
            transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
          }
          .LoadingAnimation .la-box::before {
            content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
          }
          .LoadingAnimation .la-box.la-t {
            border-color: var(--la-bd-t);
            box-shadow: 0 0 0 3px rgba(14,165,233,.1);
          }
          .LoadingAnimation .la-box.la-t::before { animation: la-shimmer 2.5s infinite; }
          @keyframes la-shimmer { 0% { left: -100%; } 100% { left: 150%; } }
          .LoadingAnimation .la-box.la-s { background: var(--la-bg-s); border-color: var(--la-bd-s); }
          .LoadingAnimation .la-icon {
            display: var(--la-icon-display);
            align-items: center; justify-content: center;
            width: 20px; height: 20px; flex-shrink: 0;
            transition: transform .35s cubic-bezier(.34,1.56,.64,1);
          }
          .LoadingAnimation .la-ico-search {
            color: #64748B; width: 18px; height: 18px;
            animation: la-scan 2s infinite ease-in-out;
          }
          @keyframes la-scan { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          .LoadingAnimation .la-ico-stars { width: 20px; height: 20px; }
          .LoadingAnimation .la-ico-stars path { fill: var(--la-ac); transition: fill .3s; }
          .LoadingAnimation .la-box.la-t .la-ico-stars path { animation: la-cpulse 3s infinite alternate; }
          @keyframes la-cpulse { 0% { fill: var(--la-ac); } 100% { fill: var(--la-ac2); } }
          .LoadingAnimation .la-star-a { animation: la-sp 2s infinite; transform-origin: center; }
          .LoadingAnimation .la-star-b { animation: la-sp 2s 1s infinite; transform-origin: center; }
          @keyframes la-sp { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.6); opacity: .6; } }
          .LoadingAnimation .la-ico-check { color: var(--la-tx-s); width: 20px; height: 20px; }
          .LoadingAnimation .la-chk {
            stroke-dasharray: 20; stroke-dashoffset: 20;
            animation: la-draw .45s forwards;
          }
          @keyframes la-draw { to { stroke-dashoffset: 0; } }
          .LoadingAnimation .la-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
          .LoadingAnimation .la-text {
            color: var(--la-tx);
            font-size: var(--la-font-size);
            font-family: var(--la-font-family);
            font-weight: 500; min-height: 18px; line-height: 1.5;
            display: flex; align-items: center; transition: color .25s;
          }
          .LoadingAnimation .la-box.la-t .la-text { color: var(--la-tx-t); font-weight: 600; }
          .LoadingAnimation .la-box.la-s .la-text { color: var(--la-tx-s); font-weight: 600; }
          .LoadingAnimation .la-cursor::after {
            content: ""; display: inline-block; width: 2px; height: 12px;
            background: currentColor; margin-left: 3px; opacity: .7;
            animation: la-blink .8s steps(2) infinite;
          }
          @keyframes la-blink { 50% { opacity: 0; } }
          .LoadingAnimation.la-compact .la-box { padding: 9px 12px; gap: 10px; }
          .LoadingAnimation.la-minimal .la-box { padding: 8px 10px; gap: 10px; box-shadow: none; background: transparent; }
          @media (prefers-reduced-motion: reduce) {
            .LoadingAnimation .la-box::before,
            .LoadingAnimation .la-ico-search,
            .LoadingAnimation .la-box.la-t .la-ico-stars path,
            .LoadingAnimation .la-star-a, .LoadingAnimation .la-star-b,
            .LoadingAnimation .la-cursor::after {
              animation: none !important; transition: none !important;
            }
          }
        `;
        document.head.appendChild(globalStyles);
      }

      const container = document.createElement('div');
      container.className = `vfrc-message vfrc-message--extension LoadingAnimation la-${variant}`;
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-label', a11yLabel ?? dict.a11y);
      container.style.setProperty('--la-bg',          theme.bg);
      container.style.setProperty('--la-bd',          theme.border);
      container.style.setProperty('--la-sh',          theme.shadow);
      container.style.setProperty('--la-r',           theme.borderRadius);
      container.style.setProperty('--la-tx',          theme.text);
      container.style.setProperty('--la-tx-t',        theme.textThinking);
      container.style.setProperty('--la-tx-s',        theme.textSuccess);
      container.style.setProperty('--la-ac',          theme.accent);
      container.style.setProperty('--la-ac2',         theme.accentAlt);
      container.style.setProperty('--la-bd-t',        theme.borderThinking);
      container.style.setProperty('--la-bd-s',        theme.borderSuccess);
      container.style.setProperty('--la-bg-s',        theme.bgSuccess);
      container.style.setProperty('--la-font-size',   theme.fontSize);
      container.style.setProperty('--la-font-family', theme.fontFamily);
      container.style.setProperty('--la-icon-display',showIcon ? 'flex' : 'none');

      const box      = document.createElement('div');
      box.className  = 'la-box';

      const iconWrap = document.createElement('div');
      iconWrap.className = 'la-icon';

      const content  = document.createElement('div');
      content.className = 'la-content';

      const textEl   = document.createElement('span');
      textEl.className = `la-text${variant !== 'minimal' && !isReducedMotion ? ' la-cursor' : ''}`;

      content.appendChild(textEl);
      box.appendChild(iconWrap);
      box.appendChild(content);
      container.appendChild(box);
      element.appendChild(container);

      function setIcon(phase) {
        if (!showIcon) return;
        iconWrap.style.transform = 'scale(0) rotate(-30deg)';
        setTimeout(() => {
          if (!container.isConnected) return;
          if (phase === 1) {
            iconWrap.innerHTML = '<svg class="la-ico-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
            box.className = 'la-box';
          } else if (phase === 2) {
            iconWrap.innerHTML = '<svg class="la-ico-stars" viewBox="0 0 24 24"><path class="la-star-a" d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z"/><path class="la-star-b" d="M19 2L20 5L23 6L20 7L19 10L18 7L15 6L18 5Z"/></svg>';
            box.classList.add('la-t');
          } else if (phase === 3 && showDone) {
            iconWrap.innerHTML = '<svg class="la-ico-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path class="la-chk" d="M20 6L9 17l-5-5"/></svg>';
            box.className = 'la-box la-s';
          }
          iconWrap.style.transform = 'scale(1) rotate(0deg)';
        }, isReducedMotion ? 0 : 180);
      }

      setIcon(1);

      let currentPhase = 1;
      let charIndex    = 0;
      let isDeleting   = false;
      let activeText   = searchPhrase;
      let timerId      = null;
      const startTime  = Date.now();

      function tick(fn, ms) {
        timerId = setTimeout(fn, isReducedMotion ? 0 : Math.max(0, ms));
      }

      function typeStep() {
        if (!container.isConnected) return;

        if (!isDeleting) {
          if (charIndex < activeText.length) {
            textEl.innerText = activeText.slice(0, ++charIndex);
            tick(typeStep, typingMsPerChar + Math.random() * typingJitterMs);
          } else if (currentPhase === 1) {
            const remainingSearchMs = searchPhaseMs - (Date.now() - startTime);
            tick(() => { isDeleting = true; typeStep(); }, Math.max(pauseAfterTypedMs, remainingSearchMs));
          } else {
            const remainingTotalMs = totalDuration - (Date.now() - startTime);
            tick(triggerEnd, Math.max(endingMinMs, remainingTotalMs));
          }
        } else {
          if (charIndex > 0) {
            textEl.innerText = activeText.slice(0, --charIndex);
            tick(typeStep, deleteMsPerChar);
          } else {
            isDeleting   = false;
            currentPhase = 2;
            activeText   = thinkPhrase;
            setIcon(2);
            tick(typeStep, pauseBetweenPhasesMs);
          }
        }
      }

      function triggerEnd() {
        if (!container.isConnected) return;
        if (showDone) setIcon(3);
        if (!isReducedMotion) textEl.style.opacity = '0';
        setTimeout(() => {
          if (!container.isConnected) return;
          textEl.innerText = donePhrase;
          textEl.classList.remove('la-cursor');
          textEl.style.opacity = '1';
        }, isReducedMotion ? 0 : 160);
      }

      requestAnimationFrame(typeStep);

      const observer = new MutationObserver(() => {
        if (!container.isConnected) {
          clearTimeout(timerId);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };
  
}());
