/** The different energy labels */
export type Label = "APPENE" | "ENERGYEXP" | "ENERGYIMP" | "ENRTOTPROD" | "BATTPERCENT" | "ENRBATTCHRG" | "ENRBATTDISCH" | "GAS" | "WATER" | "CARBON";

/** The direction in which the offset should be applied */
export type TOffsetDirection = 'top' | 'bottom' | 'left' | 'right';

/**
 * The wrapper's unique name in the HTML classname
 * 
 * The syntax in the HTML classname is : .{classname}-wrapper
 */
export type TWrapper = 'carbon' | 'solar' | 'gas' | 'grid' | 'home' | 'battery' | 'water';

/** The different svg paths label */
export type SVGLabel = "carbonToGrid" | "gridToHome" | "solarToBattery" | "gasToHome" | "waterToHome" | "solarToGrid" | "solarToHome" | "batteryToGrid" | "batteryToHome";