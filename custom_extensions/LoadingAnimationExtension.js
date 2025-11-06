/* TrixTech s.r.o. @2025 */

/**
 * LOADING ANIMATION EXTENSION - Dokumentace
 * 
 * Jak používat z Voiceflow:
 * 
 * 1. V Voiceflow použijte "Custom Extension" block
 * 2. Nastavte název extension: "ext_loadingAnimation"
 * 3. V payloadu nastavte následující proměnné:
 * 
 *    - topic: (volitelné) Téma dotazu - použije se specifická loading zpráva
 *    - lang: (volitelné) Jazyk - "cs" nebo "en" (výchozí: "cs")
 *    - type: (volitelné) Typ - "SMT", "KB", "KB_WS", "OTHER" (výchozí: "SMT")
 *    - duration: (volitelné) Délka animace v sekundách (číslo)
 * 
 * Příklad payloadu z Voiceflow:
 * {
 *   "name": "ext_loadingAnimation",
 *   "topic": "poplatky",
 *   "lang": "cs"
 * }
 * 
 * Dostupné témata (topic):
 * 
 * ČESKY / ANGLICKY:
 * - "poplatky" / "fees" - Poplatky
 * - "uredni-deska" / "office-board" - Úřední deska
 * - "uredni-hodiny" / "office-hours" - Úřední hodiny
 * - "kontakty" / "contacts" - Kontakty
 * - "formulare" / "forms" - Formuláře
 * - "zadosti" / "requests" - Žádosti
 * - "stavebni-povoleni" / "building-permit" - Stavební povolení
 * - "zivnostensky-rejstrik" / "business-registry" - Živnostenský rejstřík
 * - "matrika" / "registry-office" - Matrika
 * - "doprava" / "transport" - Doprava
 * - "kultura" / "culture" - Kultura
 * - "sport" - Sport
 * - "zdravotnictvi" / "healthcare" - Zdravotnictví
 * - "skolstvi" / "education" - Školství
 * - "socialni-sluzby" / "social-services" - Sociální služby
 * - "odpad" / "waste" - Odpad
 * - "voda" / "water" - Voda
 * - "energie" / "energy" - Energie
 * - "obecne" / "general" - Obecné dotazy
 * 
 * Pokud topic není zadán, použije se standardní chování podle type.
 */

