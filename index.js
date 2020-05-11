var result = Number(document.getElementById('Result').innerHTML);
var counter = document.getElementById('Counter').innerHTML;
var errors = document.getElementById('Errors').innerHTML;
var hostColor = document.getElementById('hostColor').innerHTML;
var langColor = document.getElementById('langColor').innerHTML;
var flag = 0;

if(hostColor == 'yellow') {    
  document.getElementById("hostPercentage").setAttribute('style','color: #e6c300;');
  document.getElementById("hostStage").setAttribute('style','background: #FFD700;');
}

if(langColor == 'yellow') {    
  document.getElementById("langPercentage").setAttribute('style','color: #e6c300;');
  document.getElementById("langStage").setAttribute('style','background: #FFD700;');
}

function Time() {
  var ipTime, systemTime, systemHour, systemMinutes, ipTimeSplit, ipHour, ipMinutes;

  ipTime = String(document.getElementById('localTime').innerHTML);

  systemTime = new Date();
  document.getElementsByClassName('date')[0].innerHTML = systemTime;
  document.getElementsByClassName('date')[1].innerHTML = systemTime;

  systemHour = systemTime.getHours().toString();
  systemHour = ("0" + systemHour).slice(-2);

  systemMinutes = systemTime.getMinutes().toString();
  systemMinutes = ("0" + systemMinutes).slice(-2);
  
  ipTimeSplit = ipTime.split(':');

  ipHour = ipTimeSplit[0];
  ipMinutes = ipTimeSplit[1];

  if(!ipTime || !systemTime || !systemHour || !systemMinutes || !ipHour || !ipMinutes){
    document.getElementsByClassName("check2")[0].innerHTML = 'Error!';
    document.getElementsByClassName("check2")[1].innerHTML = 'Error!';
    document.getElementById("datePercentage").setAttribute('style','color: #e6c300;');
    document.getElementById("dateStage").setAttribute('style','background: #FFD700;');
    document.getElementById("toast2").classList.add("toast--yellow");
    errors++;
  }
  else{
    if(systemMinutes == '59' && ipMinutes == '00' && ipHour == Number(systemHour)+1){
      document.getElementsByClassName("check2")[0].innerHTML = 'Succeed';
      document.getElementsByClassName("check2")[1].innerHTML = 'Succeed';
    }
    else{
      if(systemHour==ipHour && (systemMinutes >= ipMinutes-2 && systemMinutes <= ipMinutes+5)){
        document.getElementsByClassName("check2")[0].innerHTML = 'Succeed';
        document.getElementsByClassName("check2")[1].innerHTML = 'Succeed';
      }
      else{
        DatePercentage = 
        document.getElementsByClassName('datePercentage')[0].innerHTML = '15%';
        document.getElementsByClassName('datePercentage')[1].innerHTML = ' - 15%';
        document.getElementsByClassName('check2')[0].innerHTML = 'Failed';
        document.getElementsByClassName('check2')[1].innerHTML = 'Failed';
        document.getElementById('date_time').setAttribute('data-percentage','15');
        document.getElementById("datePercentage").setAttribute('style','color: red;');
        document.getElementById("dateStage").setAttribute('style','background: red;');
        document.getElementById("dateFg").setAttribute('style','width: 15%; background: red;');
        document.getElementById("toast2").classList.add("toast--red");
        counter++;
        result += 15;
      }
    }
  }
  timeZone();
};


