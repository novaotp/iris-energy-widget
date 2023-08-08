/** Encapsulates reusable data and provides methods for displaying the data. */
export default class DataPoint {
    constructor(dataPoint, wrapperClass) {
        this.container = self.ctx.$container;
        this.dataPoint = dataPoint;
        this.wrapperClass = wrapperClass;
        this.label = this.dataPoint.dataKey.label;
        this.dataKeyMemoized = null; // Added memoization for dataKey retrieval.
    }

    /** Initialize the display. */
    init() {
        this.showWrapperDiv();
        this.updateUsageDisplay();
    }

    /** Retrieve the DataKey by the label name and cache it for subsequent uses. */
    getDataKeyFromLabel() {
        if (!this.dataKeyMemoized) {
            this.dataKeyMemoized = Object.values(this.dataPoint.datasource.dataKeys)
                .find(dataKey => dataKey.name === this.label);
        }
        return this.dataKeyMemoized;
    }

    /** Determine the precision for the value. */
    determineValuePrecision() {
        const { decimals } = this.getDataKeyFromLabel() || {};
        return decimals || undefined;
    }

    /** Get the actual value, considering its type and necessary precision. */
    retrieveProcessedValue() {
        const rawValue = this.dataPoint.data[0][1];
        const precision = this.determineValuePrecision();

        if (typeof rawValue === 'number') {
            return precision ? parseFloat(rawValue.toFixed(precision)) : rawValue;
        }

        if (typeof rawValue === 'string') {
            return isNaN(rawValue) ? rawValue : parseFloat(parseFloat(rawValue).toFixed(precision || 0));
        }

        if (typeof rawValue === 'object') {
            return JSON.parse(rawValue);
        }

        return rawValue;
    }

    /** Get the associated unit for the value. */
    retrieveValueUnit() {
        const { units } = this.getDataKeyFromLabel() || {};
        return units || "";
    }

    /** Display the wrapperDiv. */
    showWrapperDiv() {
        this.container.find(`.${this.wrapperClass}`).css("display", "flex");
    }

    /** Set the data usage in the designated Div. */
    updateUsageDisplay() {
        this.container.find(`.${this.wrapperClass} .usage`).html(`${this.retrieveProcessedValue()} ${this.retrieveValueUnit()}`);
    }
}
