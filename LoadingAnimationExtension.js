window.LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const phase = payload.phase || 'output';

    const incomingLang = (payload.lang || 'cs').toLowerCase().trim();

    if (incomingLang.includes('cs') || incomingLang.includes('czech')) lang = 'cs';
    else if (incomingLang.includes('en') || incomingLang.includes('english')) lang = 'en';
    else if (incomingLang.includes('de') || incomingLang.includes('german')) lang = 'de';
    else if (incomingLang.includes('uk') || incomingLang.includes('ukrainian')) lang = 'uk';
    else lang = 'cs';


    const type = (payload.type || 'SMT').toUpperCase();

    const messageSequences = {
      cs: {
        analysis: {
          DEFAULT: ['Vydržte moment'],
          SMT: ['Analyzuji dotaz', 'Vydržte moment'],
          SWEARS: ['Analyzuji dotaz', 'Vydržte moment'],
          OTHER: ['Analyzuji dotaz', 'Vydržte moment'],
          KB: ['Analyzuji dotaz', 'Zpracovávám váš dotaz', 'Vydržte moment'],
          KB_WS: ['Analyzuji dotaz', 'Zpracovávám váš dotaz', 'Vydržte moment']
        },
        rewrite: ['Zpracovávám Váš dotaz'],
        output: {
          SMT: ['Dokončuji odpověď'],
          KB_WS: [
            'Hledám v databázi',
            'Prohledávám webové zdroje',
            'Připravuji odpověď',
            'Píši odpověď'
          ],
          OTHER: ['Nacházím nevhodný výraz'],
          SWEARS: ['Nacházím nevhodný výraz'],
          KB: [
            'Hledám v databázi',
            'Připravuji odpověď',
            'Píši odpověď'
          ]
        },
        all: {
          KB: [
            'Prohledávám svou databázi',
            'Ověřuji informace',
            'Připravuji svoji odpověď'
          ],
          KB_WS: [
            'Prohledávám svou databázi',
            'Prohledávám webové zdroje',
            'Ověřuji informace',
            'Připravuji svoji odpověď'
          ]
        }
      },
      en: {
        analysis: {
          DEFAULT: ['Hold on a moment'],
          SMT: ['Analyzing query.', 'Hold on a moment'],
          SWEARS: ['Analyzing query.', 'Hold on a moment'],
          OTHER: ['Analyzing query.', 'Hold on a moment'],
          KB: ['Analyzing query.', 'Processing your query.', 'Hold on a moment'],
          KB_WS: ['Analyzing query.', 'Processing your query.', 'Hold on a moment']
        },
        rewrite: ['Processing your query.'],
        output: {
          SMT: ['I am completing my response.'],
          KB_WS: [
            'I am searching the database.',
            'I am searching web sources.',
            'I am preparing my response.',
            'I am writing my response.'
          ],
          OTHER: ['I am detecting inappropriate content.'],
          SWEARS: ['I am detecting inappropriate content.'],
          KB: [
            'I am searching the database.',
            'I am preparing my response.',
            'I am writing my response.'
          ]
        },
        all: {
          KB: [
            'I am searching my database.',
            'I am verifying information.',
            'I am preparing my response.'
          ],
          KB_WS: [
            'I am searching my database.',
            'I am searching web sources.',
            'I am verifying information.',
            'I am preparing my response.'
          ]
        }
      },
      de: {
        analysis: {
          DEFAULT: ['Einen Moment bitte'],
          SMT: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          SWEARS: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          OTHER: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          KB: ['Anfrage wird analysiert.', 'Ihre Anfrage wird bearbeitet.', 'Einen Moment bitte'],
          KB_WS: ['Anfrage wird analysiert.', 'Ihre Anfrage wird bearbeitet.', 'Einen Moment bitte']
        },
        rewrite: ['Ihre Anfrage wird bearbeitet.'],
        output: {
          SMT: ['Ich bin dabei, meine Antwort fertigzustellen.'],
          KB_WS: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, Web-Quellen zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich bin dabei, meine Antwort zu schreiben.'
          ],
          OTHER: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          SWEARS: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          KB: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich bin dabei, meine Antwort zu schreiben.'
          ]
        },
        all: {
          KB: [
            'Ich durchsuche meine Datenbank.',
            'Ich überprüfe die Informationen.',
            'Ich bereite meine Antwort vor.'
          ],
          KB_WS: [
            'Ich durchsuche meine Datenbank.',
            'Ich durchsuche Web-Quellen.',
            'Ich überprüfe die Informationen.',
            'Ich bereite meine Antwort vor.'
          ]
        }
      },
      uk: {
        analysis: {
          DEFAULT: ['Зачекайте хвилинку'],
          SMT: ['Аналізую запит.', 'Зачекайте хвилинку'],
          SWEARS: ['Аналізую запит.', 'Зачекайте хвилинку'],
          OTHER: ['Аналізую запит.', 'Зачекайте хвилинку'],
          KB: ['Аналізую запит.', 'Обробляю ваш запит.', 'Зачекайте хвилинку'],
          KB_WS: ['Аналізую запит.', 'Обробляю ваш запит.', 'Зачекайте хвилинку']
        },
        rewrite: ['Обробляю ваш запит.'],
        output: {
          SMT: ['Зараз завершую відповідь.'],
          KB_WS: [
            'Зараз шукаю в базі даних.',
            'Зараз шукаю веб-джерела.',
            'Зараз готую відповідь.',
            'Зараз пишу відповідь.'
          ],
          OTHER: ['Зараз виявляю недоречний зміст.'],
          SWEARS: ['Зараз виявляю недоречний зміст.'],
          KB: [
            'Зараз шукаю в базі даних.',
            'Зараз готую відповідь.',
            'Зараз пишу відповідь.'
          ]
        },
        all: {
          KB: [
            'Шукаю у своїй базі даних.',
            'Перевіряю інформацію.',
            'Готую свою відповідь.'
          ],
          KB_WS: [
            'Шукаю у своїй базі даних.',
            'Шукаю веб-джерела.',
            'Перевіряю інформацію.',
            'Готую свою відповідь.'
          ]
        }
      }
    };

    try {
      const customDurationSeconds = payload.duration;

      let messages;
      if (phase === 'all' && (type === 'KB' || type === 'KB_WS')) {
        messages = messageSequences[lang]?.all?.[type];
      } else if (phase === 'output') {
        messages = messageSequences[lang]?.output?.[type];
      } else if (phase === 'analysis') {
        messages = messageSequences[lang]?.[phase]?.[type] || messageSequences[lang]?.[phase]?.DEFAULT;
      } else {
        messages = messageSequences[lang]?.[phase];
      }

      if (!messages || messages.length === 0) {
        return;
      }

      let totalDuration;
      if (customDurationSeconds !== undefined && typeof customDurationSeconds === 'number' && customDurationSeconds > 0) {
        totalDuration = customDurationSeconds * 1000;
      } else {
        if (phase === 'analysis') {
          if (type === 'SMT' || type === 'SWEARS' || type === 'OTHER') {
            totalDuration = 4000;
          } else if (type === 'KB' || type === 'KB_WS') {
            totalDuration = 12000;
          } else {
            totalDuration = 3000;
          }
        } else if (phase === 'output') {
          if (type === 'SMT' || type === 'SWEARS' || type === 'OTHER') {
            totalDuration = 4000;
          } else if (type === 'KB') {
            totalDuration = 12000;
          } else if (type === 'KB_WS') {
            totalDuration = 23000;
          } else {
            totalDuration = 3000;
          }
        } else {
          totalDuration = 3000;
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

      const mainColour = trace.payload?.mainColour;
      if (mainColour && typeof mainColour === 'string') {
        if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(mainColour)) {
          spinnerAnimationContainer.style.setProperty('--spinner-point-colour', mainColour);
        }
      }

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
              return;
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
    }
  }
};
