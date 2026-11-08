// ===== Electricity Lab: script.js =====
// Experiment 001: Why does a bulb get brighter?
// Model: ideal battery, constant resistance.  I = U / R,  P = U x I = U^2 / R

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
    return r + ' \u03A9';
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