load('api_events.js');
load('api_config.js');
load('api_timer.js');
load('api_gpio.js');
load('api_uart.js');
load('api_sys.js');
load('api_gpio.js');
load('api_blynk.js');
load('api_rpc.js');

let ping = 0;
let relayPin=Cfg.get('hardware.relayPin');  
let relayStat=Cfg.get('hardware.relayStat'); //initial status of relay

GPIO.setup_output(relayPin, relayStat);


 if (relayStat===true)
{
  print('Door lock open');
  Timer.set(Cfg.get('hardware.pulseTm'), 0, function () {
    print('Door lock closed');
    GPIO.write(relayPin, 0);
  }, null);
}

Blynk.setHandler(function(conn, cmd, pin, val, id) {
  print(cmd);
  // print(Blynk.isConnected());
  if (cmd === 'vr') {
    ping=!ping; 
    Blynk.virtualWrite(conn, 0, ping, id);
  }
  else if (cmd === 'vw'&& pin===5 && val===1 ) {
    // using virtual pin 5 to turn on 
    print('Door lock open');
    GPIO.write(relayPin, 1);
    Timer.set(Cfg.get('hardware.pulseTm'), 0, function () {
      print('Door lock closed');
      GPIO.write(relayPin, 0);
    }, null);
  }
}, null);
