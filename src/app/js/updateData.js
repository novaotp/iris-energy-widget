import DataPoint from "./DataPoint.class";

class DataPointFactory {
  static create(dataPoint, identifier) {
    if (dataPoint) {
      const dataMap = new DataPoint(dataPoint, identifier);
      dataMap.init();
      return dataMap;
    }
    return null;
  }
}

const dataPointMapping = {
  'APPENE': 'home-wrapper',
  'ENERGYEXP': 'exported',
  'ENERGYIMP': 'imported',
  'ENRTOTPROD': 'solar-wrapper',
  'GAS': 'gas-wrapper',
  'WATER': 'water-wrapper',
  'BATTPERCENT': 'percent',
  'ENRBATTCHRG': 'charging',
  'ENRBATTDISCH': 'discharging',
  'CARBON': 'carbon-wrapper'
};

export default function updateData() {
  // Data not ready
  if (self.ctx.defaultSubscription.loadingData) return;

  // Get data
  const data = self.ctx.defaultSubscription.data;

  // Ensure correct labels
  const validDataPointLabels = new Set(["APPENE", "ENERGYEXP", "ENERGYIMP", "ENRTOTPROD", "BATTPERCENT", "ENRBATTCHRG", "ENRBATTDISCH", "GAS", "WATER", "CARBON"]);

  // Display battery to false
  let batteryDisplayRequired = false;

  // Loop through the datapoints
  for (const dataPoint of Object.values(data)) {
    const label = dataPoint.dataKey.name.split('-').at(-1);

    // Skip processing if label is not in the valid set
    if (!validDataPointLabels.has(label)) {
      continue;
    }

    // Check for battery-related data points
    batteryDisplayRequired = batteryDisplayRequired || ['BATTPERCENT', 'ENRBATTCHRG', 'ENRBATTDISCH'].includes(label);

    DataPointFactory.create(dataPoint, dataPointMapping[label]);

    if (label === "APPENE") {
      DataPointFactory.create(dataPoint, dataPointMapping['CARBON']);
    }

    if (['BATTPERCENT', 'ENRBATTCHRG', 'ENRBATTDISCH', 'WATER'].includes(label)) {
      self.ctx.$container.find('.row3').css("display", "flex");
    }
  }

  if (!data.some(dp => dp.dataKey.name.split("-").at(-1) === "ENERGYIMP")) {
    DataPointFactory.create(data.find(dp => dp.dataKey.name.split("-").at(-1) === "APPENE"), dataPointMapping['ENERGYIMP']);
  }

  // Specific rule for battery showing
  if (batteryDisplayRequired) {
    self.ctx.$container.find('.battery-wrapper').css("display", "flex");
  }
}
