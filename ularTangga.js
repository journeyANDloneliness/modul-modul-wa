
import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {sheetGetRange, doc} from "./koneksiExcel.js"

import { fabric } from 'fabric';
import path  from "path"
//import savePng from "./savePng.js"
import _ from "lodash"
import axios from "axios"


export async function ularTangga(objekPesan, globalSiswa, nomor, myId) {
	
	
	const img=await  new Promise((resolve)=>{
		fabric.Image.fromURL(`https://iili.io/HXgXwRs.png`, function(img) {
		 	resolve(img)
		});
	})

	let canvas = new fabric.StaticCanvas(null, { width: img.width,
																							height: img.height });

	canvas.add(img)
	let rangeUlarTangga = await sheetGetRange("ular-tangga!A1:J10")
	let ladder=[]
	let snake=[]
	rangeUlarTangga.forEach((r,i)=>{
		r.forEach((c,ii)=>{
			if(c.includes("+")){
				if(!ladder[parseInt(c)])
					ladder[parseInt(c)]=[]
				ladder[parseInt(c)].push({x:ii,y:i, pos:(10*(10-(i+1)))+ (1+ii)})
			}
			if(c.includes("-")){
				if(!snake[parseInt(c)])
					snake[parseInt(c)]=[]
				snake[parseInt(c)].push({x:ii,y:i, pos:(10*(10-(i+1)))+ (1+ii)})
			}
		})
	})
	ladder = ladder.filter(v=>v)
	snake = snake.filter(v=>v)
	if(!globalSiswa.ularTangga.mainGenerated){
		for(let v of ladder){
			console.log(v)
			let mladder=await drawLadder2(canvas, v[0].x*50, v[0].y*50, v[1].x*50, v[1].y*50)
			console.log("cccc")
			//canvas.add(mladder)
		}
		for(let v of snake){
			console.log(v)
			let mladder=await drawLadder2(canvas, v[0].x*50, v[0].y*50, v[1].x*50, v[1].y*50, ["brown","yellow"])
			console.log("cccc")
			//canvas.add(mladder)
		}
		//globalSiswa.ularTangga.mainGenerated = true
	}
	
	const gambar = canvas.toDataURL();
	//console.log( process.env.image_bb_key)
	// let mainImage=await axios.post("https://api.imgbb.com/1/upload",{
	// 	key: process.env.image_bb_key,
	// 	image: gambar
	// })
	let pesan=[
		{opsi:{gambar}},
		{pesan:"ini adalah permainan ular tangga untuk hari ini!",
		 opsi:{daftar:["1. mulai **lempar dadu 🎲**"]}},
		
	]
	jawabPesan(pesan, null, nomor)

	let sheetsSoal= doc.sheetsByTitle["soal1"]
	let rows= await sheetsSoal.getRows()
	let gradeGroups= [[],[],[],[],[],[]]
	for(let a of rows){
		let grade = parseInt(a.grade)
		gradeGroups[grade-1].push(a)
	}
	//let myId=123
	globalSiswa.ularTangga.data[myId] = {pos: 0}
	//state 0 lempar dadu, 1 quiz
	let state= 0
	let shiftX = 260
	let shiftY = 50
	let commonNext={pesan:"tekan tombol atau ketik 1 untuk melanjutkan",
							 opsi:{daftar:["1. lanjut"]}}
	let prop={ladder, snake, soal:gradeGroups, 
														 canvas, shiftX,
									pos:globalSiswa.ularTangga.data[myId].pos ,img, gambar,
																							globalSiswa, commonNext, myId, nomor}
	
	let colorGrade=["1️⃣⚫terlalu mudah⚫",
								 "2️⃣🔵sangat mudah🔵",
								 "3️⃣🟢mudah🟢","4️⃣🟡sedang🟡","5️⃣🟠sulit🟠","️6️⃣🔴sangat sulit🔴"]
	while(true){
		let objPesan = await dapatkanPesan(nomor)
		
		switch(true){
				
			case state == 0:
				commonNext.opsi.daftar = ["1. lanjut giliran **lihat soal 📝**"]
				if(!objPesan.text.startsWith(1)) break
				let _pos0=_.random(1,6)
				globalSiswa.ularTangga.data[myId].pos += _pos0
				prop.pos = globalSiswa.ularTangga.data[myId].pos
				if(await checkIfFinish(prop)) return
				
				let gbr2 = await drawPlayerPosAll(prop)
				let check= await checkIfLadderOrSnake(prop)
				pesan =[{opsi:{gambar: gbr2}},
								{pesan:" 🎲 anda mendapat dadu nomer **"+ _pos0+"** 🎲"},
								check ? check.pesan: commonNext  ]
				jawabPesan(pesan, null, nomor)
				if(check) await check.fun()
				state=1
				break
				
			case state == 1:
				commonNext.opsi.daftar = ["1. lanjut giliran **lempar dadu 🎲**"]
				
				let soal=gradeGroups.map(v=>_.sample(v))
				pesan =[{pesan:`📝 pilihlah soal dibawah ini.
semakin sulit soal semakin
banyak kamu malangkah!`,
								opsi:{daftar:soal.map((v,i)=>colorGrade[i]+"\n"+(i+1)+". "+ v.soal+"\n")}}
								]
				jawabPesan(pesan, null, nomor)
				while(true){
					let objekPesan = await dapatkanPesan(nomor)
					let _pos= parseInt(objekPesan.text.split(" ")[0])
					
					let soalTerpilih = soal[_pos-1]
					if(soalTerpilih){
						pesan =[{pesan:soalTerpilih.soal, opsi:{multi: true,daftar:[soalTerpilih.a,
								soalTerpilih.b, soalTerpilih.c, soalTerpilih.d]}}]
						jawabPesan(pesan, null, nomor)
						
						let objekPesan = await dapatkanPesan(nomor)
						if(objekPesan.text.split(".")[0]  == soalTerpilih.jawabanBenar.split(".")[0]){
							
							globalSiswa.ularTangga.data[myId].pos += _pos
							prop.pos = globalSiswa.ularTangga.data[myId].pos
							
							if(await checkIfFinish(prop)) return
							
							let gbr2 = await drawPlayerPosAll(prop)
							let check= await checkIfLadderOrSnake(prop)
							
							pesan =[
											{opsi:{gambar: gbr2}},
											{pesan:"anda berhasil dan melaju "+ _pos + " langkah"},
							check ? check.pesan: commonNext  ]
							jawabPesan(pesan, null, nomor)
							if(check) await check.fun()
						}else{
							pesan =[{pesan:"maaf anda gagal  melangkah"},
										]
							globalSiswa.ularTangga.data[myId].pos -= _pos
							prop.pos = globalSiswa.ularTangga.data[myId].pos
							
							let gbr2 = await drawPlayerPosAll(prop)
							let check= await checkIfLadderOrSnake(prop)
							pesan =[{pesan:"anda gagal!. langkah anda dikurangi "+_pos+" langkah"},
											{opsi:{gambar: gbr2}},
											check ? check.pesan: commonNext  ]
							jawabPesan(pesan, null, nomor)
							if(check) await check.fun()
						}
						break
						
					}
					else
						jawabPesan([{pesan:"maaf tidak ada soal tersebut"}], null, nomor)
					
				}
				state=0
				break
		}
	}
	
}
async function checkIfFinish({ladder, snake,soal, 
														 canvas, shiftX, pos,img, gambar, globalSiswa, commonNext, myId, nomor}) {
	if(pos >= 100){
		
		let gbr=await drawPlayerPosAll({canvas, shiftX, 
														pos:globalSiswa.ularTangga.data[myId].pos ,img, gambar, 
																					globalSiswa, myId})
		canvas.add(new fabric.Text("SELAMAT! kamu berhasil rank mu=", {
				fontSize: 50,
				fill: 'BLACK',
				fontWeight: 'bold',
				left: 50,
				top: 200 ,
			}))
		jawabPesan([{opsi:{gambar:canvas.toDataURL()}},
											{pesan:"SELAMAT! kamu berhasil!"}], null, nomor)
		return true
	}
}
function checkIfLadderOrSnake({ladder, snake,soal, 
														 canvas, shiftX, pos,img, gambar, globalSiswa, commonNext, myId, nomor}){
	let output=null
	ladder.forEach( v=>{
		if(v[1].pos === pos ){
			output={pesan:{pesan:"",opsi:{multi: true}}}
			let soalMe=_.sample(soal[3])
			output.pesan.pesan ="**WOW!** kamu akan naik tangga! tapi jawab dulu soal ini ya! kalau kamu berhasil kamu akan naik!\n"+soalMe.soal
			output.pesan.opsi.daftar=[ soalMe.a, soalMe.b, soalMe.c, soalMe.d]
			output.fun=async ()=>{
				let objekPesan=await dapatkanPesan(nomor)
				if(objekPesan.text.split(".")[0]  == soalMe.jawabanBenar.split(".")[0]){
					globalSiswa.ularTangga.data[myId].pos = v[0].pos
					
					let gbr=await drawPlayerPosAll({canvas, shiftX, 
														pos:globalSiswa.ularTangga.data[myId].pos ,img, gambar, 
																					globalSiswa, myId})
					jawabPesan([{opsi:{gambar:gbr}},
											{pesan:"kamu berhasil naik tangga! "+ v[0].pos}, commonNext], null, nomor)
				}else{
					jawabPesan([{pesan:"maaf jawabanmu salah, kamu gagal naik tangga"}, commonNext], null, nomor)
				}
			}
		}
		
	})
	snake.forEach(v=>{
		if(v[0].pos === pos ){
			console.log("posisisnya",pos)
			output={pesan:{pesan:"",opsi:{multi: true}}}
			let soalMe=_.sample(soal[3])
			
			output.pesan.pesan ="oops, kamu bakal turun nih! kamu harus jawab soal ini dulu ya supaya tidak jadi turun!\n"+soalMe.soal
			output.pesan.opsi.daftar=[soalMe.a, soalMe.b, soalMe.c, soalMe.d]
			
			output.fun=async ()=>{
				let objekPesan=await dapatkanPesan(nomor)
				if(objekPesan.text.split(".")[0] == soalMe.jawabanBenar.split(".")[0]){
					jawabPesan([{pesan:"jawabanmu benar, kamu berhasil bertahan!"}, commonNext], null, nomor)
					
				}else{
					globalSiswa.ularTangga.data[myId].pos = v[1].pos
					
					let gbr= await drawPlayerPosAll({canvas, shiftX, 
														pos:globalSiswa.ularTangga.data[myId].pos ,img, gambar,
																					 globalSiswa, myId})
					jawabPesan([{opsi:{gambar:gbr}},
											{pesan:`maaf jawabanmu salah, 
	kamu gagal bertahan! posisimu turun ke-`+ v[1].pos}, commonNext], null, nomor)
				}
			}
		}
	})

	return output
	
}
async function drawPlayerPosAll({canvas, shiftX, pos,img, gambar, globalSiswa, myId}){
	canvas = new fabric.StaticCanvas(null, { width: img.width,
																									height: img.height });
	await  new Promise((resolve)=>{
		fabric.Image
			.fromURL(gambar,
		function(img) {
		 canvas.add(img)
			resolve(img)
		});
	})
	drawRanking({canvas, globalSiswa})
	Object.entries(globalSiswa.ularTangga.data)
		.forEach(([key,values])=>{
			drawPlayerPos(canvas, shiftX, values.pos,img, key[0], key == myId ? 'blue':'gray' )
		})
		
	
	
	let gbr2 = canvas.toDataURL();
	return gbr2
}
function drawPlayerPos(canvas, shiftX, pos,img, name, color){
		shiftX-=80
			const circle = new fabric.Circle({
				radius: 15,
				fill: color,
				left: shiftX+(50 * (pos% 10 === 0? 10: (pos% 10)))  ,
				top: img.height-((50 * (Math.floor(pos% 10 === 0?( pos/ 10)-1: pos/ 10)))+55),
			});
	
			const text = new fabric.Text(name, {
				fontSize: 13,
				fill: 'white',
				fontWeight: 'bold',
				left: shiftX+(50 * (pos% 10 === 0? 10: (pos% 10)) )+ 6 ,
				top: img.height-((50 * (Math.floor(pos% 10 === 0? (pos/10)-1: (pos/ 10))))+55)+5,
			});
			canvas.add(circle)
			canvas.add(text)
}
/*function dapatkanPesan(){
	let pesan=prompt()
	return {text:pesan}
}
function jawabPesan(pesan, null, nomor){
	for(let p of pesan){
		console.log(p.pesan)
		if(p.opsi?.daftar){
			p.opsi?.daftar.forEach(v=>console.log(v))
		}
		if(p.opsi?.gambar){
			savePng(p.opsi.gambar, "image.png");
		}
	}
	
}*/

