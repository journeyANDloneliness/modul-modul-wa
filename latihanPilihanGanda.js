import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"



	

export async function latihanPilihanGanda({objekPesan, nomor, soal}){
	let sheet = doc.sheetsByTitle[soal]; 
	let rows = await sheet.getRows();
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
	pesanDikirim.push({pesan:`tombol paling terakhir ditekan akan menjadi nilai mu.
 nilai akan diberikan setalah kamu klik tombol konfirmasi nilai`,opsi:{
		tombol:["konfirmasi nilai"]}})
	await jawabPesan(pesanDikirim)
	
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
		if(soal){
			if(	objekPesan.pesan.startsWith(soal?.jawabanBenar )){
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda benar ✅ untuk :"+objekPesan.pesan
				jumlahBenar++
			}
			
			else if(["konfirmasi nilai","konfimasi","konfirm"].includes(objekPesan.pesan.toLowerCase() )){
				
				break
			}
			else{
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda salah ❌ untuk :"+objekPesan.pesan
				
			}
		}else if(objekPesan.pesan == "konfirmasi nilai"){
				
				break
		}else{
			jawabPesan("reply lah soal yang hendak dijawab terlebih dahulu")
		}
		
		
	}
	jawabPesan("ini hasil anda:\n"+hasil.map((v,ind)=>v?v:"anda mengosongkan soal ke-"+ind).join("\n"),{noLoading:false})

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
						