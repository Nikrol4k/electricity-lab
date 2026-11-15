// ===== Electricity Lab: script.js =====
// This file holds four independent blocks. Each one is wrapped in its own
// function, so they do not share variables and cannot interfere with each other:
//   0. Language system (RU / EN): translations, t(), the header switcher
//   1. Experiment 001: Why does a bulb get brighter?
//   2. Experiment 002: Series vs. parallel circuits
//   3. Experiment 002: Knowledge check (quiz)
//
// HOW TRANSLATIONS WORK
//   - Static text in index.html carries a data-i18n="key" attribute
//     (data-i18n-html="key" when the text contains <strong>/<em>, and
//     data-i18n-attr="attribute:key" for attributes such as aria-label).
//   - Text built by JavaScript uses t('key', { name: value }).
//   - Blocks 1-3 register a function with I18N.onChange(), which redraws their
//     dynamic text when the language changes. Experiment state is not touched.
//   - To add or change a sentence, edit it in BOTH `en` and `ru` below.

// ---------------------------------------------------------------------
// 0. Language system
// ---------------------------------------------------------------------
const I18N = (function () {
  'use strict';

  const STORAGE_KEY = 'electricity-lab-lang';
  const DEFAULT_LANG = 'ru';

  const translations = {
    en: {
      // ----- Page, header, hero -----
      meta_title: `Electricity Lab: Learn by experimenting`,
      meta_desc: `Electricity Lab: interactive physics experiments. Change voltage and resistance, compare series and parallel circuits, and see what happens to current, power and light.`,
      skip: `Skip to content`,
      nav_aria: `Main`,
      lang_group: `Language`,
      nav_exp1: `Exp. 001`,
      nav_exp2: `Exp. 002`,
      nav_learn: `Learn`,
      nav_next: `Next`,
      hero_eyebrow: `Interactive physics`,
      hero_title: `Learn by experimenting.`,
      hero_lead: `Electricity Lab turns short physics videos into hands-on experiments. Change the voltage, change the resistance, and watch what happens to current, power and light.`,
      hero_btn1: `Start Experiment 001`,
      hero_btn2: `Try Experiment 002`,
      footer_text: `Learn by experimenting. Simulations are idealized models for learning, not exact copies of real devices.`,

      // ----- Units and shared words -----
      unit_v: `V`,
      unit_a: `A`,
      unit_w: `W`,
      unit_ohm: `Ω`,
      vt_v: `{n} volts`,
      vt_r: `{n} ohms`,
      the_science: `The science`,
      bulb1: `Bulb 1`,
      bulb2: `Bulb 2`,
      k_resistance: `Resistance`,
      k_current: `Current`,
      k_voltage: `Voltage`,
      k_power: `Power`,
      k_brightness: `Brightness`,
      total_resistance: `Total resistance`,
      total_current: `Total current`,
      scale_v_min: `1 V`,
      scale_v_max: `12 V`,
      scale_r_min: `2 Ω`,
      scale_r_max: `50 Ω`,

      // ----- Experiment 001 -----
      exp_label_001: `Experiment 001`,
      e1_title: `Why does a bulb get brighter?`,
      e1_intro: `A battery, a resistor and a bulb in one loop. Drag the sliders and watch the current and the bulb respond.`,
      e1_svg_title: `Series circuit diagram`,
      e1_svg_desc: `A battery, a resistor and a light bulb connected in a single loop. Moving dots show the direction of conventional current.`,
      svg_battery: `Battery`,
      svg_resistor: `Resistor`,
      svg_bulb: `Bulb`,
      e1_caption: `Moving dots show the direction of conventional current. Faster dots mean more current.`,
      lbl_voltage: `Voltage (U)`,
      lbl_resistance: `Resistance (R)`,
      presets_title: `Try these settings:`,
      preset_6_10: `6 V, 10 Ω`,
      preset_12_10: `12 V, 10 Ω`,
      preset_12_26: `12 V, 26 Ω`,
      e1_level_0: `The bulb is barely glowing.`,
      e1_level_1: `The bulb is dim.`,
      e1_level_2: `The bulb glows at a moderate level.`,
      e1_level_3: `The bulb is bright.`,
      e1_level_4: `The bulb is very bright.`,
      e1_detail_v_up: `Voltage increased to {u}. With the resistance fixed at {r}, current is {i} and power {p}. A higher voltage pushes more current through the same resistance, so the bulb gets brighter.`,
      e1_detail_v_down: `Voltage decreased to {u}. With the resistance fixed at {r}, current is {i} and power {p}. A lower voltage pushes less current through the same resistance, so the bulb gets dimmer.`,
      e1_detail_r_up: `Resistance increased to {r}. With the voltage fixed at {u}, current is {i} and power {p}. A higher resistance lets less current flow, so the bulb gets dimmer.`,
      e1_detail_r_down: `Resistance decreased to {r}. With the voltage fixed at {u}, current is {i} and power {p}. A lower resistance lets more current flow, so the bulb gets brighter.`,
      e1_detail_preset: `Setting applied: {u} across {r}. Current is {i} and power {p}.`,
      e1_detail_init: `Drag a slider to see how the circuit responds. Right now {u} across {r} gives current {i} and power {p}.`,
      e1_invalid_level: `Invalid values.`,
      e1_invalid_detail: `Please choose a voltage and a resistance greater than zero.`,

      // ----- "What is happening?" section -----
      learn_title: `What is happening?`,
      learn_h_quantities: `Four quantities`,
      learn_q_voltage: `<strong>Voltage (U, volts):</strong> the electrical "push" the battery gives to charge.`,
      learn_q_resistance: `<strong>Resistance (R, ohms):</strong> how strongly a component opposes the flow of current.`,
      learn_q_current: `<strong>Current (I, amperes):</strong> how much charge flows past a point each second.`,
      learn_q_power: `<strong>Power (P, watts):</strong> how fast electrical energy is converted into heat and light.`,
      learn_h_formulas: `Three formulas`,
      learn_f_ohm: `Ohm's law`,
      learn_f_power: `electrical power`,
      learn_f_power2: `the same power, written with U and R only`,
      learn_h_example: `A worked example`,
      learn_ex1: `At 6 V across 10 Ω, the current is 0.60 A and the power is 3.60 W. Raise the voltage to 12 V with the same resistance: the current doubles to 1.20 A, but the power becomes 14.40 W, which is four times larger. Power depends on the <em>square</em> of the voltage, so a small voltage change makes a big difference to brightness.`,
      learn_ex2: `Now keep 12 V and raise the resistance to 26 Ω. The current drops to about 0.46 A and the power to about 5.54 W, so the bulb dims.`,
      note1_title: `Limits of this simulation`,
      note1_a: `<strong>Constant resistance.</strong> Here, R stays fixed at the value you choose. A real incandescent bulb has a filament whose resistance rises sharply as it heats up, so a real bulb does not follow I = U ÷ R with one fixed number. A cold filament has much lower resistance than a hot one.`,
      note1_b: `<strong>Ideal parts.</strong> The battery gives a perfectly steady voltage and the wires have no resistance. Real batteries and wires are not perfect.`,
      note1_c: `<strong>Schematic brightness.</strong> The glow on screen is a visual guide to the calculated power. It is not a calibrated measurement of light output. Most of an incandescent bulb's power becomes heat, not light.`,

      // ----- Experiment 002 -----
      exp_label_002: `Experiment 002`,
      e2_title: `Series vs. parallel circuits`,
      e2_intro: `Two bulbs, one battery. Switch between a series and a parallel circuit, change the voltage and the bulb resistances, and switch a bulb off to see what happens to the other one.`,
      e2_caption: `Dots and arrows show conventional current, from the + plate around the circuit to the − plate. Faster dots mean more current. No dots means no current.`,
      sp_legend: `Circuit type`,
      cfg_series: `Series`,
      cfg_parallel: `Parallel`,
      lbl_supply: `Supply voltage (U)`,
      lbl_r1: `Bulb 1 resistance (R1)`,
      lbl_r2: `Bulb 2 resistance (R2)`,
      sw_name1: `Bulb 1 switch`,
      sw_name2: `Bulb 2 switch`,
      sw_on: `ON`,
      sw_off: `OFF`,
      sw_closed: `closed`,
      sw_open: `open`,
      sp_open_label: `OPEN`,
      sp_open: `Open`,
      sp_total_i: `Total I`,
      tbl_caption: `Results for each bulb`,
      tbl_quantity: `Quantity`,
      btn_reset: `Reset to defaults`,
      br_off: `Off`,
      br_0: `Barely glowing`,
      br_1: `Dim`,
      br_2: `Medium`,
      br_3: `Bright`,
      br_4: `Very bright`,
      sp_title_series: `Series circuit with two bulbs`,
      sp_title_parallel: `Parallel circuit with two bulbs`,
      sp_desc_series: `A battery and two bulbs in one loop.`,
      sp_desc_parallel: `A battery with two bulbs on separate branches.`,
      sp_desc_state: `Supply {u}. Bulb 1 switch is {s1}. Bulb 2 switch is {s2}. Total current {i}.`,
      sp_lvl_series_open: `Series · open, no current`,
      sp_lvl_series_closed: `Series · closed`,
      sp_lvl_par_open: `Parallel · both branches open`,
      sp_lvl_par_open_b1: `Parallel · Bulb 1 branch open`,
      sp_lvl_par_open_b2: `Parallel · Bulb 2 branch open`,
      sp_lvl_par_closed: `Parallel · both branches closed`,
      sp_series_open_both: `Both switches are open, so the loop is broken. No current flows. The full {u} appears across the gaps.`,
      sp_series_open_b1: `Bulb 1 is switched off, so the only path is broken. No current flows, and Bulb 2 goes dark too. The full {u} appears across the gap.`,
      sp_series_open_b2: `Bulb 2 is switched off, so the only path is broken. No current flows, and Bulb 1 goes dark too. The full {u} appears across the gap.`,
      sp_series_closed: `The same current, {i}, flows through both bulbs. The {u} supply is divided: {u1} across Bulb 1, {u2} across Bulb 2.`,
      sp_series_equal: `Equal resistances share it evenly.`,
      sp_series_more_b1: `Bulb 1 has more resistance, takes more voltage and glows brighter.`,
      sp_series_more_b2: `Bulb 2 has more resistance, takes more voltage and glows brighter.`,
      sp_par_open_both: `Both branches are open, so no current flows and both bulbs are dark.`,
      sp_par_open_b1: `Bulb 1's branch is open, so it carries no current. Bulb 2 is unaffected: it still gets the full {u} and draws {i}. The battery now supplies only that.`,
      sp_par_open_b2: `Bulb 2's branch is open, so it carries no current. Bulb 1 is unaffected: it still gets the full {u} and draws {i}. The battery now supplies only that.`,
      sp_par_closed: `Each branch gets the full {u}. Bulb 1 draws {i1} and Bulb 2 draws {i2}; the battery supplies the sum, {it}.`,
      sp_par_equal: `Equal resistances split the current evenly.`,
      sp_par_less_b1: `Bulb 1 has less resistance, so it draws more current and glows brighter.`,
      sp_par_less_b2: `Bulb 2 has less resistance, so it draws more current and glows brighter.`,
      note2_title: `About this model`,
      note2_a: `<strong>Constant resistance.</strong> Each bulb is treated as an ideal resistive load with a fixed resistance. A real incandescent filament changes resistance as it heats up (it is much lower when cold), so real bulbs only roughly follow these numbers. The simplification is fine for learning how series and parallel circuits behave.`,
      note2_b: `<strong>Ideal battery and wires.</strong> The supply holds exactly the voltage you choose, and the wires have no resistance.`,
      note2_c: `<strong>Conventional current.</strong> Arrows and dots show conventional current: the direction positive charge would move, from the + plate around the circuit to the − plate. In metal wires the moving charges are actually electrons, which drift the opposite way.`,
      note2_d: `<strong>Schematic brightness.</strong> The glow is a visual guide to the calculated power, not a measurement of light output.`,

      // ----- "What's the difference?" section -----
      diff_title: `What's the difference?`,
      diff_series_h: `Series circuit`,
      diff_series_p: `Components share one path. The same current flows through every component, while the supply voltage is divided between them.`,
      diff_parallel_h: `Parallel circuit`,
      diff_parallel_p: `Components have separate paths. Each branch receives the same supply voltage, while the total current is divided between branches.`,
      cmp_caption: `Series and parallel circuits compared`,
      cmp_property: `Property`,
      cmp_series_short: `Series`,
      cmp_parallel_short: `Parallel`,
      cmp_cur_s: `The same through every bulb: I = I1 = I2`,
      cmp_cur_p: `Divides between branches: I = I1 + I2`,
      cmp_vol_s: `Divided between the bulbs: U = U1 + U2`,
      cmp_vol_p: `The same across every branch: U = U1 = U2`,
      cmp_res_s: `Adds up: R = R1 + R2, larger than either bulb alone`,
      cmp_res_p: `1/R = 1/R1 + 1/R2, smaller than either bulb alone`,
      cmp_fail: `If one bulb fails`,
      cmp_fail_s: `The whole circuit stops. Both bulbs go out.`,
      cmp_fail_p: `The other bulb keeps working.`,

      // ----- Quiz -----
      quiz_title: `Quick knowledge check`,
      quiz_intro: `Pick an answer to see whether it is right.`,
      quiz_q1: `1. In a series circuit, what happens to the current?`,
      quiz_q1_a: `It divides between the bulbs.`,
      quiz_q1_b: `It is the same through every component.`,
      quiz_q1_c: `The first bulb uses up some of it, so less reaches the second.`,
      quiz_q1_explain: `In a series circuit there is only one path, and charge cannot pile up or disappear along it. So the current is the same at every point. Components do not use up current. They transfer energy, and the voltage is what gets divided.`,
      quiz_q2: `2. In a parallel circuit, what happens to the voltage across each branch?`,
      quiz_q2_a: `Each branch gets the full supply voltage.`,
      quiz_q2_b: `The supply voltage is divided between the branches.`,
      quiz_q2_c: `The branch with the larger resistance gets more voltage.`,
      quiz_q2_explain: `Each branch of a parallel circuit is connected directly across the supply, so every branch gets the full supply voltage. It is the current that divides between the branches.`,
      quiz_q3: `3. In a parallel circuit, one branch is disconnected. What happens to the bulb on the other branch?`,
      quiz_q3_a: `It goes out as well.`,
      quiz_q3_b: `It glows dimmer, because less current is available.`,
      quiz_q3_c: `It keeps working normally.`,
      quiz_q3_explain: `The second bulb's branch still forms a complete loop with the battery and is still connected across the same supply voltage. So it gets the same voltage and the same current as before. (This assumes an ideal battery.)`,
      quiz_correct: `✓ Correct!`,
      quiz_wrong: `✗ Not quite.`,
      quiz_mark_correct: `Correct answer`,
      quiz_mark_wrong: `Your answer`,
      quiz_score: `You got {n} of {m} correct.`,
      quiz_reset: `Try the quiz again`,

      // ----- Roadmap -----
      roadmap_eyebrow: `Coming next`,
      roadmap_title: `More experiments`,
      exp_label_003: `Experiment 003`,
      exp_label_004: `Experiment 004`,
      exp_label_005: `Experiment 005`,
      exp_label_006: `Experiment 006`,
      rm_002_title: `Series vs. Parallel Circuits`,
      rm_002_desc: `Switch between configurations and compare current and voltage.`,
      rm_003_title: `Ohm's Law`,
      rm_003_desc: `Explore how voltage, current and resistance relate.`,
      rm_004_title: `Electrical Power`,
      rm_004_desc: `See how voltage and resistance change power consumption.`,
      rm_005_title: `Capacitor Charging`,
      rm_005_desc: `Watch a capacitor charge and discharge over time.`,
      rm_006_title: `Magnetic Fields`,
      rm_006_desc: `Explore how electric current creates a magnetic field.`,
      badge_live: `Available now →`,
      badge_soon: `Coming soon`
    },

    ru: {
      // ----- Page, header, hero -----
      meta_title: `Electricity Lab: учись, экспериментируя`,
      meta_desc: `Electricity Lab: интерактивные эксперименты по физике. Меняйте напряжение и сопротивление, сравнивайте последовательное и параллельное соединение и смотрите, что происходит с током, мощностью и светом.`,
      skip: `Перейти к содержимому`,
      nav_aria: `Основная навигация`,
      lang_group: `Язык`,
      nav_exp1: `Опыт 001`,
      nav_exp2: `Опыт 002`,
      nav_learn: `Теория`,
      nav_next: `Далее`,
      hero_eyebrow: `Интерактивная физика`,
      hero_title: `Учись, экспериментируя.`,
      hero_lead: `Electricity Lab превращает короткие физические ролики в практические эксперименты. Меняйте напряжение и сопротивление и смотрите, что происходит с током, мощностью и светом.`,
      hero_btn1: `Начать эксперимент 001`,
      hero_btn2: `Попробовать эксперимент 002`,
      footer_text: `Учись, экспериментируя. Симуляции — это упрощённые модели для обучения, а не точные копии реальных устройств.`,

      // ----- Units and shared words -----
      unit_v: `В`,
      unit_a: `А`,
      unit_w: `Вт`,
      unit_ohm: `Ом`,
      vt_v: `{n} В`,
      vt_r: `{n} Ом`,
      the_science: `Наука`,
      bulb1: `Лампа 1`,
      bulb2: `Лампа 2`,
      k_resistance: `Сопротивление`,
      k_current: `Сила тока`,
      k_voltage: `Напряжение`,
      k_power: `Мощность`,
      k_brightness: `Яркость`,
      total_resistance: `Общее сопротивление`,
      total_current: `Общая сила тока`,
      scale_v_min: `1 В`,
      scale_v_max: `12 В`,
      scale_r_min: `2 Ом`,
      scale_r_max: `50 Ом`,

      // ----- Experiment 001 -----
      exp_label_001: `Эксперимент 001`,
      e1_title: `Почему лампочка светит ярче?`,
      e1_intro: `Батарея, резистор и лампочка в одной цепи. Двигайте ползунки и смотрите, как реагируют ток и лампочка.`,
      e1_svg_title: `Схема последовательной цепи`,
      e1_svg_desc: `Батарея, резистор и лампочка, соединённые в одну замкнутую цепь. Движущиеся точки показывают условное направление тока.`,
      svg_battery: `Батарея`,
      svg_resistor: `Резистор`,
      svg_bulb: `Лампа`,
      e1_caption: `Движущиеся точки показывают условное направление тока. Чем быстрее точки, тем больше ток.`,
      lbl_voltage: `Напряжение (U)`,
      lbl_resistance: `Сопротивление (R)`,
      presets_title: `Попробуйте такие значения:`,
      preset_6_10: `6 В, 10 Ом`,
      preset_12_10: `12 В, 10 Ом`,
      preset_12_26: `12 В, 26 Ом`,
      e1_level_0: `Лампа едва светится.`,
      e1_level_1: `Лампа светит тускло.`,
      e1_level_2: `Лампа светит умеренно.`,
      e1_level_3: `Лампа светит ярко.`,
      e1_level_4: `Лампа светит очень ярко.`,
      e1_detail_v_up: `Напряжение выросло до {u}. При неизменном сопротивлении {r} сила тока равна {i}, мощность — {p}. Большее напряжение проталкивает через то же сопротивление больший ток, поэтому лампа светит ярче.`,
      e1_detail_v_down: `Напряжение снизилось до {u}. При неизменном сопротивлении {r} сила тока равна {i}, мощность — {p}. Меньшее напряжение проталкивает через то же сопротивление меньший ток, поэтому лампа светит тусклее.`,
      e1_detail_r_up: `Сопротивление выросло до {r}. При неизменном напряжении {u} сила тока равна {i}, мощность — {p}. Большее сопротивление пропускает меньший ток, поэтому лампа светит тусклее.`,
      e1_detail_r_down: `Сопротивление снизилось до {r}. При неизменном напряжении {u} сила тока равна {i}, мощность — {p}. Меньшее сопротивление пропускает больший ток, поэтому лампа светит ярче.`,
      e1_detail_preset: `Заданы значения: {u} на {r}. Сила тока — {i}, мощность — {p}.`,
      e1_detail_init: `Двигайте ползунки, чтобы увидеть, как реагирует цепь. Сейчас {u} на {r} дают силу тока {i} и мощность {p}.`,
      e1_invalid_level: `Недопустимые значения.`,
      e1_invalid_detail: `Выберите напряжение и сопротивление больше нуля.`,

      // ----- "What is happening?" section -----
      learn_title: `Что происходит?`,
      learn_h_quantities: `Четыре величины`,
      learn_q_voltage: `<strong>Напряжение (U, вольты):</strong> «толчок», который батарея даёт электрическому заряду.`,
      learn_q_resistance: `<strong>Сопротивление (R, омы):</strong> насколько сильно элемент препятствует току.`,
      learn_q_current: `<strong>Сила тока (I, амперы):</strong> какой заряд проходит через точку цепи за секунду.`,
      learn_q_power: `<strong>Мощность (P, ватты):</strong> как быстро электрическая энергия превращается в тепло и свет.`,
      learn_h_formulas: `Три формулы`,
      learn_f_ohm: `закон Ома`,
      learn_f_power: `электрическая мощность`,
      learn_f_power2: `та же мощность, выраженная только через U и R`,
      learn_h_example: `Пример расчёта`,
      learn_ex1: `При 6 В на 10 Ом сила тока равна 0,60 А, а мощность — 3,60 Вт. Поднимем напряжение до 12 В при том же сопротивлении: ток удвоится до 1,20 А, а мощность станет 14,40 Вт — в четыре раза больше. Мощность зависит от <em>квадрата</em> напряжения, поэтому небольшое изменение напряжения сильно меняет яркость.`,
      learn_ex2: `Теперь оставим 12 В и увеличим сопротивление до 26 Ом. Ток упадёт примерно до 0,46 А, а мощность — примерно до 5,54 Вт, и лампочка потускнеет.`,
      note1_title: `Ограничения этой модели`,
      note1_a: `<strong>Постоянное сопротивление.</strong> Здесь R остаётся равным выбранному значению. У настоящей лампы накаливания сопротивление нити сильно растёт при нагреве, поэтому реальная лампа не подчиняется формуле I = U ÷ R с одним фиксированным R. У холодной нити сопротивление намного меньше, чем у раскалённой.`,
      note1_b: `<strong>Идеальные элементы.</strong> Батарея даёт строго постоянное напряжение, а у проводов нет сопротивления. Реальные батареи и провода так не работают.`,
      note1_c: `<strong>Схематичная яркость.</strong> Свечение на экране — наглядная подсказка о рассчитанной мощности, а не точное измерение светового потока. Большая часть мощности лампы накаливания уходит в тепло, а не в свет.`,

      // ----- Experiment 002 -----
      exp_label_002: `Эксперимент 002`,
      e2_title: `Последовательное и параллельное соединение`,
      e2_intro: `Две лампы, одна батарея. Переключайтесь между последовательным и параллельным соединением, меняйте напряжение и сопротивление ламп и выключайте одну из них, чтобы увидеть, что случится с другой.`,
      e2_caption: `Точки и стрелки показывают условное направление тока: от пластины «+» по цепи к пластине «−». Чем быстрее точки, тем больше ток. Нет точек — нет тока.`,
      sp_legend: `Тип соединения`,
      cfg_series: `Последовательное`,
      cfg_parallel: `Параллельное`,
      lbl_supply: `Напряжение источника (U)`,
      lbl_r1: `Сопротивление лампы 1 (R1)`,
      lbl_r2: `Сопротивление лампы 2 (R2)`,
      sw_name1: `Выключатель лампы 1`,
      sw_name2: `Выключатель лампы 2`,
      sw_on: `ВКЛ`,
      sw_off: `ВЫКЛ`,
      sw_closed: `замкнут`,
      sw_open: `разомкнут`,
      sp_open_label: `ВЫКЛ`,
      sp_open: `Обрыв`,
      sp_total_i: `I общ`,
      tbl_caption: `Результаты для каждой лампы`,
      tbl_quantity: `Величина`,
      btn_reset: `Сбросить значения`,
      br_off: `Не светит`,
      br_0: `Едва светит`,
      br_1: `Тускло`,
      br_2: `Средне`,
      br_3: `Ярко`,
      br_4: `Очень ярко`,
      sp_title_series: `Последовательная цепь с двумя лампами`,
      sp_title_parallel: `Параллельная цепь с двумя лампами`,
      sp_desc_series: `Батарея и две лампы в одной замкнутой цепи.`,
      sp_desc_parallel: `Батарея и две лампы на отдельных ветвях.`,
      sp_desc_state: `Напряжение источника {u}. Выключатель лампы 1 {s1}. Выключатель лампы 2 {s2}. Общая сила тока {i}.`,
      sp_lvl_series_open: `Последовательно · разомкнуто, тока нет`,
      sp_lvl_series_closed: `Последовательно · замкнуто`,
      sp_lvl_par_open: `Параллельно · обе ветви разомкнуты`,
      sp_lvl_par_open_b1: `Параллельно · ветвь 1 разомкнута`,
      sp_lvl_par_open_b2: `Параллельно · ветвь 2 разомкнута`,
      sp_lvl_par_closed: `Параллельно · обе ветви замкнуты`,
      sp_series_open_both: `Оба выключателя разомкнуты — цепь разорвана. Тока нет. Всё напряжение {u} приложено к разрывам.`,
      sp_series_open_b1: `Лампа 1 выключена — единственный путь разорван. Тока нет, лампа 2 тоже погасла. Всё напряжение {u} приложено к разрыву.`,
      sp_series_open_b2: `Лампа 2 выключена — единственный путь разорван. Тока нет, лампа 1 тоже погасла. Всё напряжение {u} приложено к разрыву.`,
      sp_series_closed: `Через обе лампы идёт один ток — {i}. Напряжение {u} делится: {u1} на лампе 1, {u2} на лампе 2.`,
      sp_series_equal: `Равные сопротивления делят напряжение поровну.`,
      sp_series_more_b1: `Сопротивление лампы 1 больше — ей достаётся больше напряжения, и она ярче.`,
      sp_series_more_b2: `Сопротивление лампы 2 больше — ей достаётся больше напряжения, и она ярче.`,
      sp_par_open_both: `Обе ветви разомкнуты, тока нет, обе лампы не светятся.`,
      sp_par_open_b1: `Ветвь лампы 1 разомкнута — тока в ней нет. Лампа 2 не затронута: на ней по-прежнему {u} и ток {i}. Источник теперь отдаёт только его.`,
      sp_par_open_b2: `Ветвь лампы 2 разомкнута — тока в ней нет. Лампа 1 не затронута: на ней по-прежнему {u} и ток {i}. Источник теперь отдаёт только его.`,
      sp_par_closed: `На каждой ветви полное напряжение {u}. Лампа 1 берёт {i1}, лампа 2 — {i2}; источник даёт сумму: {it}.`,
      sp_par_equal: `Равные сопротивления делят ток поровну.`,
      sp_par_less_b1: `Сопротивление лампы 1 меньше — ток в ней больше, и она ярче.`,
      sp_par_less_b2: `Сопротивление лампы 2 меньше — ток в ней больше, и она ярче.`,
      note2_title: `О модели`,
      note2_a: `<strong>Постоянное сопротивление.</strong> Каждая лампа считается идеальной нагрузкой с неизменным сопротивлением. У настоящей нити накаливания сопротивление меняется с нагревом (у холодной оно намного меньше), поэтому реальные лампы лишь приблизительно следуют этим расчётам. Для понимания последовательного и параллельного соединений такого упрощения достаточно.`,
      note2_b: `<strong>Идеальная батарея и провода.</strong> Источник держит ровно то напряжение, которое вы выбрали, а у проводов нет сопротивления.`,
      note2_c: `<strong>Условное направление тока.</strong> Стрелки и точки показывают условное направление тока — туда, куда двигались бы положительные заряды: от пластины «+» по цепи к пластине «−». В металлических проводах движутся электроны, и они дрейфуют в обратную сторону.`,
      note2_d: `<strong>Схематичная яркость.</strong> Свечение — наглядная подсказка о рассчитанной мощности, а не измерение светового потока.`,

      // ----- "What's the difference?" section -----
      diff_title: `В чём разница?`,
      diff_series_h: `Последовательная цепь`,
      diff_series_p: `Элементы соединены одним путём. Через каждый элемент течёт один и тот же ток, а напряжение источника делится между ними.`,
      diff_parallel_h: `Параллельная цепь`,
      diff_parallel_p: `У элементов отдельные пути. На каждой ветви одно и то же напряжение источника, а общий ток делится между ветвями.`,
      cmp_caption: `Сравнение последовательной и параллельной цепей`,
      cmp_property: `Свойство`,
      cmp_series_short: `Последовательно`,
      cmp_parallel_short: `Параллельно`,
      cmp_cur_s: `Одинаковая во всех лампах: I = I1 = I2`,
      cmp_cur_p: `Делится между ветвями: I = I1 + I2`,
      cmp_vol_s: `Делится между лампами: U = U1 + U2`,
      cmp_vol_p: `Одинаковое на каждой ветви: U = U1 = U2`,
      cmp_res_s: `Складывается: R = R1 + R2, больше, чем у любой лампы по отдельности`,
      cmp_res_p: `1/R = 1/R1 + 1/R2, меньше, чем у любой лампы по отдельности`,
      cmp_fail: `Если одна лампа перегорела`,
      cmp_fail_s: `Вся цепь перестаёт работать. Гаснут обе лампы.`,
      cmp_fail_p: `Вторая лампа продолжает работать.`,

      // ----- Quiz -----
      quiz_title: `Быстрая проверка знаний`,
      quiz_intro: `Выберите ответ, чтобы узнать, верен ли он.`,
      quiz_q1: `1. Что происходит с током в последовательной цепи?`,
      quiz_q1_a: `Он делится между лампами.`,
      quiz_q1_b: `Он одинаков во всех элементах.`,
      quiz_q1_c: `Первая лампа «расходует» часть тока, и до второй доходит меньше.`,
      quiz_q1_explain: `В последовательной цепи только один путь, а заряд не может накапливаться или исчезать по дороге. Поэтому ток одинаков в любой точке. Элементы не «расходуют» ток — они передают энергию, а делится именно напряжение.`,
      quiz_q2: `2. Что происходит с напряжением на каждой ветви параллельной цепи?`,
      quiz_q2_a: `На каждой ветви полное напряжение источника.`,
      quiz_q2_b: `Напряжение источника делится между ветвями.`,
      quiz_q2_c: `Больше напряжения на ветви с большим сопротивлением.`,
      quiz_q2_explain: `Каждая ветвь параллельной цепи подключена прямо к источнику, поэтому на каждой ветви полное напряжение источника. Между ветвями делится именно ток.`,
      quiz_q3: `3. В параллельной цепи одну ветвь отключили. Что станет с лампой на другой ветви?`,
      quiz_q3_a: `Она тоже погаснет.`,
      quiz_q3_b: `Она станет светить тусклее, потому что тока стало меньше.`,
      quiz_q3_c: `Она продолжит работать как прежде.`,
      quiz_q3_explain: `Ветвь второй лампы по-прежнему образует замкнутую цепь с батареей и подключена к тому же напряжению. Поэтому напряжение и ток на ней остаются прежними. (Предполагается идеальная батарея.)`,
      quiz_correct: `✓ Верно!`,
      quiz_wrong: `✗ Не совсем.`,
      quiz_mark_correct: `Правильный ответ`,
      quiz_mark_wrong: `Ваш ответ`,
      quiz_score: `Верных ответов: {n} из {m}.`,
      quiz_reset: `Пройти квиз заново`,

      // ----- Roadmap -----
      roadmap_eyebrow: `Далее`,
      roadmap_title: `Другие эксперименты`,
      exp_label_003: `Эксперимент 003`,
      exp_label_004: `Эксперимент 004`,
      exp_label_005: `Эксперимент 005`,
      exp_label_006: `Эксперимент 006`,
      rm_002_title: `Последовательное и параллельное соединение`,
      rm_002_desc: `Переключайтесь между схемами и сравнивайте ток и напряжение.`,
      rm_003_title: `Закон Ома`,
      rm_003_desc: `Узнайте, как связаны напряжение, сила тока и сопротивление.`,
      rm_004_title: `Электрическая мощность`,
      rm_004_desc: `Посмотрите, как напряжение и сопротивление меняют потребляемую мощность.`,
      rm_005_title: `Зарядка конденсатора`,
      rm_005_desc: `Наблюдайте, как конденсатор заряжается и разряжается со временем.`,
      rm_006_title: `Магнитные поля`,
      rm_006_desc: `Узнайте, как электрический ток создаёт магнитное поле.`,
      badge_live: `Уже доступно →`,
      badge_soon: `Скоро`
    }
  };

  let lang = DEFAULT_LANG;
  const listeners = [];

  // localStorage can be missing or blocked (private mode, strict settings).
  // Every access is wrapped, and the site simply falls back to Russian.
  function readSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === 'ru' || saved === 'en' ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function saveLanguage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Not saved: the choice still works until the page is closed.
    }
  }

  // t('key') or t('key', { name: value }) replaces {name} placeholders.
  function t(key, params) {
    let text = translations[lang][key];
    if (text === undefined) {
      text = translations.en[key];
    }
    if (text === undefined) {
      console.warn('Electricity Lab: missing translation key "' + key + '"');
      return key;
    }
    if (params) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return params[name] !== undefined ? params[name] : match;
      });
    }
    return text;
  }

  // Russian writes decimals with a comma: 0.60 -> 0,60. English is unchanged.
  function num(text) {
    return lang === 'ru' ? String(text).replace('.', ',') : String(text);
  }

  function applyStaticText() {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = t(element.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (element) {
      element.innerHTML = t(element.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (element) {
      element.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        const separator = pair.indexOf(':');
        if (separator > 0) {
          element.setAttribute(pair.slice(0, separator).trim(), t(pair.slice(separator + 1).trim()));
        }
      });
    });
    document.querySelectorAll('.lang-btn').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }

  function setLanguage(next) {
    if (next !== 'ru' && next !== 'en') {
      return;
    }
    lang = next;
    saveLanguage(next);
    applyStaticText();
    listeners.forEach(function (listener) { listener(); });
  }

  // Register a function that redraws dynamic text after a language change.
  function onChange(listener) {
    listeners.push(listener);
  }

  // Start: saved language if there is one, otherwise Russian.
  lang = readSavedLanguage() || DEFAULT_LANG;
  applyStaticText();

  document.querySelectorAll('.lang-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.getAttribute('data-lang'));
    });
  });

  return {
    t: t,
    num: num,
    onChange: onChange,
    getLanguage: function () { return lang; }
  };
})();


