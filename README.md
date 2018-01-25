# 4stats website (https://4stats.io)

The 4stats website displays live statistics of 4chan boards and most active threads, as well as past activity.

---
## How data is fetched

The site establishes a socket connection to the API server (https://api.4stats.io).

Board-stat-updates are streamed via the socket, while thread and timelinedata is requested from the REST API.

---
## 