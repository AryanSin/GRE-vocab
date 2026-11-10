/**
 * VOCAB GALAXY - Interactive Semantic GRE Vocabulary Explorer
 * High-performance Canvas Engine & Interactive Multi-View Experience
 */

(function () {
  'use strict';

  // State Management
  const state = {
    data: null,
    words: [],
    clusters: [],
    wordById: new Map(),
    wordByName: new Map(),
    
    // View & Filters
    currentView: 'map', // 'map' | 'brackets' | 'network' | 'groups' | 'struggle'
    filterBracket: 'all',
    filterGroup: 'all',
    filterPos: 'all',
    minSimilarity: 0.72,
    searchQuery: '',
    strugglingOnly: false,
    
    // Struggle & Revision Bucket
    struggles: new Set(),
    struggleMode: 'brackets', // 'brackets' | 'flashcards'
    flashcardIndex: 0,
    flashcardRevealed: false,
    
    // Interaction
    hoveredWord: null,
    selectedWord: null,
    hoverLock: false,
    showLabels: true,
    showLinks: true,
    
    // 2D Camera for Galaxy Map
    camera: {
      x: 0,
      y: 0,
      scale: 0.75,
      targetX: 0,
      targetY: 0,
      targetScale: 0.75,
      isPanning: false,
      startX: 0,
      startY: 0
    },

    // 2D Camera for Network Graph
    netCamera: {
      x: 0,
      y: 0,
      scale: 0.65,
      targetX: 0,
      targetY: 0,
      targetScale: 0.65,
      isPanning: false,
      startX: 0,
      startY: 0
    },

    // Audio
    currentAudioWord: null,
    isPlayingAudio: false
  };

  // DOM Elements
  const DOM = {
    // Header
    viewTabs: document.querySelectorAll('.tab-btn'),
    totalWordsPill: document.getElementById('total-words-pill'),
    totalBracketsPill: document.getElementById('total-brackets-pill'),
    totalGroupsPill: document.getElementById('total-groups-pill'),
    struggleTabBtn: document.querySelector('.struggle-tab-btn'),
    struggleTabBadge: document.getElementById('struggle-tab-badge'),
    themeToggle: document.getElementById('theme-toggle'),
    sunIcon: document.querySelector('.sun-icon'),
    moonIcon: document.querySelector('.moon-icon'),
    helpToggle: document.getElementById('help-toggle'),
    aboutModal: document.getElementById('about-modal'),
    modalClose: document.getElementById('modal-close'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    searchDropdown: document.getElementById('search-dropdown'),
    
    // Filters
    bracketFilter: document.getElementById('bracket-filter'),
    groupFilter: document.getElementById('group-filter'),
    posFilter: document.getElementById('pos-filter'),
    toggleStruggleFilter: document.getElementById('toggle-struggle-filter'),
    struggleFilterCount: document.getElementById('struggle-filter-count'),
    resetFilters: document.getElementById('reset-filters'),
    activeCount: document.getElementById('active-count'),
    simThreshold: document.getElementById('sim-threshold'),
    simVal: document.getElementById('sim-val'),
    networkThreshHint: document.getElementById('network-thresh-hint'),
    networkOnlyControls: document.querySelectorAll('.network-only'),
    
    // Panels
    panels: {
      map: document.getElementById('view-map'),
      brackets: document.getElementById('view-brackets'),
      network: document.getElementById('view-network'),
      groups: document.getElementById('view-groups'),
      struggle: document.getElementById('view-struggle')
    },
    
    // Galaxy Canvas
    galaxyCanvas: document.getElementById('galaxy-canvas'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomReset: document.getElementById('zoom-reset'),
    toggleLabels: document.getElementById('toggle-labels'),
    toggleLinks: document.getElementById('toggle-links'),
    clusterLegend: document.getElementById('cluster-legend'),
    legendToggle: document.getElementById('legend-toggle'),
    legendList: document.getElementById('legend-list'),
    legendCount: document.getElementById('legend-count'),
    
    // Brackets View
    bracketsGrid: document.getElementById('brackets-grid'),
    bracketSearchInput: document.getElementById('bracket-search-input'),
    
    // Groups View
    groupsGrid: document.getElementById('groups-grid'),
    
    // Network Canvas
    networkCanvas: document.getElementById('network-canvas'),
    netZoomIn: document.getElementById('net-zoom-in'),
    netZoomOut: document.getElementById('net-zoom-out'),
    netZoomReset: document.getElementById('net-zoom-reset'),
    
    // Hover Popup
    hoverPopup: document.getElementById('hover-popup'),
    popupWord: document.getElementById('popup-word'),
    popupStruggleBtn: document.getElementById('popup-struggle-btn'),
    popupAudioBtn: document.getElementById('popup-audio-btn'),
    popupPos: document.getElementById('popup-pos'),
    popupBracket: document.getElementById('popup-bracket'),
    popupGroup: document.getElementById('popup-group'),
    popupDescription: document.getElementById('popup-description'),
    popupNeighborsList: document.getElementById('popup-neighbors-list'),
    
    // Word Drawer
    wordDrawer: document.getElementById('word-drawer'),
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    drawerClose: document.getElementById('drawer-close'),
    drawerWord: document.getElementById('drawer-word'),
    drawerStruggleBtn: document.getElementById('drawer-struggle-btn'),
    drawerStruggleLabel: document.getElementById('drawer-struggle-label'),
    drawerAudioBtn: document.getElementById('drawer-audio-btn'),
    drawerBracketTag: document.getElementById('drawer-bracket-tag'),
    drawerGroupTag: document.getElementById('drawer-group-tag'),
    drawerPosTag: document.getElementById('drawer-pos-tag'),
    drawerDescription: document.getElementById('drawer-description'),
    drawerNeighbors: document.getElementById('drawer-neighbors'),
    drawerSiblings: document.getElementById('drawer-siblings'),
    drawerSiblingsTitle: document.getElementById('drawer-cluster-siblings-title'),

    // Struggle View Components
    struggleHeaderCount: document.getElementById('struggle-header-count'),
    struggleModeBtns: document.querySelectorAll('.struggle-mode-btn'),
    exportStruggleBtn: document.getElementById('export-struggle-btn'),
    clearStruggleBtn: document.getElementById('clear-struggle-btn'),
    struggleEmptyState: document.getElementById('struggle-empty-state'),
    struggleExploreBtn: document.getElementById('struggle-explore-btn'),
    struggleBracketsContent: document.getElementById('struggle-brackets-content'),
    struggleBracketsGrid: document.getElementById('struggle-brackets-grid'),
    struggleFlashcardsContent: document.getElementById('struggle-flashcards-content'),
    flashcardDeck: document.getElementById('flashcard-deck'),
    fcProgress: document.getElementById('fc-progress'),
    fcPrevBtn: document.getElementById('fc-prev-btn'),
    fcNextBtn: document.getElementById('fc-next-btn'),
    
    // Audio Player
    audioPlayer: document.getElementById('audio-player')
  };

  // Popup interaction state
  let popupHideTimer = null;
  let isMouseInsidePopup = false;

  // Canvas contexts
  let galaxyCtx = null;
  let networkCtx = null;

  // Animation frame identifiers
  let galaxyAnimFrame = null;
  let networkAnimFrame = null;

  /* ==========================================================================
     INITIALIZATION & DATA LOADING
     ========================================================================== */

  async function init() {
    try {
      if (window.VOCAB_DATA) {
        state.data = window.VOCAB_DATA;
      } else {
        const response = await fetch('data.json');
        state.data = await response.json();
      }
      
      processData();
      loadStruggles();
      setupUI();
      setupGalaxyCanvas();
      setupNetworkCanvas();
      setupEventListeners();
      
      // Initial renders
      renderLegend();
      renderBracketsView();
      renderGroupsView();
      renderStruggleView();
      requestGalaxyRender();
      
      // Hash routing
      handleHashRouting();
      window.addEventListener('hashchange', handleHashRouting);
      
    } catch (err) {
      console.error('Failed to initialize Vocab Galaxy:', err);
      document.body.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #ef4444; font-family: sans-serif;">
          <h2>Error loading vocabulary dataset</h2>
          <p>${err.message}</p>
        </div>
      `;
    }
  }

  function processData() {
    state.words = state.data.words;
    state.clusters = state.data.clusters;
    
    state.words.forEach(w => {
      state.wordById.set(w.id, w);
      state.wordByName.set(w.word.toLowerCase(), w);
    });

    DOM.totalWordsPill.innerHTML = `<strong>${state.words.length.toLocaleString()}</strong> Words`;
    DOM.totalBracketsPill.innerHTML = `<strong>${state.clusters.length}</strong> Semantic Brackets`;
    DOM.legendCount.textContent = state.clusters.length;
    if (DOM.bracketFilter.firstElementChild) {
      DOM.bracketFilter.firstElementChild.textContent = `All ${state.clusters.length} Brackets`;
    }
    
    // Populate bracket filter
    state.clusters.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.is_miscellaneous
        ? `${c.name} (${c.word_count})`
        : `Bracket ${c.number}: ${c.name} (${c.word_count})`;
      DOM.bracketFilter.appendChild(opt);
    });

    // Populate group filter
    const totalGroups = state.data.stats.total_groups || 34;
    DOM.totalGroupsPill.innerHTML = `<strong>${totalGroups}</strong> Mountain Groups`;
    for (let i = 1; i <= totalGroups; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Group ${i}`;
      DOM.groupFilter.appendChild(opt);
    }
  }

  /* ==========================================================================
     UI SETUP & THEME
     ========================================================================== */

  function setupUI() {
    // Check saved theme
    const savedTheme = localStorage.getItem('vocab_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.replace('dark-theme', 'light-theme');
      DOM.moonIcon.style.display = 'none';
      DOM.sunIcon.style.display = 'block';
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
      document.body.classList.replace('dark-theme', 'light-theme');
      DOM.moonIcon.style.display = 'none';
      DOM.sunIcon.style.display = 'block';
      localStorage.setItem('vocab_theme', 'light');
    } else {
      document.body.classList.replace('light-theme', 'dark-theme');
      DOM.moonIcon.style.display = 'block';
      DOM.sunIcon.style.display = 'none';
      localStorage.setItem('vocab_theme', 'dark');
    }
    requestGalaxyRender();
    if (state.currentView === 'network') requestNetworkRender();
  }

  /* ==========================================================================
     GALAXY MAP (2D SCATTER & CONSTELLATION ENGINE)
     ========================================================================== */

  function setupGalaxyCanvas() {
    galaxyCtx = DOM.galaxyCanvas.getContext('2d');
    resizeGalaxyCanvas();
    window.addEventListener('resize', resizeGalaxyCanvas);

    // Initial center on canvas
    state.camera.targetX = 0;
    state.camera.targetY = 0;
    state.camera.x = 0;
    state.camera.y = 0;
  }

  function resizeGalaxyCanvas() {
    if (!DOM.galaxyCanvas) return;
    const rect = DOM.galaxyCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    DOM.galaxyCanvas.width = rect.width * dpr;
    DOM.galaxyCanvas.height = rect.height * dpr;
    requestGalaxyRender();
  }

  function requestGalaxyRender() {
    if (galaxyAnimFrame) return;
    galaxyAnimFrame = requestAnimationFrame(renderGalaxy);
  }

  function renderGalaxy() {
    galaxyAnimFrame = null;
    if (!galaxyCtx) return;

    const canvas = DOM.galaxyCanvas;
    const ctx = galaxyCtx;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Smooth camera interpolation
    const ease = 0.2;
    state.camera.x += (state.camera.targetX - state.camera.x) * ease;
    state.camera.y += (state.camera.targetY - state.camera.y) * ease;
    state.camera.scale += (state.camera.targetScale - state.camera.scale) * ease;

    const isMoving = Math.abs(state.camera.targetX - state.camera.x) > 0.1 ||
                     Math.abs(state.camera.targetY - state.camera.y) > 0.1 ||
                     Math.abs(state.camera.targetScale - state.camera.scale) > 0.001;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Apply camera transform (center of screen is 0,0)
    ctx.translate(width / 2 + state.camera.x, height / 2 + state.camera.y);
    ctx.scale(state.camera.scale, state.camera.scale);

    const isDark = document.body.classList.contains('dark-theme');

    // 1. Draw Subtle Background Grid & Nebula Halos
    drawGalaxyBackground(ctx, isDark);

    // 2. Draw Cluster Nebula Glows & Labels
    if (state.showLabels) {
      drawClusterLabels(ctx, isDark);
    }

    // 3. Draw Synaptic Connection Lines for Hovered / Selected Word
    if (state.showLinks && (state.hoveredWord || state.selectedWord)) {
      const activeWord = state.hoveredWord || state.selectedWord;
      drawSynapticLinks(ctx, activeWord, isDark);
    }

    // 4. Draw Word Nodes
    drawWordNodes(ctx, isDark);

    ctx.restore();

    if (isMoving) {
      requestGalaxyRender();
    }
  }

  function drawGalaxyBackground(ctx, isDark) {
    // Subtle crosshair origin
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-1500, 0);
    ctx.lineTo(1500, 0);
    ctx.moveTo(0, -1500);
    ctx.lineTo(0, 1500);
    ctx.stroke();
  }

  function drawClusterLabels(ctx, isDark) {
    ctx.save();
    const zoom = state.camera.scale;

    state.clusters.forEach(c => {
      // Skip nebula glow and center label for Miscellaneous outliers group
      if (c.is_miscellaneous) {
        return;
      }

      // If bracket filter is active and doesn't match this cluster, fade out
      if (state.filterBracket !== 'all' && parseInt(state.filterBracket) !== c.id) {
        return;
      }

      // Soft circular nebula glow
      const grad = ctx.createRadialGradient(c.cx, c.cy, 10, c.cx, c.cy, 160);
      grad.addColorStop(0, hexToRgba(c.color, isDark ? 0.08 : 0.05));
      grad.addColorStop(1, hexToRgba(c.color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, 160, 0, Math.PI * 2);
      ctx.fill();

      // Cluster label badge
      if (zoom >= 0.5) {
        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const title = `Bracket ${c.number}: ${c.name}`;
        const metrics = ctx.measureText(title);
        const padding = 6;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = 18;

        ctx.fillStyle = isDark ? 'rgba(17, 20, 31, 0.75)' : 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = hexToRgba(c.color, 0.4);
        ctx.lineWidth = 1;
        roundRect(ctx, c.cx - boxWidth / 2, c.cy - 24, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
        ctx.fillText(title, c.cx, c.cy - 15);
      }
    });
    ctx.restore();
  }

  function drawSynapticLinks(ctx, word, isDark) {
    if (!word || !word.nearest_neighbors) return;

    ctx.save();
    word.nearest_neighbors.forEach(n => {
      const target = state.wordById.get(n.id);
      if (!target) return;

      const alpha = Math.max(0.2, (n.score - 0.7) / 0.3);
      ctx.strokeStyle = hexToRgba(word.cluster_color, alpha * 0.9);
      ctx.lineWidth = Math.max(1, 2.5 * alpha);

      ctx.beginPath();
      ctx.moveTo(word.x, word.y);
      // Subtle quadratic curve for celestial visual elegance
      const mx = (word.x + target.x) / 2 + (target.y - word.y) * 0.08;
      const my = (word.y + target.y) / 2 + (word.x - target.x) * 0.08;
      ctx.quadraticCurveTo(mx, my, target.x, target.y);
      ctx.stroke();

      // Target highlight ring
      ctx.strokeStyle = hexToRgba(target.cluster_color, 0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 7, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawWordNodes(ctx, isDark) {
    const zoom = state.camera.scale;
    const hovered = state.hoveredWord;
    const selected = state.selectedWord;

    state.words.forEach(w => {
      // Check filter matching
      const matches = isWordMatchingFilters(w);
      if (!matches) return;

      const isHovered = hovered && hovered.id === w.id;
      const isSelected = selected && selected.id === w.id;
      const isNeighbor = hovered && hovered.nearest_neighbors && hovered.nearest_neighbors.some(n => n.id === w.id);

      // Node size
      let radius = 4;
      if (isHovered || isSelected) {
        radius = 8;
      } else if (isNeighbor) {
        radius = 6;
      } else if (zoom > 1.2) {
        radius = 5;
      }

      // Outer glow for hovered/selected
      if (isHovered || isSelected) {
        ctx.save();
        ctx.fillStyle = hexToRgba(w.cluster_color, 0.35);
        ctx.beginPath();
        ctx.arc(w.x, w.y, radius + 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Main Node Dot
      ctx.beginPath();
      ctx.arc(w.x, w.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = w.cluster_color;
      ctx.fill();

      // Node border
      ctx.strokeStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.lineWidth = (isHovered || isSelected) ? 2 : 0.8;
      ctx.stroke();

      // Amber highlight ring for words in Struggle Bucket
      if (isStruggling(w.id)) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = (isHovered || isSelected) ? 2.5 : 1.8;
        ctx.beginPath();
        ctx.arc(w.x, w.y, radius + 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Text Label beside node
      const shouldDrawLabel = isHovered || isSelected || isNeighbor || (zoom >= 0.9) || (zoom >= 0.6 && w.id % 2 === 0);
      if (shouldDrawLabel) {
        ctx.save();
        ctx.font = (isHovered || isSelected) ? '700 13px "Plus Jakarta Sans", sans-serif' : '500 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const labelText = w.word;
        const textX = w.x + radius + 4;
        const textY = w.y;

        // Label background for legibility
        if (isHovered || isSelected) {
          const metrics = ctx.measureText(labelText);
          ctx.fillStyle = isDark ? 'rgba(13, 16, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)';
          roundRect(ctx, textX - 3, textY - 9, metrics.width + 6, 18, 4);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(w.cluster_color, 0.8);
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.fillStyle = (isHovered || isSelected) ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#cbd5e1' : '#334155');
        ctx.fillText(labelText, textX, textY);
        ctx.restore();
      }
    });
  }

  function isWordMatchingFilters(word) {
    if (state.strugglingOnly && !isStruggling(word.id)) {
      return false;
    }
    if (state.filterBracket !== 'all' && word.cluster_id !== parseInt(state.filterBracket)) {
      return false;
    }
    if (state.filterGroup !== 'all' && word.group_num !== parseInt(state.filterGroup)) {
      return false;
    }
    if (state.filterPos !== 'all' && !word.pos.includes(state.filterPos)) {
      return false;
    }
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchWord = word.word.toLowerCase().includes(q);
      const matchSyn = word.synonyms.some(s => s.toLowerCase().includes(q));
      const matchDef = word.definitions.some(d => d.toLowerCase().includes(q));
      if (!matchWord && !matchSyn && !matchDef) return false;
    }
    return true;
  }

  function findWordAtScreenCoords(screenX, screenY) {
    const canvas = DOM.galaxyCanvas;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Convert screen coordinates to world coordinates
    const mouseX = screenX - rect.left;
    const mouseY = screenY - rect.top;
    const worldX = (mouseX - (width / 2 + state.camera.x)) / state.camera.scale;
    const worldY = (mouseY - (height / 2 + state.camera.y)) / state.camera.scale;

    // Search closest word within threshold
    const hitRadiusWorld = 16 / state.camera.scale;
    const hitRadiusSq = hitRadiusWorld * hitRadiusWorld;

    let closest = null;
    let closestDistSq = Infinity;

    for (const w of state.words) {
      if (!isWordMatchingFilters(w)) continue;
      const dx = w.x - worldX;
      const dy = w.y - worldY;
      const distSq = dx * dx + dy * dy;
      if (distSq < hitRadiusSq && distSq < closestDistSq) {
        closestDistSq = distSq;
        closest = w;
      }
    }
    return closest;
  }

  /* ==========================================================================
     HOVER POPUP (RICH DESCRIPTION HTML DISPLAY)
     ========================================================================== */

  function showHoverPopup(word, clientX, clientY) {
    if (!word) {
      hideHoverPopup();
      return;
    }

    state.hoveredWord = word;
    requestGalaxyRender();

    // Populate popup content
    DOM.popupWord.textContent = word.word;
    DOM.popupPos.textContent = word.pos.join(', ') || 'term';
    DOM.popupBracket.textContent = word.is_miscellaneous ? word.cluster_name : `Bracket ${word.cluster_number}: ${word.cluster_name}`;
    DOM.popupBracket.style.backgroundColor = word.cluster_color;
    DOM.popupGroup.textContent = word.group;

    // Update struggle star button in popup
    updatePopupStruggleBtn(word);

    // Set Audio
    DOM.popupAudioBtn.onclick = (e) => {
      e.stopPropagation();
      playPronunciation(word, DOM.popupAudioBtn);
    };

    // INJECT THE FULL DESCRIPTION HTML AS REQUIRED
    DOM.popupDescription.innerHTML = word.description;

    // Populate nearest neighbors
    DOM.popupNeighborsList.innerHTML = '';
    if (word.nearest_neighbors && word.nearest_neighbors.length) {
      word.nearest_neighbors.slice(0, 4).forEach(n => {
        const pill = document.createElement('span');
        pill.className = 'neighbor-pill';
        pill.textContent = `${n.word} (${Math.round(n.score * 100)}%)`;
        pill.onclick = (e) => {
          e.stopPropagation();
          const target = state.wordById.get(n.id);
          if (target) jumpToWord(target);
        };
        DOM.popupNeighborsList.appendChild(pill);
      });
    }

    // Position popup next to mouse with edge-detection
    clearTimeout(popupHideTimer);
    DOM.hoverPopup.style.display = 'block';
    positionPopup(clientX, clientY);
  }

  function positionPopup(clientX, clientY) {
    const popup = DOM.hoverPopup;
    const rect = popup.getBoundingClientRect();
    const margin = 16;
    let x = clientX + 18;
    let y = clientY - 40;

    // Clamp right edge
    if (x + rect.width > window.innerWidth - margin) {
      x = clientX - rect.width - 18;
    }
    // Clamp left edge
    if (x < margin) {
      x = margin;
    }
    // Clamp bottom edge
    if (y + rect.height > window.innerHeight - margin) {
      y = window.innerHeight - rect.height - margin;
    }
    // Clamp top edge
    if (y < margin) {
      y = margin;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  }

  function scheduleHidePopup() {
    clearTimeout(popupHideTimer);
    popupHideTimer = setTimeout(() => {
      if (!isMouseInsidePopup) {
        hideHoverPopup();
      }
    }, 140);
  }

  function hideHoverPopup() {
    if (state.hoverLock) return;
    clearTimeout(popupHideTimer);
    state.hoveredWord = null;
    DOM.hoverPopup.style.display = 'none';
    requestGalaxyRender();
  }

  /* ==========================================================================
     PINNED WORD DETAIL DRAWER
     ========================================================================== */

  function openWordDrawer(word) {
    if (!word) return;
    state.selectedWord = word;
    hideHoverPopup();

    DOM.drawerWord.textContent = word.word;
    DOM.drawerBracketTag.textContent = word.is_miscellaneous ? word.cluster_name : `Bracket ${word.cluster_number}: ${word.cluster_name}`;
    DOM.drawerBracketTag.style.backgroundColor = word.cluster_color;
    DOM.drawerGroupTag.textContent = word.group;
    DOM.drawerPosTag.textContent = word.pos.join(', ') || 'term';

    // Update struggle star button in drawer
    updateDrawerStruggleBtn(word);

    DOM.drawerAudioBtn.onclick = () => playPronunciation(word, DOM.drawerAudioBtn);

    // Full Description HTML
    DOM.drawerDescription.innerHTML = word.description;

    // Nearest Neighbors
    DOM.drawerNeighbors.innerHTML = '';
    if (word.nearest_neighbors) {
      word.nearest_neighbors.forEach(n => {
        const row = document.createElement('div');
        row.className = 'neighbor-row';
        row.innerHTML = `
          <div class="neighbor-word-col">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${n.cluster_color}"></span>
            <span>${n.word}</span>
          </div>
          <div class="neighbor-score">${Math.round(n.score * 100)}% match</div>
        `;
        row.onclick = () => {
          const target = state.wordById.get(n.id);
          if (target) openWordDrawer(target);
        };
        DOM.drawerNeighbors.appendChild(row);
      });
    }

    // Cluster Siblings
    const cluster = state.clusters[word.cluster_id];
    if (cluster) {
      if (cluster.is_miscellaneous) {
        DOM.drawerSiblingsTitle.textContent = `Solitary / Outlier Words (${cluster.word_count} total)`;
        DOM.drawerSiblings.innerHTML = '<div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">This word has a specialized meaning with no tight synonym bracket. Its closest semantic neighbors are shown above.</div>';
        const sampleMisc = cluster.word_ids.filter(id => id !== word.id).slice(0, 16);
        sampleMisc.forEach(wid => {
          const sib = state.wordById.get(wid);
          if (!sib) return;
          DOM.drawerSiblings.appendChild(createWordChip(sib));
        });
      } else {
        DOM.drawerSiblingsTitle.textContent = `All Words in Bracket ${cluster.number} (${cluster.word_count})`;
        DOM.drawerSiblings.innerHTML = '';
        cluster.word_ids.forEach(wid => {
          const sib = state.wordById.get(wid);
          if (!sib) return;
          DOM.drawerSiblings.appendChild(createWordChip(sib));
        });
      }
    }

    DOM.wordDrawer.classList.add('open');
    DOM.drawerBackdrop.style.display = 'block';
    requestGalaxyRender();
  }

  function closeWordDrawer() {
    DOM.wordDrawer.classList.remove('open');
    DOM.drawerBackdrop.style.display = 'none';
    state.selectedWord = null;
    requestGalaxyRender();
  }

  /* ==========================================================================
     AUDIO PRONUNCIATION ENGINE
     ========================================================================== */

  function playPronunciation(word, buttonEl) {
    if (!word || !word.pronunciation) return;
    const player = DOM.audioPlayer;

    if (state.isPlayingAudio && state.currentAudioWord === word.word) {
      player.pause();
      player.currentTime = 0;
      state.isPlayingAudio = false;
      if (buttonEl) buttonEl.classList.remove('playing');
      return;
    }

    player.src = word.pronunciation;
    state.currentAudioWord = word.word;
    state.isPlayingAudio = true;
    if (buttonEl) buttonEl.classList.add('playing');

    player.play().catch(err => {
      console.warn('Audio playback error:', err);
      state.isPlayingAudio = false;
      if (buttonEl) buttonEl.classList.remove('playing');
    });

    player.onended = () => {
      state.isPlayingAudio = false;
      if (buttonEl) buttonEl.classList.remove('playing');
    };
  }

  /* ==========================================================================
     STRUGGLE & REVISION BUCKET (DATA PERSISTENCE & REVIEW ENGINE)
     ========================================================================== */

  function loadStruggles() {
    try {
      const saved = localStorage.getItem('vocab_struggles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = parsed
            .map(Number)
            .filter(id => state.wordById.has(id));
          state.struggles = new Set(validIds);
        }
      }
    } catch (e) {
      console.warn('Could not load struggles from localStorage:', e);
      state.struggles = new Set();
    }
    updateStruggleBadges();
  }

  function saveStruggles() {
    try {
      localStorage.setItem('vocab_struggles', JSON.stringify(Array.from(state.struggles)));
    } catch (e) {
      console.warn('Could not save struggles to localStorage:', e);
    }
    updateStruggleBadges();
  }

  function isStruggling(wordId) {
    return state.struggles.has(Number(wordId));
  }

  function toggleStruggle(wordId) {
    const id = Number(wordId);
    if (state.struggles.has(id)) {
      state.struggles.delete(id);
    } else {
      state.struggles.add(id);
    }
    saveStruggles();

    // Update active popup struggle button if visible
    if (state.hoveredWord && state.hoveredWord.id === id) {
      updatePopupStruggleBtn(state.hoveredWord);
    }
    // Update active drawer struggle button if visible
    if (state.selectedWord && state.selectedWord.id === id) {
      updateDrawerStruggleBtn(state.selectedWord);
    }

    // Synchronize all matching chips in DOM
    document.querySelectorAll(`.word-chip[data-word-id="${id}"]`).forEach(chip => {
      const struggling = isStruggling(id);
      chip.classList.toggle('is-struggling', struggling);
      const starBtn = chip.querySelector('.chip-star-btn');
      if (starBtn) {
        starBtn.title = struggling ? 'Remove from struggle bucket' : 'Mark as struggling';
      }
    });

    // Re-render canvas / views
    requestGalaxyRender();
    if (state.currentView === 'network') requestNetworkRender();
    if (state.currentView === 'struggle') renderStruggleView();

    if (state.strugglingOnly) {
      updateFilterUI();
    } else {
      updateActiveCount();
    }
  }

  function updatePopupStruggleBtn(word) {
    if (!DOM.popupStruggleBtn || !word) return;
    const struggling = isStruggling(word.id);
    DOM.popupStruggleBtn.classList.toggle('active', struggling);
    DOM.popupStruggleBtn.title = struggling
      ? 'Marked as struggling (click to remove from review bucket)'
      : 'Mark as struggling (click to add to review bucket)';
    DOM.popupStruggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggleStruggle(word.id);
    };
  }

  function updateDrawerStruggleBtn(word) {
    if (!DOM.drawerStruggleBtn || !word) return;
    const struggling = isStruggling(word.id);
    DOM.drawerStruggleBtn.classList.toggle('active', struggling);
    if (DOM.drawerStruggleLabel) {
      DOM.drawerStruggleLabel.textContent = struggling ? 'Marked as Struggling' : 'Mark as Struggling';
    }
    DOM.drawerStruggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggleStruggle(word.id);
    };
  }

  function updateStruggleBadges() {
    const count = state.struggles.size;
    if (DOM.struggleTabBadge) DOM.struggleTabBadge.textContent = count;
    if (DOM.struggleFilterCount) DOM.struggleFilterCount.textContent = count;
    if (DOM.struggleHeaderCount) DOM.struggleHeaderCount.textContent = `${count} word${count === 1 ? '' : 's'}`;
  }

  function clearAllStruggles() {
    if (state.struggles.size === 0) return;
    if (window.confirm(`Clear all ${state.struggles.size} words from your Struggle Bucket?`)) {
      state.struggles.clear();
      saveStruggles();
      if (state.selectedWord) updateDrawerStruggleBtn(state.selectedWord);
      if (state.hoveredWord) updatePopupStruggleBtn(state.hoveredWord);
      renderStruggleView();
      updateFilterUI();
    }
  }

  function exportStruggles() {
    if (state.struggles.size === 0) {
      alert('Your Struggle Bucket is empty. Star some words first to export them!');
      return;
    }

    const exportData = {
      title: 'Vocab Galaxy - Struggling Words Revision List',
      exported_at: new Date().toISOString(),
      total_struggles: state.struggles.size,
      words: Array.from(state.struggles).map(id => {
        const w = state.wordById.get(id);
        return {
          id: w.id,
          word: w.word,
          pos: w.pos,
          bracket: w.is_miscellaneous ? w.cluster_name : `Bracket ${w.cluster_number}: ${w.cluster_name}`,
          mountain_group: w.group,
          definitions: w.definitions,
          synonyms: w.synonyms
        };
      })
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocab-struggle-bucket-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function createWordChip(w) {
    const chip = document.createElement('div');
    const struggling = isStruggling(w.id);
    chip.className = 'word-chip' + (struggling ? ' is-struggling' : '');
    chip.dataset.wordId = w.id;
    chip.innerHTML = `
      <span class="chip-dot" style="background:${w.cluster_color}"></span>
      <span class="chip-word">${w.word}</span>
      <button class="chip-star-btn" title="${struggling ? 'Remove from struggle bucket' : 'Mark as struggling'}">★</button>
    `;

    const starBtn = chip.querySelector('.chip-star-btn');
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStruggle(w.id);
    });

    chip.addEventListener('mouseenter', (e) => {
      showHoverPopup(w, e.clientX, e.clientY);
    });
    chip.addEventListener('mousemove', (e) => {
      positionPopup(e.clientX, e.clientY);
    });
    chip.addEventListener('mouseleave', () => {
      hideHoverPopup();
    });
    chip.addEventListener('click', () => {
      openWordDrawer(w);
    });

    return chip;
  }

  /* ==========================================================================
     VIEW 5: STRUGGLE & REVISION BUCKET PANEL
     ========================================================================== */

  function renderStruggleView() {
    updateStruggleBadges();

    const struggleWordIds = Array.from(state.struggles);
    const hasStruggles = struggleWordIds.length > 0;

    if (!hasStruggles) {
      DOM.struggleEmptyState.style.display = 'block';
      DOM.struggleBracketsContent.style.display = 'none';
      DOM.struggleFlashcardsContent.style.display = 'none';
      return;
    }

    DOM.struggleEmptyState.style.display = 'none';

    // Update active tab buttons in struggle panel
    DOM.struggleModeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.smode === state.struggleMode);
    });

    if (state.struggleMode === 'brackets') {
      DOM.struggleBracketsContent.style.display = 'block';
      DOM.struggleFlashcardsContent.style.display = 'none';
      renderStruggleBrackets();
    } else if (state.struggleMode === 'flashcards') {
      DOM.struggleBracketsContent.style.display = 'none';
      DOM.struggleFlashcardsContent.style.display = 'block';
      renderFlashcard();
    }
  }

  function renderStruggleBrackets() {
    const grid = DOM.struggleBracketsGrid;
    grid.innerHTML = '';

    // Group struggling words by their semantic clusters
    const clusterMap = new Map();
    state.struggles.forEach(wid => {
      const w = state.wordById.get(wid);
      if (!w) return;
      if (!clusterMap.has(w.cluster_id)) {
        clusterMap.set(w.cluster_id, []);
      }
      clusterMap.get(w.cluster_id).push(w);
    });

    const sortedClusters = Array.from(clusterMap.entries())
      .map(([cid, words]) => ({ cluster: state.clusters[cid], words }))
      .filter(item => item.cluster)
      .sort((a, b) => a.cluster.number - b.cluster.number);

    sortedClusters.forEach(({ cluster, words }) => {
      const card = document.createElement('div');
      card.className = cluster.is_miscellaneous ? 'bracket-card misc-bracket-card' : 'bracket-card';
      const titleText = cluster.is_miscellaneous ? cluster.name : `Bracket ${cluster.number}: ${cluster.name}`;
      const synSnippet = cluster.top_synonyms && cluster.top_synonyms.length
        ? `Synonyms: ${cluster.top_synonyms.join(', ')}`
        : (cluster.is_miscellaneous ? 'Solitary / Outlier terms with specialized meanings.' : '');

      card.innerHTML = `
        <div class="card-top-bar" style="background:${cluster.color}"></div>
        <div class="card-header">
          <div class="card-title-row">
            <span class="card-title">${titleText}</span>
            <span class="card-badge" style="color:${cluster.color}">${words.length} struggling word${words.length === 1 ? '' : 's'}</span>
          </div>
          <div class="card-syns">${synSnippet}</div>
        </div>
        <div class="card-words-container"></div>
      `;

      const wordsContainer = card.querySelector('.card-words-container');
      words.forEach(w => {
        wordsContainer.appendChild(createWordChip(w));
      });

      grid.appendChild(card);
    });
  }

  function renderFlashcard() {
    const struggleWords = Array.from(state.struggles)
      .map(id => state.wordById.get(id))
      .filter(Boolean);

    if (struggleWords.length === 0) {
      renderStruggleView();
      return;
    }

    if (state.flashcardIndex >= struggleWords.length) {
      state.flashcardIndex = 0;
    } else if (state.flashcardIndex < 0) {
      state.flashcardIndex = struggleWords.length - 1;
    }

    const currentWord = struggleWords[state.flashcardIndex];
    DOM.fcProgress.textContent = `Card ${state.flashcardIndex + 1} of ${struggleWords.length}`;

    DOM.flashcardDeck.innerHTML = '';
    const cardEl = document.createElement('div');
    cardEl.className = 'flashcard';

    cardEl.innerHTML = `
      <div class="fc-header">
        <div class="fc-word-row">
          <span class="fc-word">${currentWord.word}</span>
          <span class="pos-badge">${currentWord.pos.join(', ') || 'term'}</span>
          <button class="popup-audio-btn fc-audio-btn" title="Listen to pronunciation">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>
        <span class="bracket-badge" style="background:${currentWord.cluster_color}">
          ${currentWord.is_miscellaneous ? currentWord.cluster_name : `Bracket ${currentWord.cluster_number}: ${currentWord.cluster_name}`}
        </span>
      </div>
      <div class="fc-body">
        ${
          state.flashcardRevealed
            ? `<div class="fc-revealed-content">${currentWord.description}</div>`
            : `<div class="fc-hidden-prompt" id="fc-reveal-btn">
                <div style="font-size:28px; margin-bottom:8px;">💡</div>
                <div>Click or press Spacebar to reveal definition, mnemonic &amp; examples</div>
               </div>`
        }
      </div>
      <div class="fc-footer">
        <button class="btn-mastered" id="fc-mastered-btn" title="Remove this word from your struggle bucket">
          ✓ Mastered (Remove from Bucket)
        </button>
        <button class="btn-still-struggling" id="fc-keep-btn" title="Keep this word in your struggle bucket and advance">
          Keep in Bucket &rarr;
        </button>
      </div>
    `;

    // Audio button
    const audioBtn = cardEl.querySelector('.fc-audio-btn');
    audioBtn.onclick = (e) => {
      e.stopPropagation();
      playPronunciation(currentWord, audioBtn);
    };

    // Reveal toggle
    const revealBtn = cardEl.querySelector('#fc-reveal-btn');
    if (revealBtn) {
      revealBtn.onclick = () => {
        state.flashcardRevealed = true;
        renderFlashcard();
      };
    }

    // Mastered button
    const masteredBtn = cardEl.querySelector('#fc-mastered-btn');
    masteredBtn.onclick = () => {
      toggleStruggle(currentWord.id);
      state.flashcardRevealed = false;
      renderStruggleView();
    };

    // Keep in bucket button
    const keepBtn = cardEl.querySelector('#fc-keep-btn');
    keepBtn.onclick = () => {
      state.flashcardIndex = (state.flashcardIndex + 1) % struggleWords.length;
      state.flashcardRevealed = false;
      renderFlashcard();
    };

    DOM.flashcardDeck.appendChild(cardEl);
  }

  /* ==========================================================================
     VIEW 2: SIMILARITY BRACKETS (GRID CARDS)
     ========================================================================== */

  function renderBracketsView() {
    const grid = DOM.bracketsGrid;
    grid.innerHTML = '';

    const filterText = (DOM.bracketSearchInput.value || '').toLowerCase();

    state.clusters.forEach(c => {
      const wordsInCluster = c.word_ids.map(id => state.wordById.get(id)).filter(Boolean);
      
      // Filter words based on global filters + local search
      const matchingWords = wordsInCluster.filter(w => {
        if (!isWordMatchingFilters(w)) return false;
        if (filterText) {
          const matchCluster = c.name.toLowerCase().includes(filterText);
          const matchWord = w.word.toLowerCase().includes(filterText);
          const matchSyn = w.synonyms.some(s => s.toLowerCase().includes(filterText));
          if (!matchCluster && !matchWord && !matchSyn) return false;
        }
        return true;
      });

      if (matchingWords.length === 0 && filterText) return;

      const card = document.createElement('div');
      card.className = c.is_miscellaneous ? 'bracket-card misc-bracket-card' : 'bracket-card';
      
      const titleText = c.is_miscellaneous ? c.name : `Bracket ${c.number}: ${c.name}`;
      const badgeStyle = c.is_miscellaneous ? 'background:#475569; color:#f8fafc; padding:2px 8px; border-radius:12px; font-weight:600;' : `color:${c.color}`;
      const synSnippet = c.is_miscellaneous
        ? 'Solitary terms with specialized or unique meanings that do not meet strict synonym bracket thresholds.'
        : (c.top_synonyms && c.top_synonyms.length ? `Synonyms: ${c.top_synonyms.join(', ')}` : '');

      card.innerHTML = `
        <div class="card-top-bar" style="background:${c.color}"></div>
        <div class="card-header">
          <div class="card-title-row">
            <span class="card-title">${titleText}</span>
            <span class="card-badge" style="${badgeStyle}">${matchingWords.length} words</span>
          </div>
          <div class="card-syns">${synSnippet}</div>
        </div>
        <div class="card-words-container"></div>
      `;

      const wordsContainer = card.querySelector('.card-words-container');
      matchingWords.forEach(w => {
        wordsContainer.appendChild(createWordChip(w));
      });

      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     VIEW 4: MOUNTAIN GROUPS (ORIGINAL 34 GROUPS)
     ========================================================================== */

  function renderGroupsView() {
    const grid = DOM.groupsGrid;
    grid.innerHTML = '';

    // Group words by original group_num
    const groupMap = new Map();
    state.words.forEach(w => {
      if (!groupMap.has(w.group_num)) {
        groupMap.set(w.group_num, { title: w.group, num: w.group_num, words: [] });
      }
      groupMap.get(w.group_num).words.push(w);
    });

    Array.from(groupMap.values()).sort((a, b) => a.num - b.num).forEach(g => {
      const card = document.createElement('div');
      card.className = 'bracket-card';

      card.innerHTML = `
        <div class="card-top-bar" style="background: linear-gradient(90deg, #6366f1, #a855f7);"></div>
        <div class="card-header">
          <div class="card-title-row">
            <span class="card-title">${g.title}</span>
            <span class="card-badge">${g.words.length} words</span>
          </div>
          <div class="card-syns">Hover to see meaning &amp; bracket color</div>
        </div>
        <div class="card-words-container"></div>
      `;

      const wordsContainer = card.querySelector('.card-words-container');
      g.words.forEach(w => {
        wordsContainer.appendChild(createWordChip(w));
      });

      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     VIEW 3: SYNONYM NETWORK (FORCE-CONNECTED GRAPH)
     ========================================================================== */

  function setupNetworkCanvas() {
    networkCtx = DOM.networkCanvas.getContext('2d');
    resizeNetworkCanvas();
    window.addEventListener('resize', resizeNetworkCanvas);
  }

  function resizeNetworkCanvas() {
    if (!DOM.networkCanvas) return;
    const rect = DOM.networkCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    DOM.networkCanvas.width = rect.width * dpr;
    DOM.networkCanvas.height = rect.height * dpr;
    requestNetworkRender();
  }

  function requestNetworkRender() {
    if (networkAnimFrame) return;
    networkAnimFrame = requestAnimationFrame(renderNetwork);
  }

  function renderNetwork() {
    networkAnimFrame = null;
    if (!networkCtx) return;

    const canvas = DOM.networkCanvas;
    const ctx = networkCtx;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const ease = 0.2;
    state.netCamera.x += (state.netCamera.targetX - state.netCamera.x) * ease;
    state.netCamera.y += (state.netCamera.targetY - state.netCamera.y) * ease;
    state.netCamera.scale += (state.netCamera.targetScale - state.netCamera.scale) * ease;

    const isMoving = Math.abs(state.netCamera.targetX - state.netCamera.x) > 0.1 ||
                     Math.abs(state.netCamera.targetY - state.netCamera.y) > 0.1 ||
                     Math.abs(state.netCamera.targetScale - state.netCamera.scale) > 0.001;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.translate(width / 2 + state.netCamera.x, height / 2 + state.netCamera.y);
    ctx.scale(state.netCamera.scale, state.netCamera.scale);

    const isDark = document.body.classList.contains('dark-theme');
    const thresh = state.minSimilarity;

    // Draw connecting edges where similarity >= threshold
    ctx.save();
    state.words.forEach(w => {
      if (!isWordMatchingFilters(w) || !w.nearest_neighbors) return;
      w.nearest_neighbors.forEach(n => {
        if (n.score >= thresh && n.id > w.id) {
          const target = state.wordById.get(n.id);
          if (!target || !isWordMatchingFilters(target)) return;

          const alpha = (n.score - thresh) / (1 - thresh);
          ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha * 0.4})` : `rgba(0, 0, 0, ${alpha * 0.35})`;
          ctx.lineWidth = 1 + alpha * 1.5;

          ctx.beginPath();
          ctx.moveTo(w.x, w.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
    });
    ctx.restore();

    // Draw Nodes
    drawWordNodes(ctx, isDark);

    ctx.restore();

    if (isMoving) {
      requestNetworkRender();
    }
  }

  /* ==========================================================================
     SEARCH & NAVIGATION
     ========================================================================== */

  function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    state.searchQuery = query;

    if (query.length > 0) {
      DOM.clearSearch.style.display = 'block';
      showSearchDropdown(query);
    } else {
      DOM.clearSearch.style.display = 'none';
      DOM.searchDropdown.style.display = 'none';
    }

    updateActiveCount();
    requestGalaxyRender();
    if (state.currentView === 'brackets') renderBracketsView();
    if (state.currentView === 'network') requestNetworkRender();
  }

  function showSearchDropdown(query) {
    const dropdown = DOM.searchDropdown;
    dropdown.innerHTML = '';

    const matches = [];
    for (const w of state.words) {
      if (w.word.toLowerCase().startsWith(query)) {
        matches.push({ word: w, rank: 1 });
      } else if (w.word.toLowerCase().includes(query)) {
        matches.push({ word: w, rank: 2 });
      } else if (w.synonyms.some(s => s.toLowerCase().includes(query))) {
        matches.push({ word: w, rank: 3 });
      } else if (w.definitions.some(d => d.toLowerCase().includes(query))) {
        matches.push({ word: w, rank: 4 });
      }
      if (matches.length >= 25) break;
    }

    matches.sort((a, b) => a.rank - b.rank);

    if (matches.length === 0) {
      dropdown.innerHTML = '<div style="padding: 10px; color: var(--text-muted); font-size: 12px; text-align: center;">No words found</div>';
      dropdown.style.display = 'block';
      return;
    }

    matches.slice(0, 10).forEach(m => {
      const w = m.word;
      const item = document.createElement('div');
      item.className = 'search-result-item';
      
      const defPreview = w.definitions.length ? w.definitions[0] : (w.synonyms.length ? `Synonyms: ${w.synonyms.slice(0, 3).join(', ')}` : '');

      item.innerHTML = `
        <div class="result-top">
          <span class="result-word">${w.word}</span>
          <span class="result-cluster" style="background:${w.cluster_color}">${w.is_miscellaneous ? 'Misc / Outlier' : `Bracket ${w.cluster_number}`}</span>
        </div>
        <div class="result-def">${defPreview}</div>
      `;

      item.addEventListener('click', () => {
        dropdown.style.display = 'none';
        DOM.searchInput.value = w.word;
        jumpToWord(w);
      });

      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

  function jumpToWord(word) {
    if (!word) return;
    
    // If not in map view, switch to map
    if (state.currentView !== 'map') {
      switchView('map');
    }

    // Center camera on word
    state.camera.targetX = -word.x * 1.5;
    state.camera.targetY = -word.y * 1.5;
    state.camera.targetScale = 1.5;
    
    openWordDrawer(word);
    requestGalaxyRender();
  }

  /* ==========================================================================
     CLUSTER LEGEND
     ========================================================================== */

  function renderLegend() {
    const list = DOM.legendList;
    list.innerHTML = '';

    state.clusters.forEach(c => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      if (c.is_miscellaneous) item.classList.add('misc-item');
      if (state.filterBracket === String(c.id)) item.classList.add('active');

      const label = c.is_miscellaneous ? 'Misc: Outliers & Unique' : `B${c.number}: ${c.name}`;
      item.innerHTML = `
        <span class="legend-dot" style="background:${c.color}"></span>
        <span class="legend-name" title="${c.name}">${label}</span>
        <span class="legend-count">${c.word_count}</span>
      `;

      item.addEventListener('click', () => {
        if (state.filterBracket === String(c.id)) {
          state.filterBracket = 'all';
          DOM.bracketFilter.value = 'all';
        } else {
          state.filterBracket = String(c.id);
          DOM.bracketFilter.value = c.id;
          if (!c.is_miscellaneous) {
            // Pan camera toward cluster center
            state.camera.targetX = -c.cx * state.camera.scale;
            state.camera.targetY = -c.cy * state.camera.scale;
          } else {
            // Outliers are distributed across galaxy; zoom out to overview
            state.camera.targetX = 0;
            state.camera.targetY = 0;
            state.camera.targetScale = 0.85;
          }
        }
        updateFilterUI();
      });

      list.appendChild(item);
    });
  }

  /* ==========================================================================
     FILTERS & VIEW SWITCHING
     ========================================================================== */

  function updateFilterUI() {
    renderLegend();
    updateActiveCount();
    requestGalaxyRender();
    if (state.currentView === 'brackets') renderBracketsView();
    if (state.currentView === 'network') requestNetworkRender();
  }

  function updateActiveCount() {
    const totalMatching = state.words.filter(isWordMatchingFilters).length;
    DOM.activeCount.textContent = `Showing ${totalMatching.toLocaleString()} / ${state.words.length.toLocaleString()} words`;
  }

  function switchView(viewName) {
    state.currentView = viewName;

    // Update buttons
    DOM.viewTabs.forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update panels
    Object.keys(DOM.panels).forEach(key => {
      if (key === viewName) {
        DOM.panels[key].classList.add('active');
      } else {
        DOM.panels[key].classList.remove('active');
      }
    });

    // Toggle network-specific controls in filter bar
    DOM.networkOnlyControls.forEach(el => {
      el.style.display = (viewName === 'network') ? 'flex' : 'none';
    });

    hideHoverPopup();

    if (viewName === 'map') {
      resizeGalaxyCanvas();
    } else if (viewName === 'network') {
      resizeNetworkCanvas();
    } else if (viewName === 'brackets') {
      renderBracketsView();
    } else if (viewName === 'groups') {
      renderGroupsView();
    } else if (viewName === 'struggle') {
      renderStruggleView();
    }
  }

  function handleHashRouting() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    if (hash === 'brackets' || hash === 'network' || hash === 'groups' || hash === 'map' || hash === 'struggle') {
      switchView(hash);
    } else if (hash.startsWith('word=')) {
      const wordName = decodeURIComponent(hash.slice(5)).toLowerCase();
      const target = state.wordByName.get(wordName);
      if (target) {
        jumpToWord(target);
      }
    } else if (hash.startsWith('bracket=')) {
      const bNum = parseInt(hash.slice(8));
      const c = state.clusters.find(cl => cl.number === bNum);
      if (c) {
        state.filterBracket = String(c.id);
        DOM.bracketFilter.value = c.id;
        updateFilterUI();
      }
    }
  }

  /* ==========================================================================
     EVENT LISTENERS
     ========================================================================== */

  function setupEventListeners() {
    // View Switcher Tabs
    DOM.viewTabs.forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Theme Toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // About Modal
    DOM.helpToggle.addEventListener('click', () => { DOM.aboutModal.style.display = 'flex'; });
    DOM.modalClose.addEventListener('click', () => { DOM.aboutModal.style.display = 'none'; });
    DOM.aboutModal.addEventListener('click', (e) => {
      if (e.target === DOM.aboutModal) DOM.aboutModal.style.display = 'none';
    });

    // Search Input
    DOM.searchInput.addEventListener('input', handleSearchInput);
    DOM.clearSearch.addEventListener('click', () => {
      DOM.searchInput.value = '';
      handleSearchInput({ target: DOM.searchInput });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        DOM.searchDropdown.style.display = 'none';
      }
    });

    // Filter controls
    DOM.bracketFilter.addEventListener('change', (e) => {
      state.filterBracket = e.target.value;
      updateFilterUI();
    });

    DOM.groupFilter.addEventListener('change', (e) => {
      state.filterGroup = e.target.value;
      updateFilterUI();
    });

    DOM.posFilter.addEventListener('change', (e) => {
      state.filterPos = e.target.value;
      updateFilterUI();
    });

    DOM.resetFilters.addEventListener('click', () => {
      state.filterBracket = 'all';
      state.filterGroup = 'all';
      state.filterPos = 'all';
      state.searchQuery = '';
      state.strugglingOnly = false;
      DOM.toggleStruggleFilter.classList.remove('active');
      DOM.bracketFilter.value = 'all';
      DOM.groupFilter.value = 'all';
      DOM.posFilter.value = 'all';
      DOM.searchInput.value = '';
      DOM.clearSearch.style.display = 'none';
      updateFilterUI();
    });

    // Toggle Struggle Words Only Filter
    DOM.toggleStruggleFilter.addEventListener('click', () => {
      state.strugglingOnly = !state.strugglingOnly;
      DOM.toggleStruggleFilter.classList.toggle('active', state.strugglingOnly);
      updateFilterUI();
    });

    // Struggle Bucket View Controls
    DOM.struggleModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.struggleMode = btn.dataset.smode;
        state.flashcardRevealed = false;
        renderStruggleView();
      });
    });

    DOM.exportStruggleBtn.addEventListener('click', exportStruggles);
    DOM.clearStruggleBtn.addEventListener('click', clearAllStruggles);
    DOM.struggleExploreBtn.addEventListener('click', () => switchView('map'));

    // Flashcard Quiz Controls
    DOM.fcPrevBtn.addEventListener('click', () => {
      const struggleCount = state.struggles.size;
      if (struggleCount > 0) {
        state.flashcardIndex = (state.flashcardIndex - 1 + struggleCount) % struggleCount;
        state.flashcardRevealed = false;
        renderFlashcard();
      }
    });

    DOM.fcNextBtn.addEventListener('click', () => {
      const struggleCount = state.struggles.size;
      if (struggleCount > 0) {
        state.flashcardIndex = (state.flashcardIndex + 1) % struggleCount;
        state.flashcardRevealed = false;
        renderFlashcard();
      }
    });

    DOM.simThreshold.addEventListener('input', (e) => {
      state.minSimilarity = parseFloat(e.target.value);
      DOM.simVal.textContent = state.minSimilarity.toFixed(2);
      DOM.networkThreshHint.textContent = state.minSimilarity.toFixed(2);
      if (state.currentView === 'network') requestNetworkRender();
    });

    // Galaxy Canvas Pan & Zoom Controls
    DOM.zoomIn.addEventListener('click', () => {
      state.camera.targetScale = Math.min(3.5, state.camera.targetScale * 1.3);
      requestGalaxyRender();
    });

    DOM.zoomOut.addEventListener('click', () => {
      state.camera.targetScale = Math.max(0.3, state.camera.targetScale / 1.3);
      requestGalaxyRender();
    });

    DOM.zoomReset.addEventListener('click', () => {
      state.camera.targetX = 0;
      state.camera.targetY = 0;
      state.camera.targetScale = 0.75;
      requestGalaxyRender();
    });

    DOM.toggleLabels.addEventListener('click', () => {
      state.showLabels = !state.showLabels;
      DOM.toggleLabels.classList.toggle('active', state.showLabels);
      requestGalaxyRender();
    });

    DOM.toggleLinks.addEventListener('click', () => {
      state.showLinks = !state.showLinks;
      DOM.toggleLinks.classList.toggle('active', state.showLinks);
      requestGalaxyRender();
    });

    // Legend Toggle
    DOM.legendToggle.addEventListener('click', () => {
      DOM.clusterLegend.classList.toggle('collapsed');
    });

    // Brackets Search Input
    DOM.bracketSearchInput.addEventListener('input', () => {
      renderBracketsView();
    });

    // Word Drawer Close
    DOM.drawerClose.addEventListener('click', closeWordDrawer);
    DOM.drawerBackdrop.addEventListener('click', closeWordDrawer);

    // Hover Popup Hover Protection (prevents flicker when moving cursor into popup)
    DOM.hoverPopup.addEventListener('mouseenter', () => {
      isMouseInsidePopup = true;
      clearTimeout(popupHideTimer);
    });

    DOM.hoverPopup.addEventListener('mouseleave', () => {
      isMouseInsidePopup = false;
      scheduleHidePopup();
    });

    // Galaxy Canvas Mouse Events (Hover detection, Drag pan, Wheel zoom)
    const gCanvas = DOM.galaxyCanvas;

    gCanvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      state.camera.isPanning = true;
      state.camera.startX = e.clientX - state.camera.targetX;
      state.camera.startY = e.clientY - state.camera.targetY;
    });

    window.addEventListener('mouseup', () => {
      state.camera.isPanning = false;
    });

    gCanvas.addEventListener('mousemove', (e) => {
      if (state.camera.isPanning) {
        state.camera.targetX = e.clientX - state.camera.startX;
        state.camera.targetY = e.clientY - state.camera.startY;
        hideHoverPopup();
        requestGalaxyRender();
        return;
      }

      // Detect word hover
      const hovered = findWordAtScreenCoords(e.clientX, e.clientY);
      if (hovered) {
        gCanvas.style.cursor = 'pointer';
        clearTimeout(popupHideTimer);
        showHoverPopup(hovered, e.clientX, e.clientY);
      } else {
        gCanvas.style.cursor = 'grab';
        if (!isMouseInsidePopup) {
          scheduleHidePopup();
        }
      }
    });

    gCanvas.addEventListener('mouseleave', () => {
      state.camera.isPanning = false;
      if (!isMouseInsidePopup) {
        scheduleHidePopup();
      }
    });

    gCanvas.addEventListener('click', (e) => {
      const clickedWord = findWordAtScreenCoords(e.clientX, e.clientY);
      if (clickedWord) {
        openWordDrawer(clickedWord);
      }
    });

    // Smooth Wheel Zoom centered on cursor
    gCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.max(0.3, Math.min(4.0, state.camera.targetScale * zoomFactor));

      const rect = gCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - (rect.width / 2);
      const mouseY = e.clientY - rect.top - (rect.height / 2);

      // Adjust targetX and targetY so zoom focuses on mouse
      state.camera.targetX -= (mouseX - state.camera.targetX) * (zoomFactor - 1);
      state.camera.targetY -= (mouseY - state.camera.targetY) * (zoomFactor - 1);
      state.camera.targetScale = newScale;

      requestGalaxyRender();
    }, { passive: false });

    // Network Canvas Pan & Zoom
    const nCanvas = DOM.networkCanvas;
    DOM.netZoomIn.addEventListener('click', () => {
      state.netCamera.targetScale = Math.min(3.0, state.netCamera.targetScale * 1.3);
      requestNetworkRender();
    });
    DOM.netZoomOut.addEventListener('click', () => {
      state.netCamera.targetScale = Math.max(0.2, state.netCamera.targetScale / 1.3);
      requestNetworkRender();
    });
    DOM.netZoomReset.addEventListener('click', () => {
      state.netCamera.targetX = 0;
      state.netCamera.targetY = 0;
      state.netCamera.targetScale = 0.65;
      requestNetworkRender();
    });

    nCanvas.addEventListener('mousedown', (e) => {
      state.netCamera.isPanning = true;
      state.netCamera.startX = e.clientX - state.netCamera.targetX;
      state.netCamera.startY = e.clientY - state.netCamera.targetY;
    });
    window.addEventListener('mouseup', () => { state.netCamera.isPanning = false; });
    nCanvas.addEventListener('mousemove', (e) => {
      if (state.netCamera.isPanning) {
        state.netCamera.targetX = e.clientX - state.netCamera.startX;
        state.netCamera.targetY = e.clientY - state.netCamera.startY;
        requestNetworkRender();
      }
    });
    nCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      state.netCamera.targetScale = Math.max(0.2, Math.min(3.5, state.netCamera.targetScale * factor));
      requestNetworkRender();
    }, { passive: false });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== DOM.searchInput && document.activeElement !== DOM.bracketSearchInput) {
        e.preventDefault();
        DOM.searchInput.focus();
      } else if (e.key === 'Escape') {
        DOM.searchDropdown.style.display = 'none';
        closeWordDrawer();
        hideHoverPopup();
        DOM.aboutModal.style.display = 'none';
      } else if (state.currentView === 'struggle' && state.struggleMode === 'flashcards' && state.struggles.size > 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          DOM.fcPrevBtn.click();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          DOM.fcNextBtn.click();
        } else if (e.key === ' ' || e.key === 'Enter') {
          if (!state.flashcardRevealed) {
            e.preventDefault();
            state.flashcardRevealed = true;
            renderFlashcard();
          }
        }
      }
    });
  }

  /* ==========================================================================
     UTILITY FUNCTIONS
     ========================================================================== */

  function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
