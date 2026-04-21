const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Implémentation des opérations du service calculatrice
const calculatorService = {
 CalculatorService: {
 CalculatorPort: {
 // Opération Addition
 Add: function(args) {
 const result = parseFloat(args.a) + parseFloat(args.b);
 console.log(`Add: ${args.a} + ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Soustraction
 Subtract: function(args) {
 const result = parseFloat(args.a) - parseFloat(args.b);
 console.log(`Subtract: ${args.a} - ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Multiplication
 Multiply: function(args) {
 const result = parseFloat(args.a) * parseFloat(args.b);
 console.log(`Multiply: ${args.a} * ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Division
 Divide: function(args) {
 if (parseFloat(args.b) === 0) {
 throw {
 Fault: {
 Code: { Value: 'DIVIDE_BY_ZERO' },
 Reason: { Text: 'Division par zero impossible' }
 }
 };
 }
 const result = parseFloat(args.a) / parseFloat(args.b);
 console.log(`Divide: ${args.a} / ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Modulo
 Modulo: function(args) {
 if (parseFloat(args.b) === 0) {
 throw {
 Fault: {
 Code: { Value: 'MODULO_BY_ZERO' },
 Reason: { Text: 'Modulo par zero impossible' }
 }
 };
 }
 const result = parseFloat(args.a) % parseFloat(args.b);
 console.log(`Modulo: ${args.a} % ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Puissance
 Power: function(args) {
 const a = parseFloat(args.a);
 const b = parseFloat(args.b);

 // Eviter 0^(-n) qui impliquerait une division par zero
 if (a === 0 && b < 0) {
 throw {
 Fault: {
 Code: { Value: 'INVALID_NEGATIVE_EXPONENT' },
 Reason: { Text: '0 ne peut pas etre eleve a une puissance negative' }
 }
 };
 }

 const result = Math.pow(a, b);
 console.log(`Power: ${a} ^ ${b} = ${result}`);
 return { result: result };
 }
 }
 }
};

// Implémentation du service de température
const temperatureService = {
 TemperatureService: {
 TemperaturePort: {
 CelsiusToFahrenheit: function(args) {
 const celsius = parseFloat(args.value);
 const result = (celsius * 9) / 5 + 32;
 console.log(`CelsiusToFahrenheit: ${celsius}C -> ${result}F`);
 return { result: result };
 },

 FahrenheitToCelsius: function(args) {
 const fahrenheit = parseFloat(args.value);
 const result = ((fahrenheit - 32) * 5) / 9;
 console.log(`FahrenheitToCelsius: ${fahrenheit}F -> ${result}C`);
 return { result: result };
 },

 CelsiusToKelvin: function(args) {
 const celsius = parseFloat(args.value);
 const result = celsius + 273.15;
 console.log(`CelsiusToKelvin: ${celsius}C -> ${result}K`);
 return { result: result };
 }
 }
 }
};

// Lire les fichiers WSDL
const calculatorWsdlPath = path.join(__dirname, 'calculator.wsdl');
const calculatorWsdl = fs.readFileSync(calculatorWsdlPath, 'utf8');

const temperatureWsdlPath = path.join(__dirname, 'temperature.wsdl');
const temperatureWsdl = fs.readFileSync(temperatureWsdlPath, 'utf8');

// Démarrer le serveur
app.listen(PORT, function() {
 console.log(`Serveur demarre sur http://localhost:${PORT}`);

 // Créer les services SOAP
 const calculatorSoapServer = soap.listen(app, '/calculator', calculatorService, calculatorWsdl);
 const temperatureSoapServer = soap.listen(app, '/temperature', temperatureService, temperatureWsdl);

 console.log(`WSDL calculatrice: http://localhost:${PORT}/calculator?wsdl`);
 console.log(`WSDL temperature: http://localhost:${PORT}/temperature?wsdl`);

 // Logs des requêtes entrantes (debug)
 calculatorSoapServer.log = function(type, data) {
 console.log(`[calculator][${type}]`, data);
 };

 temperatureSoapServer.log = function(type, data) {
 console.log(`[temperature][${type}]`, data);
 };
});