function timeZone(){
  var systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var ipTimeZone = document.getElementById("TimeZone").innerHTML;

  if(!systemTimeZone || !ipTimeZone){
    document.getElementsByClassName("check3")[0].innerHTML = 'Error!';
    document.getElementsByClassName("check3")[1].innerHTML = 'Error!';
    document.getElementById("zonePercentage").setAttribute('style','color: #e6c300;');
    document.getElementById("zoneStage").setAttribute('style','background: #FFD700;');
    document.getElementById("toast3").classList.add("toast--yellow");
    errors++;
  }
  else{
    if(systemTimeZone == ipTimeZone){
      document.getElementsByClassName("check3")[0].innerHTML = 'Succeed';
      document.getElementsByClassName("check3")[1].innerHTML = 'Succeed';
    }
    else{
      document.getElementsByClassName('zonePercentage')[0].innerHTML = '15%';
      document.getElementsByClassName('zonePercentage')[1].innerHTML = ' - 15%';
      document.getElementsByClassName('check3')[0].innerHTML = 'Failed';
      document.getElementsByClassName('check3')[1].innerHTML = 'Failed';
      document.getElementById('time_zone').setAttribute('data-percentage','15');
      document.getElementsByClassName('zonePercentage')[0].setAttribute('style','color: red;');
      document.getElementById("zoneStage").setAttribute('style','background: red;');
      document.getElementById("zoneFg").setAttribute('style','width: 15%; background: red;');
      document.getElementById("toast3").classList.add("toast--red");
      counter++;
      result += 15;
    }
  }
  isTor();
};


function isTor(){
  if (performance.now() % 100 !== 0) {
    document.getElementsByClassName("check6")[0].innerHTML = 'Succeed';
    document.getElementsByClassName ("check6")[1].innerHTML = 'Succeed';
  }
  else{
    result += 25;
    counter++;
    document.getElementsByClassName('torPercentage')[0].innerHTML = '20%';
    document.getElementsByClassName('torPercentage')[1].innerHTML = ' - 20%';
    document.getElementsByClassName('check6')[0].innerHTML = 'Failed';
    document.getElementsByClassName('check6')[1].innerHTML = 'Failed';
    document.getElementById('tor').setAttribute('data-percentage','20');
    document.getElementById("torPercentage").setAttribute('style','color: red;');
    document.getElementById("torStage").setAttribute('style','background: red;');
    document.getElementById("torFg").setAttribute('style','width: 20%; background: red;');
    document.getElementById("toast6").classList.add("toast--red");
  }
  WebRTC();
};


