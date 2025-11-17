/*! PayloadWindow.js — Litovel AI Assistant (municipal persona v2.6, no-bleed) | (c) 2025 TrixTech s.r.o. */
(function (window, document) {
  // ===== UX timing - produkční nastavení =====
  var UX = {
    dwellMs: 30000,        // 30s - uživatel strávil čas na stránce
    longStayMs: 60000,     // 60s - dlouhodobá návštěva
    minScrollPct: 30,      // 30% scrollu - uživatel má zájem o obsah
    showDelayMs: 400,      // 400ms - delay animace
    bootWindowMs: 3000,    // 3s - boot delay (čekání na načtení Voiceflow)
    closeCooldownMs: 10000, // 10s - cooldown po zavření
    enforceEveryMs: 1000,  // 1s - check interval
    autoHideMs: 90000,     // 90s (1.5 min) - auto-skrytí pokud uživatel nereaguje
    reShowDelayMs: 8000,   // 8s - re-show po zavření chatu
    sessionTimeoutMs: 300000, // 5 minut = session timeout
    autoReShowMs: 180000,  // 3 minuty - po auto-hide znovu povolit zobrazení
    chatInteractDelayMs: 800,  // 800ms delay - bezpečné odeslání zprávy do chatu
    vfReadyDelayMs: 3000   // 3s - minimální delay po načtení Voiceflow před spuštěním timerů
  };

  // ===== Storage klíče =====
  var SS = {
    SUPPRESS: 'vf_payload_suppressed_session',
    PAYLOAD_DISMISSED: 'vf_payload_dismissed_by_user', // Uživatel zavřel payload křížkem - nezobrazovat po celou session
    CHAT_OPEN: 'vf_chat_is_open',
    USER_OPENED_CHAT: 'vf_user_opened_chat',
    CHAT_CLOSED_TIME: 'vf_chat_closed_time',
    SHOW_COUNT: 'vf_show_count',
    LAST_SHOW_TIME: 'vf_last_show_time',
    SESSION_START: 'vf_session_start'
  };
  var LS = {
    LAST_CLOSE: 'vf_last_close_at',
    TOTAL_VISITS: 'vf_total_visits',
    LAST_VISIT: 'vf_last_visit'
  };

  // ===== Městské copy / zprávy (Litovel) - URL-based, formální vykání, bez emoji =====
  var MSG = {
    // Obecné zprávy pro různé situace
    default:          'Dobrý den. Jsem k dispozici, pokud potřebujete s něčím poradit!',
    deep:             'Hledáte něco konkrétního? Mohu Vám pomoci rychle se zorientovat.',
    linger:           'Jsem k dispozici, pokud potřebujete s něčím poradit nebo něco najít.',
    return_short:     'Máte nějaké další dotazy? Rád pomohu s dalšími informacemi.',
    return_medium:    'Vrátili jste se? Pokud máte další dotaz, klikněte a zeptejte se.',
    return_long:      'Vítejte zpět. Potřebujete něco zjistit nebo vyřídit?',
    session_expired:  'Dobrý den. Mohu Vám něčím pomoci na webu města?',
    idle_reminder:    'Jsem k dispozici pro všechny informace o úřadu, službách a městě.',
    final_attempt:    'Hledáte něco konkrétního? Stačí kliknout a zeptat se.',
    
    // URL-specific zprávy
    urad:             'Pomohu Vám rychle najít správný odbor, formulář i kontakty.',
    uredni_deska:     'Chcete najít nové dokumenty z úřední desky?',
    aktualni_info:    'Poskytnu Vám praktické informace z města i výzvy z úřadu.',
    vyhledavani:      'Najdu konkrétní dokument na úřední desce podle textu či čísla.',
    events:           'Chcete doporučit akci na víkend nebo dnes?',
    noviny:           'Podívejme se na poslední vydání Litovelských novin.',
    kontakty:         'Najdu Vám správnou osobu na úřadě a poskytnu kontakt.',
    odbory:           'Poradím, který odbor řeší Vaši záležitost a jak na to.',
    rezervace:        'Chcete se objednat na úřad bez čekání?',
    prukazy:          'Pomohu s občanským průkazem, pasem i řidičákem krok za krokem.',
    stav_zadosti_op:  'Zjistím stav žádosti o občanský průkaz.',
    stav_zadosti_rp:  'Zjistím, zda je řidičský průkaz připraven k vyzvednutí.',
    zivotni_situace:  'Najdu postup pro Vaši životní situaci na jednom místě.',
    formulare:        'Stáhneme správný formulář a zkontrolujeme přílohy.',
    odbor_dopravy:    'Dopravní záležitosti? Poradím s registrem vozidel, řidičáky i silnicemi.',
    odbor_vystavby:   'Stavební záležitosti, povolení, územní plánování. Nasměruji Vás na správného referenta.',
    odbor_zp:         'Životní prostředí: voda, zeleň, odpady. Vysvětlím, co kam spadá.',
    vnitrni_veci:     'Matrika, podatelna, přestupky. Poradím, kam s tím.',
    uredni_hodiny:    'Kdy má úřad otevřeno a jaké jsou přestávky?',
    info_obcany:      'Praktické informace pro občany přehledně na jednom místě.',
    platby:           'Chcete zaplatit poplatek? Ukážu možnosti a variabilní symbol.',
    poplatek_odpady:  'Vysvětlím částku a splatnost poplatku za odpad.',
    poplatek_psi:     'Řešíte poplatek za psa? Zjistíme sazbu i osvobození.',
    poplatek_hrbitov: 'Hřbitovní místa a poplatky. Poradím, jak platit správně.',
    moznosti_platby:  'Provedu Vás krokem k online platbě a variabilnímu symbolu.',
    kalendar_svozu:   'Poskytnu kalendář svozu pro Vaši část města.',
    harmonogram_svoz: 'Podívejme se na harmonogram svozu odpadů 2025.',
    bioodpad:         'Kdy budou velké kontejnery na bioodpad? Zjistím termíny.',
    mestska_policie:  'Spojím Vás s Městskou policií a poskytnu aktuální informace.',
    cinnost_mp:       'Co přesně Městská policie řeší a jak pomáhá? Poskytnu přehled.',
    webkamera:        'Chcete živý pohled z webkamery? Zde je.',
    tic:              'Hledáte tipy, mapy nebo suvenýry? Poskytnu informace z TIC.',
    gurmanska:        'Pivovar, gastronomie a lokální zážitky. Poskytnu přehled.',
    vodactvi:         'Voda a lodě v Litovli. Půjčovny i trasy.',
    biotop:           'Informace o biotopu: provoz, kontakty i praktické tipy.',
    historie:         'Projdeme si historii města stručně a srozumitelně.',
    partnerska:       'Zajímají Vás partnerská města? Řeknu více.',
    zakon_106:        'Najdu povinně zveřejňované informace dle zákona 106.',
    uzemni_plan:      'Územní plánování a UAP. Odkážu Vás na platné podklady a návrhy.',
    pozadavky:        'Nahlásíte závadu na mapě a zkontrolujete stav řešení.',
    svatba:           'Plánujete svatbu? Pomohu Vám s rezervací termínu.',
    matrika:          'Matrika: rodné listy, sňatky, úmrtí. Vysvětlím postup.'
  };

  /* ===== Vzhled – městský brand Litovel (modrá / světle modrá) ===== */
  var CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* CSS Reset a izolace pro payload window - zabránění přepsání webovými styly */
#vfCta,
#vfCta *,
#vfCta *::before,
#vfCta *::after {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  line-height: normal !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  text-decoration: none !important;
  list-style: none !important;
  border-collapse: collapse !important;
  vertical-align: baseline !important;
}

:root{
  --vf-brand:#006fb9;         /* tmavší městská modrá */
  --vf-accent:#007ACA;        /* světlejší městská modrá */
  --vf-dark:#015289;          /* tmavá modrá pro gradient */
  --vf-text:#0b1720;
  --vf-bg:#ffffff;
  --vf-card-w:240px;
  --vf-launcher-size:120px;
  --vf-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* CTA kontejner - plná izolace */
#vfCta.vf-cta{
  position: fixed !important;
  right: 18px !important;
  bottom: 100px !important;
  z-index: 999999 !important;
  opacity: 0 !important;
  transform: translateY(8px) scale(.98) !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transition: opacity .2s ease, transform .2s ease, visibility 0s linear .2s !important;
  font-family: var(--vf-font) !important;
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  height: auto !important;
  max-width: none !important;
  max-height: none !important;
  min-width: 0 !important;
  min-height: 0 !important;
  float: none !important;
  clear: both !important;
  display: block !important;
}

#vfCta.vf-cta.is-in{ 
  opacity: 1 !important; 
  transform: translateY(0) scale(1) !important; 
  visibility: visible !important; 
  pointer-events: auto !important; 
}

