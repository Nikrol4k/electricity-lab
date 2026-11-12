// ===== Electricity Lab: script.js =====
// This file holds three independent blocks. Each one is wrapped in its own
// function, so they do not share variables and cannot interfere with each other:
//   1. Experiment 001: Why does a bulb get brighter?
//   2. Experiment 002: Series vs. parallel circuits
//   3. Experiment 002: Knowledge check (quiz)

// ---------------------------------------------------------------------
// 1. Experiment 001: Why does a bulb get brighter?
// Model: ideal battery, constant resistance.  I = U / R,  P = U x I = U^2 / R
// ---------------------------------------------------------------------
(function () {
  'use strict';

  // ---------- Settings ----------
  const LIMITS = {
    voltage: { min: 1, max: 12, fallback: 6 },
    resistance: { min: 2, max: 50, fallback: 10 }
  };

  // Power (in watts) that gives full on-screen brightness.
  // The gamma curve makes differences between settings easy to see.
  const REFERENCE_POWER = 20;
  const GAMMA = 0.6;

  const FILAMENT_OFF = [107, 114, 128];
  const FILAMENT_ON = [255, 236, 170];

  const POWER_LEVELS = [
    { below: 0.5, text: 'The bulb is barely glowing.' },
    { below: 2, text: 'The bulb is dim.' },
    { below: 6, text: 'The bulb glows at a moderate level.' },
    { below: 20, text: 'The bulb is bright.' },
    { below: Infinity, text: 'The bulb is very bright.' }
  ];

  // ---------- Elements ----------
  const byId = (id) => document.getElementById(id);

  const els = {
    voltage: byId('voltage'),
    resistance: byId('resistance'),
    voltageValue: byId('voltage-value'),
    resistanceValue: byId('resistance-value'),
    currentValue: byId('current-value'),
    powerValue: byId('power-value'),
    svgVoltage: byId('svg-voltage'),
    svgResistance: byId('svg-resistance'),
    svgCurrent: byId('svg-current'),
    circuit: byId('circuit'),
    glow: byId('bulb-glow'),
    glass: byId('bulb-glass'),
    filament: byId('filament'),
    statusLevel: byId('status-level'),
    statusDetail: byId('status-detail'),
    year: byId('year')
  };

  const required = ['voltage', 'resistance', 'voltageValue', 'resistanceValue',
    'currentValue', 'powerValue', 'svgVoltage', 'svgResistance', 'svgCurrent',
    'circuit', 'glow', 'glass', 'filament', 'statusLevel', 'statusDetail'];

  if (required.some((key) => !els[key])) {
    console.error('Electricity Lab: some elements are missing from index.html.');
    return;
  }

  // Last values, used to describe what changed.
  const previous = { voltage: null, resistance: null };

  // ---------- Helpers ----------
  function readNumber(input, limits) {
    const value = parseFloat(input.value);
    if (!Number.isFinite(value)) {
      return limits.fallback;
    }
    return Math.min(Math.max(value, limits.min), limits.max);
  }

  function calculate(voltage, resistance) {
    if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || resistance <= 0) {
      return null;
    }
    const current = voltage / resistance; // I = U / R
    const power = voltage * current;      // P = U x I (same as U^2 / R)
    return { current: current, power: power };
  }

  function formatVoltage(v) {
    return (Number.isInteger(v) ? String(v) : v.toFixed(1)) + ' V';
  }

  function formatResistance(r) {
    return r + ' Ω';
  }

  function formatCurrent(i) {
    return i.toFixed(2) + ' A';
  }

  function formatPower(p) {
    return p.toFixed(2) + ' W';
  }

  function brightnessFromPower(power) {
    const ratio = Math.max(0, power) / REFERENCE_POWER;
    return Math.min(1, Math.pow(ratio, GAMMA));
  }

  function mixColor(from, to, t) {
    const channel = (i) => Math.round(from[i] + (to[i] - from[i]) * t);
    return 'rgb(' + channel(0) + ', ' + channel(1) + ', ' + channel(2) + ')';
  }

  function updateSliderFill(input, limits) {
    const value = Number(input.value);
    const percent = ((value - limits.min) / (limits.max - limits.min)) * 100;
    input.style.setProperty('--fill', Math.min(100, Math.max(0, percent)) + '%');
  }

  function levelText(power) {
    for (let i = 0; i < POWER_LEVELS.length; i++) {
      if (power < POWER_LEVELS[i].below) {
        return POWER_LEVELS[i].text;
      }
    }
    return '';
  }

  // ---------- Status message ----------
  function buildDetail(source, voltage, resistance, current, power) {
    const numbers = formatCurrent(current) + ' and power ' + formatPower(power);

    if (source === 'voltage' && previous.voltage !== null) {
      const rose = voltage > previous.voltage;
      return 'Voltage ' + (rose ? 'increased' : 'decreased') + ' to ' + formatVoltage(voltage) +
        '. With the resistance fixed at ' + formatResistance(resistance) +
        ', current is ' + numbers + '. ' +
        (rose
          ? 'A higher voltage pushes more current through the same resistance, so the bulb gets brighter.'
          : 'A lower voltage pushes less current through the same resistance, so the bulb gets dimmer.');
    }

    if (source === 'resistance' && previous.resistance !== null) {
      const rose = resistance > previous.resistance;
      return 'Resistance ' + (rose ? 'increased' : 'decreased') + ' to ' + formatResistance(resistance) +
        '. With the voltage fixed at ' + formatVoltage(voltage) +
        ', current is ' + numbers + '. ' +
        (rose
          ? 'A higher resistance lets less current flow, so the bulb gets dimmer.'
          : 'A lower resistance lets more current flow, so the bulb gets brighter.');
    }

    if (source === 'preset') {
      return 'Setting applied: ' + formatVoltage(voltage) + ' across ' + formatResistance(resistance) +
        '. Current is ' + numbers + '.';
    }

    return 'Drag a slider to see how the circuit responds. Right now ' + formatVoltage(voltage) +
      ' across ' + formatResistance(resistance) + ' gives current ' + numbers + '.';
  }

  // ---------- Main update ----------
  function update(source) {
    const voltage = readNumber(els.voltage, LIMITS.voltage);
    const resistance = readNumber(els.resistance, LIMITS.resistance);

    // Write back safe values if the inputs held something invalid.
    if (Number(els.voltage.value) !== voltage) {
      els.voltage.value = voltage;
    }
    if (Number(els.resistance.value) !== resistance) {
      els.resistance.value = resistance;
    }

    const result = calculate(voltage, resistance);
    if (!result) {
      els.statusLevel.textContent = 'Invalid values.';
      els.statusDetail.textContent = 'Please choose a voltage and a resistance greater than zero.';
      return;
    }

    const current = result.current;
    const power = result.power;
    const brightness = brightnessFromPower(power);

    // Text readouts
    els.voltageValue.textContent = formatVoltage(voltage);
    els.resistanceValue.textContent = formatResistance(resistance);
    els.currentValue.textContent = formatCurrent(current);
    els.powerValue.textContent = formatPower(power);

    // Labels inside the circuit diagram
    els.svgVoltage.textContent = 'U = ' + formatVoltage(voltage);
    els.svgResistance.textContent = 'R = ' + formatResistance(resistance);
    els.svgCurrent.textContent = 'I = ' + formatCurrent(current);

    // Bulb
    els.glow.style.opacity = String(brightness);
    els.glass.style.fill = 'rgba(255, 211, 107, ' + (0.08 + 0.5 * brightness).toFixed(3) + ')';
    els.filament.querySelectorAll('line').forEach(function (line) {
      line.style.stroke = mixColor(FILAMENT_OFF, FILAMENT_ON, brightness);
    });

    // Speed of the current-flow dots
    const duration = Math.max(0.25, Math.min(3, 2.4 / (1 + 4 * current)));
    els.circuit.style.setProperty('--flow-duration', duration.toFixed(2) + 's');

    // Sliders: progress fill and spoken value
    updateSliderFill(els.voltage, LIMITS.voltage);
    updateSliderFill(els.resistance, LIMITS.resistance);
    els.voltage.setAttribute('aria-valuetext', formatVoltage(voltage).replace(' V', ' volts'));
    els.resistance.setAttribute('aria-valuetext', resistance + ' ohms');

    // Status message
    els.statusLevel.textContent = levelText(power);
    els.statusDetail.textContent = buildDetail(source, voltage, resistance, current, power);

    previous.voltage = voltage;
    previous.resistance = resistance;
  }

  // ---------- Events ----------
  els.voltage.addEventListener('input', function () {
    update('voltage');
  });

  els.resistance.addEventListener('input', function () {
    update('resistance');
  });

  document.querySelectorAll('.preset').forEach(function (button) {
    button.addEventListener('click', function () {
      els.voltage.value = button.getAttribute('data-voltage');
      els.resistance.value = button.getAttribute('data-resistance');
      update('preset');
    });
  });

  if (els.year) {
    els.year.textContent = String(new Date().getFullYear());
  }

  // ---------- Start ----------
  update('init');
})();


