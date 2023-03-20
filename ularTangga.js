import {sheetGetRange} from "./koneksiExcel.js"

import { fabric } from 'fabric';
import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"
import path  from "path"




export async function ularTangga(objekPesan) {
	
	
	let img=await  new Promise((resolve)=>{
		fabric.Image.fromURL(`https://iili.io/HXgXwRs.png`, function(img) {
		 	resolve(img)
		});
	})
	
	let canvas = new fabric.StaticCanvas(null, { width: img.width,
																							height: img.height });

	canvas.add(img)
	let rangeUlarTangga = await sheetGetRange("ular-tangga!A1:J10")
	let ladder=[]
	rangeUlarTangga.forEach((r,i)=>{
		r.forEach((c,ii)=>{
			if(c.includes("+")){
				if(!ladder[parseInt(c)])ladder[parseInt(c)]=[]
				ladder[parseInt(c)].push({x:i,y:ii})
			}
		})
	})
	ladder = ladder.filter(v=>v)
	for(let v of ladder){
		console.log(v)
		let mladder=await drawLadder(v[0].x*50, v[0].y*50, v[1].x*50, v[1].y*50)
		console.log("cccc")
		canvas.add(mladder)
	}
	
	const gambar = canvas.toDataURL();
	let pesan=[
		{pesan:"",opsi:{tombol:["Lempar Dadu 10 angka"]}},
		{opsi:{gambar}}
	]
	
	
	jawabPesan(pesan)
}

async function drawLadder(
		startX = 50,
		 startY = 50,
		 endX = 400,
		 endY = 50){
		let shiftX= 213
		startX+=shiftX
		endX+=shiftX

		// Calculate the angle between the start and end points
		var deltaX = endX - startX;
		var deltaY = endY - startY;
		var angleInRadians = Math.atan2(deltaY, deltaX);
		var angleInDegrees = angleInRadians * 180 / Math.PI;

		// Create a Fabric.js image object and set its position, size, and rotation
		var image = await new Promise((resolve)=>{
			new fabric.Image.fromURL('https://iili.io/HX6IF5P.png', function(myImg) {
				// Scale the image to fit between the start and end points
				var width = Math.abs(deltaX);
				var height = Math.abs(deltaY);
				//myImg.scaleToWidth(width);
				//myImg.scaleToHeight(height);
	
				// Position the image at the start point
				myImg.originX=0
				myImg.originY=0
				myImg.left = startX;
				myImg.top = startY;
	
				// Set the image rotation angle based on the difference between the start and end points
				//myImg.angle = angleInDegrees;
				console.log(myImg)
				resolve(myImg)
			})
		})

		return image
}