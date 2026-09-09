/**
 * ONE E-Waste Emporia — AI Agape Assistant Widget
 * Embedded chatbot supporting Customer Service, Technical Diagnostics, 
 * Apprentice Training, Data Privacy, and Ministry Volunteering.
 */

(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    .one-chat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c084fc 0%, #6366f1 100%);
      box-shadow: 0 10px 30px rgba(147, 51, 234, 0.45), 0 0 20px rgba(192, 132, 252, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .one-chat-bubble:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 14px 40px rgba(147, 51, 234, 0.65);
    }
    .one-chat-bubble svg { width: 28px; height: 28px; fill: #ffffff; }

    .one-chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 400px;
      max-width: calc(100vw - 32px);
      height: 620px;
      max-height: calc(100vh - 120px);
      background: rgba(14, 18, 30, 0.95);
      border: 1px solid rgba(192, 132, 252, 0.35);
      border-radius: 20px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(192, 132, 252, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      animation: oneFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes oneFadeUp {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .one-chat-window.open { display: flex; }

    .one-chat-header {
      background: linear-gradient(135deg, rgba(30, 24, 48, 0.9) 0%, rgba(20, 24, 42, 0.95) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .one-chat-header-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .one-chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c084fc, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      box-shadow: 0 0 10px rgba(192, 132, 252, 0.5);
    }
    .one-chat-h-text h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .one-chat-h-text span {
      font-size: 11px;
      color: #34d399;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .one-chat-h-text span::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
    }
    .one-chat-close-btn {
      background: transparent;
      border: none;
      color: #9ba3b8;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }
    .one-chat-close-btn:hover { color: #ffffff; }

    .one-chat-topics {
      display: flex;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .one-chat-topics::-webkit-scrollbar { display: none; }
    .one-topic-chip {
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .one-topic-chip:hover, .one-topic-chip.active {
      background: rgba(192, 132, 252, 0.2);
      border-color: #c084fc;
      color: #ffffff;
    }

    .one-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }
    .one-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .one-msg.bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border-bottom-left-radius: 4px;
    }
    .one-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #c084fc 0%, #6366f1 100%);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }
    .one-msg a { color: #38bdf8; text-decoration: underline; }
    .one-msg strong { color: #ffffff; }

    .one-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .one-quick-btn {
      background: rgba(192, 132, 252, 0.12);
      border: 1px solid rgba(192, 132, 252, 0.3);
      color: #e9d5ff;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11.5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .one-quick-btn:hover {
      background: #c084fc;
      color: #000;
    }

    .one-chat-footer {
      padding: 12px 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(10, 14, 24, 0.9);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .one-chat-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 9px 12px;
      color: #ffffff;
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s;
    }
    .one-chat-input:focus {
      border-color: #c084fc;
      box-shadow: 0 0 8px rgba(192, 132, 252, 0.3);
    }
    .one-send-btn {
      background: linear-gradient(135deg, #c084fc, #6366f1);
      border: none;
      border-radius: 10px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #ffffff;
      transition: transform 0.2s;
    }
    .one-send-btn:hover { transform: scale(1.05); }
    .one-send-btn svg { width: 16px; height: 16px; fill: currentColor; }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.className = 'one-chat-bubble';
  bubble.setAttribute('title', 'Chat with ONE Emporia AI Assistant');
  bubble.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.646-.824A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.574 0-3.04-.439-4.29-1.2l-.307-.184-2.736.486.495-2.667-.2-.32A7.95 7.95 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  `;

  const windowEl = document.createElement('div');
  windowEl.className = 'one-chat-window';
  windowEl.innerHTML = `
    <div class="one-chat-header">
      <div class="one-chat-header-title">
        <div class="one-chat-avatar">&#10022;</div>
        <div class="one-chat-h-text">
          <h3>ONE Agape Assistant</h3>
          <span>Online &bull; Community & Tech Support</span>
        </div>
      </div>
      <button class="one-chat-close-btn" id="oneChatClose" aria-label="Close chat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="one-chat-topics">
      <span class="one-topic-chip active" data-topic="general">All Help</span>
      <span class="one-topic-chip" data-topic="repair">Diagnostic & $50 Fee</span>
      <span class="one-topic-chip" data-topic="data">Data Recovery & Passkeys</span>
      <span class="one-topic-chip" data-topic="volunteer">Volunteer Guild</span>
      <span class="one-topic-chip" data-topic="training">CompTIA A+ Training</span>
      <span class="one-topic-chip" data-topic="fleet">Corporate ITAD</span>
    </div>

    <div class="one-chat-messages" id="oneMsgContainer">
      <div class="one-msg bot">
        Peace be with you! I am the <strong>ONE Emporia AI Guide</strong>, rooted in the agape teachings of Yeshua ben Yosef. 
        <br><br>
        How can I assist you with computer repairs, data recovery, vocational training, or community stewardship today?
        <div class="one-quick-actions">
          <button class="one-quick-btn" onclick="window.oneAsk('How does the $50 repair diagnostic work?')">Repair & $50 Fee</button>
          <button class="one-quick-btn" onclick="window.oneAsk('How do I receive my recovered data securely?')">Data Return & SMS</button>
          <button class="one-quick-btn" onclick="window.oneAsk('How do I volunteer to mentor returning citizens?')">Volunteer Pathways</button>
          <button class="one-quick-btn" onclick="window.oneAsk('Where can I see apprentice CompTIA skills?')">Apprentice Passport</button>
        </div>
      </div>
    </div>

    <form class="one-chat-footer" id="oneChatForm">
      <input type="text" class="one-chat-input" id="oneChatInput" placeholder="Ask about repairs, data privacy, training, orders..." autocomplete="off" required>
      <button type="submit" class="one-send-btn" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </form>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(windowEl);

  bubble.addEventListener('click', () => {
    windowEl.classList.toggle('open');
    if (windowEl.classList.contains('open')) {
      document.getElementById('oneChatInput').focus();
    }
  });

  document.getElementById('oneChatClose').addEventListener('click', () => {
    windowEl.classList.remove('open');
  });

  document.querySelectorAll('.one-topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.one-topic-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.getAttribute('data-topic');
      let promptText = "";
      if (topic === 'repair') promptText = "Tell me about computer diagnostic bench pricing, written estimates, and how the $50 deposit is credited.";
      else if (topic === 'data') promptText = "How does the Data Sanctuary handle private recovery, out-of-band SMS keys, and 14-day cloud vaults?";
      else if (topic === 'volunteer') promptText = "What are the How, When, Where, and Why volunteer opportunities in the restorative guild?";
      else if (topic === 'training') promptText = "How does the CompTIA A+ apprentice curriculum and digital skills passport work?";
      else if (topic === 'fleet') promptText = "How do corporate fleet pickups, 501(c)(3) tax receipts, and serialized wipe audits work?";
      else promptText = "What are the core ministries and services of ONE E-Waste Emporia?";

      sendMessage(promptText);
    });
  });

  const knowledgeBase = [
    {
      keywords: ['50', 'diagnostic', 'deposit', 'fee', 'estimate', 'repair', 'cost', 'pricing'],
      answer: "<strong>The Diagnostic & Repair Service:</strong><br>• We charge an initial flat fee of <strong>$50.00 USD</strong> for laboratory diagnostics.<br>• Within 5 business days, our apprentice technicians and supervisory engineers issue an itemized <strong>written estimate</strong> detailing parts and labor.<br>• <strong>100% of the $50 fee is credited back</strong> toward your final invoice if you approve the repair.<br>• If repair is declined, you choose whether to have it returned (wiped or unwiped) or donated to our vocational guild for a tax deduction. <a href='terms.html'>View Terms</a>"
    },
    {
      keywords: ['data', 'recover', 'return', 'retriev', 'photo', 'privacy', 'secret', 'usb', 'cloud', 'vault'],
      answer: "<strong>Data Sanctuary Delivery Protocols:</strong><br>• <strong>Encrypted Cloud Vault (Included Free):</strong> 14-day expiring AES-256 cloud link with the decryption PIN sent <em>out-of-band via SMS</em> directly to your phone.<br>• <strong>Hardware Encrypted Media:</strong> We can ship an AES-256 encrypted USB 3.2 Drive (+$25) or 1TB SSD (+$85). Following our <em>Zero-Key In-Box Rule</em>, passwords are never placed in the shipping box.<br>• <strong>30-Day Courtesy Safety Hold:</strong> The lab holds an offline staging copy for 30 days to protect against lost parcels or failed downloads before executing a permanent NIST SP 800-88 cryptographic purge. <a href='DATA_RECOVERY_PROTOCOL.md'>Read Protocol</a>"
    },
    {
      keywords: ['volunteer', 'how', 'when', 'where', 'why', 'onboard', 'join', 'help'],
      answer: "<strong>Volunteer Guild Onboarding (The 4 W's):</strong><br>• <strong>WHY:</strong> Grounded in universal agape, restorative justice for returning citizens, inclusion for disabled technicians, and zero-landfill care.<br>• <strong>HOW:</strong> Hardware repair, Linux flashing, life-skills mentorship, or logistics & sorting.<br>• <strong>WHEN:</strong> Tue/Thu mornings (9am-1pm), Wed evening solder lab (6pm-8:30pm), or 1st/3rd Saturday drives.<br>• <strong>WHERE:</strong> Church Tech Annex (123 Sanctuary Way, Atlanta, GA), mobile regional drop-offs, or remote virtual tutoring.<br><a href='volunteer.html'>Fill Volunteer Application &rarr;</a>"
    },
    {
      keywords: ['passport', 'comptia', 'apprentice', 'training', 'skill', 'curriculum', 'education', 'transcript'],
      answer: "<strong>Apprentice Skills Passport & Training:</strong><br>• Our 16-week vocational practicum is aligned with <strong>CompTIA A+ (220-1101 & 220-1102)</strong>.<br>• Apprentices master power rail diagnostics, ultrasonic cleaning, micro-soldering, and NIST SP 800-88 drive wiping.<br>• The digital <strong>Skills Passport</strong> tracks verified lab hours and logged repairs, generating an exportable, print-ready employer transcript with supervisor attestations.<br><a href='passport.html' target='_blank'>View Live Apprentice Passport &rarr;</a>"
    },
    {
      keywords: ['triage', 'decision', 'tree', 'troubleshoot', 'symptom', 'dead', 'black screen', 'blue screen', 'thermal'],
      answer: "<strong>Interactive Triage Assistant:</strong><br>• Our lab features a step-by-step diagnostic tree for apprentices and technicians.<br>• Troubleshoot dead power rails (19V shorts, standby PMIC), POST display failures, RAM errors, and thermal shutdowns with exact voltage and soldering specifications.<br><a href='triage-assistant.html' target='_blank'>Open Triage Decision Assistant &rarr;</a>"
    },
    {
      keywords: ['store', 'buy', 'shop', 'refurbish', 'laptop', 'price', 'desktop', 'purchase'],
      answer: "<strong>The Community Storefront:</strong><br>• Browse certified refurbished laptops ($125-$195), compact mini PCs ($95), and 512GB SSD upgrade kits ($35).<br>• All computers include a fresh install of Linux Mint or Windows 11 Pro, new thermal paste, and an official <strong>90-Day Guild Warranty</strong>.<br>• 100% of proceeds fund apprentice wages and student laptop grants.<br><a href='store.html'>Visit Community Storefront &rarr;</a>"
    },
    {
      keywords: ['enterprise', 'corporate', 'fleet', 'decommission', 'bulk', 'itad', 'school', 'lot'],
      answer: "<strong>Corporate & Church Fleet ITAD:</strong><br>• Free dock-to-dock freight pickup for lots of 15+ devices.<br>• Serialized NIST SP 800-88 sanitization certificates eliminate data liability.<br>• Official 501(c)(3) equipment fair-market valuation tax contribution receipts.<br>• Use our interactive calculator to estimate pounds of e-waste diverted and student laptops funded.<br><a href='enterprise.html'>Fleet Decommissioning Portal &rarr;</a>"
    },
    {
      keywords: ['track', 'status', 'where is my', 'order', 'parcel', 'arrival', 'webhook'],
      answer: "<strong>Work Order Tracking:</strong><br>• Check the status of your repair, data recovery, or donation using your Work Order ID (e.g. <code>WO-8X92A</code>) or phone number.<br>• View live milestones, inspect written estimates, approve/decline repairs, or download signed certificates.<br><a href='track.html'>Open Tracking Portal &rarr;</a>"
    },
    {
      keywords: ['qr', 'verify', 'certificate', 'attestation', 'sanitization', 'sticker'],
      answer: "<strong>Cryptographic Verification & Chassis QR Stickers:</strong><br>• Every sanitized drive receives a verified SHA-256 hash ledger.<br>• Repaired machines feature a 2"x2" chassis QR sticker that anyone can scan with a smartphone camera to confirm NIST 800-88 purge compliance.<br><a href='verify.html'>View Verification Ledger &rarr;</a>"
    },
    {
      keywords: ['who', 'one church', 'agape', 'yeshua', 'mission', 'about'],
      answer: "<strong>About Our New Era (ONE) Church:</strong><br>• A worldwide spiritual movement rooted in the original, unchanged <em>agape</em> (unconditional love) teachings of Yeshua ben Yosef.<br>• ONE E-Waste Emporia puts agape into action through environmental stewardship, restorative justice for returning citizens, and technical inclusion for individuals with disabilities."
    }
  ];

  function findBotResponse(input) {
    const text = input.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(k => text.includes(k))) {
        return item.answer;
      }
    }
    return "Thank you for reaching out! In our agape ministry, we provide computer repairs ($50 diagnostic deposit credited toward repair), certified NIST 800-88 data recovery with out-of-band SMS keys, vocational training for returning citizens and disabled apprentices, and upcycled computer sales. <br><br>You can also explore our <a href='store.html'>Storefront</a>, <a href='volunteer.html'>Volunteer Guild</a>, <a href='track.html'>Order Tracking</a>, or <a href='enterprise.html'>Fleet ITAD</a>. Would you like details on any of these?";
  }

  function appendMessage(sender, text) {
    const container = document.getElementById('oneMsgContainer');
    const msg = document.createElement('div');
    msg.className = `one-msg ${sender}`;
    msg.innerHTML = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  async function sendMessage(userText) {
    appendMessage('user', userText);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        appendMessage('bot', data.reply);
        return;
      }
    } catch (e) {
      // Fallback to internal knowledge engine
    }

    setTimeout(() => {
      const reply = findBotResponse(userText);
      appendMessage('bot', reply);
    }, 450);
  }

  window.oneAsk = function (questionText) {
    sendMessage(questionText);
  };

  document.getElementById('oneChatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('oneChatInput');
    const query = input.value.trim();
    if (!query) return;
    input.value = '';
    sendMessage(query);
  });

})();
