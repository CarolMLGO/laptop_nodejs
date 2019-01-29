const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync('./data/data.json','utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req,res) => {
	//url.parse()
	const pathName = url.parse(req.url,true).pathname; // true: parse into an object
	console.log(pathName);
	const id = url.parse(req.url,true).query.id;

	//PRODUCTS OVERVIEW
	if (pathName === '/products' || pathName === '') {
		res.writeHead(200,{'Content-Type':'text/html'});
		fs.readFile(`${__dirname}/templates/overview.html`,'utf-8',(err,data1) => {
			if (err) {
				console.log('Error reading file!');
			};	
			let output = data1;
			fs.readFile(`${__dirname}/templates/card.html`,'utf-8',(err,data2) => {
				const cardsOuput = laptopData.map(el => replaceTemplate(data2,el)).join('');
				output = output.replace(/{%CARDS%}/g,cardsOuput);
				res.end(output);
			});
		});
	} 

	//laptop detail
	else if (pathName === '/laptop' && id < laptopData.length) {
		res.writeHead(200,{'Content-Type':'text/html'});
		fs.readFile(`${__dirname}/templates/laptop.html`,'utf-8',(err,data) => {
			if (err) {
				console.log('Error reading file!');
			}
			const laptop = laptopData[id];
			const output = replaceTemplate(data,laptop);
			res.end(output);
		});
	} 

	//IMAGES (need another image router to serve images, image file name will be read in the pathName)
	else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
		fs.readFile(`${__dirname}/data/img/${pathName}`,(err,data)=>{
			if (err) {
				console.log('Imges reading error!');
			}
			res.writeHead(200,{'Content-Type':'image/jpg'});
			res.end(data);
		})
	}

	//URL not found
	else {
		res.writeHead(404,{'Content-Type':'text/html'});

	}

});

server.listen(4000,'127.0.0.1',() => {
	console.log('listening for requests now');
});
//127.0.0.1 local host

function replaceTemplate (originalHtml,laptop) {
	let output = originalHtml.replace(/{%PRODUCTNAME%}/g,laptop.productName);
	output = output.replace(/{%PRICE%}/g,laptop.price);
	output = output.replace(/{%IMAGE%}/g,laptop.image);
	output = output.replace(/{%CPU%}/g,laptop.cpu);
	output = output.replace(/{%SCREEN%}/g,laptop.screen);
	output = output.replace(/{%STORAGE%}/g,laptop.storage);
	output = output.replace(/{%RAM%}/g,laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g,laptop.description);
	output = output.replace(/{%ID%}/g,laptop.id);
	return output;
}