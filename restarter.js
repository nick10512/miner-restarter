const CGMinerClient = require('cgminer-api')
const CronJob = require('cron').CronJob
const exec = require('child_process').exec
require('dotenv').config()

console.log(process.env.ROOT_PASSWORD)

// Make a client to talk to a miner
const cgminer = new CGMinerClient({
  host: '192.168.128.27',
  port: 4028
});

// Create a job to run every 15 minutes
const restartJob = new CronJob('0 */15 * * * *', function () {
  restartIfNecessary()
})

// Start the timer
restartJob.start()

response = {
  'SUMMARY': [
    {
      'GHS 5s': '10000'
    }
  ]
}

function restartIfNecessary () {
  // Get summary information
  cgminer.sendCommand('summary', function (err, response) {
    if (err != undefined) {
      return
    }

    console.log(response)
    console.log('Hashrate: ' + response['SUMMARY'][0]['GHS 5s'])

    // Restart if machine has 0 hashrate
    if (response['SUMMARY'][0]['GHS 5s'] !== '0') {
      console.log('Restarting')
      // cgminer.sendCommand('restart', function (err, response) {
      exec('ssh root@192.168.128.27 /sbin/reboot', function (err, stdout, stderr) {
        console.log(err, response)
        console.log('Restart complete')
      })
    }

  })
}

// Check for restart on startup
restartIfNecessary()

const addThenDoSomething = function (x, func) {
  const y = x + x
  func(y)
}

const log = function (message) {
  console.log(message)
}

addThenDoSomething(3, log)

//
// var integer = 8
// var number = 8.3
// var string = 'hello'
// var boolean = true
// var object = {
//   int: integer,
//   num: number,
//   str: string,
//   bool: boolean
// }
// console.log(object.num)
//
// var array = [1, 2, 3, 4]
// console.log(array[0])
//
// if (boolean) {
//   console.log("TRUE")
// } else {
//   console.log("FALSE")
// }