function drawRanking({canvas, globalSiswa}) {
	Object.entries( globalSiswa.ularTangga.data).
		sort((a, b) => b[1].pos - a[1].pos).
		forEach(([key, value], i) =>{
			const text = new fabric.Text(`${(i+1)}. ${key} | ${value.pos}`, {
				fontSize: 13,
				fill: 'black',
				fontWeight: 'bold',
				left: 20 ,
				top: 60+(16*(i+1)),
			});
			canvas.add(text)
		})
	
}
		// Function to draw a ladder from point to point
function drawLadder2(canvas, startX, startY, endX, endY, color=['black','black']) {
  // Calculate the length and angle of the line
	let shiftX = 260
	let shiftY = 50
	startX = startX + shiftX
	endX = endX + shiftX
	startY = startY + shiftY
	endY = endY + shiftY
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  // Create the horizontal rungs of the ladder
  const rungWidth = 23;
  const rungHeight = 18;
  const numRungs = Math.floor(length / rungWidth);

  for (let i = 0; i < numRungs; i++) {
    const x = startX + (dx / numRungs) * i;
    const y = startY + (dy / numRungs) * i;

    // Create a rectangle for the rung
    const rung = new fabric.Rect({
      left: x,
      top: y,
      width: rungWidth,
      height: rungHeight,
      fill: color[i%2],
      angle: angle,
      originX: 'left',
      originY: 'top'
    });

    // Add the rung to the canvas
    canvas.add(rung);
  }
}

