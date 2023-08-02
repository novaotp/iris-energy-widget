self.onInit = function() {
    self.ctx.$scope.data = self.ctx.defaultSubscription.data;

    for (var i=0; i<self.ctx.$scope.data.length; i++) {
        let dataPoint = self.ctx.$scope.data[i]
        console.log(dataPoint.datasource)
    
        // delay the console log
        setTimeout(() => {
            console.log(dataPoint.data)
        }, 2000);  // 2000 ms = 2 seconds
    
        console.log(dataPoint)
    }
}
    
self.onDataUpdated = function() {
    self.ctx.detectChanges();
}