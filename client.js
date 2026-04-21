const soap = require('soap');

const CALCULATOR_WSDL_URL = 'http://localhost:8000/calculator?wsdl';
const TEMPERATURE_WSDL_URL = 'http://localhost:8000/temperature?wsdl';

function extractSoapError(error) {
 return error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message;
}

async function testCalculatorService() {
 const calculatorClient = await soap.createClientAsync(CALCULATOR_WSDL_URL);

 console.log('Client SOAP Calculatrice connecte');
 console.log('Operations disponibles:', Object.keys(calculatorClient.CalculatorService.CalculatorPort));
 console.log('\n--- Tests CalculatorService ---\n');

 const addResult = await calculatorClient.AddAsync({ a: 10, b: 5 });
 console.log(`Addition: 10 + 5 = ${addResult[0].result}`);

 const subResult = await calculatorClient.SubtractAsync({ a: 10, b: 3 });
 console.log(`Soustraction: 10 - 3 = ${subResult[0].result}`);

 const mulResult = await calculatorClient.MultiplyAsync({ a: 4, b: 7 });
 console.log(`Multiplication: 4 x 7 = ${mulResult[0].result}`);

 const divResult = await calculatorClient.DivideAsync({ a: 20, b: 4 });
 console.log(`Division: 20 / 4 = ${divResult[0].result}`);

 const moduloResult = await calculatorClient.ModuloAsync({ a: 20, b: 6 });
 console.log(`Modulo: 20 % 6 = ${moduloResult[0].result}`);

 const powerResult = await calculatorClient.PowerAsync({ a: 2, b: 8 });
 console.log(`Power: 2^8 = ${powerResult[0].result}`);

 const powerNegativeResult = await calculatorClient.PowerAsync({ a: 2, b: -3 });
 console.log(`Power (exposant negatif): 2^-3 = ${powerNegativeResult[0].result}`);

 console.log('\n--- Tests erreurs CalculatorService ---');

 try {
 await calculatorClient.DivideAsync({ a: 10, b: 0 });
 } catch (error) {
 console.log(`Erreur division par zero: ${extractSoapError(error)}`);
 }

 try {
 await calculatorClient.ModuloAsync({ a: 10, b: 0 });
 } catch (error) {
 console.log(`Erreur modulo par zero: ${extractSoapError(error)}`);
 }

 try {
 await calculatorClient.PowerAsync({ a: 0, b: -2 });
 } catch (error) {
 console.log(`Erreur puissance invalide: ${extractSoapError(error)}`);
 }
}

async function testTemperatureService() {
 const temperatureClient = await soap.createClientAsync(TEMPERATURE_WSDL_URL);

 console.log('\nClient SOAP Temperature connecte');
 console.log('Operations disponibles:', Object.keys(temperatureClient.TemperatureService.TemperaturePort));
 console.log('\n--- Tests TemperatureService ---\n');

 const cToF = await temperatureClient.CelsiusToFahrenheitAsync({ value: 25 });
 console.log(`CelsiusToFahrenheit: 25C -> ${cToF[0].result}F`);

 const fToC = await temperatureClient.FahrenheitToCelsiusAsync({ value: 77 });
 console.log(`FahrenheitToCelsius: 77F -> ${fToC[0].result}C`);

 const cToK = await temperatureClient.CelsiusToKelvinAsync({ value: 25 });
 console.log(`CelsiusToKelvin: 25C -> ${cToK[0].result}K`);
}

async function main() {
 try {
 await testCalculatorService();
 await testTemperatureService();
 } catch (error) {
 console.error('Erreur de connexion ou execution:', error.message);
 }
}

main();
