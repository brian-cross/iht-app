// Define the schedule rotations. 0 = day off, 1 = weekday shift, 2 = weekend shift.
// Week 1 start is referenced off the existing schedule, starting on January 3 2021.
// All schedules are calculated starting from that date.
const rotation = [
  0, 1, 1, 0, 0, 1, 2, // Week 1
  2, 1, 0, 0, 0, 1, 2, // Week 2
  2, 0, 0, 1, 1, 1, 0, // Week 3
  0, 0, 1, 1, 1, 0, 0, // Week 4
];

export default rotation;