// ---------------------------------------------------------------------
// 2. Experiment 002: Series vs. parallel circuits
//
// Model: ideal battery (constant voltage U), two bulbs treated as ideal
// resistors with constant resistance R1 and R2, wires with no resistance.
// All values are in SI units: volts (V), ohms (ohm), amperes (A), watts (W).
//
// SERIES (one loop)
//   R_total = R1 + R2
//   I_total = U / R_total        I1 = I2 = I_total
//   U1 = I1 x R1                 U2 = I2 x R2          (U1 + U2 = U)
//   An open switch anywhere breaks the loop: no current anywhere.
//
// PARALLEL (two branches across the supply)
//   1 / R_total = 1 / R1 + 1 / R2   i.e.  R_total = (R1 x R2) / (R1 + R2)
//   U1 = U2 = U                  I1 = U / R1        I2 = U / R2
//   I_total = I1 + I2
//   An open switch removes only its own branch.
//
// POWER (both circuits)   P = U x I   for each bulb
// ---------------------------------------------------------------------
(function () {
  'use strict';

  // ---------- Settings ----------
  const LIMITS = {
    voltage: { min: 1, max: 12, fallback: 12 },
    resistance: { min: 2, max: 50, fallback: 10 }
  };

  // Same brightness scale as Experiment 001, so the two experiments agree.
  const REFERENCE_POWER = 20;
  const GAMMA = 0.6;

  const FILAMENT_OFF = [107, 114, 128];
  const FILAMENT_ON = [255, 236, 170];

  // Animated dots: one dot every FLOW_PERIOD drawing units.
  // Speed grows with current but is capped so it never becomes a blur.
  const FLOW_PERIOD = 16;
  const FLOW_SPEED_BASE = 8;
  const FLOW_SPEED_GAIN = 16;
  const FLOW_SPEED_MAX = 48;
  const IDLE_CURRENT = 1e-9;

  const BRIGHTNESS_LEVELS = [
    { below: 0.5, text: 'Barely glowing' },
    { below: 2, text: 'Dim' },
    { below: 6, text: 'Medium' },
    { below: 20, text: 'Bright' },
    { below: Infinity, text: 'Very bright' }
  ];

  // ---------- Elements ----------
  const byId = (id) => document.getElementById(id);

  const els = {
    svg: byId('sp-circuit'),
    svgTitle: byId('sp-circuit-title'),
    svgDesc: byId('sp-circuit-desc'),
    seriesDiagram: byId('sp-series'),
    parallelDiagram: byId('sp-parallel'),
    configParallel: byId('sp-config-parallel'),
    configSeries: byId('sp-config-series'),
    voltage: byId('sp-voltage'),
    voltageValue: byId('sp-voltage-value'),
    r1: byId('sp-r1'),
    r1Value: byId('sp-r1-value'),
    r2: byId('sp-r2'),
    r2Value: byId('sp-r2-value'),
    totalR: byId('sp-total-r'),
    totalI: byId('sp-total-i'),
    formulaR: byId('sp-formula-r'),
    statusLevel: byId('sp-status-level'),
    statusDetail: byId('sp-status-detail'),
    reset: byId('sp-reset'),
    switches: [byId('sp-switch-1'), byId('sp-switch-2')],
    switchTexts: [byId('sp-switch-1-text'), byId('sp-switch-2-text')],
    // Results table, one entry per bulb
    out: [
      {
        resistance: byId('sp-out-r1'), current: byId('sp-out-i1'), voltage: byId('sp-out-u1'),
        power: byId('sp-out-p1'), brightness: byId('sp-out-b1'), meter: byId('sp-meter-1')
      },
      {
        resistance: byId('sp-out-r2'), current: byId('sp-out-i2'), voltage: byId('sp-out-u2'),
        power: byId('sp-out-p2'), brightness: byId('sp-out-b2'), meter: byId('sp-meter-2')
      }
    ]
  };

  const hasMissing =
    [els.svg, els.svgTitle, els.svgDesc, els.seriesDiagram, els.parallelDiagram,
      els.configParallel, els.configSeries, els.voltage, els.voltageValue,
      els.r1, els.r1Value, els.r2, els.r2Value, els.totalR, els.totalI, els.formulaR,
      els.statusLevel, els.statusDetail, els.reset]
      .concat(els.switches, els.switchTexts)
      .concat(els.out.reduce(function (list, row) {
        return list.concat(Object.keys(row).map(function (key) { return row[key]; }));
      }, []))
      .some(function (element) { return !element; });

  if (hasMissing) {
    console.error('Electricity Lab (Experiment 002): some elements are missing from index.html.');
    return;
  }

  // Look up the drawing parts of one diagram once, so updates are fast.
  function collectDiagramParts(group) {
    const bulbs = [1, 2].map(function (n) {
      return {
        glow: group.querySelector('.sp-glow[data-bulb="' + n + '"]'),
        glass: group.querySelector('.sp-glass[data-bulb="' + n + '"]'),
        filamentLines: group.querySelectorAll('.sp-filament[data-bulb="' + n + '"] line'),
        switchGroup: group.querySelector('.sp-switch[data-switch="' + n + '"]')
      };
    });
    return {
      group: group,
      bulbs: bulbs,
      flows: group.querySelectorAll('.sp-flow'),
      labels: group.querySelectorAll('[data-label]')
    };
  }

  const diagrams = {
    series: collectDiagramParts(els.seriesDiagram),
    parallel: collectDiagramParts(els.parallelDiagram)
  };

  // Switch state lives here (true = switch closed = bulb ON).
  const switchOn = [true, true];

  // ---------- Formatting ----------
  function finiteOrZero(value) {
    return Number.isFinite(value) ? value : 0;
  }

  // 12 -> "12", 4.5 -> "4.5", 6.6667 -> "6.67"
  function trimNumber(value) {
    return String(parseFloat(finiteOrZero(value).toFixed(2)));
  }

  function formatVolts(v) {
    return trimNumber(v) + ' V';
  }

  function formatOhms(r) {
    return trimNumber(r) + ' Ω';
  }

  function formatAmps(i) {
    return finiteOrZero(i).toFixed(2) + ' A';
  }

  function formatWatts(p) {
    return finiteOrZero(p).toFixed(2) + ' W';
  }

  // ---------- Helpers ----------
  function readNumber(input, limits) {
    const value = parseFloat(input.value);
    if (!Number.isFinite(value)) {
      return limits.fallback;
    }
    return Math.min(Math.max(value, limits.min), limits.max);
  }

  function readState() {
    return {
      config: els.configParallel.checked ? 'parallel' : 'series',
      voltage: readNumber(els.voltage, LIMITS.voltage),
      resistances: [readNumber(els.r1, LIMITS.resistance), readNumber(els.r2, LIMITS.resistance)],
      on: [switchOn[0], switchOn[1]]
    };
  }

  function brightnessFromPower(power) {
    const ratio = Math.max(0, power) / REFERENCE_POWER;
    return Math.min(1, Math.pow(ratio, GAMMA));
  }

  function brightnessWord(power) {
    if (!(power > IDLE_CURRENT)) {
      return 'Off';
    }
    for (let i = 0; i < BRIGHTNESS_LEVELS.length; i++) {
      if (power < BRIGHTNESS_LEVELS[i].below) {
        return BRIGHTNESS_LEVELS[i].text;
      }
    }
    return '';
  }

  function mixColor(from, to, t) {
    const channel = (i) => Math.round(from[i] + (to[i] - from[i]) * t);
    return 'rgb(' + channel(0) + ', ' + channel(1) + ', ' + channel(2) + ')';
  }

  function updateSliderFill(input, limits) {
    const value = Number(input.value);
    const percent = ((value - limits.min) / (limits.max - limits.min)) * 100;
    input.style.setProperty('--fill', Math.min(100, Math.max(0, percent)) + '%');
  }

  // Seconds for one dot spacing to pass. More current = faster, but capped.
  function flowDuration(current) {
    const speed = Math.min(FLOW_SPEED_MAX, FLOW_SPEED_BASE + FLOW_SPEED_GAIN * Math.sqrt(current));
    return FLOW_PERIOD / speed;
  }

  // ---------- Physics ----------
  // state: { config, voltage, resistances: [R1, R2], on: [bool, bool] }
  // Returns the total resistance (null = open circuit, no complete path),
  // the total current, and per-bulb current, voltage and power.
  function computeCircuit(state) {
    const U = state.voltage;
    const R = state.resistances;

    const bulbs = [0, 1].map(function (i) {
      return { resistance: R[i], switchedOn: state.on[i], current: 0, voltage: 0, power: 0, brightness: 0 };
    });

    let totalResistance = null;
    let totalCurrent = 0;

    if (state.config === 'series') {
      // One loop: every switch must be closed or the loop is broken.
      if (state.on[0] && state.on[1]) {
        totalResistance = R[0] + R[1];            // R_total = R1 + R2
        totalCurrent = U / totalResistance;        // I_total = U / R_total
        bulbs.forEach(function (bulb) {
          bulb.current = totalCurrent;             // I1 = I2 = I_total
          bulb.voltage = totalCurrent * bulb.resistance; // U_n = I_n x R_n
        });
      }
      // else: open circuit. No current, so no voltage drop across either bulb
      // (the whole supply voltage appears across the open switch instead).
    } else {
      // Two branches, each connected straight across the supply.
      bulbs.forEach(function (bulb) {
        if (bulb.switchedOn) {
          bulb.voltage = U;                        // U1 = U2 = U
          bulb.current = U / bulb.resistance;      // I_n = U / R_n
        }
        // An open branch carries no current, and so has no voltage across its bulb.
      });
      totalCurrent = bulbs[0].current + bulbs[1].current; // I_total = I1 + I2

      if (state.on[0] && state.on[1]) {
        totalResistance = (R[0] * R[1]) / (R[0] + R[1]);  // 1/R = 1/R1 + 1/R2
      } else if (state.on[0]) {
        totalResistance = R[0];                    // only branch 1 is connected
      } else if (state.on[1]) {
        totalResistance = R[1];                    // only branch 2 is connected
      }
      // else: both branches open, no complete path.
    }

    bulbs.forEach(function (bulb) {
      bulb.power = bulb.voltage * bulb.current;    // P = U x I
      bulb.brightness = brightnessFromPower(bulb.power);
    });

    return {
      isClosed: totalResistance !== null,
      totalResistance: totalResistance,
      totalCurrent: totalCurrent,
      bulbs: bulbs
    };
  }

  // ---------- Rendering: controls and results ----------
  function renderControls(state) {
    els.voltageValue.textContent = formatVolts(state.voltage);
    els.r1Value.textContent = formatOhms(state.resistances[0]);
    els.r2Value.textContent = formatOhms(state.resistances[1]);

    updateSliderFill(els.voltage, LIMITS.voltage);
    updateSliderFill(els.r1, LIMITS.resistance);
    updateSliderFill(els.r2, LIMITS.resistance);

    els.voltage.setAttribute('aria-valuetext', trimNumber(state.voltage) + ' volts');
    els.r1.setAttribute('aria-valuetext', trimNumber(state.resistances[0]) + ' ohms');
    els.r2.setAttribute('aria-valuetext', trimNumber(state.resistances[1]) + ' ohms');

    // Switches say ON or OFF in words, not only through colour or position.
    [0, 1].forEach(function (i) {
      els.switches[i].setAttribute('aria-checked', state.on[i] ? 'true' : 'false');
      els.switchTexts[i].textContent = state.on[i] ? 'ON' : 'OFF';
    });

    els.formulaR.textContent = state.config === 'series' ? 'R = R1 + R2' : '1/R = 1/R1 + 1/R2';
  }

  function renderResults(result) {
    els.totalR.textContent = result.isClosed ? formatOhms(result.totalResistance) : 'Open';
    els.totalI.textContent = formatAmps(result.totalCurrent);

    result.bulbs.forEach(function (bulb, i) {
      const row = els.out[i];
      row.resistance.textContent = formatOhms(bulb.resistance);
      row.current.textContent = formatAmps(bulb.current);
      row.voltage.textContent = formatVolts(bulb.voltage);
      row.power.textContent = formatWatts(bulb.power);
      row.brightness.textContent = brightnessWord(bulb.power);
      row.meter.style.width = (bulb.power > IDLE_CURRENT ? bulb.brightness * 100 : 0).toFixed(0) + '%';
    });
  }

  // ---------- Rendering: circuit diagram ----------
  function renderDiagram(state, result) {
    const isSeries = state.config === 'series';
    els.seriesDiagram.classList.toggle('is-hidden', !isSeries);
    els.parallelDiagram.classList.toggle('is-hidden', isSeries);

    const parts = isSeries ? diagrams.series : diagrams.parallel;
    const bulbs = result.bulbs;

    // Text labels inside the drawing
    const labelText = {
      voltage: formatVolts(state.voltage),
      current: (isSeries ? 'I = ' : 'Total I = ') + formatAmps(result.totalCurrent),
      r1: 'R1 = ' + formatOhms(bulbs[0].resistance),
      r2: 'R2 = ' + formatOhms(bulbs[1].resistance),
      u1: 'U1 = ' + formatVolts(bulbs[0].voltage),
      u2: 'U2 = ' + formatVolts(bulbs[1].voltage),
      i1: 'I1 = ' + formatAmps(bulbs[0].current),
      i2: 'I2 = ' + formatAmps(bulbs[1].current)
    };
    parts.labels.forEach(function (label) {
      const text = labelText[label.getAttribute('data-label')];
      if (text !== undefined) {
        label.textContent = text;
      }
    });

    // Bulbs: glow, glass and filament follow the calculated power.
    bulbs.forEach(function (bulb, i) {
      const drawing = parts.bulbs[i];
      const lit = bulb.power > IDLE_CURRENT ? bulb.brightness : 0;

      drawing.glow.style.opacity = String(lit);
      drawing.glass.style.fill = 'rgba(255, 211, 107, ' + (0.08 + 0.5 * lit).toFixed(3) + ')';
      drawing.glass.classList.toggle('is-switched-off', !bulb.switchedOn);
      drawing.filamentLines.forEach(function (line) {
        line.style.stroke = mixColor(FILAMENT_OFF, FILAMENT_ON, lit);
      });

      // An OFF switch is drawn as an open gap in the wire.
      drawing.switchGroup.classList.toggle('is-open', !bulb.switchedOn);
    });

    // Moving dots: each wire segment moves at the speed of ITS OWN current.
    // No current means the segment shows no dots at all.
    const segmentCurrent = isSeries
      ? { loop: result.totalCurrent }
      : { trunk: result.totalCurrent, b1: bulbs[0].current, b2: bulbs[1].current, rail: bulbs[1].current };

    parts.flows.forEach(function (flow) {
      const current = segmentCurrent[flow.getAttribute('data-seg')] || 0;
      const moving = current > IDLE_CURRENT;
      flow.classList.toggle('is-idle', !moving);
      if (moving) {
        flow.style.setProperty('--sp-flow-duration', flowDuration(current).toFixed(2) + 's');
      }
    });

    // Text alternative for screen readers
    els.svgTitle.textContent = isSeries ? 'Series circuit with two bulbs' : 'Parallel circuit with two bulbs';
    els.svgDesc.textContent =
      (isSeries
        ? 'A battery and two bulbs in one loop. '
        : 'A battery with two bulbs on separate branches. ') +
      'Supply ' + formatVolts(state.voltage) + '. ' +
      'Bulb 1 switch is ' + (state.on[0] ? 'closed' : 'open') + '. ' +
      'Bulb 2 switch is ' + (state.on[1] ? 'closed' : 'open') + '. ' +
      'Total current ' + formatAmps(result.totalCurrent) + '.';
  }

  // ---------- Rendering: explanation message ----------
  // Short on purpose: the box must stay readable on a phone.
  function buildStatus(state, result) {
    const U = formatVolts(state.voltage);
    const b1 = result.bulbs[0];
    const b2 = result.bulbs[1];
    const equal = b1.resistance === b2.resistance;

    if (state.config === 'series') {
      if (!result.isClosed) {
        if (!state.on[0] && !state.on[1]) {
          return {
            level: 'Series \u00B7 open, no current',
            detail: 'Both switches are open, so the loop is broken. No current flows. The full ' + U + ' appears across the gaps.'
          };
        }
        const offName = state.on[0] ? 'Bulb 2' : 'Bulb 1';
        const otherName = state.on[0] ? 'Bulb 1' : 'Bulb 2';
        return {
          level: 'Series \u00B7 open, no current',
          detail: offName + ' is switched off, so the only path is broken. No current flows, and ' +
            otherName + ' goes dark too. The full ' + U + ' appears across the gap.'
        };
      }
      let detail = 'The same current, ' + formatAmps(result.totalCurrent) + ', flows through both bulbs. The ' +
        U + ' supply is divided: ' + formatVolts(b1.voltage) + ' across Bulb 1, ' + formatVolts(b2.voltage) + ' across Bulb 2.';
      if (equal) {
        detail += ' Equal resistances share it evenly.';
      } else {
        const bigger = b1.resistance > b2.resistance ? 'Bulb 1' : 'Bulb 2';
        detail += ' ' + bigger + ' has more resistance, takes more voltage and glows brighter.';
      }
      return { level: 'Series \u00B7 closed', detail: detail };
    }

    // Parallel
    if (!result.isClosed) {
      return {
        level: 'Parallel \u00B7 both branches open',
        detail: 'Both branches are open, so no current flows and both bulbs are dark.'
      };
    }
    if (!state.on[0] || !state.on[1]) {
      const offName = state.on[0] ? 'Bulb 2' : 'Bulb 1';
      const onBulb = state.on[0] ? b1 : b2;
      const onName = state.on[0] ? 'Bulb 1' : 'Bulb 2';
      return {
        level: 'Parallel \u00B7 ' + offName + ' branch open',
        detail: offName + "'s branch is open, so it carries no current. " + onName + ' is unaffected: it still gets the full ' +
          U + ' and draws ' + formatAmps(onBulb.current) + '. The battery now supplies only that.'
      };
    }
    let parallelDetail = 'Each branch gets the full ' + U + '. Bulb 1 draws ' + formatAmps(b1.current) +
      ' and Bulb 2 draws ' + formatAmps(b2.current) + '; the battery supplies the sum, ' + formatAmps(result.totalCurrent) + '.';
    if (equal) {
      parallelDetail += ' Equal resistances split the current evenly.';
    } else {
      const smaller = b1.resistance < b2.resistance ? 'Bulb 1' : 'Bulb 2';
      parallelDetail += ' ' + smaller + ' has less resistance, so it draws more current and glows brighter.';
    }
    return { level: 'Parallel \u00B7 both branches closed', detail: parallelDetail };
  }

  // ---------- Main update ----------
  function update() {
    const state = readState();
    const result = computeCircuit(state);
    const status = buildStatus(state, result);

    renderControls(state);
    renderResults(result);
    renderDiagram(state, result);

    els.statusLevel.textContent = status.level;
    els.statusDetail.textContent = status.detail;
  }

  // ---------- Events ----------
  [els.voltage, els.r1, els.r2].forEach(function (slider) {
    slider.addEventListener('input', update);
  });

  [els.configSeries, els.configParallel].forEach(function (radio) {
    radio.addEventListener('change', update);
  });

  els.switches.forEach(function (button, i) {
    button.addEventListener('click', function () {
      switchOn[i] = !switchOn[i];
      update();
    });
  });

  els.reset.addEventListener('click', function () {
    els.configSeries.checked = true;
    els.voltage.value = '12';
    els.r1.value = '10';
    els.r2.value = '10';
    switchOn[0] = true;
    switchOn[1] = true;
    update();
  });

  // ---------- Start ----------
  update();
})();


