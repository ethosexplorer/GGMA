const ACUITY_FEED_URL = "https://app.acuityscheduling.com/export.php?owner=22720152&token=cm1oNFAxdS9BWXl5Q2RNWTNoVFFRV2FBdEN6S3Y1TlJDUWlYSjhrZGR1TWZoSjR5TTBrUGlOcmEyamJEaDYxajZQQ3V0MVRBdlhJREVkdzZkMFdzZGRVWXFoL2FVSUU5QXh5ZEY4eTdvQ2ZYS2g2Q0FLTmlydnB6a0RaYQ%3D%3D";

function convertUTCToTimeZone(dateStr, timeZone = 'America/Chicago') {
  if (!dateStr || dateStr.length < 15) return { date: '', time: '00:00' };
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6));
  const day = parseInt(dateStr.slice(6, 8));
  const hour = parseInt(dateStr.slice(9, 11));
  const min = parseInt(dateStr.slice(11, 13));
  const sec = parseInt(dateStr.slice(13, 15));
  
  const date = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const partMap = {};
  parts.forEach(p => partMap[p.type] = p.value);
  
  const localDate = `${partMap.year}-${partMap.month}-${partMap.day}`;
  const localTime = `${partMap.hour}:${partMap.minute}`;
  return { date: localDate, time: localTime };
}

function parseICalTime(val) {
  if (!val) return { date: '', time: '00:00' };
  if (val.endsWith('Z')) {
    return convertUTCToTimeZone(val);
  }
  const date = `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`;
  let time = '00:00';
  if (val.includes('T')) {
    const tIdx = val.indexOf('T');
    time = `${val.slice(tIdx + 1, tIdx + 3)}:${val.slice(tIdx + 3, tIdx + 5)}`;
  }
  return { date, time };
}

function parseICS(icsText) {
  const events = [];
  const lines = icsText.split(/\r?\n/);
  
  const unfoldedLines = [];
  for (let line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfoldedLines.length > 0) {
        unfoldedLines[unfoldedLines.length - 1] += line.slice(1);
      }
    } else {
      unfoldedLines.push(line);
    }
  }

  let currentEvent = null;
  for (let line of unfoldedLines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (currentEvent) {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        let key = line.slice(0, colonIdx);
        const value = line.slice(colonIdx + 1);
        if (key.includes(';')) {
          key = key.split(';')[0];
        }
        currentEvent[key] = value;
      }
    }
  }
  return events;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(ACUITY_FEED_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Acuity feed: ${response.statusText}`);
    }
    const icsText = await response.text();
    const rawEvents = parseICS(icsText);

    const formattedEvents = rawEvents.map((ev, index) => {
      const start = parseICalTime(ev.DTSTART);
      const end = parseICalTime(ev.DTEND);
      
      const summary = ev.SUMMARY || 'Untitled Booking';
      const description = (ev.DESCRIPTION || '').replace(/\\n/g, '\n').replace(/\\,/g, ',');
      const location = ev.LOCATION || '';
      
      // Auto-categorize
      const lower = summary.toLowerCase();
      let category = 'ops';
      let color = 'bg-indigo-500';
      let label = '📅';

      if (lower.includes('med card') || lower.includes('qualifying') || lower.includes('doctor') || lower.includes('intake')) {
        category = 'telehealth';
        color = 'bg-emerald-500';
        label = '🩺 Telehealth';
      } else if (lower.includes('demo') || lower.includes('walk-through') || lower.includes('meeting') || lower.includes('consult')) {
        category = 'executive';
        color = 'bg-purple-500';
        label = '🤝 Executive';
      } else if (lower.includes('compliance') || lower.includes('metrc')) {
        category = 'compliance';
        color = 'bg-amber-500';
        label = '📋 Compliance';
      }

      return {
        id: `acuity_${ev.UID || index}`,
        title: `${label} - ${summary}`,
        date: start.date,
        startTime: start.time,
        endTime: end.time,
        category,
        color,
        description: `${description}\n\n[Source: Acuity Scheduling]`,
        location,
        meetLink: location.startsWith('http') ? location : ''
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Acuity Feed Error:', error);
    res.status(500).json({ error: error.message });
  }
}
