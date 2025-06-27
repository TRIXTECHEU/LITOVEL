window.LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'ext_loadingAnimation',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' ||
    trace.payload?.type === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const phase = payload.phase || 'output';           // 'analysis', 'all' or 'output'
    const incomingLang = (payload.lang || 'cs').toLowerCase().trim();

    // správná deklarace proměnné
    let lang;
    if (incomingLang.includes('cs') || incomingLang.includes('czech')) {
      lang = 'cs';
    } else if (incomingLang.includes('en') || incomingLang.includes('english')) {
      lang = 'en';
    } else {
      lang = 'cs';
    }

    const type = (payload.type || 'SMT').toUpperCase(); // 'SMT', 'KB', 'KB_WS', etc.

    const messageSequences = {
      cs: {
        analysis: {
          DEFAULT: ['Vydržte moment'],
          SMT: ['Analyzuji dotaz', 'Vydržte moment'],
          KB: ['Analyzuji dotaz', 'Zpracovávám váš dotaz', 'Vydržte moment'],
          KB_WS: ['Analyzuji dotaz', 'Zpracovávám váš dotaz', 'Vydržte moment'],
          OTHER: ['Analyzuji dotaz', 'Vydržte moment'],
          SWEARS: ['Analyzuji dotaz', 'Vydržte moment']
        },
        output: {
          SMT: ['Dokončuji odpověď'],
          KB: ['Připravuji odpověď', 'Píši odpověď'],
          KB_WS: ['Hledám v databázi', 'Prohledávám webové zdroje', 'Připravuji odpověď', 'Píši odpověď'],
          OTHER: ['Nacházím nevhodný výraz'],
          SWEARS: ['Nacházím nevhodný výraz']
        },
        all: {
          KB: ['Prohledávám svou databázi', 'Ověřuji informace', 'Připravuji svoji odpověď'],
          KB_WS: ['Prohledávám svou databázi', 'Prohledávám webové zdroje', 'Ověřuji informace', 'Připravuji svoji odpověď']
        }
      },
      en: {
        analysis: {
          DEFAULT: ['Hold on a moment'],
          SMT: ['Analyzing query.', 'Hold on a moment'],
          KB: ['Analyzing query.', 'Processing your query.', 'Hold on a moment'],
          KB_WS: ['Analyzing query.', 'Processing your query.', 'Hold on a moment'],
          OTHER: ['Analyzing query.', 'Hold on a moment'],
          SWEARS: ['Analyzing query.', 'Hold on a moment']
        },
        output: {
          SMT: ['I am completing my response.'],
          KB: ['I am preparing my response.', 'I am writing my response.'],
          KB_WS: ['I am searching the database.', 'I am searching web sources.', 'I am preparing my response.', 'I am writing my response.'],
          OTHER: ['I am detecting inappropriate content.'],
          SWEARS: ['I am detecting inappropriate content.']
        },
        all: {
          KB: ['I am searching my database.', 'I am verifying information.', 'I am preparing my response.'],
          KB_WS: ['I am searching my database.', 'I am searching web sources.', 'I am verifying information.', 'I am preparing my response.']
        }
      }
    };

    try {
      // pauza na základě payload.duration (v sekundách)
      const customDurationSeconds = payload.duration;
      let totalDuration;

      if (typeof customDurationSeconds === 'number' && customDurationSeconds > 0) {
        totalDuration = customDurationSeconds * 1000;
      } else {
        // fallback dle fáze a typu
        if (phase === 'analysis') {
          totalDuration = (type === 'KB' || type === 'KB_WS') ? 12000 : 4000;
        } else if (phase === 'output') {
          totalDuration = (type === 'KB_WS') ? 23000
                        : (type === 'KB')   ? 12000
                        : 4000;
        } else {
          totalDuration = 3000;
        }
      }

      const messages = 
        phase === 'all'
          ? messageSequences[lang].all[type] || []
          : messageSequences[lang][phase][type] || messageSequences[lang][phase].DEFAULT;

      if (!messages.length) return;

      const container = document.createElement('div');
      container.className = 'vfrc-message vfrc-message--extension LoadingAnimation';

      // styl kontejneru
      const style = document.createElement('style');
      style.textContent = `
        .vfrc-message--extension.LoadingAnimation { opacity:1; transition:opacity .3s; width:100%; }
        .vfrc-message--extension.LoadingAnimation.hide { opacity:0; visibility:hidden; }
        .loading-box { display:flex; align-items:center; gap:8px; padding:8px 12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:12px; }
        .loading-text { flex:1; font-size:12px; line-height:1.3; font-style:italic; color:rgba(26,30,35,.7); transition:opacity .3s,transform .3s;}
        .loading-text.changing { opacity:0; transform:translateY(-5px); }
        .loading-text.entering { opacity:0; transform:translateY(5px); }
        .rotating-point-spinner { width:16px; height:16px; animation:spin .9s linear infinite; }
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
      `;
      container.appendChild(style);

      const loadingBox = document.createElement('div');
      loadingBox.className = 'loading-box';

      const spinner = document.createElement('div');
      spinner.className = 'rotating-point-spinner';
      spinner.style.setProperty('--spinner-point-colour', '#006FB9');
      loadingBox.appendChild(spinner);

      const textEl = document.createElement('span');
      textEl.className = 'loading-text';
      loadingBox.appendChild(textEl);

      container.appendChild(loadingBox);
      element.appendChild(container);

      const interval = totalDuration / messages.length;
      let idx = 0;

      const showNext = () => {
        textEl.classList.add('changing');
        setTimeout(() => {
          textEl.textContent = messages[idx++];
          textEl.classList.remove('changing');
          textEl.classList.add('entering');
          requestAnimationFrame(() => textEl.classList.remove('entering'));
        }, 300);
      };

      showNext();
      const ticker = setInterval(() => {
        if (idx < messages.length) showNext();
        else clearInterval(ticker);
      }, interval);

      // po uplynutí schovej spinner
      const hideId = setTimeout(() => spinner.classList.add('hide'), totalDuration);

      // stop při vykreslení AI odpovědi
      const respObs = new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(n => {
          if (n.nodeType === 1 && n.classList.contains('vfrc-message--ai')) {
            clearInterval(ticker);
            clearTimeout(hideId);
            spinner.classList.add('hide');
            respObs.disconnect();
          }
        }));
      });
      respObs.observe(document.body, { childList:true, subtree:true });

    } catch (err) {
      console.error('LoadingAnimationExtension error:', err);
    }
  }
};
