let memory = []

function isInMemory(element) {
    let index = 0;
    for (e in memory) {
        if (element[0] === e[0]) {
            break;
        }
        index++;
    }
    return index;
}

function addInMemory(element) {
    if (isInMemoryByKey(element[0]) === memory.length)
        memory.push(element);
}

function isInMemoryByKey(key) {
    let index = 0;
    var BreakException = {};
    try {
        memory.forEach(function (el) {
            if (el[0] === key) {
                throw BreakException;
            }
            index++;
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    return index;
}

function getMemoryLength() {
    return memory.length;
}

function getElementAtIndex(index) {
    return memory[index];
}