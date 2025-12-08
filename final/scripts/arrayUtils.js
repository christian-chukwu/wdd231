/* Array Processing Utilities */

export function filterByProperty(array, property, value) {
  if (!value) return array;
  return array.filter(item => item[property] === value);
}

export function sortAlphabetically(array, property) {
  return [...array].sort((a, b) => {
    const aValue = a[property] || '';
    const bValue = b[property] || '';
    return aValue.localeCompare(bValue);
  });
}

export function sortByDifficulty(array) {
  const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };

  return [...array].sort((a, b) => {
    const aOrder = difficultyOrder[a.difficulty] || 999;
    const bOrder = difficultyOrder[b.difficulty] || 999;
    return aOrder - bOrder;
  });
}

export function getUniqueValues(array, property) {
  const unique = [];
  const seen = new Set();

  array.forEach(item => {
    const value = item[property];
    if (!seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  });

  return unique;
}

export function searchItems(array, searchTerm, searchProperties) {
  if (!searchTerm) return array;

  const lowerTerm = searchTerm.toLowerCase();
  return array.filter(item => {
    return searchProperties.some(prop => {
      const value = item[prop];
      return value && value.toLowerCase().includes(lowerTerm);
    });
  });
}

export function mapItemsToNewFormat(array, mapping) {
  return array.map(item => {
    const newItem = {};
    Object.keys(mapping).forEach(newKey => {
      newItem[newKey] = item[mapping[newKey]];
    });
    return newItem;
  });
}

export function groupByProperty(array, property) {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}