#vfCta.vf-cta.is-out{ 
  opacity: 0 !important; 
  transform: translateY(8px) scale(.98) !important; 
  visibility: hidden !important; 
  pointer-events: none !important; 
  transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s !important; 
}

/* Karta - fixní šířka a izolace */
#vfCta .vf-card{
  position: relative !important;
  width: 240px !important;
  max-width: 240px !important;
  min-width: 240px !important;
  background: #ffffff !important;
  color: #0b1720 !important;
  border: 0 !important;
  border-radius: 16px !important;
  padding: 14px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  box-shadow: 0 16px 32px -16px rgba(0,0,0,.28) !important;
  font-family: var(--vf-font) !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  float: none !important;
  clear: both !important;
}

/* Hlavička karty */
#vfCta .vf-header{ 
  display: flex !important; 
  align-items: center !important; 
  gap: 10px !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

#vfCta .vf-avatar{
  width: 32px !important;
  height: 32px !important;
  flex: 0 0 32px !important;
  max-width: 32px !important;
  max-height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  object-fit: contain !important;
  border-radius: 4px !important;
  background: #ffffff !important;
  user-select: none !important;
  -webkit-user-drag: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

#vfCta .vf-title{ 
  font-size: 15px !important; 
  font-weight: 800 !important; 
  line-height: 1.1 !important; 
  white-space: nowrap !important; 
  overflow: hidden !important; 
  text-overflow: ellipsis !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 1 1 auto !important;
}

#vfCta .vf-title-accent{ 
  color: #007ACA !important; 
  margin-right: 6px !important; 
}

#vfCta .vf-title-rest{ 
  color: #0b1720 !important; 
}

/* Popisek */
#vfCta .vf-desc{ 
  margin: 2px 0 4px !important; 
  font-size: 14px !important; 
  line-height: 1.35 !important; 
  color: #0b1720 !important;
  padding: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* CTA tlačítko – stejný styl jako "Spustit nový chat" z style.css */
