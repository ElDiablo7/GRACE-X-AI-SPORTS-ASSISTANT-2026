
const https = require('https');

// 1. Test Racing API
const racingUser = 'vbpgLg668eirKd6C6cLVzuPg';
const racingPass = '1fCjR7j78E2gQnd6Ca7R5HWz';
const racingAuth = Buffer.from(`${racingUser}:${racingPass}`).toString('base64');
const racingOptions = {
  hostname: 'api.theracingapi.com',
  path: '/v1/racecards/basic?region_codes=gb',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${racingAuth}`,
    'Content-Type': 'application/json'
  }
};

console.log("--- Testing Racing API ---");
const req = https.request(racingOptions, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
        const json = JSON.parse(data);
        if (Array.isArray(json.racecards)) {
             console.log(`Found ${json.racecards.length} racecards.`);
             if(json.racecards.length > 0) console.log("Sample:", JSON.stringify(json.racecards[0], null, 2));
        } else {
             console.log("Response:", data.substring(0, 500));
        }
    } catch(e) {
        console.log("Raw body:", data.substring(0, 500));
    }
    testFootball();
  });
});

req.on('error', error => {
  console.error(error);
  testFootball();
});

req.end();

// 2. Test Football API
function testFootball() {
    console.log("\n--- Testing Football API ---");
    const footballKey = 'b7dd48542d7eab24e8b0c1e0fb54c7ba';
    const footballOptions = {
      hostname: 'v3.football.api-sports.io',
      path: '/fixtures?live=all',
      method: 'GET',
      headers: {
        'x-apisports-key': footballKey
      }
    };

    const req2 = https.request(footballOptions, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
         try {
            const json = JSON.parse(data);
            if (json.response) {
                 console.log(`Found ${json.response.length} live matches.`);
                 if (json.response.length > 0) {
                     console.log("Sample:", JSON.stringify(json.response[0], null, 2));
                 } else {
                     // Check errors
                     if (json.errors && Object.keys(json.errors).length > 0) {
                         console.log("Errors:", JSON.stringify(json.errors, null, 2));
                     }
                 }
            } else {
                 console.log("Response:", data.substring(0, 500));
            }
        } catch(e) {
            console.log("Raw body:", data.substring(0, 500));
        }
      });
    });

    req2.on('error', error => {
      console.error(error);
    });

    req2.end();
}
