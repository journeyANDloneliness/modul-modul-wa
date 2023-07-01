

export function keluarDariMenu(text, add){
	if(!text) return
	return ["konfirmasi nilai","konfimasi","konfirm","home","sudah","selesai","keluar",add].includes(text?.toLowerCase())
}

