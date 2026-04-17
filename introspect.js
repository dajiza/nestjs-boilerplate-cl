const crypto = require('crypto');
const fs = require('fs');
const https = require('https');

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((a, l) => {
  const p = l.split('=');
  if (p[0]) a[p[0]] = p.slice(1).join('=');
  return a;
}, {});

const ts = Math.floor(Date.now() / 1000);
const p = 'blvd-admin-v1' + env.BOULEVARD_BUSINESS_ID + ts;
const rk = Buffer.from(env.BOULEVARD_SECRET_KEY, 'base64');
const sig = crypto.createHmac('sha256', rk).update(p, 'utf8').digest('base64');
const t = sig + p;
const c = Buffer.from(env.BOULEVARD_API_KEY + ':' + t).toString('base64');

const types = ['NativeObjectMeta', 'StaffLocationAbilities', 'StaffRole', 'CreditCard'];
const query = `{
  ${types.map((name, i) => `t${i}: __type(name: "${name}") { name fields { name type { name kind ofType { name } } } }`).join('\n')}
}`;

const u = new URL(env.BOULEVARD_API_ENDPOINT);
const d = JSON.stringify({ query });
const r = https.request({
  hostname: u.hostname,
  path: u.pathname,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + c }
}, res => {
  let b = '';
  res.on('data', ch => b += ch);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(b), null, 2)));
});
r.write(d);
r.end();
