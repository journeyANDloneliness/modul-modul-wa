import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"

import {doc}  from "./koneksiExcel.js"
export async function materi({objekPesan, nomor, materiSheetName, awal}){
	let sheet = doc.sheetsByTitle[materiSheetName]; 
	let materi = await sheet.getRows()
	let welcome = materi.find(v=>v.judul.toLowerCase() == awal)
	let menu = makeMenu(welcome.menu)
//console.log(output); // Output: Hello123World)
	let pesanDikirim=	[
		{	pesan: welcome.deskripsi, opsi:{daftar:menu, multi:true,one_time_keyboard: true }}
									]
	if(welcome.url){
		pesanDikirim.unshift({	pesan: "gambar", opsi:{gambar:
		{url:welcome.url} }})
	}
		
	await jawabPesan(pesanDikirim)
	let foundMateri = welcome
	while (true) {
		
		let objekPesan = await dapatkanPesan()
		
		let foundMenu=menu.find(v=>v.includes(objekPesan.text))
		if(foundMenu){
			if(foundMenu.includes("kembali")){
				if(foundMateri.asal == "home"){
					return
				}
				foundMenu = "---"+foundMateri.asal
				
			}
			else if(foundMenu.includes("home")){
				
				return 
			}
				
				console.log("found menu", foundMenu.substr(3))
			foundMateri = materi.find(v=>foundMenu.substr(3).toLowerCase().replace(/[^a-zA-Z0-9]/g, "") == v.judul.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""))
			if(foundMateri ){
					menu = makeMenu(foundMateri.menu)
				let pesanDikirim=	[
					{pesan: foundMateri.deskripsi, 
													 opsi:{daftar:menu,																									one_time_keyboard: true,
													 multi: true}}
													]
					if(foundMateri.url){
						pesanDikirim.unshift({	pesan: "gambar", opsi:{gambar:
						{url:foundMateri.url} }})
					}
					await jawabPesan(pesanDikirim)
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
