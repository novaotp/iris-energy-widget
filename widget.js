self.onInit = function() {
    // Define a constructor function
    self.ctx.$scope.DataPoint = function(dataPoint) {
        this.dataPoint = dataPoint;
        this.label = this.dataPoint.dataKey.label;
    }
    self.ctx.$scope.DataPoint.prototype.__findDataKey = function() {
        let dataKey;
    
        for (const [index, dataKeys] of Object.entries(this.dataPoint.datasource.dataKeys)) {
            if (dataKeys.name === this.label) {
                dataKey = dataKeys;
            }
        }
        
        return dataKey
    }
    self.ctx.$scope.DataPoint.prototype.value = function() {
        return this.dataPoint.data[0][1];
    }
    self.ctx.$scope.DataPoint.prototype.unit = function() {
        const dataKey = this.__findDataKey();
        console.log(this.label, dataKey)
        
        return dataKey.units === undefined ? "" : dataKey.units;
    }
    
    self.ctx.$scope.setFlowChartSize = function() {
        var masterDiv = self.ctx.$container.find('.master');
        var flowchartDiv = self.ctx.$container.find('.flowchart');
        var masterWidth = masterDiv.width();
        var masterHeight = masterDiv.height();
        var size = Math.min(masterWidth, masterHeight);
        flowchartDiv.width(size);
        flowchartDiv.height(size);
    }
    
    self.ctx.$scope.setFlowChartSize();
}
    
self.onDataUpdated = function() {
    self.ctx.detectChanges()
    
    function homeDiv(dataPoint) {
        const dataMap = new self.ctx.$scope.DataPoint(dataPoint)
        
        const homeUsageDiv = self.ctx.$container.find('.home-usage');
        const value = dataMap.value();
        const unit = dataMap.unit();
        homeUsageDiv.html(`${value} ${unit}`);
    }
    
    function gridDiv(dataPointExp, dataPointImp) {
        const dataMapExp = new self.ctx.$scope.DataPoint(dataPointExp)
        const exportedUsageDiv = self.ctx.$container.find('.exported-usage');
        const expValue = dataMapExp.value();
        const expUnit = dataMapExp.unit();
        exportedUsageDiv.html(`${expValue} ${expUnit}`);
        
        const dataMapImp = new self.ctx.$scope.DataPoint(dataPointImp)
        const importedUsageDiv = self.ctx.$container.find('.imported-usage');
        const impValue = dataMapImp.value();
        const impUnit = dataMapImp.unit();
        importedUsageDiv.html(`${impValue} ${impUnit}`);
    }
    
    function carbonDiv(dataPoint) {
        const dataMap = new self.ctx.$scope.DataPoint(dataPoint)
        
        const carbonUsageDiv = self.ctx.$container.find('.carbon-usage');
        const value = dataMap.value();
        const unit = dataMap.unit();
        carbonUsageDiv.html(`${value} ${unit}`);
    }
    
    // Best proven way of getting data
    function useData(callback) {
        let data = self.ctx.defaultSubscription.data;
        let dataPoints = []
            
        // Why : https://github.com/thingsboard/thingsboard/issues/6609#issuecomment-1142185617
        setTimeout(() => {
            for (const [index, dataPoint] of Object.entries(data)) {
                const label = dataPoint.dataKey.name;
                const data = dataPoint.data.at(-1);
                dataPoints.push(dataPoint);
            }
    
            callback(dataPoints);
        }, 1000);
    }
    
    useData(function(dataPoints) {
        carbonDiv(dataPoints[0]);
        gridDiv(dataPoints[1], dataPoints[2]);
        homeDiv(dataPoints[0]);
    });
}

self.onResize = function() {
    self.ctx.$scope.setFlowChartSize();
}
