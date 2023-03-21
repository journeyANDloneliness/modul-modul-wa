import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"
import lodash from "lodash"


export async function randomPilihanGanda(){
	let soalSoal= 		[
			{pesan:` Jawablah seluruh oertanyaan berikut, kemudian tunggu jawaban apabila telah selesai. 1. Gelombang yang arah rambat nya searah dengan arah getarnya disebut
	`, opsi:{tombol: ["a. Gelombang Longitudinal"
										,"b. Gelombang Transversal"
										,"c. Gelombang Elektromagnetik",
	                  "d. Gelombang mikro"]},
			 jawabanBenar : "a. "
			},
				{pesan:`2. Gelombang yang arah rambat nya tegak lurus dengan arah getarnya disebut
	`, opsi:{tombol: ["a. Gelombang Longitudinal"
									 ,"b. Gelombang Transversal"
									 ,"c. Gelombang Elektromagnetik",
	                  "d. Gelombang mikro"]},
				 jawabanBenar: "b. "
			}, {pesan:`3. Getaran yang merambat disebut
	`, opsi:{tombol: ["a. Frekuensi"
									 ,"b. Priode"
									 ,"c. Gelombang",
	                  "d. amplitudo"]},
				 jawabanBenar: "c. " },
		 {pesan:`4. Banyak getaran tiap waktu disebut
	`, opsi:{tombol: ["a. Frekuensi"
									 ,"b. Priode"
									 ,"c. Gelombang",
	                  "d. amplitudo"]},
				 jawabanBenar: "a. "
		 }
          ]

	//lodash.random(0, soalSoal.length)
	let soalDiacak = lodash.shuffle(soalSoal)
	let jawab=""
	for(let soal of soalDiacak){
			jawabPesan(jawab+"\n--------------------------\n"
								 +"pertanyaan selanjutnya: \n"+soal.pesan, soal.opsi)
			let objekPesan = await dapatkanPesan()
			if(objekPesan.pesan.includes(soal.jawabanBenar))
				jawab="jawaban anda Benar ✅"
			else
				jawab="jawaban anda Salah ❌"
		
	}
	jawabPesan(jawab+"\n--------------------------\n"+"ini adalah soal terakhir selamat!")
	
	
	
	
}
						