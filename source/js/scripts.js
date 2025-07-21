(function () {
  const carreerStartDate = new Date("2017-03-01");
  const carreerStartYear = carreerStartDate.getFullYear();
  const carreerStartMonth = carreerStartDate.getMonth();
  const carreerStartDay = carreerStartDate.getDate();

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const experienceFullYears =
    todayYear -
    carreerStartYear -
    (todayMonth < carreerStartMonth ||
    (todayMonth === carreerStartMonth && todayDay < carreerStartDay)
      ? 1
      : 0);

  const expYears = document.getElementById("expYears");
  if (expYears) {
    expYears.textContent = experienceFullYears;
  }
})();
