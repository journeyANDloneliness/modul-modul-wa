import {dapatkanPesan, jawabPesan, abaikanPesan} from "auto-wa-rapiwha"
export async function materiTujuanPembelajaran(){
  while(true){
					
						let objekPesan=await dapatkanPesan()
						
						if (objekPesan.pesan=="Tujuan Pembelajaran"){
							jawabPesan(`
	➡️ *3.11 Menganalisis konsep getaran, gelombang, dan bunyi dalam kehidupan sehari-hari termasuk sistem pendengaran manusia dan sistem sonar pada hewan*
		 
	➡️ *4.11 Menyajikan hasil percobaan tentang getaran, gelombang, atau bunyi*
	
	*Tujuan* 
	Siswa mampu menganalisi gegetaran, gelombang, dan bunyi dalam kehidupan sehari-hari termasuk sistem pendengaran manusia dan sistem sonar pada hewan serta menyajikannya dalam bentuk tabel

 *Tekan/Ketik tombol kembali untuk kembali ke menu sebelumnya
 *Tekan/Ketik tombol Keluar untuk keluar untuk menu awal (home)
	`, {path: "./kumpulan Gambar/gambar gelombang transversal.png"})
						}
						else if(objekPesan.pesan=="kembali"){
							
							break
						}
						else if(objekPesan.pesan == "keluar"){
							break home
						}
						
					}
				
}