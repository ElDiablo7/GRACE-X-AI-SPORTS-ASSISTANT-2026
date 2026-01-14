const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: Number(process.env.PORT || 3001),
      path: path,
      method: 'GET',
      headers: {
        'x-client-key': 'pro-user-123'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Invalid JSON', raw: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function verify() {
  console.log('--- VERIFYING REAL DATA FEEDS ---\n');

  try {
    console.log('Fetching Racing Data...');
    const racingData = await makeRequest('/api/racing/upcoming');
    const list = Array.isArray(racingData.races) ? racingData.races
               : Array.isArray(racingData.racecards) ? racingData.racecards
               : Array.isArray(racingData.race_cards) ? racingData.race_cards
               : [];
    if (list.length > 0) {
      console.log(`✅ Racing API Connected. Found ${list.length} racecards.`);
      const firstRace = list[0];
      const runners = Array.isArray(firstRace.runners) ? firstRace.runners
                    : Array.isArray(firstRace.runner_details) ? firstRace.runner_details
                    : [];
        console.log(`   Sample: ${firstRace.course} at ${firstRace.time}`);
        console.log(`   Runners: ${runners.length}`);
        const rid = firstRace.race_id || firstRace.id || '';
        console.log(`   ID: ${rid} (Format check: ${String(rid).startsWith('live-event') ? 'SIMULATED' : 'REAL'})`);
    } else {
      console.log('⚠️ Racing API returned empty or unexpected format:', Object.keys(racingData));
    }
  } catch (e) {
    console.log('❌ Racing API Failed:', e.message);
  }

  console.log('\n--------------------------------\n');

  try {
    console.log('Fetching Football Data...');
    const footballData = await makeRequest('/api/football/live');
    if (Array.isArray(footballData.response)) {
      console.log(`✅ Football API Connected. Found ${footballData.response.length} live matches.`);
      if (footballData.response.length > 0) {
        const firstMatch = footballData.response[0];
        console.log(`   Sample: ${firstMatch.teams.home.name} vs ${firstMatch.teams.away.name}`);
        console.log(`   League: ${firstMatch.league.name}`);
        console.log(`   Status: ${firstMatch.fixture.status.long}`);
      } else {
        console.log('   (No live matches currently, but API connection is valid)');
      }
    } else {
      console.log('⚠️ Football API returned unexpected format:', JSON.stringify(footballData).substring(0, 100));
    }
  } catch (e) {
    console.log('❌ Football API Failed:', e.message);
  }
}

verify();
