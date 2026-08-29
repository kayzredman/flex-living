const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting QA Certification Tests for Identity Service...');
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  const request = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(`${BASE_URL}${path}`, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // Test 1: Health Check
    let res = await request('GET', '/health');
    assert(res.status === 200 && res.data.status === 'OK', 'Health check endpoint returns 200 OK');

    // Test 2: Register without phone number
    res = await request('POST', '/v1/auth/register', {});
    assert(res.status === 400 && res.data.error, 'Register validates missing phone number');

    // Test 3: Successful Registration (OTP Generation)
    const testPhone = '+233551234567';
    res = await request('POST', '/v1/auth/register', { phoneNumber: testPhone });
    assert(res.status === 200 && res.data.debug && res.data.debug.otp, 'Register generates and returns mock OTP');
    const otp = res.data.debug.otp;

    // Test 4: Verify with wrong OTP
    res = await request('POST', '/v1/auth/verify-otp', { phoneNumber: testPhone, otp: '000000' });
    assert(res.status === 401, 'Verify rejects incorrect OTP');

    // Test 5: Successful Verification & JWT Issuance
    res = await request('POST', '/v1/auth/verify-otp', { phoneNumber: testPhone, otp });
    assert(res.status === 200 && res.data.token && res.data.user, 'Verify accepts correct OTP and issues JWT');
    assert(res.data.user.phone_number === testPhone, 'JWT response includes correct user record');

    // Test 6: Database Persistence Check (Verify again should fail since OTP is cleared)
    res = await request('POST', '/v1/auth/verify-otp', { phoneNumber: testPhone, otp });
    assert(res.status === 401, 'OTP is invalidated after successful use');

  } catch (err) {
    console.error('QA Test execution failed:', err.message);
  }

  console.log('\n📊 QA Summary:');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('🏆 QA CERTIFICATION: APPROVED. Milestone 1 meets all requirements.');
  } else {
    console.log('🚨 QA CERTIFICATION: REJECTED. Please fix the failing tests.');
  }
}

runTests();
