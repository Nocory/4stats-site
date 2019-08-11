# 4stats-site

The [**4stats website**](https://4stats.io) displays live statistics of 4chan boards and most active threads, as well as past activity.

With some exceptions most SFW-_ish_ boards had their history recorded since the end of July 2017. NSFW-_ish_ boards were added later and have been recorded since the end of october.

---

## Main Libraries:

The site mainly uses [**Vue.js**](https://vuejs.org/) to render updating stats and threads.

[**Chart.js**](http://www.chartjs.org/) is utilized to display the recorded post- & activity-history.

Bundled together with [**Webpack**](https://webpack.js.org/) and hosted on [**Netlify**](https://www.netlify.com/).

---

## Client-Server Communication

The site establishes a socket connection to the [**4stats API**](https://github.com/nocory/4stats-api) server.

Board-statistics are streamed via the socket, while thread and timelinedata is requested from the REST API.
