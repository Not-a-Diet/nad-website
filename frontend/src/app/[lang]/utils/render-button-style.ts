export function renderButtonStyle(type: string) {
	switch (type) {
		case "primary":
			return "px-8 py-3 text-lg font-semibold rounded-2xl bg-ebony text-anti-flash_white";
		case "secondary":
			return "px-8 py-3 text-lg font-semibold border rounded-2xl border-ebony text-ebony";
		default:
			return "px-8 py-3 text-lg font-semibold rounded-2xl bg-secondary text-white";
	}
}
