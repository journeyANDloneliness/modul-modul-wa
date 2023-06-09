import {sheetGetRange} from "./koneksiExcel.js"
import {keluarDariMenu} from "./common.js"

import { fabric } from 'fabric';
import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"





export async function tekaTekiSilang({objekPesan, nomor}) {

	const canvas = new fabric.StaticCanvas(null, { width: 200, height: 220 });

	// Create a new Fabric.js rectangle object

	let rangesTeka = await sheetGetRange("teka-teki!A1:J11")
	rangesTeka.forEach((r,i)=>{
		r.forEach((c,ii)=>{
			if(c){
				const rect = new fabric.Rect({
						left: ii*20,
						top: i*20,
						fill: 'yellow',
						stroke:'red',
						strokeWidth: 2,
						width: 20,
						height: 20
				});
				canvas.add(rect)
				if(c.split("=").length > 1){
					canvas.add(new fabric.Text(c.split("=")[0] , { 
					  fontFamily: 'Delicious_500', 
					  left: ii*20+3.5, 
					  top: i*20+3.5 ,
						fontSize: 7
					}));
				}
				
			}
			
		})
	})
	

	const base64 = canvas.toDataURL();
	let rangesSoal = await sheetGetRange("teka-teki!M2:O11")
	let daftar=[]
	let soal={pesan:"pertanyaan:",opsi:{daftar, buttonText:"lihat pertanyan"}}
	let jumlahSoal=0
	rangesSoal.forEach((r,i)=>{
			if(r[1]){
				jumlahSoal++
				daftar.push(r[0]+". "+ r[1])
			}
	})
	


	
	
	let pesan=[
		{pesan:"ini adalah teka-teki silang untuk hari ini"},
		{pesan:"hello", opsi:{gambar:base64}},
		soal,
		{pesan:`*peraturanya*: 
_________________________________________
•  Klik daftar atau tulis angka pertanyaan yang mau dijawab kemudian 
	jawablah pesan pada soal yang dipilih

• Tekan tombol atau tulis "konfirmasi" jika sudah selesai, 
 	kamu tetap bisa konfirmasi meski belum mengisi
	semua jawaban karena mungkin masih terlalu sulit untukmu.

		jika kamu berhasil menjawab semua pertanyaan jawaban akan otomatis disimpan dan nilai kamu bertambah`,
		 opsi:{tombol:["konfirmasi jawaban"]}}
	]
	jawabPesan(pesan, null, nomor)
	let jawabanBenar=[]
	out:
	while (true) {
		let objekPesan = await dapatkanPesan(nomor)

		if(keluarDariMenu( objekPesan.text ,"konfirmasi jawaban")){
			jawabPesan(`kamu keluar dari sesi teka-teki silang.
								 jawaban kamu terkonfoirmasi dan disimpan. tetapi kamu masih bisa mengulanginya lagi`, null, nomor)
			
			break
		}
		for(let r of rangesSoal){
			if(objekPesan.pesan == r[0]+". "+r[1] ||( parseInt(objekPesan.pesan) == r[0] &&  r[1] ) ){
				jawabPesan("silahkan jawab pertanyaan. \n"+r[1], null, nomor)
			
				let objekPesan = await dapatkanPesan(nomor)
				if(objekPesan.pesan.toLowerCase() == r[2].toLowerCase()){
					let gambar=drawJawaban(canvas, rangesTeka, r[0], r[2])
					
					
					if(jawabanBenar.includes(r[0])){
						jawabPesan([{pesan:"kamu sudah menjawab pertanyaan ini"},soal], null, nomor)
						break
					}else{
						jawabanBenar.push(r[0])
						soal.opsi.daftar= daftar.filter((v,i)=>{
							return v.split(". ")[0] != r[0]
						})
						daftar=soal.opsi.daftar
					}
					
					if(jawabanBenar.length == jumlahSoal){
						jawabPesan([{pesan:"benar ✅"},{opsi:{gambar}},
												{pesan:`
🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
	selamat kamu berhasil 
 				menyelsaikan 
	teka teki silang ini
🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`}], null, nomor)
						break out
					}

					else{
					
						jawabPesan([{pesan:"benar ✅"},{opsi:{gambar}},soal
												,{pesan:"ketik **'konfirmasi jawaban'** jika merasa sudah selesai atau klik tombol ini",opsi:{daftar:["konfirmasi jawaban"]}}], null, nomor)
					}
					

				}else{
					jawabPesan([{pesan:"maaf jawaban kamu masih salah ❌ "},soal, {pesan:"ketik **'konfirmasi jawaban'** jika merasa sudah selesai atau klik tombol ini",opsi:{daftar:["konfirmasi jawaban"]}}], null, nomor)
				}
				break
				
				
			}
		}
		jawabPesan(`maaf. tidak ada pertanyaan seperti itu di teka-teki silang ini, misal soal no 1: ketik "1"  lalu ketika soal dimunculkan, ketiklah jawabanya`, null, nomor)
	}
	
}

function drawJawaban(canvas, rangesTeka, num, text) {
	let rowLength=10
	let list=[]
	rangesTeka.forEach((r,i)=>{
		r.forEach((c,ii)=>{
			if(c){
				
				
				if(c.split("=").length > 1 && c.split("=")[0] == num){
					//horizontal
					if(r[ii+1] && !r[ii-1] ){
						text.split("").forEach((t,iii)=>{
							list[(i*rowLength)+ii+iii]=t
						})
					}else{
						text.split("").forEach((t,iii)=>{
							list[((i+iii)*rowLength)+ii]=t
						})
					}
				}
				if(list[(i*rowLength)+ii]){
					canvas.add(new fabric.Text(
						list[(i*rowLength)+ii].toUpperCase(), { 
						fontFamily: 'Delicious_500', 
						left: ii*20+8, 
						top: i*20+8 ,
						fontSize: 9
					}));
				}
				
				
				
			}
			
		})
	})
	

	return canvas.toDataURL();
}