// ── State ──────────────────────────────────────────────────────
const state = {
  view: 'groups',
  groupRankings: {},         // { 'A': [id,id,id,id], ... }
  thirdPlaceSelected: [],    // up to 8 teamIds
  bracket: {},               // { matchId: winnerId }
};

// ── Helpers ────────────────────────────────────────────────────
function getTeam(id) {
  if (!id) return null;
  for (const g of GROUPS) {
    const t = g.teams.find(t => t.id === id);
    if (t) return t;
  }
  return null;
}

function getGroupRanking(groupId) {
  return state.groupRankings[groupId] || [];
}

function isGroupComplete(groupId) {
  return (state.groupRankings[groupId] || []).length === 4;
}

function allGroupsComplete() {
  return GROUPS.every(g => isGroupComplete(g.id));
}

// Returns teamId for a given position ('1','2') in a group
function teamAtPos(groupId, pos) {
  const rank = getGroupRanking(groupId);
  const idx = parseInt(pos) - 1;
  return rank[idx] || null;
}

// ── 3rd-place slot assignment ──────────────────────────────────
// grpSet is a string like 'ABCDF' meaning groups A,B,C,D,F
// Given the 8 user-selected 3rd-place teams, assign each to its grpSet slot
// using constraint-based matching (most constrained teams first)
function assign3rdPlaceTeams() {
  // Map each selected 3rd-place team to its group
  const selectedWithGroup = state.thirdPlaceSelected.map(id => {
    for (const g of GROUPS) {
      if (g.teams.some(t => t.id === id)) return { id, groupId: g.id };
    }
    return { id, groupId: null };
  });

  // All 8 slot grpSets (in R32 order)
  const slots = R32
    .filter(m => m.grpSet)
    .map(m => ({ grpSet: m.grpSet, assigned: null }));

  // Count how many slots each team is eligible for
  const eligibility = selectedWithGroup.map(tw => ({
    ...tw,
    eligible: slots.filter(s => s.grpSet.includes(tw.groupId)).map(s => s.grpSet),
  }));

  // Sort by most constrained first
  eligibility.sort((a, b) => a.eligible.length - b.eligible.length);

  const assigned = {}; // grpSet → teamId

  for (const tw of eligibility) {
    // Find first unassigned eligible slot
    const slot = slots.find(s => s.grpSet.includes(tw.groupId) && !assigned[s.grpSet]);
    if (slot) assigned[slot.grpSet] = tw.id;
  }

  return assigned; // { grpSet: teamId }
}

// ── Build bracket ──────────────────────────────────────────────
function buildR32() {
  const assignment = assign3rdPlaceTeams();

  return R32.map((m, i) => {
    let top = null, bot = null;

    if (m.pos1 === '1' || m.pos1 === '2') top = teamAtPos(m.g1, m.pos1);
    if (m.pos2 === '1' || m.pos2 === '2') bot = teamAtPos(m.g2, m.pos2);
    if (m.pos2 === '3') bot = assignment[m.grpSet] || null;

    return {
      id: `r32_${i}`,
      top, bot,
      topSlot: slotLabel(m.pos1, m.g1),
      botSlot: m.pos2 === '3' ? slotLabel('3', null, m.grpSet) : slotLabel(m.pos2, m.g2),
    };
  });
}

// Human-readable slot descriptor, e.g. "1A" (winner gr.A), "2B" (runner-up gr.B),
// "3CEFHI" (a 3rd-place team from one of groups C/E/F/H/I)
function slotLabel(pos, group, grpSet) {
  if (pos === '3') return `მე-3 (${grpSet})`;
  if (pos === '1') return `1. ${group}`;
  if (pos === '2') return `2. ${group}`;
  return '';
}

function buildRound(prevMatches, prefix) {
  const result = [];
  for (let i = 0; i < prevMatches.length; i += 2) {
    const m1 = prevMatches[i];
    const m2 = prevMatches[i + 1];
    if (!m1 || !m2) break;
    result.push({
      id: `${prefix}_${Math.floor(i / 2)}`,
      top: state.bracket[m1.id] || null,
      bot: state.bracket[m2.id] || null,
      topSlot: 'გამარჯვ.',
      botSlot: 'გამარჯვ.',
    });
  }
  return result;
}

function getWinnerOf(match) {
  return match ? state.bracket[match.id] || null : null;
}

function getLoserOf(match) {
  if (!match) return null;
  const w = state.bracket[match.id];
  if (!w) return null;
  return w === match.top ? match.bot : match.top;
}