#vfCta #vfOpenChat.vf-btn{
  position: relative !important;
  overflow: hidden !important;
  padding: 10px 18px !important;
  border: 0 !important;
  border-radius: 15px !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: .05em !important;
  font-size: 15px !important;
  cursor: pointer !important;
  background: linear-gradient(120deg, #007ACA 0%, #006fb9 50%, #015289 100%) !important;
  transition: background .2s ease, color .2s ease !important;
  margin: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
  display: inline-block !important;
  text-align: center !important;
  text-decoration: none !important;
  line-height: normal !important;
}

#vfCta #vfOpenChat.vf-btn:active{ 
  transform: translateY(1px) !important; 
}

#vfCta #vfOpenChat.vf-btn::after{
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: -35% !important;
  width: 70% !important;
  height: 100% !important;
  background: linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.32) 50%, rgba(255,255,255,0) 100%) !important;
  transform: translateX(260%) skewX(-24deg) !important;
  opacity: 0 !important;
  transition: transform .95s cubic-bezier(.22,.61,.36,1), opacity 1ms linear .96s !important;
  pointer-events: none !important;
  will-change: transform, opacity !important;
}

#vfCta #vfOpenChat.vf-btn:hover{
  background: linear-gradient(120deg, #015289 0%, #006fb9 50%, #007ACA 100%) !important;
}

#vfCta #vfOpenChat.vf-btn:hover::after{
  transform: translateX(-260%) skewX(-24deg) !important;
  opacity: 1 !important;
  transition: transform .95s cubic-bezier(.22,.61,.36,1), opacity 120ms ease 0s !important;
}

/* Zavírací křížek */
#vfCta #vfCtaClose.vf-close{
  position: absolute !important;
  top: -10px !important;
  right: -10px !important;
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  border-radius: 999px !important;
  border: 1px solid rgba(0,0,0,.15) !important;
  background: #fff !important;
  color: #0b1720 !important;
  cursor: pointer !important;
  font-size: 14px !important;
  line-height: 1 !important;
  display: grid !important;
  place-items: center !important;
  box-shadow: 0 8px 16px -10px rgba(0,0,0,.25) !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  text-align: center !important;
}

/* Anti-bleed */
#vfCta .vf-avatar, 
#vfCta .vf-btn, 
#vfCta .vf-close, 
#vfCta .vf-card, 
#vfCta .vf-cta, 
#vfCta img{ 
  -webkit-user-drag: none !important; 
  user-select: none !important; 
}

/* Responzivní design - MOBILY */
@media (max-width:768px){
  #vfCta.vf-cta{ 
    right: auto !important;
    left: 20px !important;
    bottom: calc(80px + 20px) !important;
    transform: translateY(8px) scale(.98) !important;
  }
  #vfCta.vf-cta.is-in{ 
    opacity: 1 !important; 
    transform: translateY(0) scale(1) !important; 
    visibility: visible !important; 
    pointer-events: auto !important; 
  }
  #vfCta.vf-cta.is-out{ 
    opacity: 0 !important; 
    transform: translateY(8px) scale(.98) !important; 
    visibility: hidden !important; 
    pointer-events: none !important;
  }
  #vfCta .vf-card{ 
    width: calc(100vw - 32px) !important; 
    max-width: 240px !important;
    min-width: auto !important;
    margin: 0 !important;
  }
  #vfCta .vf-title{ font-size: 14px !important; }
  #vfCta .vf-desc{ font-size: 13px !important; }
  #vfCta #vfOpenChat.vf-btn{ 
    padding: 12px 20px !important; 
    font-size: 15px !important; 
  }
}

