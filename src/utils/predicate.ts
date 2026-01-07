/* import { parse } from 'odata-filter-parser';

// Example OData $filter string
const filterString = "(FirstName eq 'John' or LastName ne 'Doe') and Freight gt 100";

// 1. Parse the OData filter string into a predicate structure
const predicateStructure = parse(filterString);

// The 'predicateStructure' will be a nested object representing the logic.
// Example structure:
// {
//   type: 'and',
//   left: { type: 'or', ... },
//   right: { type: 'gt', field: 'Freight', value: 100 }
// }

// 2. Create a generic function to evaluate the predicate structure
function evaluatePredicate(item, predicate) {
  if (!predicate) return true;

  switch (predicate.type) {
    case 'and':
      return evaluatePredicate(item, predicate.left) && evaluatePredicate(item, predicate.right);
    case 'or':
      return evaluatePredicate(item, predicate.left) || evaluatePredicate(item, predicate.right);
    case 'not':
      return !evaluatePredicate(item, predicate.value);
    case 'eq':
      return item[predicate.field] === predicate.value;
    case 'ne':
      return item[predicate.field] !== predicate.value;
    // Add other cases like 'gt', 'lt', 'ge', 'le', 'contains', 'startswith', etc.
    // Ensure data types are handled correctly (e.g., date parsing).
    default:
      console.warn(`Unknown predicate type: ${predicate.type}`);
      return false;
  }
}

// 3. Create a final predicate function
function createODataFilterFunction(filterString) {
  const structure = parse(filterString);
  return (item) => evaluatePredicate(item, structure);
}

// Usage Example:
const data = [
  { FirstName: 'John', LastName: 'Doe', Freight: 50 },
  { FirstName: 'Jane', LastName: 'Doe', Freight: 120 },
  { FirstName: 'John', LastName: 'Smith', Freight: 200 }
];

const filterFn = createODataFilterFunction(filterString);

const filteredData = data.filter(filterFn);

console.log(filteredData);
// Output: [{ FirstName: 'John', LastName: 'Smith', Freight: 200 }]
 */
