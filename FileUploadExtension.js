window.FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload?.name === 'ext_fileUpload',

  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const incomingLang = (payload.lang || 'cs').toLowerCase().trim();

    // Determine language
    let lang;
    if (incomingLang.includes('cs') || incomingLang.includes('czech')) {
      lang = 'cs';
    } else if (incomingLang.includes('en') || incomingLang.includes('english')) {
      lang = 'en';
    } else {
      lang = 'cs';
    }

    // UI text in both languages
    const texts = {
      cs: {
        dragDrop: 'Přetáhněte a pusťte sem',
        maxSize: 'Maximální velikost',
        skip: 'Přeskočit',
        uploading: '⬆ Nahrávám…',
        success: 'Soubor byl úspěšně nahrán!',
        tooLarge: 'Soubor je příliš velký (limit 30 MB)!',
        error: '❌ Chyba při nahrávání.',
      },
      en: {
        dragDrop: 'Drag & drop here',
        maxSize: 'Maximum size',
        skip: 'Skip',
        uploading: '⬆ Uploading…',
        success: 'File uploaded successfully!',
        tooLarge: 'File is too large (30 MB limit)!',
        error: '❌ Upload error.',
      }
    };

    const t = texts[lang];

    // Build the upload box
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .file-upload-box {
            border: 2px dashed #66C2FF;
            background-color: #E5F5FF;
            border-radius: 10px;
            padding: clamp(15px, 3vw, 20px);
            text-align: center;
            transition: all 0.3s ease;
            font-family: Poppins;
            max-width: 100%;
            box-sizing: border-box;
            margin: 0 auto;
        }
        .file-upload-box.dragover {
            background-color: #CCE8FF;
            border-color: #33ADFF;
        }
        .file-upload-box.success {
            background-color: #EDF7FF;
            border-color: #006FB9;
            opacity: 0.7;
        }
        .file-upload-box img.upload-icon {
            width: clamp(40px, 10vw, 50px);
            height: clamp(40px, 10vw, 50px);
            object-fit: contain;
            pointer-events: none;
            user-select: none;
        }
        .file-upload-status {
            font-weight: bold;
            margin-top: 0.5em;
            font-size: 12px;
        }
        .file-upload-box.success .file-upload-status { color: #005C99; }

        .file-upload-box.error {
            background-color: #ffe6e6;
            border-color: #cc0000;
        }
        .file-upload-box.error .file-upload-status { color: #cc0000; }

        .cancel-wrapper {
            text-align: center;
            margin-top: 0.5em;
            display: flex;
            justify-content: center;
        }
        .cancel-button {
            background-color: #e94f77;
            color: white;
            border: none;
            padding: 0.6em 10.5em;
            font-size: clamp(10px, 3vw, 11px);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: Poppins;
            width: auto;
            max-width: none;
            margin: 0;
            display: inline-block;
            letter-spacing: normal;
            white-space: nowrap;
        }
        .cancel-button:hover { background-color: #d84368; }

        .disabled-opacity {
            opacity: 0.6;
            pointer-events: none;
        }
        @media (max-width: 400px) {
          .file-upload-box { padding: 12px; }
        }
      </style>

      <div class="file-upload-box">
        <img src="https://i.imgur.com/YAP68Cf.png" class="upload-icon" />
        <div style="margin-top:5px; font-size:13px;"><strong>${t.dragDrop}</strong></div>
        <div style="margin-bottom:5px; font-size:11px;">${t.maxSize}: <strong>30 MB</strong></div>
        <input type="file" style="display:none" />
        <div class="file-upload-status"></div>
      </div>
      <div class="cancel-wrapper">
        <button class="cancel-button">${t.skip}</button>
      </div>
    `;

    element.appendChild(wrapper);

    const box = wrapper.querySelector('.file-upload-box');
    const input = wrapper.querySelector('input[type=file]');
    const status = wrapper.querySelector('.file-upload-status');
    const cancel = wrapper.querySelector('.cancel-button');

    let interactionDone = false;

    const disableAll = () => wrapper.classList.add('disabled-opacity');

    const handleFile = async (file) => {
      if (!file || interactionDone) return;
      if (file.size > 30 * 1024 * 1024) {
        status.textContent = t.tooLarge;
        box.classList.replace('success', 'error');
        return;
      }

      status.textContent = t.uploading;
      box.classList.remove('error');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'voiceflow_upload');
      formData.append('folder', 'voiceflow_uploads');

      try {
        const resp = await fetch('https://api.cloudinary.com/v1_1/del00w7dj/auto/upload', {
          method: 'POST', body: formData,
        });
        const data = await resp.json();
        if (!data.secure_url) throw new Error();

        box.classList.add('success');
        status.textContent = t.success;
        interactionDone = true;
        disableAll();

        window.voiceflow?.chat?.interact?.({
          type: 'complete',
          payload: {
            file: data.secure_url,
            name: file.name,
            type: file.type,
            size: file.size,
          }
        });
      } catch {
        box.classList.add('error');
        status.textContent = t.error;
      }
    };

    box.addEventListener('click', () => !interactionDone && input.click());
    input.addEventListener('change', () => handleFile(input.files[0]));

    box.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!interactionDone) box.classList.add('dragover');
    });
    box.addEventListener('dragleave', () => box.classList.remove('dragover'));
    box.addEventListener('drop', (e) => {
      e.preventDefault();
      box.classList.remove('dragover');
      if (!interactionDone) handleFile(e.dataTransfer.files[0]);
    });

    cancel.addEventListener('click', () => {
      if (interactionDone) return;
      interactionDone = true;
      disableAll();
      window.voiceflow?.chat?.interact?.({
        type: 'cancel',
        payload: { cancelled: true },
      });
    });
  },
};
