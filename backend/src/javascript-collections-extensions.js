Array.prototype.groupBy = function(groupCriteria) {
    return this.reduce(
        (groupedElements, currentElement) => {
            const groupKey = groupCriteria(currentElement)
            const oldValues = groupedElements.get(groupKey) || []

            groupedElements.set(groupKey, [...oldValues, currentElement])

            return groupedElements
        },
        new Map())
}

Array.prototype.sum = function(aFunction) {
    return this.reduce((subTotal, currentElement) => subTotal + aFunction(currentElement), 0)
}

Map.prototype.entriesAsArray = function() {
    return Array.from(this.entries())
}

Map.prototype.valuesAsArray = function() {
    return Array.from(this.values())
}

Map.prototype.map = function(transformFunction) {
    return this.entriesAsArray().reduce(
        (newMap, [key, value]) => {
            newMap.set(key, transformFunction(key, value))
            return newMap
        },
        new Map()
    )
}