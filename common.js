

export function keluarDariMenu(text, add){
	return ["konfirmasi nilai","konfimasi","konfirm","home","sudah","selesai",add].includes(text.toLowerCase())
}