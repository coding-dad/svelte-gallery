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
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fzq-lee-VbDjv8-8ibc-unsplash.jpg?v=1561796309182",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fkrisjanis-mezulis-Ndz3w6MCeWc-unsplash.jpg?v=1561796310554",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fsepp-rutz-tskqMngoHSA-unsplash.jpg?v=1561796311981",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Ferik-mclean-WhRsHmFtFXQ-unsplash.jpg?v=1561796313563",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fjosh-sorenson-Z33d85enIBI-unsplash.jpg?v=1561796314943",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fpang-yuhao-wCi28eq8TF4-unsplash.jpg?v=1561796316818",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fhakon-sataoen-XFiY4FZj8ZE-unsplash.jpg?v=1561796317836",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fjohn-fowler-aaIN3y2zcMQ-unsplash.jpg?v=1561796318194",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fsepp-rutz-hZQOby6ZdIE-unsplash.jpg?v=1561796318251",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fpascal-habermann-A6hoSqrce5U-unsplash.jpg?v=1561796318397",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Flance-asper-5Kp5LVjINgI-unsplash.jpg?v=1561796323607",
	"/images/d8464ae8-ad7e-4d59-81e2-3711e6ecf721%2Fkeith-luke-TAm2z1TOges-unsplash.jpg?v=1561796324012"
];

/**
 * Just a helper method to wait a little while
 */
export async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}