// ---------------------------------------------------------------------
// 1. Experiment 001: Why does a bulb get brighter?
// Model: ideal battery, constant resistance.  I = U / R,  P = U x I = U^2 / R
// ---------------------------------------------------------------------
(function () {
  'use strict';

  const t = I18N.t;
  const num = I18N.num;

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

  // Each level points to a translation key (e1_level_N).
  const POWER_LEVELS = [
    { below: 0.5, key: 'e1_level_0' },
    { below: 2, key: 'e1_level_1' },
    { below: 6, key: 'e1_level_2' },
    { below: 20, key: 'e1_level_3' },
    { below: Infinity, key: 'e1_level_4' }
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

  // Key of the explanation currently shown. Kept so that the SAME message can
  // be shown again in the other language without touching the experiment.
  const view = { detailKey: 'e1_detail_init' };

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
    return num(Number.isInteger(v) ? String(v) : v.toFixed(1)) + ' ' + t('unit_v');
  }

  function formatResistance(r) {
    return r + ' ' + t('unit_ohm');
  }

  function formatCurrent(i) {
    return num(i.toFixed(2)) + ' ' + t('unit_a');
  }

  function formatPower(p) {
    return num(p.toFixed(2)) + ' ' + t('unit_w');
  }

  function brightnessFromPower(power) {
    const ratio = Math.max(0, power) / REFERENCE_POWER;
    return Math.min(1, Math.pow(ratio, GAMMA));
  }

  function mixColor(from, to, amount) {
    const channel = (i) => Math.round(from[i] + (to[i] - from[i]) * amount);
    return 'rgb(' + channel(0) + ', ' + channel(1) + ', ' + channel(2) + ')';
  }

  function updateSliderFill(input, limits) {
    const value = Number(input.value);
    const percent = ((value - limits.min) / (limits.max - limits.min)) * 100;
    input.style.setProperty('--fill', Math.min(100, Math.max(0, percent)) + '%');
  }

  function levelKey(power) {
    for (let i = 0; i < POWER_LEVELS.length; i++) {
      if (power < POWER_LEVELS[i].below) {
        return POWER_LEVELS[i].key;
      }
    }
    return POWER_LEVELS[POWER_LEVELS.length - 1].key;
  }

  // ---------- Which explanation to show ----------
  function pickDetailKey(source, voltage, resistance) {
    if (source === 'voltage' && previous.voltage !== null) {
      return voltage > previous.voltage ? 'e1_detail_v_up' : 'e1_detail_v_down';
    }
    if (source === 'resistance' && previous.resistance !== null) {
      return resistance > previous.resistance ? 'e1_detail_r_up' : 'e1_detail_r_down';
    }
    if (source === 'preset') {
      return 'e1_detail_preset';
    }
    return 'e1_detail_init';
  }

  // ---------- Drawing (reads the sliders, never changes them) ----------
  // Returns false when the values are invalid.
  function render() {
    const voltage = readNumber(els.voltage, LIMITS.voltage);
    const resistance = readNumber(els.resistance, LIMITS.resistance);

    const result = calculate(voltage, resistance);
    if (!result) {
      els.statusLevel.textContent = t('e1_invalid_level');
      els.statusDetail.textContent = t('e1_invalid_detail');
      return false;
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
    els.voltage.setAttribute('aria-valuetext', t('vt_v', { n: num(String(voltage)) }));
    els.resistance.setAttribute('aria-valuetext', t('vt_r', { n: String(resistance) }));

    // Status message
    els.statusLevel.textContent = t(levelKey(power));
    els.statusDetail.textContent = t(view.detailKey, {
      u: formatVoltage(voltage),
      r: formatResistance(resistance),
      i: formatCurrent(current),
      p: formatPower(power)
    });
    return true;
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

    view.detailKey = pickDetailKey(source, voltage, resistance);
    if (!render()) {
      return;
    }

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

  // Language change: redraw the text, keep the experiment exactly as it is.
  I18N.onChange(render);

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

  const t = I18N.t;
  const num = I18N.num;

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

  // Each level points to a translation key (br_N).
  const BRIGHTNESS_LEVELS = [
    { below: 0.5, key: 'br_0' },
    { below: 2, key: 'br_1' },
    { below: 6, key: 'br_2' },
    { below: 20, key: 'br_3' },
    { below: Infinity, key: 'br_4' }
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

  // 12 -> "12", 4.5 -> "4.5", 6.6667 -> "6.67"  (comma in Russian)
  function trimNumber(value) {
    return num(String(parseFloat(finiteOrZero(value).toFixed(2))));
  }

  function formatVolts(v) {
    return trimNumber(v) + ' ' + t('unit_v');
  }

  function formatOhms(r) {
    return trimNumber(r) + ' ' + t('unit_ohm');
  }

  function formatAmps(i) {
    return num(finiteOrZero(i).toFixed(2)) + ' ' + t('unit_a');
  }

  function formatWatts(p) {
    return num(finiteOrZero(p).toFixed(2)) + ' ' + t('unit_w');
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
      return t('br_off');
    }
    for (let i = 0; i < BRIGHTNESS_LEVELS.length; i++) {
      if (power < BRIGHTNESS_LEVELS[i].below) {
        return t(BRIGHTNESS_LEVELS[i].key);
      }
    }
    return '';
  }

  function mixColor(from, to, amount) {
    const channel = (i) => Math.round(from[i] + (to[i] - from[i]) * amount);
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

    els.voltage.setAttribute('aria-valuetext', t('vt_v', { n: trimNumber(state.voltage) }));
    els.r1.setAttribute('aria-valuetext', t('vt_r', { n: trimNumber(state.resistances[0]) }));
    els.r2.setAttribute('aria-valuetext', t('vt_r', { n: trimNumber(state.resistances[1]) }));

    // Switches say ON or OFF in words, not only through colour or position.
    [0, 1].forEach(function (i) {
      els.switches[i].setAttribute('aria-checked', state.on[i] ? 'true' : 'false');
      els.switchTexts[i].textContent = state.on[i] ? t('sw_on') : t('sw_off');
    });

    els.formulaR.textContent = state.config === 'series' ? 'R = R1 + R2' : '1/R = 1/R1 + 1/R2';
  }

  function renderResults(result) {
    els.totalR.textContent = result.isClosed ? formatOhms(result.totalResistance) : t('sp_open');
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
      current: (isSeries ? 'I' : t('sp_total_i')) + ' = ' + formatAmps(result.totalCurrent),
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
    els.svgTitle.textContent = t(isSeries ? 'sp_title_series' : 'sp_title_parallel');
    els.svgDesc.textContent =
      t(isSeries ? 'sp_desc_series' : 'sp_desc_parallel') + ' ' +
      t('sp_desc_state', {
        u: formatVolts(state.voltage),
        s1: t(state.on[0] ? 'sw_closed' : 'sw_open'),
        s2: t(state.on[1] ? 'sw_closed' : 'sw_open'),
        i: formatAmps(result.totalCurrent)
      });
  }

  // ---------- Rendering: explanation message ----------
  // Short on purpose: the box must stay readable on a phone.
  function buildStatus(state, result) {
    const u = formatVolts(state.voltage);
    const b1 = result.bulbs[0];
    const b2 = result.bulbs[1];
    const equal = b1.resistance === b2.resistance;

    if (state.config === 'series') {
      if (!result.isClosed) {
        if (!state.on[0] && !state.on[1]) {
          return { level: t('sp_lvl_series_open'), detail: t('sp_series_open_both', { u: u }) };
        }
        return {
          level: t('sp_lvl_series_open'),
          detail: t(state.on[0] ? 'sp_series_open_b2' : 'sp_series_open_b1', { u: u })
        };
      }
      let detail = t('sp_series_closed', {
        i: formatAmps(result.totalCurrent), u: u, u1: formatVolts(b1.voltage), u2: formatVolts(b2.voltage)
      });
      if (equal) {
        detail += ' ' + t('sp_series_equal');
      } else {
        detail += ' ' + t(b1.resistance > b2.resistance ? 'sp_series_more_b1' : 'sp_series_more_b2');
      }
      return { level: t('sp_lvl_series_closed'), detail: detail };
    }

    // Parallel
    if (!result.isClosed) {
      return { level: t('sp_lvl_par_open'), detail: t('sp_par_open_both') };
    }
    if (!state.on[0] || !state.on[1]) {
      const onBulb = state.on[0] ? b1 : b2;
      return {
        level: t(state.on[0] ? 'sp_lvl_par_open_b2' : 'sp_lvl_par_open_b1'),
        detail: t(state.on[0] ? 'sp_par_open_b2' : 'sp_par_open_b1', { u: u, i: formatAmps(onBulb.current) })
      };
    }
    let parallelDetail = t('sp_par_closed', {
      u: u, i1: formatAmps(b1.current), i2: formatAmps(b2.current), it: formatAmps(result.totalCurrent)
    });
    if (equal) {
      parallelDetail += ' ' + t('sp_par_equal');
    } else {
      parallelDetail += ' ' + t(b1.resistance < b2.resistance ? 'sp_par_less_b1' : 'sp_par_less_b2');
    }
    return { level: t('sp_lvl_par_closed'), detail: parallelDetail };
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

  // Language change: everything here is drawn from the current state, so
  // simply drawing again gives the same experiment in the new language.
  I18N.onChange(update);

  // ---------- Start ----------
  update();
})();


// ---------------------------------------------------------------------
// 3. Experiment 002: Knowledge check (quiz)
// Answers stay hidden until the visitor picks an option.
// Chosen answers are kept when the language changes.
// ---------------------------------------------------------------------
(function () {
  'use strict';

  const t = I18N.t;

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
    heading.textContent = t(isCorrect ? 'quiz_correct' : 'quiz_wrong');
    feedback.appendChild(heading);
    feedback.appendChild(document.createTextNode(t(question.getAttribute('data-explain-key'))));

    feedback.classList.add('is-shown');
    feedback.classList.toggle('is-wrong', !isCorrect);
  }

  // The "Correct answer" / "Your answer" tags are drawn from data-mark by CSS.
  function showMarks(question) {
    question.querySelectorAll('.quiz-option').forEach(function (button) {
      if (button.classList.contains('is-correct')) {
        button.setAttribute('data-mark', '  ✓  ' + t('quiz_mark_correct'));
      } else if (button.classList.contains('is-wrong')) {
        button.setAttribute('data-mark', '  ✗  ' + t('quiz_mark_wrong'));
      }
    });
  }

  function updateScore() {
    const answered = questions.filter(function (q) { return q.getAttribute('data-answered') === 'true'; });
    if (answered.length < questions.length) {
      return;
    }
    const correct = answered.filter(function (q) { return q.getAttribute('data-result') === 'correct'; }).length;
    scoreText.textContent = t('quiz_score', { n: correct, m: questions.length });
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

    showMarks(question);
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
        button.removeAttribute('data-mark');
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

  // Language change: show the same answers and feedback in the new language.
  I18N.onChange(function () {
    questions.forEach(function (question) {
      if (question.getAttribute('data-answered') === 'true') {
        showMarks(question);
        showFeedback(question, question.getAttribute('data-result') === 'correct');
      }
    });
    updateScore();
  });
})();
