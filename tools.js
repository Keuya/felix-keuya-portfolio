(() => {
  const number = (value) => {
    const parsed = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const money = (value, symbol = '$') => {
    if (!Number.isFinite(value)) return '—';
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1e9) return `${sign}${symbol}${(abs / 1e9).toFixed(2)}bn`;
    if (abs >= 1e6) return `${sign}${symbol}${(abs / 1e6).toFixed(2)}m`;
    if (abs >= 1e3) return `${sign}${symbol}${(abs / 1e3).toFixed(1)}k`;
    return `${sign}${symbol}${abs.toFixed(2)}`;
  };

  const rate = (value) => `${(value * 100).toFixed(1)}%`;
  const x = (value) => Number.isFinite(value) ? `${value.toFixed(2)}x` : '—';
  const set = (root, key, value) => {
    const el = root.querySelector(`[data-output="${key}"]`);
    if (el) el.textContent = value;
  };

  const annuityPayment = (principal, annualRate, years) => {
    if (principal <= 0 || years <= 0) return 0;
    if (annualRate <= 0) return principal / years;
    return principal * annualRate / (1 - Math.pow(1 + annualRate, -years));
  };

  const annuityPV = (payment, annualRate, years) => {
    if (payment <= 0 || years <= 0) return 0;
    if (annualRate <= 0) return payment * years;
    return payment * (1 - Math.pow(1 + annualRate, -years)) / annualRate;
  };

  const dscrRoot = document.querySelector('[data-tool="dscr"]');
  if (dscrRoot) {
    const form = dscrRoot.querySelector('form');
    const calculate = () => {
      const symbol = form.elements.currency.value.trim() || '$';
      const revenue = number(form.elements.revenue.value);
      const opex = number(form.elements.opex.value);
      const other = number(form.elements.other.value);
      const target = Math.max(number(form.elements.target.value), 0.01);
      const interest = Math.max(number(form.elements.interest.value) / 100, 0);
      const tenor = Math.max(Math.round(number(form.elements.tenor.value)), 1);
      const proposedDebt = Math.max(number(form.elements.debt.value), 0);

      const cfads = revenue - opex - other;
      const maxDebtService = cfads > 0 ? cfads / target : 0;
      const debtCapacity = annuityPV(maxDebtService, interest, tenor);
      const proposedDebtService = annuityPayment(proposedDebt, interest, tenor);
      const proposedDscr = proposedDebtService > 0 ? cfads / proposedDebtService : NaN;
      const headroom = debtCapacity - proposedDebt;

      set(dscrRoot, 'cfads', money(cfads, symbol));
      set(dscrRoot, 'max-debt-service', money(maxDebtService, symbol));
      set(dscrRoot, 'debt-capacity', money(debtCapacity, symbol));
      set(dscrRoot, 'proposed-debt-service', proposedDebt > 0 ? money(proposedDebtService, symbol) : 'Not entered');
      set(dscrRoot, 'proposed-dscr', proposedDebt > 0 ? x(proposedDscr) : 'Not entered');
      set(dscrRoot, 'headroom', proposedDebt > 0 ? money(headroom, symbol) : 'Not entered');

      const reading = dscrRoot.querySelector('[data-reading]');
      if (reading) {
        if (cfads <= 0) {
          reading.textContent = 'CFADS is zero or negative, so this simplified sizing case cannot support debt service.';
        } else if (proposedDebt > 0 && proposedDscr < target) {
          reading.textContent = `At the proposed debt amount, estimated DSCR is below the ${target.toFixed(2)}x target. Reduce debt, improve CFADS or change the financing assumptions before relying on the case.`;
        } else if (proposedDebt > 0) {
          reading.textContent = `At the proposed debt amount, estimated DSCR is above the ${target.toFixed(2)}x target in this simplified level-debt-service case.`;
        } else {
          reading.textContent = `The indicative debt capacity is the present value of level annual debt service that keeps DSCR at ${target.toFixed(2)}x.`;
        }
      }
    };

    form.addEventListener('input', calculate);
    form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
    form.querySelector('[data-reset]')?.addEventListener('click', () => { form.reset(); requestAnimationFrame(calculate); });
    calculate();
  }

  const ppaRoot = document.querySelector('[data-tool="ppa"]');
  if (ppaRoot) {
    const form = ppaRoot.querySelector('form');
    const calculate = () => {
      const symbol = form.elements.currency.value.trim() || 'R';
      const loadMwh = Math.max(number(form.elements.load.value), 0);
      const renewableMwh = Math.max(number(form.elements.renewable.value), 0);
      const ppa = Math.max(number(form.elements.ppa.value), 0);
      const network = Math.max(number(form.elements.network.value), 0);
      const residualTariff = Math.max(number(form.elements.residual.value), 0);
      const benchmark = Math.max(number(form.elements.benchmark.value), 0);

      const deliveredMwh = Math.min(renewableMwh, loadMwh);
      const residualMwh = Math.max(loadMwh - deliveredMwh, 0);
      const loadKwh = loadMwh * 1000;
      const renewableKwh = deliveredMwh * 1000;
      const residualKwh = residualMwh * 1000;

      const baselineCost = loadKwh * benchmark;
      const ppaCost = renewableKwh * ppa;
      const networkCost = renewableKwh * network;
      const residualCost = residualKwh * residualTariff;
      const totalCost = ppaCost + networkCost + residualCost;
      const saving = baselineCost - totalCost;
      const savingPct = baselineCost > 0 ? saving / baselineCost : NaN;
      const renewableShare = loadMwh > 0 ? deliveredMwh / loadMwh : NaN;
      const breakEvenPpa = renewableKwh > 0 ? (baselineCost - networkCost - residualCost) / renewableKwh : NaN;

      set(ppaRoot, 'baseline', money(baselineCost, symbol));
      set(ppaRoot, 'total', money(totalCost, symbol));
      set(ppaRoot, 'saving', money(saving, symbol));
      set(ppaRoot, 'saving-pct', Number.isFinite(savingPct) ? rate(savingPct) : '—');
      set(ppaRoot, 'renewable-share', Number.isFinite(renewableShare) ? rate(renewableShare) : '—');
      set(ppaRoot, 'break-even', Number.isFinite(breakEvenPpa) ? `${symbol}${breakEvenPpa.toFixed(3)}/kWh` : '—');
      set(ppaRoot, 'ppa-cost', money(ppaCost, symbol));
      set(ppaRoot, 'network-cost', money(networkCost, symbol));
      set(ppaRoot, 'residual-cost', money(residualCost, symbol));

      const reading = ppaRoot.querySelector('[data-reading]');
      if (reading) {
        if (renewableMwh > loadMwh && loadMwh > 0) {
          reading.textContent = `You entered more renewable energy than annual buyer load. This calculator caps delivered renewable energy at buyer load and does not value surplus export.`;
        } else if (Number.isFinite(savingPct) && savingPct > 0) {
          reading.textContent = `On these assumptions, the wheeled supply case is ${rate(savingPct)} below the grid-only benchmark. The break-even PPA price shows the maximum energy price that would leave the buyer level with the benchmark before any other value or cost is added.`;
        } else if (Number.isFinite(savingPct)) {
          reading.textContent = `On these assumptions, the wheeled supply case is not cheaper than the grid-only benchmark. Check the PPA price, delivered share, network charges and residual-supply tariff.`;
        } else {
          reading.textContent = 'Enter a buyer load and tariff assumptions to compare the two cases.';
        }
      }
    };

    form.addEventListener('input', calculate);
    form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
    form.querySelector('[data-reset]')?.addEventListener('click', () => { form.reset(); requestAnimationFrame(calculate); });
    calculate();
  }
})();
