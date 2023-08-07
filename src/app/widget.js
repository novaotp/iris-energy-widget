/** Encapsulates reusable data and provides methods for displaying the data. */
class DataPoint {
    constructor(dataPoint, wrapperClass) {
        this.container = self.ctx.$container;
        this.dataPoint = dataPoint;
        this.wrapperClass = wrapperClass;
        this.label = this.dataPoint.dataKey.label;
    }

    /** Initialize the display. */
    init() {
        this.__showHTML();
        this.__setUsage();
    }

    /** Retrieve the DataKey by the label name. */
    __findDataKey() { return Object.values(this.dataPoint.datasource.dataKeys).find(dataKey => dataKey.name === this.label); }

    /** Determine the precision for the value. */
    __precision() {
        const { decimals } = this.__findDataKey() || {};
        return decimals || undefined;
    }

    /** Get the actual value, considering its type and necessary precision. */
    __value() {
        const rawValue = this.dataPoint.data[0][1];
        const precision = this.__precision();

        switch (typeof rawValue) {
            case 'number':
                return precision ? parseFloat(rawValue.toFixed(precision)) : rawValue;
            case 'string':
                return isNaN(rawValue) ? rawValue : parseFloat(parseFloat(rawValue).toFixed(precision || 0));
            case 'object':
                return JSON.parse(rawValue);
            default:
                return rawValue;
        }
    }

    /** Get the associated unit for the value. */
    __unit() {
        const { units } = this.__findDataKey() || {};
        return units || "";
    }

    /** Display the wrapperDiv. */
    __showHTML() {
        this.container.find(`.${this.wrapperClass}`).css("display", "flex");
    }

    /** Set the data usage in the designated Div. */
    __setUsage() {
        this.container.find(`.${this.wrapperClass} .usage`).html(`${this.__value()} ${this.__unit()}`);
    }
}

/** Update the sizes. */
function resize() {
    const masterDiv = self.ctx.$container.find('.master');
    const wrappers = self.ctx.$container.find('.wrapper');
    const circles = self.ctx.$container.find('.circle');
    const svgPath = self.ctx.$container.find('.svg-path');
    const flowchart = self.ctx.$container.find('.flowchart');

    const wrappersMinSize = Math.min(wrappers.width(), wrappers.height()) * 0.6;
    const viewBoxValue = `0 0 ${masterDiv.width()} ${masterDiv.height()}`;

    circles.width(wrappersMinSize).height(wrappersMinSize);
    svgPath.attr('viewBox', viewBoxValue);

    // Simplifying the conditions and making the size adjustments more clear.
    if (self.ctx.$container.find('.solar-wrapper').css("display") === "none" &&
        self.ctx.$container.find('.battery-wrapper').css("display") === "none") {
        wrappers.css("width", `${flowchart.width() / 2}px`);
    } else {
        wrappers.css("width", `${flowchart.width() / 3}px`);
    }

    // Adjusting row height.
    if (self.ctx.$container.find('.row3').css("display") === "none") {
        self.ctx.$container.find('.rows').css("height", `${flowchart.height() / 2}px`);
    } else {
        self.ctx.$container.find('.rows').css("height", `${flowchart.height() / 3}px`);
    }

    updateSVGs();
}

function home(dataPoint) {
    const dataMap = new DataPoint(dataPoint, 'home-wrapper')
    dataMap.init();
}

function grid(dataPointExp, dataPointImp) {
    if (dataPointExp !== undefined) {
        const dataMapExp = new DataPoint(dataPointExp, 'exported')
        dataMapExp.init();
    }

    const dataMapImp = new DataPoint(dataPointImp, 'imported')
    dataMapImp.init();
}

function carbon(dataPoint) {
    const dataMap = new DataPoint(dataPoint, 'carbon-wrapper')
    dataMap.init();
}

function solar(dataPoint) {
    if (dataPoint !== undefined) {
        const dataMap = new DataPoint(dataPoint, 'solar-wrapper')
        dataMap.init();
    }
}

