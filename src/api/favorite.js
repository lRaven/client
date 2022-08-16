import axios from "axios";
import store from '@/store';
import cookie from 'vue-cookies';

const baseURL = store.state.baseURL;


//* получение списка квартир избранных юзером и передача в функцию выборки
async function getFavoriteApartmentNumber() {
	try {
		const response = await axios.get(`${baseURL}/academ/favorite/`, {
			headers: { Authorization: `token ${cookie.get('auth_token')}` }
		})
		if (response.status === 200) {
			let apartments = [];
			for (const key in response.data) {
				if (Object.hasOwnProperty.call(response.data, key)) {
					apartments[key] = response.data[key];
					apartments[key].favorite_id = apartments[key].id;
				}
			}
			getFavoriteApartments(apartments);
		}
	}
	catch (err) { throw new Error(err) }
}

//* получение всех данных о квартирах
async function getFavoriteApartments(favorites) {
	try {
		const response = await axios.get(`${baseURL}/academ/apartment/`, {
			headers: { Authorization: `token ${cookie.get('auth_token')}` }
		})

		if (response.status === 200) {
			for (let i = 0; i < response.data.length; i++) {
				for (let index = 0; index < favorites.length; index++) {
					if (response.data[i].id === favorites[index].apartment) {
						let favorite = favorites[index].favorite_id;
						favorites[index] = response.data[i];
						favorites[index].favorite_id = favorite;
					}
				}
			}
			store.commit('SET_FAVORITES', favorites);
			sortFavoriteList();
		}
	}
	catch (err) { throw new Error(err) }
}

//* удаление из избранного
async function removeFavorite(id) {
	try {
		const response = axios.delete(`${baseURL}/academ/favorite/${id}/`, {
			headers: { Authorization: `token ${cookie.get('auth_token')}` }
		})

		if (response.status === 204) {
			console.log(`Квартира под номером ${id} удалена из Избранного`);
			getFavoriteApartmentNumber();
		}
	}
	catch (err) { throw new Error(err) }
}

//* добавить в избранное
async function addFavorite(user, apartment) {
	try {
		const response = axios.post(`${baseURL}/academ/favorite/`,
			{ user: user, apartment: apartment, },
			{ headers: { Authorization: `token ${cookie.get('auth_token')}` } },
		)
		if (response.status === 201) {
			getFavoriteApartmentNumber();
		}
	}
	catch (err) { throw new Error(err) }
}

//* сортировка по-возрастанию (по цене или по площади)
function sortFavoriteList(way = store.state.cabinet.sort) {
	let favoriteList = store.state.cabinet.favorites;
	switch (way) {
		//* сортировка по цене (по-возрастанию)
		case 'price': {
			for (let index = 0; index < favoriteList.length - 1; index++) {
				for (let i = 0; i < favoriteList.length - 1; i++) {
					if (favoriteList[i].cost > favoriteList[i + 1].cost) {
						let item = favoriteList[i];
						favoriteList[i] = favoriteList[i + 1];
						favoriteList[i + 1] = item;
					}
				}
			}
			break;
		}

		//* сортировка по площади (по-возрастанию)
		case 'area': {
			for (let index = 0; index < favoriteList.length - 1; index++) {
				for (let i = 0; i < favoriteList.length - 1; i++) {
					if (favoriteList[i].area > favoriteList[i + 1].area) {
						let item = favoriteList[i];
						favoriteList[i] = favoriteList[i + 1];
						favoriteList[i + 1] = item;
					}
				}
			}
			break;
		}
		default: {
			break;
		}
	}
}

export { getFavoriteApartmentNumber, getFavoriteApartments, removeFavorite, addFavorite, sortFavoriteList }