// ── Render ─────────────────────────────────────────────────────
const app = document.getElementById('app');

function render() {
  renderApp();
}

function renderApp() {
  const tabs = [
    { id: 'groups',     label: '⚽ ჯგუფები' },
    { id: 'thirdplace', label: '🥉 მე-3 ადგილი' },
    { id: 'bracket',    label: '🏆 პლეი-ოფი' },
  ];

  const tabsHtml = tabs.map(t => `
    <button class="nav-tab ${t.id === state.view ? 'active' : ''}"
      onclick="setView('${t.id}')">
      ${t.label}
    </button>
  `).join('');

  app.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <div class="header-brand">🏆 <span>2026 ბრეკეტი</span></div>
        <nav class="nav-tabs">${tabsHtml}</nav>
        <button class="btn-reset" onclick="resetAll()">↺ თავიდან</button>
      </div>
    </header>
    <main class="main-content fade-in" id="view-content"></main>
  `;

  const content = document.getElementById('view-content');
  if (state.view === 'groups') renderGroups(content);
  else if (state.view === 'thirdplace') renderThirdPlace(content);
  else if (state.view === 'bracket') renderBracket(content);
}

function setView(v) {
  state.view = v;
  renderApp();
}

function resetAll() {
  if (!confirm('ნამდვილად გინდა თავიდან დაწყება?')) return;
  Object.assign(state, { view: 'groups', groupRankings: {}, thirdPlaceSelected: [], bracket: {} });
  render();
}

// ── Groups ─────────────────────────────────────────────────────
function renderGroups(container) {
  const groupsDone = GROUPS.filter(g => isGroupComplete(g.id)).length;
  const pct = Math.round(groupsDone / GROUPS.length * 100);

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">⚽ ჯგუფური ეტაპი</h2>
      <p class="section-subtitle">თითოეულ ჯგუფში დაალაგე გუნდები 1-4-ადგილის მიხედვით</p>
    </div>
    <div class="progress-wrap">
      <div class="progress-label">${groupsDone} / ${GROUPS.length} ჯგუფი შევსებული</div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="info-box">
      <span>ℹ️</span>
      <div><strong>როგორ გავაკეთო?</strong> დააწკაპუნე გუნდებზე: ჯერ 1-ლი ადგილი, შემდეგ მე-2, მე-3. მე-4 ავტომატურად ივსება.</div>
    </div>
    <div class="groups-grid" id="groups-grid"></div>
    <div class="continue-bar">
      <button class="btn-continue" ${allGroupsComplete() ? '' : 'disabled'} onclick="setView('thirdplace')">
        მე-3 ადგილზე გადასვლა →
      </button>
    </div>
  `;

  document.getElementById('groups-grid').innerHTML = GROUPS.map(g => renderGroupCard(g)).join('');
}