// ---------------------------------------------------------------------
// 3. Experiment 002: Knowledge check (quiz)
// Answers stay hidden until the visitor picks an option.
// ---------------------------------------------------------------------
(function () {
  'use strict';

  const quiz = document.getElementById('quiz');
  const scoreText = document.getElementById('quiz-score');
  const resetButton = document.getElementById('quiz-reset');

  if (!quiz || !scoreText || !resetButton) {
    return;
  }

  const questions = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-question'));

  function showFeedback(question, isCorrect) {
    const feedback = question.querySelector('.quiz-feedback');
    feedback.textContent = '';

    const heading = document.createElement('strong');
    heading.textContent = isCorrect ? '✓ Correct!' : '✗ Not quite.';
    feedback.appendChild(heading);
    feedback.appendChild(document.createTextNode(question.getAttribute('data-explain')));

    feedback.classList.add('is-shown');
    feedback.classList.toggle('is-wrong', !isCorrect);
  }

  function updateScore() {
    const answered = questions.filter(function (q) { return q.getAttribute('data-answered') === 'true'; });
    if (answered.length < questions.length) {
      return;
    }
    const correct = answered.filter(function (q) { return q.getAttribute('data-result') === 'correct'; }).length;
    scoreText.textContent = 'You got ' + correct + ' of ' + questions.length + ' correct.';
    scoreText.classList.add('is-shown');
    resetButton.hidden = false;
  }

  quiz.addEventListener('click', function (event) {
    const option = event.target.closest('.quiz-option');
    if (!option) {
      return;
    }
    const question = option.closest('.quiz-question');
    if (!question || question.getAttribute('data-answered') === 'true') {
      return;
    }

    const isCorrect = option.getAttribute('data-correct') === 'true';
    question.setAttribute('data-answered', 'true');
    question.setAttribute('data-result', isCorrect ? 'correct' : 'wrong');

    question.querySelectorAll('.quiz-option').forEach(function (button) {
      button.setAttribute('aria-disabled', 'true');
      if (button.getAttribute('data-correct') === 'true') {
        button.classList.add('is-correct');
      }
    });
    if (!isCorrect) {
      option.classList.add('is-wrong');
    }
    option.setAttribute('aria-pressed', 'true');

    showFeedback(question, isCorrect);
    updateScore();
  });

  resetButton.addEventListener('click', function () {
    questions.forEach(function (question) {
      question.removeAttribute('data-answered');
      question.removeAttribute('data-result');
      question.querySelectorAll('.quiz-option').forEach(function (button) {
        button.removeAttribute('aria-disabled');
        button.removeAttribute('aria-pressed');
        button.classList.remove('is-correct', 'is-wrong');
      });
      const feedback = question.querySelector('.quiz-feedback');
      feedback.textContent = '';
      feedback.classList.remove('is-shown', 'is-wrong');
    });
    scoreText.textContent = '';
    scoreText.classList.remove('is-shown');
    resetButton.hidden = true;

    const firstOption = quiz.querySelector('.quiz-option');
    if (firstOption) {
      firstOption.focus();
    }
  });
})();
