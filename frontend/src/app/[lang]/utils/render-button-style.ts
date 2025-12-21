export function renderButtonStyle(type: string) {
  switch (type) {
    case "primary":
      return `
				bg-primary 
				inline-flex 
				justify-center 
				items-center 
				gap-3 
				px-6 
				py-3 
				rounded-full 
				transition-all 
				duration-300 
				transform 
				hover:scale-105 hover:shadow-lg 
				text-anti-flash_white
			`;
    case "secondary":
      return "px-8 py-3 text-lg font-semibold border rounded-2xl border-ebony text-ebony";
    default:
      return "px-8 py-3 text-lg font-semibold rounded-2xl bg-secondary text-white";
  }
}