function renderGroupCard(g) {
  const ranked = getGroupRanking(g.id);
  const complete = ranked.length === 4;

  const teamsHtml = g.teams.map(t => {
    const pos = ranked.indexOf(t.id);
    const isRanked = pos !== -1;
    return `
      <div class="team-row ${isRanked ? 'ranked' : ''}"
           onclick="toggleGroupRank('${g.id}','${t.id}')">
        <div class="team-rank ${isRanked ? 'rank-' + (pos + 1) : ''}">
          ${isRanked ? pos + 1 : ''}
        </div>
        <span class="team-flag">${t.flag}</span>
        <span class="team-name ${isRanked && pos === 0 ? 'bold' : ''}">${t.name}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="group-card ${complete ? 'complete' : ''}">
      <div class="group-header">
        <span class="group-name">${g.name}</span>
        <span class="group-hint">${complete ? '✓ შევსებული' : 'დასალაგებელი'}</span>
      </div>
      <div class="group-teams">${teamsHtml}</div>
    </div>
  `;
}

function toggleGroupRank(groupId, teamId) {
  const ranked = [...getGroupRanking(groupId)];
  const idx = ranked.indexOf(teamId);

  if (idx !== -1) {
    state.groupRankings[groupId] = ranked.slice(0, idx);
  } else if (ranked.length < 3) {
    ranked.push(teamId);
    state.groupRankings[groupId] = ranked;
    if (ranked.length === 3) {
      const group = GROUPS.find(g => g.id === groupId);
      const fourth = group.teams.find(t => !ranked.includes(t.id));
      if (fourth) state.groupRankings[groupId].push(fourth.id);
    }
  }
  // Reset downstream when group changes
  state.thirdPlaceSelected = [];
  state.bracket = {};
  renderApp();
}

// ── Third Place ────────────────────────────────────────────────
function renderThirdPlace(container) {
  const thirds = GROUPS.map(g => {
    const ranked = getGroupRanking(g.id);
    return ranked[2] ? { groupId: g.id, teamId: ranked[2] } : null;
  }).filter(Boolean);

  const selected = state.thirdPlaceSelected;
  const count = selected.length;

  const cardsHtml = thirds.map(({ groupId, teamId }) => {
    const team = getTeam(teamId);
    if (!team) return '';
    const isSelected = selected.includes(teamId);
    const isDisabled = !isSelected && count >= 8;
    const ranking = getGroupRanking(groupId);
    const rank1 = getTeam(ranking[0]);
    const rank2 = getTeam(ranking[1]);

    return `
      <div class="third-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
           onclick="toggleThirdPlace('${teamId}')">
        <span class="team-flag" style="font-size:28px">${team.flag}</span>
        <div class="third-card-info">
          <div class="third-card-group">ჯგ. ${groupId}</div>
          <div class="third-card-name">${team.name}</div>
          <div class="third-card-rank">${rank1 ? rank1.flag + ' ' + rank1.name : ''} · ${rank2 ? rank2.flag + ' ' + rank2.name : ''}</div>
        </div>
        <div class="check-icon">✓</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">🥉 მე-3 ადგილის გუნდები</h2>
      <p class="section-subtitle">12 ჯგუფიდან 8 გუნდი გადავა 1/32-ის ფინალში</p>
    </div>
    <div class="third-counter">
      <div class="counter-badge">
        <span class="counter-num">${count}</span>
        <span style="color:var(--text-muted)">/ 8 გუნდი შერჩეული</span>
      </div>
    </div>
    <div class="info-box">
      <span>ℹ️</span>
      <div>აირჩიე <strong>8 გუნდი</strong> — თითოეული ჯგუფური ეტაპის შემდეგ ადგილის მიხედვით FIFA-ს ბრეკეტის სლოტებში განაწილდება.</div>
    </div>
    <div class="third-grid">${cardsHtml}</div>
    <div class="continue-bar">
      <button class="btn-continue" ${count === 8 ? '' : 'disabled'} onclick="setView('bracket')">
        ბრეკეტზე გადასვლა →
      </button>
    </div>
  `;
}

function toggleThirdPlace(teamId) {
  const idx = state.thirdPlaceSelected.indexOf(teamId);
  if (idx !== -1) {
    state.thirdPlaceSelected.splice(idx, 1);
  } else if (state.thirdPlaceSelected.length < 8) {
    state.thirdPlaceSelected.push(teamId);
  }
  state.bracket = {};
  renderApp();
}

// ── Bracket ────────────────────────────────────────────────────
function renderBracket(container) {
  const r32 = buildR32();
  const r16 = buildRound(r32, 'r16');
  const qf  = buildRound(r16, 'qf');
  const sf  = buildRound(qf,  'sf');
  const fin = buildRound(sf,  'fin');

  const finalMatch = fin[0];
  const champion = finalMatch ? state.bracket[finalMatch.id] : null;

  const sf1 = sf[0], sf2 = sf[1];
  const tp1 = sf1 ? getLoserOf(sf1) : null;
  const tp2 = sf2 ? getLoserOf(sf2) : null;
  const tpMatchId = 'tp_final';
  const tpWinner = state.bracket[tpMatchId];

  let champHtml = '';
  if (champion) {
    const t = getTeam(champion);
    const runnerUpId = finalMatch.top === champion ? finalMatch.bot : finalMatch.top;
    const runnerUp = getTeam(runnerUpId);
    const third = tpWinner ? getTeam(tpWinner) : null;
    const fourthId = tp1 && tp2 ? (tp1 === tpWinner ? tp2 : tp1) : null;
    const fourth = fourthId ? getTeam(fourthId) : null;

    champHtml = `
      <div class="champion-card">
        <div class="champion-trophy">🏆</div>
        <div class="champion-label">2026 მსოფლიო ჩემპიონი</div>
        <div class="champion-flag">${t ? t.flag : ''}</div>
        <div class="champion-name">${t ? t.name : ''}</div>
      </div>
      <div class="podium">
        ${runnerUp ? `<div class="podium-item"><div class="podium-pos">🥈 მე-2 ადგილი</div><div class="podium-flag">${runnerUp.flag}</div><div class="podium-name">${runnerUp.name}</div></div>` : ''}
        ${third ? `<div class="podium-item"><div class="podium-pos">🥉 მე-3 ადგილი</div><div class="podium-flag">${third.flag}</div><div class="podium-name">${third.name}</div></div>` : ''}
        ${fourth ? `<div class="podium-item"><div class="podium-pos">4️⃣ მე-4 ადგილი</div><div class="podium-flag">${fourth.flag}</div><div class="podium-name">${fourth.name}</div></div>` : ''}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">🏆 პლეი-ოფ ბრეკეტი</h2>
      <p class="section-subtitle">FIFA 2026-ის ოფიციალური 1/32-ის ბადე — ივსება ჯგუფების შევსებისას რეალურ დროში</p>
    </div>
    <div class="info-box">
      <span>ℹ️</span>
      <div>
        <strong>როგორ იკითხება სლოტები:</strong>
        „1. A" = A ჯგუფის გამარჯვებული · „2. B" = B ჯგუფის მე-2 ადგილი ·
        „მე-3 (CEFHI)" = მე-3 ადგილის გუნდი ჩამოთვლილი ჯგუფებიდან.
        გუნდები ავტომატურად ჩაისმება, როცა ჯგუფურ ეტაპს და მე-3 ადგილს შეავსებ.
      </div>
    </div>
    ${champHtml ? `<div class="fade-in" style="margin-bottom:32px">${champHtml}</div>` : ''}

    <div class="bracket-outer">
      <div class="bracket-wrapper">
        ${renderRoundColumn('1/32 ფინალი', r32, 8)}
        ${renderRoundColumn('1/16 ფინალი', r16, 4)}
        ${renderRoundColumn('მეოთხ.-ფ.', qf, 2)}
        ${renderRoundColumn('ნახ.-ფინ.', sf, 1)}
        ${renderRoundColumn('ფინალი', fin, 1)}
      </div>
    </div>

    ${tp1 && tp2 ? `
      <div style="margin-top:28px">
        <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:10px">🥉 მე-3 ადგილისთვის</div>
        <div style="max-width:260px;margin:0 auto">
          ${renderMatchHtml({ id: tpMatchId, top: tp1, bot: tp2 })}
        </div>
      </div>
    ` : ''}
  `;
}

function renderRoundColumn(label, matches, slotsPerHalf) {
  const matchesHtml = matches.map(m => `
    <div class="bracket-slot">
      ${renderMatchHtml(m)}
    </div>
  `).join('');

  return `
    <div class="bracket-round">
      <div class="round-label">${label}</div>
      <div class="bracket-matches">${matchesHtml}</div>
    </div>
  `;
}

function renderMatchHtml(m) {
  const winner = state.bracket[m.id];
  const top = m.top ? getTeam(m.top) : null;
  const bot = m.bot ? getTeam(m.bot) : null;

  const topClass = !top ? 'tbd' : winner === m.top ? 'winner' : winner ? 'loser' : '';
  const botClass = !bot ? 'tbd' : winner === m.bot ? 'winner' : winner ? 'loser' : '';

  const topClick = top && (!winner || winner !== m.top) ? `onclick="pickWinner('${m.id}','${m.top}')"` : winner === m.top ? `onclick="pickWinner('${m.id}','')"` : '';
  const botClick = bot && (!winner || winner !== m.bot) ? `onclick="pickWinner('${m.id}','${m.bot}')"` : winner === m.bot ? `onclick="pickWinner('${m.id}','')"` : '';

  const topText = top ? top.name : (m.topSlot || 'TBD');
  const botText = bot ? bot.name : (m.botSlot || 'TBD');

  return `
    <div class="bracket-match">
      <div class="bracket-team ${topClass}" ${topClick}>
        <span class="bracket-flag">${top ? top.flag : '⚽'}</span>
        <span class="bracket-name">${topText}</span>
      </div>
      <div class="bracket-team ${botClass}" ${botClick}>
        <span class="bracket-flag">${bot ? bot.flag : '⚽'}</span>
        <span class="bracket-name">${botText}</span>
      </div>
    </div>
  `;
}

function pickWinner(matchId, teamId) {
  if (!teamId) {
    delete state.bracket[matchId];
  } else if (state.bracket[matchId] === teamId) {
    delete state.bracket[matchId];
  } else {
    state.bracket[matchId] = teamId;
  }
  renderApp();
}

// ── Init ───────────────────────────────────────────────────────
render();
