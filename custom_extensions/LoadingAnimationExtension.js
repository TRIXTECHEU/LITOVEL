/* TrixTech s.r.o. @2025 */

window.LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',

  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const lang = ((payload.lang || 'cs').toLowerCase().includes('en')) ? 'en' : 'cs';
    const type = (payload.type || 'SMT').toUpperCase();
    const phase = payload.phase || 'output';
    const customDuration = typeof payload.duration === 'number' && payload.duration > 0 ? payload.duration * 1000 : null;

    const messagesMap = {
      cs: {
        analysis: {
          DEFAULT: ['Chvilku strpení.'],
          SMT: ['Zpracovávám váš dotaz.', 'Ještě okamžik.'],
          SWEARS: ['Zpracovávám dotaz.', 'Chvilku strpení.'],
          OTHER: ['Zkoumám zadání.', 'Ještě moment.'],
          KB: ['Zjišťuji souvislosti.', 'Zpracovávám data.', 'Chvilku strpení.'],
          KB_WS: ['Hledám odpověď v databázi Litovel.', 'Zpracovávám informace.', 'Ještě okamžik.']
        },
        rewrite: ['Připravuji výstižnější odpověď.'],
        output: {
          SMT: ['Tvořím odpověď.'],
          KB_WS: ['Hledám v databázi Litovel.', 'Získávám relevantní informace.', 'Formuluji odpověď.'],
          OTHER: ['Ověřuji vhodnost obsahu.'],
          SWEARS: ['Kontroluji jazykový obsah.'],
          KB: ['Získávám informace.', 'Zpracovávám odpověď.', 'Formuluji reakci.']
        },
        all: {
          KB: ['Procházím databázi Litovel.', 'Ověřuji dostupná fakta.', 'Připravuji odpověď.'],
          KB_WS: ['Hledám v databázi Litovel.', 'Analyzuji webové zdroje.', 'Ověřuji souvislosti.', 'Píši odpověď.']
        }
      },
      en: {
        analysis: {
          DEFAULT: ['Hold on a moment.'],
          SMT: ['Processing your query.', 'Just a moment.'],
          SWEARS: ['Processing your query.', 'Hold on a moment.'],
          OTHER: ['Examining the request.', 'Just a moment.'],
          KB: ['Checking relations.', 'Processing data.', 'Hold on a moment.'],
          KB_WS: ['Searching the Litovel database.', 'Processing information.', 'Just a moment.']
        },
        rewrite: ['Preparing a clearer response.'],
        output: {
          SMT: ['Generating response.'],
          KB_WS: ['Searching the Litovel database.', 'Gathering relevant information.', 'Formulating response.'],
          OTHER: ['Verifying content appropriateness.'],
          SWEARS: ['Checking language content.'],
          KB: ['Gathering information.', 'Processing response.', 'Formulating reply.']
        },
        all: {
          KB: ['Browsing the Litovel database.', 'Verifying available facts.', 'Preparing response.'],
          KB_WS: ['Searching the Litovel database.', 'Analyzing web sources.', 'Verifying context.', 'Writing response.']
        }
      }
    };

    let messages;
    if (phase === 'all' && (type === 'KB' || type === 'KB_WS')) {
      messages = messagesMap[lang]?.all?.[type];
    } else if (phase === 'output') {
      messages = messagesMap[lang]?.output?.[type];
    } else if (phase === 'analysis') {
      messages = messagesMap[lang]?.analysis?.[type] || messagesMap[lang]?.analysis?.DEFAULT;
    } else {
      messages = messagesMap[lang]?.[phase];
    }
    if (!messages?.length) return;

    const totalDuration = customDuration ?? (
      phase === 'analysis' ? (type === 'KB' || type === 'KB_WS' ? 12000 : 4000) :
      phase === 'output' ? (type === 'KB_WS' ? 23000 : type === 'KB' ? 12000 : 4000) :
      3000
    );
    const messageInterval = totalDuration / messages.length;

    const container = document.createElement('div');
    container.className = 'vfrc-message vfrc-message--extension LoadingAnimation';
    container.innerHTML = `
      <style>
        .vfrc-message--extension.LoadingAnimation { opacity:1; transition:opacity 0.3s ease-out; width:100%; display:block; }
        .vfrc-message--extension.LoadingAnimation.hide { opacity:0; visibility:hidden; pointer-events:none; }
        .loading-box { display:flex; align-items:center; gap:8px; padding:8px 12px; background:#F9FAFB; border-radius:12px; border:1px solid #E5E7EB; }
        .loading-text { flex:1; font-size:12px; color:rgba(26,30,35,0.7); font-style:italic; transition:opacity 0.3s,transform 0.3s; }
        .loading-text.changing { opacity:0; transform:translateY(-5px); }
        .loading-text.entering { opacity:0; transform:translateY(5px); }
        .rotating-point-spinner { width:16px; height:16px; position:relative; animation:spin 0.9s linear infinite; flex-shrink:0; }
        .rotating-point-spinner::before { content:""; position:absolute; top:0; left:0; width:100%; height:100%; border:2px solid rgba(0,0,0,0.12); border-radius:50%; }
        .rotating-point-spinner::after { content:""; position:absolute; width:5px; height:5px; top:-1.5px; left:calc(50% - 2.5px); background:#006FB9; border-radius:50%; }
        .rotating-point-spinner.hide { opacity:0; width:0; display:none; }
        @keyframes spin { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
      </style>
      <div class="loading-box">
        <div class="rotating-point-spinner"></div>
        <span class="loading-text"></span>
      </div>
    `;
    element.appendChild(container);

    const textEl = container.querySelector('.loading-text');
    const spinner = container.querySelector('.rotating-point-spinner');
    let currentIndex = 0;

    const showText = (text) => {
      textEl.classList.add('changing');
      setTimeout(() => {
        textEl.textContent = text;
        textEl.classList.remove('changing');
        textEl.classList.add('entering');
        requestAnimationFrame(() => textEl.classList.remove('entering'));
      }, 300);
    };
    showText(messages[currentIndex]);

    let intervalId = null;
    if (messages.length > 1) {
      intervalId = setInterval(() => {
        if (++currentIndex < messages.length) {
          showText(messages[currentIndex]);
        } else {
          clearInterval(intervalId);
        }
      }, messageInterval);
    }

    const stopAnimation = () => {
      clearInterval(intervalId);
      spinner.classList.add('hide');
    };

    const hideAfter = setTimeout(stopAnimation, totalDuration);

    const observer = new MutationObserver(muts => {
      muts.forEach(m => m.removedNodes.forEach(n => {
        if (n === container || n.contains(container)) {
          clearTimeout(hideAfter);
          clearInterval(intervalId);
          observer.disconnect();
        }
      }));
    });
    observer.observe(element.parentElement || document.body, { childList: true, subtree: true });

    const responseObserver = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && n.classList.contains('vfrc-message--ai')) {
          stopAnimation();
          responseObserver.disconnect();
        }
      }));
    });
    responseObserver.observe(document.body, { childList: true, subtree: true });
  }
};
