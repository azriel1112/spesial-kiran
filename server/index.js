import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const TIMEZONE = "Asia/Jakarta";
const TARGET_DATE = "2026-05-24";

app.get("/api/time", (req, res) => {
  const now = dayjs().tz(TIMEZONE);

  const targetStart = dayjs.tz(`${TARGET_DATE} 00:00:00`, TIMEZONE);
  const targetEnd = dayjs.tz(`${TARGET_DATE} 23:59:59`, TIMEZONE);

  const isBirthday =
    now.isAfter(targetStart.subtract(1, "millisecond")) &&
    now.isBefore(targetEnd.add(1, "millisecond"));

  res.json({
    timezone: TIMEZONE,
    now: now.format(),
    nowText: now.format("DD MMMM YYYY HH:mm:ss"),
    targetDate: TARGET_DATE,
    targetDateText: "24 Mei 2026",
    targetTimestamp: targetStart.valueOf(),
    isBirthday
  });
});

app.listen(PORT, () => {
  console.log(`Birthday backend running on http://localhost:${PORT}`);
});
