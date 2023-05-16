import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"
export async function materi({objekPesan, nomor, materiSheetName, awal}){
	let sheet = doc.sheetsByTitle[materiSheetName]; 
	let materi = await sheet.getRows()
	let welcome = materi.find(v=>v.judul.toLowerCase() == awal)
	let menu = makeMenu(welcome.menu)
//console.log(output); // Output: Hello123World)
	await jawabPesan([
		{	pesan: welcome.deskripsi, opsi:{daftar:menu }}
									])
	let foundMateri = welcome
	while (true) {
		
		let objekPesan = await dapatkanPesan()
		
		let foundMenu=menu.find(v=>v.includes(objekPesan.text))
		if(foundMenu){
			console.log("found menu", foundMenu)
			if(objekPesan.text.includes("kembali"))
				foundMenu = "---"+foundMateri.asal
			
			foundMateri = materi.find(v=>foundMenu.substr(3).toLowerCase() == v.judul.toLowerCase())
			if(foundMateri ){
					menu = makeMenu(foundMateri.menu)
					await jawabPesan(foundMateri.deskripsi, {daftar:menu})
			}else{
				await jawabPesan("maaf belum tersedia materi yang dimaksud")
			}
		}
	}
	
}

function makeMenu(str) {
	return str.split("\n")
		.map(v=>v.toLowerCase())
}

export default materi
