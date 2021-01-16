/**
 * Returns a list of holidays for the specified year.
 * Supports one year before and two years after the current year.
 * @param {number} [year=currentYear] - The year in which to return the holiday dates.
 * Defaults to the current year.
 */
async function getHolidays(year) {
  const holidayList = [];

  const civicHolidayId = 17;
  const easterMondayId = 8;
  const boxingDayId = 27;

  const currentYear = new Date().getFullYear();
  const actualYear = year ?? currentYear;

  if (actualYear < currentYear - 1 || actualYear > currentYear + 2)
    throw new Error(
      `Year must be between ${currentYear - 1} and ${currentYear + 2}.`
    );

  const baseUrl = "https://canada-holidays.ca/api/v1";
  const generalEndpoint = `${baseUrl}/provinces/AB?year=${actualYear}`;
  const civicEndpoint = `${baseUrl}/holidays/${civicHolidayId}?year=${actualYear}`;
  const easterEndpoint = `${baseUrl}/holidays/${easterMondayId}?year=${actualYear}`;
  const boxingEndpoint = `${baseUrl}/holidays/${boxingDayId}?year=${actualYear}`;

  const promises = await Promise.all([
    fetch(generalEndpoint),
    fetch(civicEndpoint),
    fetch(easterEndpoint),
    fetch(boxingEndpoint),
  ]);

  promises.forEach(async promise => {
    const data = await promise.json();
    // Individual holiday
    if (data.holiday) {
      const { holiday } = data;
      // console.log(`Date: ${holiday.date} Name: ${holiday.nameEn}`);
      holidayList.push({ date: holiday.date, name: holiday.nameEn });
    }

    // Provincial holidays
    if (data.province) {
      data.province.holidays.forEach(holiday => {
        // console.log(`Date: ${holiday.date} Name: ${holiday.nameEn}`);
        holidayList.push({ date: holiday.date, name: holiday.nameEn });
      });
    }
  });

  return holidayList;
}

export default getHolidays;
