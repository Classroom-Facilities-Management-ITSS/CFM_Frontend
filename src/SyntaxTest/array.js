const data = [
  { name: 'Event 1', date: new Date('2023-01-15T08:56:45.978') },
  { name: 'Event 2', date: new Date('2022-12-20T09:56:45.978') },
  { name: 'Event 3', date: new Date('2023-03-05T10:56:45.978') }
];

// Sorting the array based on the 'date' property
data.sort((a, b) => a.date - b.date);

console.log(data[0]);
console.log(data[1]);
console.log(data[2]);