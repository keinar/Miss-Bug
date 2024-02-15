export const bugServiceCommon = {
    getEmptyBug,
    getDefaultFilter,
    getDefaultSort,
    getInitialSortValues
}

function getEmptyBug(title = '', severity = '', description = '', labels = []) {   // createdAt will be added by server
	return { title, severity, description, labels }
}

function getDefaultFilter() {
	return { title: '', minSeverity: '', label: '' }
}

function getDefaultSort() {
    return {
        sortBy: 'createdAt',
        isAscending: false
    }
}

function getInitialSortValues() {
    return {
        createdAt: {key: 'createdAt', isAscending: true},
        severity: {key: 'severity', isAscending: true},
        title: {key: 'title', isAscending: false},
    }
}
