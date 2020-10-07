var counterStarted = false;
var time;
var timer;
var timerStart;
var timeSpentOnSite = getTimeSpentOnSite();

function getTimeSpentOnSite() {
  timeSpentOnSite = parseInt(sessionStorage.getItem("timeSpentOnSite-611110"));
  timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
  return timeSpentOnSite;
}

function startCounting() {
  timerStart = Date.now();
  timer = setInterval(function () {
    timeSpentOnSite = getTimeSpentOnSite() + (Date.now() - timerStart);
    sessionStorage.setItem("timeSpentOnSite-611110", timeSpentOnSite);
    timerStart = parseInt(Date.now());
    time = parseInt(timeSpentOnSite / 1000);
  }, 1000);
}

if (!counterStarted) {
  startCounting();
  counterStarted = true;
}

// We store the navigation template history of the user
var tpl_history = new Array();

if (sessionStorage.getItem("template_history-611110") == null) {
  sessionStorage.setItem("template_history-611110", "[]");
} else {
  tpl_history = JSON.parse(sessionStorage.getItem("template_history-611110"));
  tpl_history.indexOf(tc_vars.navigation_template) === -1 ? tpl_history.push(tc_vars.navigation_template) : null;
  sessionStorage.setItem("template_history-611110", JSON.stringify(tpl_history));
}

// We check that the user visited one of the valid pages
var acceptedPages = ["page_univers", "page_pilar", "page_content"];
var validPages = tpl_history.filter(function (seenPage) {
  return acceptedPages.indexOf(seenPage) > -1;
});

console.log({
  userStatusIsEqualToSuspect: tc_vars.user_statut == "suspect",
  navigationPageDoesNotEndsWithConfirmation: !tc_vars.navigation_pagename.indexOf("_confirmation") > -1,
  userHasVisitedAValidPage: validPages.length >= 1,
  userHasSpendMoreThan30s: getTimeSpentOnSite() / 1000 > 30,
});

if (
  tc_vars.user_statut == "suspect" &&
  !tc_vars.navigation_pagename.indexOf("_confirmation") > -1 &&
  validPages.length >= 1 &&
  getTimeSpentOnSite() / 1000 > 30
) {
  if (sessionStorage.getItem("has-seen-popin-611110") == "true") {
    return false;
  } else {
    return true;
  }
} else {
  return false;
}
