import  Jimp from "jimp"

export async function gambarRanking(rank, listSiswa){
		
	
	
	let bg = await Jimp.read('ranking.png')
	let font = await Jimp.loadFont(Jimp.FONT_SANS_14_BLACK)
	let font2 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)


	bg.print(font2, 108, 138, "1. "+listSiswa[0].nama);
	bg.print(font2, 119, 31, listSiswa[0].total);
	bg.print(font2,  24, 153, "2. "+listSiswa[1].nama);
	bg.print(font2,  27, 70, listSiswa[1].total);
	bg.print(font2,  202, 153, "3. "+listSiswa[2].nama);
	bg.print(font2,  212, 78, listSiswa[2].total);
	let fontx
	let startIndex =  Math.max(3, rank - 4)

	let endIndex = Math.min(listSiswa.length, rank + 5)
	
	startIndex -= listSiswa.length - (rank+1+4) < 0
		? (rank+1+4)-listSiswa.length :0
	
	endIndex += rank- 7 < 0? 7 - rank : 0
	
	if(rank - 7 > 0)
		bg.print(font2, 18, 180, "		...")

	listSiswa.slice(startIndex, endIndex )
		.forEach((v,i)=>{
			if(i+startIndex == rank)
				fontx = 		font2
			else
				fontx = 		font
				
			bg.print(fontx, 18, 200+(20*i),  (v.ranking)+". "+v.nama);
			bg.print(fontx, 202, 200+(20*i),  v.total);

	})
	
	if(rank+ 4 < listSiswa.length)
		bg.print(font2, 18, 200+(20*9), "	...")
	

	
	 return await  bg.getBase64Async(Jimp.MIME_PNG);

}