@media (max-width:480px){
  #vfCta.vf-cta{ 
    left: 12px !important;
    bottom: calc(70px + 16px) !important;
  }
  #vfCta .vf-card{ 
    width: calc(100vw - 24px) !important;
    max-width: 100% !important;
    min-width: auto !important;
    padding: 12px !important;
    border-radius: 14px !important;
  }
  #vfCta .vf-avatar{ 
    width: 28px !important; 
    height: 28px !important; 
    flex: 0 0 28px !important;
    max-width: 28px !important;
    max-height: 28px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }
  #vfCta .vf-title{ font-size: 13px !important; }
  #vfCta .vf-desc{ font-size: 12.5px !important; line-height: 1.4 !important; }
  #vfCta #vfOpenChat.vf-btn{ 
    padding: 11px 18px !important; 
    font-size: 14px !important; 
    border-radius: 12px !important;
  }
}
  `.trim();

  // ===== helpers =====
  var now = function(){ return Date.now(); };
  var getSS = function(k){ return sessionStorage.getItem(k); };
  var setSS = function(k,v){ sessionStorage.setItem(k, String(v)); };
  var rmSS = function(k){ sessionStorage.removeItem(k); };
  var getLS = function(k){ return localStorage.getItem(k); };
  var setLS = function(k,v){ localStorage.setItem(k, String(v)); };
  var within = function(ts, ms){ return ts && (now() - Number(ts) < ms); };

  var ctaEl, btnOpenEl, btnCloseEl, descEl, visible = false;
  var metDwell = false, metScroll = false, deepScroll = false, longStay = false;
  var dwellTimer = null, longTimer = null, enforceTimer = null, boot = true, vfReady = false;
  var vfReadyTime = null; // Čas kdy se Voiceflow načetl
  var chatOpen = false;
  var autoHideTimer = null, reShowTimer = null;
  var showCount = 0, sessionStart = now();
  var autoHideWasTimer = false;

  function scheduleAutoReShow(){
    clearTimeout(reShowTimer);
    reShowTimer = setTimeout(function(){
      if (!chatOpen && !detectChatVisible()){
        rmSS(SS.SUPPRESS);
        updateMessage();
        showCTA();
      }
    }, UX.autoReShowMs);
  }

  function injectCSS(){
    if (document.querySelector('style[data-payloadwindow-style]')) return;
    var s = document.createElement('style');
    s.setAttribute('data-payloadwindow-style','1');
    s.appendChild(document.createTextNode(CSS));
    document.head.appendChild(s);
  }

  function injectCTA(){
    if (document.getElementById('vfCta')) return;
    
    var wrap = document.createElement('div');
    wrap.innerHTML = [
      '<div class="vf-cta" id="vfCta" aria-live="polite" aria-hidden="true" style="display:none">',
      '  <div class="vf-card">',
      '    <button class="vf-close" id="vfCtaClose" aria-label="Skrýt">×</button>',
      '    <div class="vf-header">',
      '      <img class="vf-avatar" src="https://trixtecheu.github.io/LITOVEL/images/litovel-icon.png" alt="Znak města Litovel" draggable="false" ondragstart="return false;">',
      '      <strong class="vf-title"><span class="vf-title-accent">AI asistent</span><span class="vf-title-rest">Litovel</span></strong>',
      '    </div>',
      '    <p class="vf-desc" id="vfCtaDesc">' + MSG.default + '</p>',
      '    <button id="vfOpenChat" class="vf-btn" aria-label="Otevřít AI asistenta Litovel"><span class="vf-label">Poraď mi</span></button>',
      '  </div>',
      '</div>'
    ].join('\n');
    document.body.appendChild(wrap.firstChild);
  }

  // Inteligentní URL matching pro personalizované zprávy
  function sectionFromURL(){
    var url = window.location.href.toLowerCase();
    var path = window.location.pathname.toLowerCase();
    
    // Specifické stránky (od nejkonkrétnějších)
    if (path.includes('stav-zadosti-obcanske-prukazy')) return 'stav_zadosti_op';
    if (path.includes('stav-zadosti-ridicske-prukazy')) return 'stav_zadosti_rp';
    if (path.includes('rezervace-terminu-svatby')) return 'svatba';
    if (path.includes('matricni-urad')) return 'matrika';
    if (path.includes('poplatek-za-hrobova-mista')) return 'poplatek_hrbitov';
    if (path.includes('poplatek-za-psy')) return 'poplatek_psi';
    if (path.includes('mistni-poplatek-za-odpadove')) return 'poplatek_odpady';
    if (path.includes('moznosti-platby')) return 'moznosti_platby';
    if (path.includes('kalendar-svozu-bioodpadu')) return 'bioodpad';
    if (path.includes('harmonogram-svozu-odpadu')) return 'harmonogram_svoz';
    if (path.includes('kalendar-svozu-odpadu')) return 'kalendar_svozu';
    if (path.includes('litovelske-noviny')) return 'noviny';
    if (path.includes('cinnost-mestske-policie')) return 'cinnost_mp';
    if (path.includes('mestska-policie')) return 'mestska_policie';
    if (path.includes('webkamera')) return 'webkamera';
    if (path.includes('gurmanska-turistika')) return 'gurmanska';
    if (path.includes('vodactvi')) return 'vodactvi';
    if (path.includes('biotop')) return 'biotop';
    if (path.includes('turisticke-informacni-centrum')) return 'tic';
    if (path.includes('historie-mesta')) return 'historie';
    if (path.includes('partnerska-mesta')) return 'partnerska';
    if (path.includes('106-1999')) return 'zakon_106';
    if (path.includes('uzemni-planovani')) return 'uzemni_plan';
    if (path.includes('pozadavky-obcanu')) return 'pozadavky';
    if (path.includes('organizacni-struktura')) return 'odbory';
    if (path.includes('odbor-dopravy')) return 'odbor_dopravy';
    if (path.includes('odbor-vystavby')) return 'odbor_vystavby';
    if (path.includes('odbor-zivotniho-prostredi')) return 'odbor_zp';
    if (path.includes('oddeleni-vnitrnich-veci')) return 'vnitrni_veci';
    if (path.includes('uredni-hodiny')) return 'uredni_hodiny';
    if (path.includes('potrebuji-si-zaplatit')) return 'platby';
    if (path.includes('zivotni-situace')) return 'zivotni_situace';
    if (path.includes('formulare-a-dokumenty')) return 'formulare';
    if (path.includes('vydavani-prukazu')) return 'prukazy';
    if (path.includes('obcanske-prukazy') || path.includes('ridicske-prukazy')) return 'prukazy';
    if (path.includes('rezervace-na-urad')) return 'rezervace';
    if (path.includes('odbory-uradu')) return 'odbory';
    if (path.includes('kontakty')) return 'kontakty';
    if (path.includes('vyhledavani')) return 'vyhledavani';
    if (path.includes('aktualni-informace')) return 'aktualni_info';
    if (path.includes('uredni-deska') || path.includes('aktualni-oznameni')) return 'uredni_deska';
    if (url.includes('events') || path.includes('akce')) return 'events';
    if (path.includes('informace-pro-obcany')) return 'info_obcany';
    if (path.includes('urad')) return 'urad';
    
    // Fallback na default
    return 'default';
  }

  // Mapování sekcí na automatické zprávy do chatu
  // POUZE tyto sekce posílají automatickou zprávu při kliknutí na payload tlačítko
  // Ostatní sekce (default, aktualni_info, atd.) nezobrazují žádnou zprávu
  function getAutoMessageForSection(section){
    var autoMessages = {
      // Poplatky a platby
      'platby': 'Jaké se platí ve městě poplatky?',
      'poplatek_odpady': 'Jak zaplatit poplatek za odpady?',
      'poplatek_psi': 'Kolik stojí poplatek za psa?',
      'poplatek_hrbitov': 'Jaké jsou poplatky za hřbitovní místa?',
      'moznosti_platby': 'Jak mohu platit poplatky online?',
      
      // Doklady a průkazy
      'prukazy': 'Jak si vyřídit občanský průkaz nebo řidičák?',
      'stav_zadosti_op': 'Jak zjistím stav žádosti o občanský průkaz?',
      'stav_zadosti_rp': 'Kdy bude připraven můj řidičský průkaz?',
      
      // Rezervace a termíny
      'rezervace': 'Jak se objednat na úřad?',
      'svatba': 'Jak si rezervovat termín svatby?',
      
      // Odpady a svoz
      'kalendar_svozu': 'Kdy se sváží odpad v mé části města?',
      'harmonogram_svoz': 'Jaký je harmonogram svozu odpadů?',
      'bioodpad': 'Kdy budou kontejnery na bioodpad?',
      
      // Informace a služby
      'uredni_deska': 'Co nového je na úřední desce?',
      'events': 'Jaké jsou aktuální akce ve městě?',
      'noviny': 'Kde najdu poslední Litovelské noviny?',
      'mestska_policie': 'Jak kontaktovat městskou policii?',
      'uredni_hodiny': 'Jaké jsou úřední hodiny?',
      
      // Úřední záležitosti
      'odbory': 'Který odbor řeší moji záležitost?',
      'kontakty': 'Jak kontaktovat městský úřad?',
      'matrika': 'Jak si vyřídit rodný list nebo oddací list?',
      'urad': 'Co mohu vyřídit na městském úřadě?'
    };
    
    // Vrátí zprávu nebo null (= žádná automatická zpráva)
    return autoMessages[section] || null;
  }

  function pickMessage(ctx){
    // Zjisti, jestli chat byl v minulosti zavřen v této session
    var chatClosedTime = getSS(SS.CHAT_CLOSED_TIME);
    var hadChatInteraction = chatClosedTime ? true : false;
    
    // NOVÁ STRÁNKA / NOVÁ NÁVŠTĚVA (uživatel nepracoval s chatem)
    // → Vždy zobraz úvodní zprávu, i když showCount > 0
    if (!hadChatInteraction) {
      // První zobrazení - vždy default nebo URL-specific zpráva
      if (showCount === 0) {
        var sec = sectionFromURL();
        return MSG[sec] || MSG.default;
      }
      // Po prvním zobrazení - podle kontextu
      // Priorita 1: Deep scroll - uživatel aktivně prohledává obsah
      if (ctx.deepScroll) return MSG.deep;
      // Priorita 2: Long stay - uživatel je na stránce déle
      if (ctx.longStay) return MSG.linger;
      // Priorita 3: URL-specific zpráva nebo default
      var sec = sectionFromURL();
      return MSG[sec] || MSG.default;
    }
    
    // OPAKOVANÉ ZOBRAZENÍ (chat byl v minulosti zavřen)
    // → Zobraz "návratové" zprávy podle času od zavření
    var timeSinceClose = now() - Number(chatClosedTime);

    // Krátce po zavření (do 1 minuty) - decentní
    if (timeSinceClose < 60000) return MSG.return_short;
    // Střední doba (1-5 minut) - aktivnější nabídka
    if (timeSinceClose < 300000) return MSG.return_medium;
    // Dlouho po zavření (5+ minut) - nová návštěva
    if (timeSinceClose < 600000) return MSG.return_long;

    // Velmi dlouhá session - uživatel je tu velmi dlouho
    var sessionAge = now() - sessionStart;
    if (sessionAge > UX.sessionTimeoutMs) return MSG.session_expired;
    
    // Příliš mnoho zobrazení - jemnější přístup
    if (showCount > 3) return MSG.final_attempt;
    
    // Idle reminder pro dlouhou návštěvu
    if (ctx.longStay) return MSG.idle_reminder;

    return MSG.return_medium;
  }

  function updateMessage(){
    if (!descEl) return;
    descEl.innerHTML = pickMessage({ deepScroll: deepScroll, longStay: longStay });
  }

  // ===== VF: zjištění viditelnosti chatu =====
  function detectChatVisible(){
    // 1. Zkontroluj Voiceflow API (nejspolehlivější)
    if (window.voiceflow?.chat && typeof window.voiceflow.chat.isOpen === 'function') {
      try { 
        var isOpen = window.voiceflow.chat.isOpen();
        return isOpen; // Důvěřuj API - je to nejspolehlivější
      } catch(e) {
        // API selhalo, pokračuj na DOM kontrolu
      }
    }
    
    // 2. Pokud API není dostupné, zkontroluj DOM
    // Launcher je SKRYTÝ když je chat otevřený
    var launcher = document.querySelector('.vfrc-launcher, button.vfrc-launcher');
    if (launcher) {
      var launcherCS = window.getComputedStyle(launcher);
      var launcherRect = launcher.getBoundingClientRect();
      var launcherVisible = launcherCS && launcherCS.display !== 'none' && launcherCS.visibility !== 'hidden' && launcherCS.opacity !== '0' && launcherRect.width > 10;
      
      // Pokud je launcher SKRYTÝ = chat je OTEVŘENÝ
      return !launcherVisible;
    }
    
    return false;
  }

  function canShow(){
    var vfIsReady = vfReady && window.voiceflow && window.voiceflow.chat;
    if (!vfIsReady) return false;
    
    var chatVisible = detectChatVisible();
    var sessionOpen = getSS(SS.CHAT_OPEN) === '1';
    var suppressed = getSS(SS.SUPPRESS) === '1';
    var dismissed = getSS(SS.PAYLOAD_DISMISSED) === '1';
    var dwellMet = metDwell;
    var scrollMet = metScroll;
    var cooldownActive = within(getLS(LS.LAST_CLOSE), UX.closeCooldownMs);
    
    if (dismissed) return false;
    if (chatOpen) return false;
    if (chatVisible) return false;
    if (sessionOpen) return false;
    if (suppressed) return false;
    
    // Pokud je chat dlouho zavřený (>2 min), ignoruj dwell/scroll požadavky
    // = uživatel měl čas prozkoumat web, můžeme se znovu nabídnout
    var chatClosedTime = getSS(SS.CHAT_CLOSED_TIME);
    var longClosed = chatClosedTime && (now() - Number(chatClosedTime) > 120000); // 2 minuty
    
    if (!longClosed && !dwellMet && !scrollMet) return false;
    if (cooldownActive) return false;
    
    return true;
  }

  function showCTA(){
    if (chatOpen) return;
    if (detectChatVisible()) return;
    if (!ctaEl) return;
    if (visible) return;
    if (!canShow()) return;

    visible = true;
    showCount++;
    setSS(SS.SHOW_COUNT, String(showCount));
    setSS(SS.LAST_SHOW_TIME, String(now()));

    ctaEl.style.display = '';
    ctaEl.classList.remove('is-out');
    ctaEl.classList.add('is-in');
    ctaEl.removeAttribute('aria-hidden');

    clearTimeout(autoHideTimer);
    autoHideTimer = setTimeout(function(){
      if (visible && !chatOpen) {
        autoHideWasTimer = true;
        hideCTA();
        setSS(SS.SUPPRESS, '1');
        scheduleAutoReShow();
      }
    }, UX.autoHideMs);
  }

  function hideCTA(){
    if (!ctaEl || !visible) return;
    visible = false;
    clearTimeout(autoHideTimer);
    ctaEl.classList.add('is-out');
    var done = function(){
      ctaEl.style.display='none';
      ctaEl.setAttribute('aria-hidden','true');
      ctaEl.removeEventListener('transitionend', done);
    };
    ctaEl.addEventListener('transitionend', done);
    setTimeout(done, 160);
    if (!autoHideWasTimer) return;
    autoHideWasTimer = false;
  }

  function scheduleDwell(){ clearTimeout(dwellTimer); dwellTimer = setTimeout(function(){ metDwell = true; maybeShow(); }, UX.dwellMs); }
  function scheduleLongStay(){ clearTimeout(longTimer); longTimer = setTimeout(function(){ longStay = true; updateMessage(); maybeShow(); }, UX.longStayMs); }
  function watchScroll(){
    var onScroll = function(){
      var sc = (scrollY + innerHeight) / Math.max(1, document.documentElement.scrollHeight) * 100;
      if (sc >= UX.minScrollPct) metScroll = true;
      if (sc >= 65) deepScroll = true;
      if (metScroll){ removeEventListener('scroll', onScroll); maybeShow(); }
    };
    addEventListener('scroll', onScroll, { passive:true }); onScroll();
  }
  function maybeShow(){ 
    // Extra kontrola před zobrazením
    if (chatOpen || detectChatVisible()) return;
    if (!canShow()) return; 
    
    if (vfReadyTime) {
      var timeSinceVFReady = now() - vfReadyTime;
      var minDelayAfterVF = 5000;
      
      if (timeSinceVFReady < minDelayAfterVF) {
        var remainingDelay = minDelayAfterVF - timeSinceVFReady;
        setTimeout(function(){
          if (!chatOpen && !detectChatVisible() && canShow()) {
            updateMessage(); 
            setTimeout(showCTA, UX.showDelayMs);
          }
        }, remainingDelay);
        return;
      }
    }
    
    updateMessage(); 
    setTimeout(showCTA, UX.showDelayMs); 
  }

  function startEnforcer(){
    clearInterval(enforceTimer);
    enforceTimer = setInterval(function(){
      var openNow = detectChatVisible();
      var wasChatOpen = chatOpen;

      // PRIORITA: Pokud je chat otevřený, schovat payload a nic dalšího nedělat
      if (openNow || chatOpen){
        if (!chatOpen){
          chatOpen = true;
          setSS(SS.CHAT_OPEN,'1');
        }
        // Pokud je payload viditelné a chat je otevřený, VŽDY ho schovat
        if (visible) {
          hideCTA();
        }
        return; // STOP - nic dalšího nedělat když je chat otevřený
      }

      // Chat byl zavřený - naplánovat znovu zobrazení
      if (!openNow && wasChatOpen){
        chatOpen = false;
        setSS(SS.CHAT_OPEN, '0');
        setSS(SS.CHAT_CLOSED_TIME, String(now()));
        setLS(LS.LAST_CLOSE, String(now()));

        clearTimeout(reShowTimer);
        reShowTimer = setTimeout(function(){
          if (!chatOpen && !visible && !detectChatVisible()) {
            rmSS(SS.SUPPRESS);
            updateMessage();
            showCTA();
          }
        }, UX.reShowDelayMs);
        return;
      }

      // Chat není otevřený a CTA není viditelný - zkusit zobrazit
      // DŮLEŽITÉ: Zobraz POUZE pokud chat JE OPRAVDU zavřený
      if (!openNow && !chatOpen && !visible && canShow()){
        updateMessage();
        showCTA();
      }
    }, UX.enforceEveryMs);
  }

  function observeVF(){
    // Sleduj LAUNCHER tlačítko - když zmizí, chat je otevřený
    var checkLauncher = function() {
      var launcher = document.querySelector('.vfrc-launcher, button.vfrc-launcher');
      if (!launcher) return;
      
      var launcherCS = window.getComputedStyle(launcher);
      var launcherVisible = launcherCS && launcherCS.display !== 'none' && launcherCS.visibility !== 'hidden' && launcherCS.opacity !== '0';
      
      // Launcher ZMIZEL = chat se otevřel
      if (!launcherVisible && !chatOpen) {
        chatOpen = true;
        setSS(SS.CHAT_OPEN,'1');
        if (visible) hideCTA();
      }
      // Launcher se OBJEVIL = chat se zavřel
      else if (launcherVisible && chatOpen) {
        chatOpen = false;
        setSS(SS.CHAT_OPEN, '0');
        setSS(SS.CHAT_CLOSED_TIME, String(now()));
      }
    };
    
    // Observer na celý body
    var mo = new MutationObserver(checkLauncher);
    mo.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    // Observer přímo na launcher pokud existuje
    var launcher = document.querySelector('.vfrc-launcher, button.vfrc-launcher');
    if (launcher) {
      var launcherMo = new MutationObserver(checkLauncher);
      launcherMo.observe(launcher, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
    }
  }

  function markChatOpened(){
    setSS(SS.CHAT_OPEN, '1');
    setSS(SS.USER_OPENED_CHAT, '1');
    setSS(SS.SUPPRESS, '1');
    chatOpen = true;
    hideCTA();
  }

  function bindOpenChatButton(){
    var btn = document.getElementById('vfOpenChat');
    if (btn){
      btn.addEventListener('click', function(){
        try { window.voiceflow.chat.open(); } catch(_) {}
        setSS(SS.SUPPRESS, '1');
        markChatOpened();
      });
    }
  }

  function bindLauncherClick(){
    var LAUNCHER_SEL = '.vfrc-launcher__container, .vfrc-launcher__inner, .vfrc-widget__launcher, .vfrc-launcher, .vfrc-button[title="Open chat agent"], [data-testid="vfrc-launcher"], [data-voiceflow-launcher]';
    var HOST_SEL = '#voiceflow-chat, #voiceflow-chat-widget';

    document.addEventListener('click', function(e){
      var target = e.target;
      if (!target) return;

      var path = (typeof e.composedPath === 'function') ? e.composedPath() : [];
      for (var i = 0; i < path.length; i++){
        var n = path[i];
        if (n && n.matches && n.matches(LAUNCHER_SEL)){
          markChatOpened();
          return;
        }
      }
      if (target.closest && target.closest(LAUNCHER_SEL)){
        markChatOpened();
        return;
      }
      var hosts = document.querySelectorAll(HOST_SEL);
      for (var j = 0; j < hosts.length; j++){
        var host = hosts[j];
        var sr = host && host.shadowRoot;
        if (!sr) continue;
        if (sr.contains(target)){
          for (var k = 0; k < path.length; k++){
            var sn = path[k];
            if (sn && sn.matches && sn.matches(LAUNCHER_SEL)){
              markChatOpened();
              return;
            }
          }
        }
      }
    }, true);
  }

  function handleChatClosed(){
    rmSS(SS.CHAT_OPEN);
    chatOpen = false;
    rmSS(SS.USER_OPENED_CHAT);
    setSS(SS.CHAT_CLOSED_TIME, String(now()));
    setLS(LS.LAST_CLOSE, String(now()));
    clearTimeout(reShowTimer);
    reShowTimer = setTimeout(function(){
      if (!chatOpen && !detectChatVisible()){
        rmSS(SS.SUPPRESS);
        updateMessage();
        showCTA();
      }
    }, UX.reShowDelayMs);
  }

  function bindCloseButtons(){
    var CLOSE_SEL = 'button[title="Close chat agent"], [aria-label="Close"], .vfrc-header__button, .vfrc-close, .vfrc-close-button, [data-testid="vfrc-header-close"]';
    var HOST_SEL = '#voiceflow-chat, #voiceflow-chat-widget';

    document.addEventListener('click', function(e){
      var t = e.target; if (!t) return;
      var path = (typeof e.composedPath === 'function') ? e.composedPath() : [];
      for (var i = 0; i < path.length; i++){
        var n = path[i];
        if (n && n.matches && n.matches(CLOSE_SEL)){
          handleChatClosed();
          return;
        }
      }
      if (t.closest && t.closest(CLOSE_SEL)){
        handleChatClosed();
        return;
      }
      var hosts = document.querySelectorAll(HOST_SEL);
      for (var j = 0; j < hosts.length; j++){
        var host = hosts[j]; var sr = host && host.shadowRoot; if (!sr) continue;
        if (sr.contains(t)){
          for (var k = 0; k < path.length; k++){
            var sn = path[k];
            if (sn && sn.matches && sn.matches(CLOSE_SEL)){
              handleChatClosed();
              return;
            }
          }
        }
      }
    }, true);
  }

  setTimeout(function(){ boot = false; }, UX.bootWindowMs);
  addEventListener('hashchange', updateMessage);

  addEventListener('message', function(evt){
    var data = evt.data;
    if (typeof data === 'string'){ try { data = JSON.parse(data); } catch{} }
    if (!data || typeof data.type !== 'string') return;

    if (data.type === 'voiceflow:open'){
      setSS(SS.CHAT_OPEN,'1');
      setSS(SS.USER_OPENED_CHAT,'1');
      setSS(SS.SUPPRESS, '1');
      chatOpen = true;
      hideCTA();
    }
    if (data.type === 'voiceflow:close'){
      rmSS(SS.CHAT_OPEN);
      chatOpen = false;
      rmSS(SS.USER_OPENED_CHAT);
      setSS(SS.CHAT_CLOSED_TIME, String(now()));
      setLS(LS.LAST_CLOSE, String(now()));

      clearTimeout(reShowTimer);
      reShowTimer = setTimeout(function(){
        if (!chatOpen && !visible) {
          rmSS(SS.SUPPRESS);
          updateMessage();
          showCTA();
        }
      }, UX.reShowDelayMs);
    }
  });

  window.PayloadWindowOnReady = function(api){
    vfReady = true;
    vfReadyTime = now();
    
    try{
      if (api?.proactive?.push){
        var _orig = api.proactive.push.bind(api.proactive);
        api.proactive.push = function(){ if (detectChatVisible() || chatOpen) return; return _orig.apply(api.proactive, arguments); };
      }
    }catch(_){}

    if (detectChatVisible() || getSS(SS.CHAT_OPEN)==='1'){
      chatOpen = true;
      setSS(SS.CHAT_OPEN,'1');
      if (visible) hideCTA();
    }
    
    metDwell = false;
    metScroll = false;
    deepScroll = false;
    longStay = false;
    clearTimeout(dwellTimer);
    clearTimeout(longTimer);
    
    observeVF();
    startEnforcer();
    
    setTimeout(function(){
      scheduleDwell();
      scheduleLongStay();
      watchScroll();
    }, UX.vfReadyDelayMs);
  };

  function bindCTA(){
    ctaEl      = document.getElementById('vfCta');
    btnOpenEl  = document.getElementById('vfOpenChat');
    btnCloseEl = document.getElementById('vfCtaClose');
    descEl     = document.getElementById('vfCtaDesc');

    btnOpenEl?.addEventListener('click', function(){
      try { 
        window.voiceflow.chat.open(); 
        
        var section = sectionFromURL();
        var autoMessage = getAutoMessageForSection(section);
        
        if (autoMessage) {
          setTimeout(function(){
            try {
              window.voiceflow.chat.interact({ 
                type: 'text', 
                payload: autoMessage 
              });
            } catch(err) {}
          }, UX.chatInteractDelayMs);
        }
      } catch(_) {}
      setSS(SS.SUPPRESS, '1');
      markChatOpened();
    });

    btnCloseEl?.addEventListener('click', function(){ 
      setSS(SS.PAYLOAD_DISMISSED, '1');
      setSS(SS.SUPPRESS, '1');
      hideCTA();
    });
  }

  function init(){
    var hostname = window.location.hostname.toLowerCase();
    var isValidDomain = hostname.includes('litovel.eu');
    
    if (!isValidDomain) {
      return;
    }
    
    showCount = parseInt(getSS(SS.SHOW_COUNT) || '0');
    sessionStart = parseInt(getSS(SS.SESSION_START) || String(now()));
    setSS(SS.SESSION_START, String(sessionStart));

    injectCSS();
    injectCTA();
    bindCTA();
    bindOpenChatButton();
    bindLauncherClick();
    bindCloseButtons();

    startEnforcer();
    observeVF();

    document.addEventListener('visibilitychange', function(){ 
      if (document.visibilityState==='visible' && !metDwell) scheduleDwell(); 
    });

    var chatIsVisible = detectChatVisible();
    var sessionChatOpen = getSS(SS.CHAT_OPEN) === '1';
    
    if (chatIsVisible || sessionChatOpen){
      chatOpen = true;
      setSS(SS.CHAT_OPEN,'1');
      if (visible) hideCTA();
    } else {
      rmSS(SS.SUPPRESS);
      rmSS(SS.CHAT_OPEN);
      chatOpen = false;
    }
  }

  window.PayloadWindow = { show: showCTA, hide: hideCTA };
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }

})(window, document);
