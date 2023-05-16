import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"
export async function materi({objekPesan, nomor, materiSheetName, awal}){
	let sheet = doc.sheetsByTitle[materiSheetName]; 
	let materi = await sheet.getRows();
	let welcome = materi.find(v=>v.judul == awal)
	let menu = makeMenu(welcome)
console.log(output); // Output: Hello123World)
	await jawabPesan([
		{	pesan: welcome.deskripsi, opsi:{daftar:menu }}
									])

	while (true) {
		
		let objekPesan = dapatkanPesan()
		let foundMenu=menu.find(v=>v.includes(objekPesan.text))
		if(foundMenu){
			let foundMateri = materi.find(v=>foundMenu.substr(2) == v.judul.toLowerCase())
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
	return str.menu.split("\n")
		.map(v=>v.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""))
}

export default materi