function WebRTC(){
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new myPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]}),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;
    document.getElementById("A").innerHTML = window.RTCPeerConnection
    document.getElementById("B").innerHTML = window.mozRTCPeerConnection
    document.getElementById("C").innerHTML = window.webkitRTCPeerConnection
    if(!window.mozRTCPeerConnection || !window.webkitRTCPeerConnection) check();

  function ipIterate(ip) {
    if (!localIPs[ip]);
    localIPs[ip] = true;
  }
  
  pc.createDataChannel("");
  
  pc.createOffer(function(sdp) {
    sdp.sdp.split('\n').forEach(function(line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop);
  
  pc.onicecandidate = function(ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
    check()
  };

  function check(){
    var clientIP = document.getElementById("clientIP").innerHTML;
    if(!Object.keys(localIPs)[0] && !Object.keys(localIPs)[1]){
      document.getElementsByClassName("check5")[0].innerHTML = 'Error!';
      document.getElementsByClassName("check5")[1].innerHTML = 'Error!';
      document.getElementById("rtcPercentage").setAttribute('style','color: #e6c300;');
      document.getElementById("rtcStage").setAttribute('style','background: #FFD700;');
      document.getElementById("toast5").classList.add("toast--yellow");
      errors++;
      Update();
    }
    else{
      if (clientIP == Object.keys(localIPs)[0] || clientIP == Object.keys(localIPs)[1]) {
        document.getElementsByClassName("check5")[0].innerHTML = 'Succeed';
        document.getElementsByClassName("check5")[1].innerHTML = 'Succeed';
        Update();
      }
      else{
        result += 20;
        counter++;
        document.getElementsByClassName('rtcPercentage')[0].innerHTML = '20%';
        document.getElementsByClassName('rtcPercentage')[1].innerHTML = ' - 20%';
        document.getElementsByClassName('check5')[0].innerHTML = 'Failed';
        document.getElementsByClassName('check5')[1].innerHTML = 'Failed';
        document.getElementById('WebRTC').setAttribute('data-percentage','20');
        document.getElementById("rtcPercentage").setAttribute('style','color: red;');
        document.getElementById("rtcStage").setAttribute('style','background: red;');
        document.getElementById("rtcFg").setAttribute('style','width: 20%; background: red;');
        document.getElementById("toast5").classList.add("toast--red");
        document.getElementById("leakedIPs").innerHTML = "<u style='font-size: 14px;'>leaked ip:</u> " + Object.keys(localIPs)[0];
        if(Object.keys(localIPs)[1] != '0.0.0.0' && Object.keys(localIPs)[1] != undefined){
          document.getElementById("leakedIPs").innerHTML += ' / ' + Object.keys(localIPs)[1];
        }
        Update();
      }
    }
  }
};


function Update(){
  els = document.getElementsByClassName("Using");
  if(errors >= 3){
    Array.prototype.forEach.call(els, (el) => {el.setAttribute('style','color: #e6c300;');});
    Array.prototype.forEach.call(els, (el) => {el.innerHTML = 'Checking Error!';});
  }
  else{
    if(result >= 50){
      Array.prototype.forEach.call(els, (el) => {el.setAttribute('style','color: red;');});
      Array.prototype.forEach.call(els, (el) => {el.innerHTML = 'You are Using VPN!';});
    }
    else{
      Array.prototype.forEach.call(els, (el) => {el.setAttribute('style','color: #0071b3;');});
      Array.prototype.forEach.call(els, (el) => {el.innerHTML = 'You are Not Using VPN.';});
    }
  }

  document.getElementById("count").innerHTML = counter;
  document.getElementById("progress").setAttribute('style', 'width: ' + counter * 100/6 + '%');

  $(".trigger").each(function() {
    $(this).each(function() {
      var percentage = $(this).data("percentage");
      $(this).css("height", percentage * 4 + "%"); 
      $(this).prop("Counter", 0).animate(
        {Counter: $(this).data("percentage")},{duration: 1800,easing: "swing",step: function(now) {
          $(this).text(Math.ceil(now));
        }
      });
    });
  });
}


function updateGraph() {
  var mySvg = document.querySelector('#my-svg');
  var snap = Snap(mySvg);
  var w = mySvg.width.baseVal.value,h = mySvg.height.baseVal.value,cx = w / 2,cy = h / 2;
  var radius = 100;
  var perimeter = 2 * Math.PI * radius;
  var color = '#007ac1';

  var circle = snap.circle(cx, cy, radius);
  var text = document.querySelector('.percent-text');
  text.style.color = color;
  if(errors >= 3){
  color = '#e6c300';
  text.style.color = '#e6c300';
  }

  if(result >= 0.5){
    color = '#e60000';
    text.style.color = color;
  }

  // Reset attributes
  circle.attr({
	fill: 'none',
	stroke: color,
	strokeWidth: '0.7cm',
	strokeDasharray: '0 ' + perimeter,
	strokeDashoffset: perimeter * .25 });

  // Animate
  Snap.animate(0, result/100, val => {
	circle.attr({
	  strokeDasharray: perimeter * val + ' ' + perimeter * (1 - val) });
	text.innerHTML = Math.round(val * 100) + '%';
  }, 2500, mina.easeinout);
};

function toggle(checked) {
  if(checked){
    document.getElementById("chartView").setAttribute('style', 'display:none;');
    document.getElementById("pyView").setAttribute('style', 'display:inline;');
    document.getElementById("body").setAttribute('style','background: #efefef;');
    if (flag == 0) updateGraph(); flag = 1;
  }
  else{
    document.getElementById("pyView").setAttribute('style', 'display:none;');
    document.getElementById("chartView").setAttribute('style', 'display:inline;');
    document.getElementById("body").setAttribute('style','background: -webkit-gradient(linear, left top, left bottom, from(#30303A), to(#808080)) fixed;');
  }
}

jQuery(document).ready(function(){
  jQuery('.toast__close').click(function(e){
    e.preventDefault();
    var parent = $(this).parent('.toast');
    parent.fadeOut("slow", function() { $(this).remove(); } );
  });
});