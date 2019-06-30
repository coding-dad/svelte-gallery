// A list of static images, thanks to unsplash
/*
	The list of images used in the gallery as demo images

	Thanks to unsplash (https://unsplash.com) and the photographers ...
		Sepp Rutz on Unsplash
		Keith Luke on Unsplash
		Pang Yuhao on Unsplash
		Håkon Sataøen on Unsplash
		Erik Mclean on Unsplash
		Lance Asper on Unsplash
		John Fowler on Unsplash
		ZQ Lee on Unsplash
		Pascal Habermann on Unsplash
		Krisjanis Mezulis on Unsplash
		Josh Sorenson on Unsplash
	

*/
export const images = [
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/zq-lee-VbDjv8-8ibc-unsplash.jpg?v=1561796309182",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/krisjanis-mezulis-Ndz3w6MCeWc-unsplash.jpg?v=1561796310554",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/sepp-rutz-tskqMngoHSA-unsplash.jpg?v=1561796311981",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/erik-mclean-WhRsHmFtFXQ-unsplash.jpg?v=1561796313563",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/josh-sorenson-Z33d85enIBI-unsplash.jpg?v=1561796314943",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/pang-yuhao-wCi28eq8TF4-unsplash.jpg?v=1561796316818",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/hakon-sataoen-XFiY4FZj8ZE-unsplash.jpg?v=1561796317836",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/john-fowler-aaIN3y2zcMQ-unsplash.jpg?v=1561796318194",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/sepp-rutz-hZQOby6ZdIE-unsplash.jpg?v=1561796318251",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/pascal-habermann-A6hoSqrce5U-unsplash.jpg?v=1561796318397",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/lance-asper-5Kp5LVjINgI-unsplash.jpg?v=1561796323607",
	"https://raw.githubusercontent.com/coding-dad/svelte-gallery/master/public/images/keith-luke-TAm2z1TOges-unsplash.jpg?v=1561796324012"
];

/**
 * Just a helper method to wait a little while
 */
export async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}
