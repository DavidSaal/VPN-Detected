var express = require('express');
var request = require('request');
var geoip = require('geoip-lite');
var CountryLanguage = require('country-language');
var bodyParser = require('body-parser')
var app = express();
var ipClient;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var result, accept_language, time, flag, time_zone, errors;
var country, fullCountry, answer, ans, counter;
var hostColor, langColor;
var check1, check4;
var hostPercentage, langPercentage, percentage1, percentage4;
var isProxy, isTor, isVpn, isCrawler;

app.get('/', function(req, res) {
    percentage1 = 0;
    percentage4 = 0;
    counter = 0;
    result = 0;
    errors = 0;
    //console.log(JSON.stringify(req.headers));
    console.log("\n------------------------------------------------------");
    //ipClient = '217.182.175.75'; //Proxy
    //ipClient = '104.248.140.7'; //VPN
    //ipClient = '109.64.95.83'; //Real IP
    ipClient = req.header('x-forwarded-for');
    accept_language = req.header('accept-language');
    country = geoip.lookup(ipClient)['country'];
    time_zone = geoip.lookup(ipClient)['timezone'];
    fullCountry = CountryLanguage.getCountry(country).name;
    console.log("Client Connected..");
    console.log(`Client IP: ${ipClient}`);
    console.log("----------------DetectionInfo--------------------");
    DetectionInfo(res);
})

let port = process.env.PORT;;
if (port == null || port == "") {
    port = 3000;
  }

app.listen(port);
console.log("-------------------");
app.use(express.static(__dirname + '/'));
console.log("Server is running..");

function DetectionInfo(res)
{
  request(`https://www.ipqualityscore.com/api/json/ip/uglNEXB1BLgftt4M5FyKRFrpdRFk6t0W/${ipClient}`,function(error,response,body){
    var bodyData1 = JSON.parse(body);
    if(error || bodyData1['success'] == 'false'){
      console.log('DetectionInfo error:', bodyData1['success']);
    }
    else{
      isProxy = bodyData1['proxy']
      isTor = bodyData1['tor']
      isVpn = bodyData1['vpn']
      isCrawler = bodyData1['is_crawler']
        console.log('DetectionInfo result - ', 'isProxy: ' + bodyData1['proxy'] + ' isTor: ' + bodyData1['tor'] + ' isVpn: ' + bodyData1['vpn'] + ' isCrawler: ' + bodyData1['is_crawler']);
      }
    console.log('1. Result is:', result);
    console.log("--------------------HostChecker-----------------------");
    HostChecker(res);
  }
)};


function HostChecker(res)
{
   request(`https://www.ipqualityscore.com/api/json/ip/uglNEXB1BLgftt4M5FyKRFrpdRFk6t0W/${ipClient}`,function(error,response,body){
    var bodyData = JSON.parse(body);
    if(error || bodyData['success'] == false){
      console.log('HostChecker error:', bodyData['success']);
      hostColor = 'yellow';
      check1 = 'Error!';
      errors++;
    }
    else{
      ans = 0;
      ipNumbers = ipClient.split('.');
      replace = ipNumbers[0]+'-'+ipNumbers[1]+'-'+ipNumbers[2]+'-'+ipNumbers[3];
      ipNumbers.forEach(function (num) {ans += bodyData['host'].includes(num)})
      if(bodyData['host'] == ipClient || (bodyData['region'] == 'N\/A' && bodyData['city'] == 'N\/A') || !bodyData['host'].includes(replace) || ans < 4){
          check1 = 'Failed';
          result += 10;
          hostPercentage = ' - 10%'
          percentage1 = 10
          hostColor = 'red'
          counter++;
        }
        else{
          check1 = 'Succeed';
          hostColor = 'green'
        }
        console.log('HostChecker result is:', bodyData['host'] + ' || Region: ' + bodyData['region'] + ' || City: ' + bodyData['city']);
      }
    console.log('2. Result is:', result);
    console.log("------------------Accepted_Language--------------------");
    Accepted_Language(res);
 })
};


function Accepted_Language(res){
  try {
    console.log('iP_Country:',country);
    console.log('Accepted_Language:', accept_language);
  } catch (err) {'Accepted_Language Function Error!'; langColor = '#e6c300'; check4 = 'Error!'; errors++;}
  request(`https://api.ipgeolocation.io/timezone?apiKey=3f643672d11b4aff9c827233f1e5cb05&tz=` + fullCountry ,function(error,response,body){
  if(error || fullCountry == undefined){
    time = undefined;
  }
  else{
    time = JSON.parse(body)['time_24'];
  }  
  
  answer = 0;

  CountryLanguage.getCountryLanguages(country, function (err, languages) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Languages: ',languages);
      languages.forEach(function (languageCodes) {
        console.log('#.', languageCodes.iso639_1);
        if(languageCodes.iso639_1 == 'en'){
        }
        else{
          answer += accept_language.includes(languageCodes.iso639_1);
        }
        })
      }
    })
  console.log('Accepted_Language result:', answer);

  if(!country || !accept_language){
    console.log('Accepted_Language error: Country: ' + country + '  Accepted languages: ' + accept_language);
    langColor = 'yellow';
    check4 = 'Error!';
    errors++;
  }
  else{
    if(country == 'US'){
      langColor = 'yellow';
      check4 = 'US Error!';
      errors++;
    }
    else{
      if(answer == 0){
        check4 = 'Failed';
        result += 20;
        langPercentage = '- 20 %'
        percentage4 = 20
        langColor = 'red'
        counter++;
      }
      else{
        check4 = 'Succeed';
        langColor = 'green'
    }
  }
}
  console.log('3. Result is:', result);
  console.log("--------------------Request End-----------------------");
  flag = 'https://www.countryflags.io/' + country + '/shiny/24.png'
  res.render('index',{result,time,country:fullCountry,flag,time_zone,ipClient,hostColor,langColor
                    ,check1,check4,hostPercentage,langPercentage,percentage1,percentage4,isProxy,isTor,isVpn,isCrawler,counter,errors});
});
};