window.LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const incomingLang = (payload.lang || 'cs').toLowerCase().trim();
  
    let lang;
    if (incomingLang.includes('cs') || incomingLang.includes('Czech')) lang = 'cs';
    else if (incomingLang.includes('en') || incomingLang.includes('English')) lang = 'en';
    else lang = 'cs';
  
    const type = (payload.type || 'SMT').toUpperCase();
    const topic = (payload.topic || '').toLowerCase().trim();

    // Mapování témat na specifické zprávy
    const topicMessages = {
      cs: {
        'obecne': ['Zpracovávám váš dotaz.', 'Hledám relevantní informace.', 'Připravuji odpověď.'],
        'general': ['Zpracovávám váš dotaz.', 'Hledám relevantní informace.', 'Připravuji odpověď.'],
        'poplatky': ['Vyhledávám informace o poplatcích.', 'Kontroluji aktuální sazby.', 'Připravuji přehled poplatků.'],
        'fees': ['Vyhledávám informace o poplatcích.', 'Kontroluji aktuální sazby.', 'Připravuji přehled poplatků.'],
        'uredni-deska': ['Procházím úřední desku.', 'Hledám aktuální dokumenty.', 'Získávám informace z úřední desky.'],
        'office-board': ['Procházím úřední desku.', 'Hledám aktuální dokumenty.', 'Získávám informace z úřední desky.'],
        'uredni-hodiny': ['Kontroluji úřední hodiny.', 'Ověřuji dostupnost úřadu.', 'Zjišťuji otevírací dobu.'],
        'office-hours': ['Kontroluji úřední hodiny.', 'Ověřuji dostupnost úřadu.', 'Zjišťuji otevírací dobu.'],
        'kontakty': ['Hledám kontaktní informace.', 'Zjišťuji telefonní čísla a e-maily.', 'Připravuji seznam kontaktů.'],
        'contacts': ['Hledám kontaktní informace.', 'Zjišťuji telefonní čísla a e-maily.', 'Připravuji seznam kontaktů.'],
        'formulare': ['Vyhledávám formuláře.', 'Kontroluji dostupné dokumenty.', 'Připravuji seznam formulářů.'],
        'forms': ['Vyhledávám formuláře.', 'Kontroluji dostupné dokumenty.', 'Připravuji seznam formulářů.'],
        'zadosti': ['Procházím typy žádostí.', 'Zjišťuji postup podání.', 'Připravuji informace o žádostech.'],
        'requests': ['Procházím typy žádostí.', 'Zjišťuji postup podání.', 'Připravuji informace o žádostech.'],
        'stavebni-povoleni': ['Vyhledávám informace o stavebním povolení.', 'Kontroluji požadavky a dokumenty.', 'Zjišťuji postup žádosti.'],
        'building-permit': ['Vyhledávám informace o stavebním povolení.', 'Kontroluji požadavky a dokumenty.', 'Zjišťuji postup žádosti.'],
        'zivnostensky-rejstrik': ['Procházím živnostenský rejstřík.', 'Kontroluji podmínky podnikání.', 'Zjišťuji potřebné informace.'],
        'business-registry': ['Procházím živnostenský rejstřík.', 'Kontroluji podmínky podnikání.', 'Zjišťuji potřebné informace.'],
        'matrika': ['Vyhledávám informace o matričních úkonech.', 'Kontroluji dostupné služby.', 'Zjišťuji potřebné dokumenty.'],
        'registry-office': ['Vyhledávám informace o matričních úkonech.', 'Kontroluji dostupné služby.', 'Zjišťuji potřebné dokumenty.'],
        'doprava': ['Procházím dopravní informace.', 'Kontroluji dopravní předpisy.', 'Zjišťuji parkovací možnosti.'],
        'transport': ['Procházím dopravní informace.', 'Kontroluji dopravní předpisy.', 'Zjišťuji parkovací možnosti.'],
        'kultura': ['Vyhledávám kulturní akce.', 'Kontroluji programy a události.', 'Připravuji přehled kulturních aktivit.'],
        'culture': ['Vyhledávám kulturní akce.', 'Kontroluji programy a události.', 'Připravuji přehled kulturních aktivit.'],
        'sport': ['Procházím sportovní možnosti.', 'Kontroluji sportovní zařízení.', 'Zjišťuji sportovní aktivity.'],
        'zdravotnictvi': ['Vyhledávám zdravotní služby.', 'Kontroluji dostupnost lékařů.', 'Zjišťuji zdravotní informace.'],
        'healthcare': ['Vyhledávám zdravotní služby.', 'Kontroluji dostupnost lékařů.', 'Zjišťuji zdravotní informace.'],
        'skolstvi': ['Procházím školské informace.', 'Kontroluji školy a školky.', 'Zjišťuji vzdělávací možnosti.'],
        'education': ['Procházím školské informace.', 'Kontroluji školy a školky.', 'Zjišťuji vzdělávací možnosti.'],
        'socialni-sluzby': ['Vyhledávám sociální služby.', 'Kontroluji dostupné programy.', 'Zjišťuji podporu a pomoc.'],
        'social-services': ['Vyhledávám sociální služby.', 'Kontroluji dostupné programy.', 'Zjišťuji podporu a pomoc.'],
        'odpad': ['Procházím informace o odpadu.', 'Kontroluji svozové dny.', 'Zjišťuji třídění odpadu.'],
        'waste': ['Procházím informace o odpadu.', 'Kontroluji svozové dny.', 'Zjišťuji třídění odpadu.'],
        'voda': ['Vyhledávám informace o vodě.', 'Kontroluji vodovod a kanalizaci.', 'Zjišťuji vodní služby.'],
        'water': ['Vyhledávám informace o vodě.', 'Kontroluji vodovod a kanalizaci.', 'Zjišťuji vodní služby.'],
        'energie': ['Procházím energetické služby.', 'Kontroluji dodavatele energií.', 'Zjišťuji energetické informace.'],
        'energy': ['Procházím energetické služby.', 'Kontroluji dodavatele energií.', 'Zjišťuji energetické informace.']
      },
      en: {
        'obecne': ['Processing your query.', 'Looking for relevant information.', 'Preparing response.'],
        'general': ['Processing your query.', 'Looking for relevant information.', 'Preparing response.'],
        'poplatky': ['Searching for fee information.', 'Checking current rates.', 'Preparing fee overview.'],
        'fees': ['Searching for fee information.', 'Checking current rates.', 'Preparing fee overview.'],
        'uredni-deska': ['Browsing the office board.', 'Looking for current documents.', 'Retrieving information from the office board.'],
        'office-board': ['Browsing the office board.', 'Looking for current documents.', 'Retrieving information from the office board.'],
        'uredni-hodiny': ['Checking office hours.', 'Verifying office availability.', 'Finding opening hours.'],
        'office-hours': ['Checking office hours.', 'Verifying office availability.', 'Finding opening hours.'],
        'kontakty': ['Looking for contact information.', 'Finding phone numbers and emails.', 'Preparing contact list.'],
        'contacts': ['Looking for contact information.', 'Finding phone numbers and emails.', 'Preparing contact list.'],
        'formulare': ['Searching for forms.', 'Checking available documents.', 'Preparing form list.'],
        'forms': ['Searching for forms.', 'Checking available documents.', 'Preparing form list.'],
        'zadosti': ['Browsing request types.', 'Finding submission procedures.', 'Preparing request information.'],
        'requests': ['Browsing request types.', 'Finding submission procedures.', 'Preparing request information.'],
        'stavebni-povoleni': ['Searching for building permit information.', 'Checking requirements and documents.', 'Finding application procedure.'],
        'building-permit': ['Searching for building permit information.', 'Checking requirements and documents.', 'Finding application procedure.'],
        'zivnostensky-rejstrik': ['Browsing business registry.', 'Checking business conditions.', 'Finding required information.'],
        'business-registry': ['Browsing business registry.', 'Checking business conditions.', 'Finding required information.'],
        'matrika': ['Searching for registry office information.', 'Checking available services.', 'Finding required documents.'],
        'registry-office': ['Searching for registry office information.', 'Checking available services.', 'Finding required documents.'],
        'doprava': ['Browsing transport information.', 'Checking traffic regulations.', 'Finding parking options.'],
        'transport': ['Browsing transport information.', 'Checking traffic regulations.', 'Finding parking options.'],
        'kultura': ['Searching for cultural events.', 'Checking programs and events.', 'Preparing cultural activities overview.'],
        'culture': ['Searching for cultural events.', 'Checking programs and events.', 'Preparing cultural activities overview.'],
        'sport': ['Browsing sports options.', 'Checking sports facilities.', 'Finding sports activities.'],
        'zdravotnictvi': ['Searching for healthcare services.', 'Checking doctor availability.', 'Finding health information.'],
        'healthcare': ['Searching for healthcare services.', 'Checking doctor availability.', 'Finding health information.'],
        'skolstvi': ['Browsing education information.', 'Checking schools and kindergartens.', 'Finding educational options.'],
        'education': ['Browsing education information.', 'Checking schools and kindergartens.', 'Finding educational options.'],
        'socialni-sluzby': ['Searching for social services.', 'Checking available programs.', 'Finding support and help.'],
        'social-services': ['Searching for social services.', 'Checking available programs.', 'Finding support and help.'],
        'odpad': ['Browsing waste information.', 'Checking collection days.', 'Finding waste sorting information.'],
        'waste': ['Browsing waste information.', 'Checking collection days.', 'Finding waste sorting information.'],
        'voda': ['Searching for water information.', 'Checking water and sewer services.', 'Finding water services.'],
        'water': ['Searching for water information.', 'Checking water and sewer services.', 'Finding water services.'],
        'energie': ['Browsing energy services.', 'Checking energy suppliers.', 'Finding energy information.'],
        'energy': ['Browsing energy services.', 'Checking energy suppliers.', 'Finding energy information.']
      }
    };

    // Záložní zprávy, pokud není zadáno topic
    const messageSequences = {
      cs: {
        output: {
          SMT: ['Zpracovávám váš dotaz.', 'Připravuji odpověď.'],
          KB: [
            'Hledám v databázi Litovel.',
            'Získávám informace.',
            'Připravuji odpověď.'
          ],
          KB_WS: [
            'Hledám v databázi Litovel.',
            'Analyzuji webové zdroje.',
            'Získávám relevantní informace.',
            'Formuluji odpověď.'
          ],
          OTHER: ['Zpracovávám váš dotaz.', 'Připravuji odpověď.']
        }
      },
      en: {
        output: {
          SMT: ['Processing your query.', 'Preparing response.'],
          KB: [
            'Searching the Litovel database.',
            'Gathering information.',
            'Preparing response.'
          ],
          KB_WS: [
            'Searching the Litovel database.',
            'Analyzing web sources.',
            'Gathering relevant information.',
            'Formulating response.'
          ],
          OTHER: ['Processing your query.', 'Preparing response.']
        }
      }
    };

    try {
      const customDurationSeconds = payload.duration;

      let messages;
      
      // Pokud je zadáno topic, použij specifické zprávy pro toto téma
      if (topic && topicMessages[lang]?.[topic]) {
        messages = topicMessages[lang][topic];
      } else {
        // Záložní zprávy podle typu
        messages = messageSequences[lang]?.output?.[type] || messageSequences[lang]?.output?.OTHER;
      }

      if (!messages || messages.length === 0) return;

      let totalDuration;
      if (typeof customDurationSeconds === 'number' && customDurationSeconds > 0) {
        totalDuration = customDurationSeconds * 1000;
      } else {
        // Pokud je topic, použij delší dobu, jinak podle typu
        if (topic) {
          totalDuration = 6000;
        } else {
          totalDuration = (type === 'KB_WS') ? 23000
                         : (type === 'KB')   ? 12000
                         : 4000;
        }
      }

      const messageInterval = totalDuration / messages.length;

      const container = document.createElement('div');
      container.className = 'vfrc-message vfrc-message--extension LoadingAnimation';

      const style = document.createElement('style');
      style.textContent = `
        .vfrc-message.vfrc-message--extension.LoadingAnimation {
          opacity: 1;
          transition: opacity 0.3s ease-out;
          width: 100%;
          display: block;
        }

        .vfrc-message.vfrc-message--extension.LoadingAnimation.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .loading-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin: 0;
          width: 100%;
          box-sizing: border-box;
          background-color: #F9FAFB;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
        }

        .loading-text {
          color: rgba(26, 30, 35, 0.7);
          font-size: 12px;
          line-height: 1.3;
          font-family: var(--_1bof89na);
          position: relative;
          display: flex;
          flex-direction: column;
          max-width: 100%;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
          flex: 1;
          min-width: 0;
          font-style: italic;
        }

        .loading-text.changing {
          opacity: 0;
          transform: translateY(-5px);
        }

        .loading-text.entering {
          opacity: 0;
          transform: translateY(5px);
        }

        @keyframes loading-spinner-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .rotating-point-spinner {
          position: relative;
          width: 16px;
          height: 16px;
          animation: loading-spinner-spin 0.9s linear infinite;
          flex-shrink: 0;
          transition: opacity 0.3s ease-out, width 0.3s ease-out;
          opacity: 1;
        }

        .rotating-point-spinner::before {
          content: "";
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.12);
        }

        .rotating-point-spinner::after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          width: 5px;
          height: 5px;
          background-color: var(--spinner-point-colour, #696969);
          border-radius: 50%;
          top: -1.5px; 
          left: calc(50% - 2.5px);
        }

        .spinner-point-colour {
          color: #006FB9;
        }

        .rotating-point-spinner.hide {
          opacity: 0;
          visibility: hidden;
          width: 0 !important;
          display: none;
          /* margin-right: 0 !important;
        }
      `;
      container.appendChild(style);

      const loadingBox = document.createElement('div');
      loadingBox.className = 'loading-box';

      const spinnerAnimationContainer = document.createElement('div');
      spinnerAnimationContainer.className = 'rotating-point-spinner';

      spinnerAnimationContainer.style.setProperty('--spinner-point-colour', '#006FB9');

      loadingBox.appendChild(spinnerAnimationContainer);

      const textElement = document.createElement('span');
      textElement.className = 'loading-text';
      loadingBox.appendChild(textElement);

      container.appendChild(loadingBox);

      let currentIndex = 0;
      const updateText = (newText) => {
        const currentTextElement = loadingBox.querySelector('.loading-text');
        if (!currentTextElement) return;
        currentTextElement.classList.add('changing');
        setTimeout(() => {
          currentTextElement.textContent = newText;
          currentTextElement.classList.remove('changing');
          currentTextElement.classList.add('entering');
          requestAnimationFrame(() => {
            currentTextElement.classList.remove('entering');
          });
        }, 300);
      };
      updateText(messages[currentIndex]);

      let intervalId = null;
      if (messages.length > 1) {
        intervalId = setInterval(() => {
          if (currentIndex < messages.length - 1) {
            currentIndex++;
            updateText(messages[currentIndex]);
          } else {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }, messageInterval);
      }

      const animationTimeoutId = setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        if (spinnerAnimationContainer) {
          spinnerAnimationContainer.classList.add('hide');
        }
      }, totalDuration);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === container || node.contains(container)) {
              if (intervalId) clearInterval(intervalId);
              clearTimeout(animationTimeoutId);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(element.parentElement || document.body, {
        childList: true,
        subtree: true
      });

      const responseObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList.contains('vfrc-message--ai')) {
              if (intervalId) clearInterval(intervalId);
              clearTimeout(animationTimeoutId);
              spinnerAnimationContainer.classList.add('hide');
              responseObserver.disconnect();
            }
          });
        });
      });
      responseObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      if (element) {
        element.appendChild(container);
        void container.offsetHeight;
      }
    } catch (error) {
      console.error('LoadingAnimationExtension error:', error);
    }
  }
};
