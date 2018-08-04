const CGMinerClient = require('cgminer-api')
const CronJob = require('cron').CronJob
const exec = require('child_process').exec
require('dotenv').config()

// Make a client to talk to a miner
// const cgminer = new CGMinerClient({
//   host: '192.168.128.27',
//   port: 4028
// });

const ipaddresses = process.env.IP_ADDRESSES.split(',')
miners = []
for (ipaddress of ipaddresses) {
  var miner = new CGMinerClient({
    host: ipaddress,
    port: 4028
  })
  miner.ipaddress = ipaddress
  miners.push(miner)
}

// Create a job to run every 15 minutes

function runRestartJob () {
  console.log("Checking all miners")
  for (miner of miners) {
    restartIfNecessary(miner)
  }
}

const restartJob = new CronJob('0 */15 * * * *', runRestartJob)

// Start the timer
restartJob.start()

function restartIfNecessary (miner) {
  // Get summary information
  miner.sendCommand('summary', function (err, response) {
    if (err != undefined) {
      return
    }

    console.log('Hashrate at IP address ' + miner.ipaddress + ': ' + response['SUMMARY'][0]['GHS 5s'])

    // Restart if machine has 0 hashrate
    if (response['SUMMARY'][0]['GHS 5s'] === '0') {
      console.log('Restarting')
      // cgminer.sendCommand('restart', function (err, response) {
      exec('sshpass -v -f rootpass.txt ssh -o "StrictHostKeyChecking no" root@192.168.128.24 /sbin/reboot', function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
        console.log('Restart complete')
      })
    }

  })
}

runRestartJob()
