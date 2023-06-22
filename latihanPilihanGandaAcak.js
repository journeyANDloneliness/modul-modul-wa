import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"

import _ from  'lodash'



	function getRandomNumber(min, max, exclusions) {
  const range = _.difference(_.range(min, max + 1), exclusions);
  return _.sample(range);
}
async function getRandomSoal(sheet, excludes){
	let sampledNumber=getRandomNumber(0,50,excludes )
	excludes.push(sampledNumber)
	let rows = await sheet.getRows({offset: sampledNumber, limit:1});
	
	return rows.map((v,i)=>{
		return {
				pesan: v.nomor+" "+v.soal,
				opsi:{daftar: [v.a, v.b, v.c, v.d], multi: true},
				buttonText:"pilihan ganda",
				soal:v.soal,nomor: v.nomor, jawabanBenar: v.jawabanBenar			}
	})
}
export async function latihanPilihanGandaAcak({objekPesan, nomor, soal}){
	let sheet = doc.sheetsByTitle[soal]; 
	let sampled=[]
		
	let pesanDikirim = await getRandomSoal(sheet,sampled)
	
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
		let soal = pesanDikirim[0]
		if(soal){
			if(	objekPesan.pesan.startsWith(soal?.jawabanBenar )){
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda benar ✅ untuk :"+objekPesan.pesan
				jumlahBenar++
			}
			
			else if(["konfirmasi nilai","konfimasi","konfirm","home","sudah","selesai"].includes(objekPesan.pesan.toLowerCase() )){
				
				break
			}
			else{
				hasil[parseInt(soal.nomor)] = soal.nomor+" jawaban anda salah ❌ untuk :"+objekPesan.pesan
				
			}
		
			pesanDikirim  = await getRandomSoal(sheet, sampled)
			
			jawabPesan([{pesan:hasil[parseInt(soal.nomor)]}, ...pesanDikirim], null, nomor )
		}else if(["konfirmasi nilai","konfimasi","konfirm","home","sudah","selesai"].includes(objekPesan.pesan.toLowerCase())){
				
				break
		}else{
			jawabPesan("reply lah soal yang hendak dijawab terlebih dahulu",null,nomor)
		}
		
		
	}
	jawabPesan("ini total hasil anda:\n"+hasil.map((v,ind)=>v?v:"anda mengosongkan soal ke-"+ind).join("\n"),{noLoading:false}, nomor)

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
						