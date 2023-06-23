import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"
import  _ from "lodash"
import {keluarDariMenu} from "./common.js"


	

export async function latihanPilihanGanda({objekPesan, nomor, soal}){
	let sheet = doc.sheetsByTitle[soal]; 
	let rows = await sheet.getRows({offset: _.random(0,45),limit: 10});
	let soal_soal = rows.map((v,i)=>{
		return {
				pesan: v.nomor+" "+v.soal,
				opsi:{daftar: [v.a, v.b, v.c, v.d], multi: true},
				buttonText:"pilihan ganda",
				jawabanBenar:v.jawabanBenar
			}
	})
	//memastikan hanya  sheet dengan "jawaban benar colom" terisi saja yang diambil
	soal_soal = soal_soal.filter(v=>v.jawabanBenar)
	console.log(soal_soal)
	let pesanDikirim = [...soal_soal]
	pesanDikirim.push({pesan:`reply pesan ini atau tekan tombol pada soal yang tersedia untuk memberikan jawabanmu. tombol paling terakhir ditekan akan menjadi nilai mu.
 nilai akan diberikan setalah kamu klik tombol konfirmasi nilai`,opsi:{
		tombol:["konfirmasi nilai"]}})
	await jawabPesan(pesanDikirim, null, nomor)
	
	let hasil = []
	
	let jumlahBenar=0
	while(true){
		abaikanPesan()
		
		let objekPesan = await dapatkanPesan(nomor)
		//jawabPesan("anda menjawab "+objekPesan.pesan)
		let soal = rows
			.find(v=>{
				//console.log( v.nomor+" "+v.soal , objekPesan.quotedMessage.body)
				return objekPesan.quotedMessage?.body?.includes( v.nomor+" "+v.soal )
		
			})
		let jawabanKu= objekPesan.text.toLowerCase() 
		
		if(!soal) {
			soal=rows
			.find(v=>{
				return objekPesan.text.startsWith(v.nomor)
			})
			let jawabanKu= objekPesan.text.toLowerCase().split(" ")[0]
		}
		let jawabanBenar= soal?.jawabanBenar.split(".")[0].toLowerCase() 
	
		if(soal){
			if(	jawabanKu.startsWith(jawabanBenar )){
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda benar ✅ untuk :"+objekPesan.pesan
				jumlahBenar++
			}
			
			else if(keluarDariMenu(objekPesan.text)){
				
				break
			}
			else{
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda salah ❌ untuk :"+objekPesan.pesan
				
			}
			jawabPesan("anda masih bisa mengubah jawaban anda pada nomor soal yang sama. ketik konfirmasi jika merasa sudah selesai",{tombol:["konfirmasi nilai"]},nomor)
		}else if(keluarDariMenu(objekPesan.text)){
				
				break
		}else{
			jawabPesan("reply lah soal yang hendak dijawab terlebih dahulu seprti gambar berikut. atau awali jawabanmu dengan soal yang dipilih misal soal nomor '10' maka '10 A'",{
				gambar:{url:"https://imgtr.ee/images/2023/06/23/m47M1.md.jpg"}},nomor)
		}
		
		
	}
	jawabPesan("ini hasil anda:\n"+hasil.filter(v=>v).map((v,ind)=>v?v:"anda mengosongkan soal ke-"+ind).join("\n"),{noLoading:false}, nomor)

	sheet = doc.sheetsByTitle["nilai_siswa"]; 
	rows = await sheet.getRows();
	let siswa = rows.find(v=>v.nama == objekPesan.contact.name)
	if(siswa){
			siswa.nilai_latihan1 = jumlahBenar
			await siswa.save()
	}else{
		await sheet.addRow({nama:objekPesan.contact.name,
								 nilai_latihan1:jumlahBenar })
	}
	
}
						