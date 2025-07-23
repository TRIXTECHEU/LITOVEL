/* TrixTech s.r.o. @2025 */

window.VFSelectFixExtension = {
  name: 'SelectFix',
  type: 'response',
  match: ({ trace }) =>
    trace?.type === 'ext_select_input' || trace?.payload?.name === 'ext_select_input',

  render: ({ trace, element }) => {
    try {
      const bodyRaw = trace.payload?.body;
      let parsed = {};

      if (bodyRaw) {
        try {
          parsed = typeof bodyRaw === 'string'
            ? JSON.parse(bodyRaw)
            : bodyRaw;
        } catch {}
      } else {
        parsed = trace.payload;
      }

      const OPTIONS = Array.isArray(parsed.data) ? parsed.data : [];
      if (!OPTIONS.length) return;

      const lang = (parsed.lang || 'cs').toLowerCase().startsWith('en') ? 'en' : 'cs';
      const T = {
        placeholder: lang === 'cs' ? 'Přidat položky' : 'Add tools',
        confirm:     lang === 'cs' ? 'Potvrdit'       : 'Confirm',
        cancel:      lang === 'cs' ? 'Zrušit'         : 'Cancel'
      };

      element.innerHTML = `
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .sf-wrap {
          font-family:'Poppins',sans-serif;
          width:260px;
          background:#fff;
          border-radius:12px;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
          padding:12px;
          box-sizing:border-box;
          position:relative;
        }

        .sf-wrap.disabled {
          opacity:.6;
          pointer-events:none;
        }

        .sf-control {
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          gap:4px;
          padding:6px 12px;
          border:1px solid #c4c4c4;
          border-radius:8px;
          background:#f1f2f2;
          cursor:pointer;
          position:relative;
        }

        .sf-control.open {
          border-color:#0172be;
          background:#e8f3ff;
        }

        .sf-tags {
          display:flex;
          flex-wrap:wrap;
          gap:4px;
          overflow:hidden;
          flex:1;
        }

        .ph {
          color:#9ca3af;
          font-size:13px;
          flex:1000;
          text-align:left;
        }

        .sf-tag {
          display:flex;
          align-items:center;
          background:#e0f0ff;
          border:1px solid #0172be;
          border-radius:6px;
          padding:2px 6px;
          font-size:13px;
          color:#0369a1;
          animation: slideInTag 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .sf-tag.remove {
          animation: slideOutTag 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .sf-tag .rm {
          margin-left:4px;
          cursor:pointer;
          font-weight:bold;
        }

        .arrow {
          width:16px; height:16px;
          background:url(https://i.imgur.com/DSTtLTn.png) center/contain no-repeat;
          position:absolute;
          right:12px;
          top:50%;
          transform:translateY(-50%) rotate(0deg);
          transition:transform .3s;
        }

        .sf-control.open .arrow {
          transform:translateY(-50%) rotate(180deg);
        }

        .sf-list {
          margin-top:6px;
          background:#fff;
          border:1px solid #c4c4c4;
          border-radius:8px;
          max-height:180px;
          overflow-y:auto;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
          display:none;
          animation:fadeIn .3s ease;
        }

        .sf-list.open { display:block; }

        .itm {
          padding:8px 12px;
          font-size:13px;
          color:#374151;
          cursor:pointer;
          transition:background .2s;
          animation: slideInItem 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .itm.remove {
          animation: slideOutItem 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .itm:hover {
          background:#017ACB; 
          color:#fff;
        }

        .sf-act {
          display:flex;
          gap:8px;
          margin-top:12px;
        }

        .sf-act button {
          flex:1;
          padding:8px 0;
          font-size:13px;
          font-weight:600;
          border:none;
          border-radius:6px;
          color:#fff;
          cursor:pointer;
          transition:background .2s;
        }

        .btn-yes { background:#0172be; }
        .btn-yes:disabled { background:#93c5fd; cursor:not-allowed; }
        .btn-yes:hover:not(:disabled) { background:#025f9a; }
        .btn-no  { background:#e94f77; }
        .btn-no:hover { background:#d84368; }

        /* Animace */
        @keyframes fadeIn {
          from {opacity:0;transform:scale(0.95);}
          to {opacity:1;transform:scale(1);}
        }

        @keyframes slideInTag {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideOutTag {
          from { opacity:1; transform:translateX(0); }
          to   { opacity:0; transform:translateX(10px); }
        }

        @keyframes slideInItem {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideOutItem {
          from { opacity:1; transform:translateX(0); }
          to   { opacity:0; transform:translateX(10px); }
        }
        </style>

      <div class="sf-wrap">
        <div class="sf-control">
          <div class="sf-tags"></div>
          <span class="ph">${T.placeholder}</span>
          <div class="arrow"></div>
        </div>
        <div class="sf-list"></div>
        <div class="sf-act">
          <button class="btn-yes" disabled>${T.confirm}</button>
          <button class="btn-no">${T.cancel}</button>
        </div>
      </div>
    `;

    const wrap   = element.querySelector('.sf-wrap');
    const ctrl   = element.querySelector('.sf-control');
    const tagsEl = element.querySelector('.sf-tags');
    const phEl   = element.querySelector('.ph');
    const listEl = element.querySelector('.sf-list');
    const yesBtn = element.querySelector('.btn-yes');
    const noBtn  = element.querySelector('.btn-no');

    let selected = [];
    const ALL_ITEM = OPTIONS[OPTIONS.length - 1];

    function renderTags() {
      tagsEl.innerHTML = '';
      selected.forEach(v => {
        const tag = document.createElement('div');
        tag.className = 'sf-tag';
        tag.textContent = v;
        const rm = document.createElement('span');
        rm.className = 'rm';
        rm.textContent = '×';
        rm.onclick = e => {
          e.stopPropagation();
          selected = selected.filter(i => i !== v);
          rebuild();
        };
        tag.appendChild(rm);
        tagsEl.appendChild(tag);
      });
      phEl.style.display = selected.length ? 'none' : 'inline';
      yesBtn.disabled = !selected.length;
    }

    function renderList() {
      listEl.innerHTML = '';
      if (selected.includes(ALL_ITEM)) return;
      OPTIONS.filter(o => !selected.includes(o)).forEach(v => {
        const it = document.createElement('div');
        it.className = 'itm';
        it.textContent = v;
        it.onclick = () => {
          if (v === ALL_ITEM) {
            selected = [ALL_ITEM];
            ctrl.classList.remove('open');
            listEl.classList.remove('open');
          } else {
            selected = selected.filter(i => i !== ALL_ITEM);
            selected.push(v);
          }
          rebuild();
        };
        listEl.appendChild(it);
      });
    }

    function rebuild() {
      renderTags();
      renderList();
    }

    rebuild();

    ctrl.onclick = () => {
      if (!selected.includes(ALL_ITEM)) {
        ctrl.classList.toggle('open');
        listEl.classList.toggle('open');
      }
    };

    yesBtn.onclick = () => {
      wrap.classList.add('disabled');
      ctrl.classList.remove('open');
      listEl.classList.remove('open');
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { value: selected }
      });
    };

    noBtn.onclick = () => {
      wrap.classList.add('disabled');
      ctrl.classList.remove('open');
      listEl.classList.remove('open');
      window.voiceflow.chat.interact({ type: 'cancel' });
    };

  } catch (err) {
    window.voiceflow.chat.interact({
      type: 'error',
      payload: { message: err.message }
    });
  }
}
};
