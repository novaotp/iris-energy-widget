self.onInit = function() {
    /* ----- DATACLASS START ----- */

    /**
     * Classe DataPoint permettant d'encapsuler les données réutilisables.
     * 
     * @param dataPoint Map contenant toutes les données obtenues via le defaultSubscription.
     * @param usageClass Le nom de la classe html à utiliser pour modifier le innerHTML directement.
     */
    self.ctx.$scope.DataPoint = function(dataPoint, usageClass, wrapperClass) {
        this.dataPoint = dataPoint;
        this.usageDiv = self.ctx.$container.find(usageClass);
        this.wrapperDiv = self.ctx.$container.find(wrapperClass);
        this.__showHTML();

        this.label = this.dataPoint.dataKey.label;
    }
    self.ctx.$scope.DataPoint.prototype.__findDataKey = function() {
        let dataKey;
    
        for (const dataKeys of Object.values(this.dataPoint.datasource.dataKeys)) {
            if (dataKeys.name === this.label) {
                dataKey = dataKeys;
            }
        }
        
        return dataKey
    }
    self.ctx.$scope.DataPoint.prototype.__precision = function() {
        const dataKey = this.__findDataKey();
        
        return (dataKey.decimals === undefined || dataKey.decimals === null) ? undefined : dataKey.decimals;
    }
    self.ctx.$scope.DataPoint.prototype.__value = function() {
        const rawValue = this.dataPoint.data[0][1];
        const precision = this.__precision();

        switch (typeof rawValue) {
            case 'number':
                if (precision === undefined) return rawValue;
                return parseFloat(rawValue.toFixed(precision));
            case 'string':
                if (isNaN(parseFloat(rawValue))) return rawValue;
                return parseFloat(parseFloat(rawValue).toFixed(precision));
            case 'object':
                return JSON.parse(rawValue);
        }
    }
    self.ctx.$scope.DataPoint.prototype.__unit = function() {
        const dataKey = this.__findDataKey();
        
        return (dataKey.units === undefined || dataKey.units === null) ? "" : dataKey.units;
    }
    self.ctx.$scope.DataPoint.prototype.__showHTML = function() {
        this.wrapperDiv.css("display", "flex");
    }
    self.ctx.$scope.DataPoint.prototype.setUsage = function() {
        this.usageDiv.html(`${this.__value()} ${this.__unit()}`)
    }
    
    /* ----- DATACLASS END ----- */
    
    self.ctx.$scope.setFlowChartSize = function() {
        var masterDiv = self.ctx.$container.find('.master');
        
        var masterWidth = masterDiv.width();
        var masterHeight = masterDiv.height();
        
        var wrappers = self.ctx.$container.find('.wrapper')
        var circles = self.ctx.$container.find('.circle')
        
        var wrappersWidth = wrappers.width();
        var wrappersHeight = wrappers.height();
        
        var wrappersMinSize = Math.min(wrappersWidth, wrappersHeight) * 0.6;
        
        circles.width(wrappersMinSize);
        circles.height(wrappersMinSize);
        
        // Change viewBox to match aspect ratio of master container
        var svgPath = self.ctx.$container.find('.svg-path')
        var viewBoxValue = '0 0 ' + masterWidth + ' ' + masterHeight;
        svgPath.each(function() {
            this.setAttribute('viewBox', viewBoxValue);
        });
    }
    
    self.ctx.$scope.setFlowChartSize();

    /* ----- ENERGY SOURCES START ----- */

    self.ctx.$scope.home = function(dataPoint) {
        const dataMap = new self.ctx.$scope.DataPoint(dataPoint, '.home-usage', '.home-wrapper')  
        dataMap.setUsage();
    }
    
    self.ctx.$scope.grid = function(dataPointExp, dataPointImp) {
        if (dataPointExp !== undefined) {
            const dataMapExp = new self.ctx.$scope.DataPoint(dataPointExp, '.exported-usage', '.exported')
            dataMapExp.setUsage();
        }
        
        const dataMapImp = new self.ctx.$scope.DataPoint(dataPointImp, '.imported-usage', '.imported')
        dataMapImp.setUsage();
    }
    
    self.ctx.$scope.carbon = function(dataPoint) {
        const dataMap = new self.ctx.$scope.DataPoint(dataPoint, '.carbon-usage', '.carbon-wrapper')  
        dataMap.setUsage();
    }

    self.ctx.$scope.solar = function(dataPoint) {
        const dataMap = new self.ctx.$scope.DataPoint(dataPoint, '.solar-usage', '.solar-wrapper')  
        dataMap.setUsage();
    }

    self.ctx.$scope.gas = function(dataPoint) {
        if (dataPoint !== undefined) {
            const dataMap = new self.ctx.$scope.DataPoint(dataPoint, '.gas-usage', '.gas-wrapper')  
            dataMap.setUsage();
        }
    }

    self.ctx.$scope.water = function(dataPoint) {
        if (dataPoint !== undefined) {
            const dataMap = new self.ctx.$scope.DataPoint(dataPoint, '.water-usage', '.water-wrapper')  
            dataMap.setUsage();
        }
    }

    self.ctx.$scope.battery = function(dataPointPercent, dataPointCharging, dataPointDischarging) {
        if (dataPointPercent !== undefined || dataPointCharging !== undefined || dataPointDischarging !== undefined) {
            self.ctx.$container.find('.battery-wrapper').css("display", "flex");

            if (dataPointPercent !== undefined) {
                const dataMapPercent = new self.ctx.$scope.DataPoint(dataPointPercent, '.percent-usage', '.percent')
                dataMapPercent.setUsage();
            }

            if (dataPointCharging !== undefined) {
                const dataMapCharging = new self.ctx.$scope.DataPoint(dataPointCharging, '.charging-usage', '.charging')
                dataMapCharging.setUsage();
            }

            if (dataPointDischarging !== undefined) {
                const dataMapDischarging = new self.ctx.$scope.DataPoint(dataPointDischarging, '.discharging-usage', '.discharging')
                dataMapDischarging.setUsage();
            }
        }
    }

    /* ----- ENERGY SOURCES END ----- */

    // Best proven way of getting data
    self.ctx.$scope.useData = function() {
        // Obtain the data
        let data = self.ctx.defaultSubscription.data;

        // Datapoints
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
        }
            
        // Why : https://github.com/thingsboard/thingsboard/issues/6609#issuecomment-1142185617
        setTimeout(() => {
            for (const dataPoint of Object.values(data)) {
                const label = dataPoint.dataKey.name.split('-').at(-1);
                dataPoints[label] = dataPoint;
            }

            if (dataPoints['ENERGYIMP'] === undefined) {
                dataPoints['ENERGYIMP'] = dataPoints['APPENE'];
            }
    
            // Use the datapoints here
            self.ctx.$scope.home(dataPoints['APPENE']);
            self.ctx.$scope.grid(dataPoints['ENERGYEXP'], dataPoints['ENERGYIMP']);
            self.ctx.$scope.carbon(dataPoints['APPENE']);
            self.ctx.$scope.gas(dataPoints['GAS']);
            self.ctx.$scope.water(dataPoints['WATER']);
            self.ctx.$scope.battery(dataPoints['BATTPERCENT'], dataPoints['ENRBATTCHRG'], dataPoints['ENRBATTDISCH']);
        }, 1000);
    }

    self.ctx.$scope.useData();
}
    
self.onDataUpdated = function() {
    self.ctx.detectChanges()
    self.ctx.$scope.useData();
}

self.onResize = function() {
    self.ctx.$scope.setFlowChartSize();
}