function gas(dataPoint) {
    if (dataPoint !== undefined) {
        const dataMap = new DataPoint(dataPoint, 'gas-wrapper')
        dataMap.init();
    }
}

function water(dataPoint) {
    if (dataPoint !== undefined) {
        const dataMap = new DataPoint(dataPoint, 'water-wrapper')
        dataMap.init();
    }
}

function battery(dataPointPercent, dataPointCharging, dataPointDischarging) {
    if (dataPointPercent !== undefined || dataPointCharging !== undefined || dataPointDischarging !== undefined) {
        self.ctx.$container.find('.battery-wrapper').css("display", "flex");

        if (dataPointPercent !== undefined) {
            const dataMapPercent = new DataPoint(dataPointPercent, 'percent')
            dataMapPercent.init();
        }

        if (dataPointCharging !== undefined) {
            const dataMapCharging = new DataPoint(dataPointCharging, 'charging')
            dataMapCharging.init();
        }

        if (dataPointDischarging !== undefined) {
            const dataMapDischarging = new DataPoint(dataPointDischarging, 'discharging')
            dataMapDischarging.init();
        }
    }
}

function updateSVGs() {
    function generateUniqueID(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 11);
    }

    $('.svg-path').each(function() {
        const uniquePathID = generateUniqueID('path_');
        
        // Update the path ID
        $(this).find('path').attr('id', uniquePathID);
        
        // Update the mpath's href to reference the new path ID
        $(this).find('animateMotion > mpath').attr('href', `#${uniquePathID}`);
    });
}

/** Process data, create data map and visualize it. */
async function useData() {
    if (self.ctx.defaultSubscription.loadingData) return;

    const data = self.ctx.defaultSubscription.data;
    let dataPoints = {
        "APPENE": undefined,
        "ENERGYEXP": undefined,
        "ENERGYIMP": undefined,
        "ENRTOTPROD": undefined,
        "BATTPERCENT": undefined,
        "ENRBATTCHRG": undefined,
        "ENRBATTDISCH": undefined,
        "GAS": undefined,
        "WATER": undefined,
    };

    // Mapping the data directly
    for (const dataPoint of Object.values(data)) {
        const label = dataPoint.dataKey.name.split('-').at(-1);
        dataPoints[label] = dataPoint;
    }

    // Use the datapoints here
    home(dataPoints['APPENE']);
    grid(dataPoints['ENERGYEXP'], dataPoints['ENERGYIMP']);
    carbon(dataPoints['APPENE']);
    solar(dataPoints['ENRTOTPROD']);
    gas(dataPoints['GAS']);
    water(dataPoints['WATER']);
    battery(dataPoints['BATTPERCENT'], dataPoints['ENRBATTCHRG'], dataPoints['ENRBATTDISCH']);

    // Row3 control
    if (dataPoints['WATER'] === undefined && dataPoints['BATTPERCENT'] === undefined && dataPoints['ENRBATTCHRG'] === undefined && dataPoints['ENRBATTDISCH'] === undefined) {
        const flowchart = self.ctx.$container.find('.flowchart');
        self.ctx.$container.find('.row3').css("display", "none");
        self.ctx.$container.find('.rows').css("height", `${flowchart.height() / 2}px`);
    }

    // Col2 control
    if (dataPoints['ENRTOTPROD'] === undefined && dataPoints['BATTPERCENT'] === undefined && dataPoints['ENRBATTCHRG'] === undefined && dataPoints['ENRBATTDISCH'] === undefined) {
        const flowchart = self.ctx.$container.find('.flowchart');
        self.ctx.$container.find('.wrapper').css("width", `${flowchart.width() / 2}px`);
    }
}

self.onInit = function () {
    useData();
    resize();
}

self.onDataUpdated = function () {
    self.ctx.detectChanges()
    useData();
    resize();
}

self.onResize = function () {
    resize();
}

self.onEditModeChanged = function () {
    resize();
}