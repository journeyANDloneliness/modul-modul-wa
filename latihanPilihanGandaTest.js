import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"


export async function latihanPilihanGanda(){
	
	jawabPesan(
		[
			{pesan:` Jawablah seluruh oertanyaan berikut, kemudian tunggu jawaban apabila telah selesai. 1. Gelombang yang arah rambat nya searah dengan arah getarnya disebut
	`, opsi:{tombol: ["a. Gelombang Longitudinal"
																 ,"b. Gelombang Transversal"
																,"c. Gelombang Elektromagnetik",
	             "d. Gelombang mikro"]}
			},
				{pesan:`2. Gelombang yang arah rambat nya tegak lurus dengan arah getarnya disebut
	`, opsi:{tombol: ["a. Gelombang Longitudinal"
																 ,"b. Gelombang Transversal"
																,"c. Gelombang Elektromagnetik",
	             "d. Gelombang mikro"]}
			}
		 ])
	let jawabanBenar = ["a. ", "b. "]
	let hasil = []
	let nomorSoal=0
	for(let isiArray of jawabanBenar ){
		nomorSoal+=1
		let objekPesan = await dapatkanPesan()
		//jawabPesan("anda menjawab "+objekPesan.pesan)
		if(nomorSoal<2)
			abaikanPesan()
		if(objekPesan.pesan.includes(isiArray) ){
			hasil.push(nomorSoal+" jawaban anda benar ✅ untuk :"+objekPesan.pesan)
		}else{
			hasil.push(nomorSoal+" jawaban anda salah ❌ untuk :"+objekPesan.pesan)
			
		}
		
	}

	jawabPesan("ini hasil anda:\n"+hasil.join("\n"))
	
	
}
						