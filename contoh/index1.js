import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"
import {latihanPilihanGanda} from "module-module-wa-masama"

import {koneksiExcel, doc} from "module-module-wa-masama"
import {gambarRanking} from "module-module-wa-masama"
import {tekaTekiSilang} from "module-module-wa-masama"
import {ularTangga} from "module-module-wa-masama"

import {latihanDua} from "./latihan_dua.js"


await koneksiExcel()

while(true){
	
abaikanPesan()
	let objekPesan=await dapatkanPesan()

		
	if(objekPesan.chat.name == "grp"){
		home:
		while(true){
		jawabPesan(`
	ᴀꜱꜱᴀʟᴀᴍᴜᴀʟᴀɪᴋᴜᴍ! ꜱᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ ᴍᴇɴᴜ ꜰɪꜱɪᴋᴀ 	ᴘᴀᴅᴀ ᴘᴇᴍʙᴇʟᴀᴊᴀʀᴀɴ ɢᴇʟᴏᴍʙᴀɴɢ, ꜱɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ꜱᴜʙ ᴍᴇɴᴜ ʙᴇʀɪᴋᴜᴛ`,
							 {buttonText: "menu", daftar:["LATIHAN DUA","Materi", "Contoh Soal","Latihan", 
																						"Informasi","TekaTekiSilang",
																						"Ular Tangga",
																						"Petunjuk", "Tentang"]}	)
		
	
		while(true){
			
			let objekPesan=await dapatkanPesan()
				
			if(objekPesan.pesan == "LATIHAN DUA"){
				latihanDua({objekPesan})
			}
			else if(objekPesan.pesan == "Materi" ){
				
			}
      else if (objekPesan.pesan == "Contoh"){
				jawabPesan("Gambar Gelombang Tranversal")
        
			}
			else if(objekPesan.pesan == "Latihan"){
				while(true){
					jawabPesan("ini adalah latihan-latihan yang tersedia",
										 {tombol:["Latihan berurutan","Latihan acak"]})
					while(true){
						let objekPesan = await dapatkanPesan()
						if(objekPesan.pesan == "Latihan berurutan")
							await latihanPilihanGanda({soal:"soal1", objekPesan})
						else if(objekPesan.pesan == "Latihan acak")
						{
							//await randomPilihanGanda()
						}
					}
					
				
				}
			
				
			}
			else if(objekPesan.pesan == "Informasi"){
				let sheet = doc.sheetsByTitle["nilai_siswa"]; 
				let rows = await sheet.getRows();
				rows.sort((a,b)=>a.ranking - b.ranking)
				console.log(rows)
				let siswa = rows.findIndex(v=>v.nama == "Mazamat")
				let gambar=await gambarRanking(siswa, rows)
				await jawabPesan("ranking siswa",{gambar})
				break home
			}
			else if(objekPesan.pesan == "TekaTekiSilang"){
				await tekaTekiSilang({})
				break home
			}
			else if(objekPesan.pesan == "Ular Tangga"){
				await ularTangga({})
				break home
			}
        
			
		}
		}
		
	}
	


	
}

	
