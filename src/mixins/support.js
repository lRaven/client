import { send_support_message } from "@/api/support";
import { returnErrorMessages } from "@/js/returnErrorMessages";

import { mapState } from 'vuex';

export const supportForm = {
	computed: {
		...mapState({ user_id: (state) => state.cabinet.user.id, }),

		isFormValid() {
			if (
				this.form_data.name.length > 0 &&
				this.form_data.phone_number.length > 0 &&
				this.form_data.email.length > 0 &&
				this.form_data.topic_type !== "" &&
				this.form_data.message.length > 0
			) {
				return true;
			} else {
				return false;
			}
		},
	},
	data: () => ({
		form_data: {
			name: "",
			phone_number: "",
			email: "",
			topic_type: "",
			message: "",
		},

		topic_list: [
			{ id: 1, value: "Вопрос по покупке" },
			{ id: 2, value: "Вопрос по заселению" },
			{ id: 3, value: "Вопрос по стройке" },
			{ id: 4, value: "Вопрос по проживанию" },
			{ id: 5, value: "Обращение в службу безопасности" },
			{ id: 6, value: "Предложение о сотрудничестве" },
			{ id: 7, value: "Сообщить об ошибке на сайте" },
			{ id: 8, value: "Другое" },
		],
	}),
	methods: {
		//* отправка сообщения в поддержку
		async send_message(event) {
			try {
				const response = await send_support_message({
					name: this.form_data.name,
					phone_number: this.form_data.phone_number,
					email: this.form_data.email,
					topic_type: this.form_data.topic_type.id,
					message: this.form_data.message,
					user: this.user_id,
				});
				if (response.status === 201) {
					this.toast.success(
						"Спасибо за обращение, с вами скоро свяжутся"
					);
					console.log("support message send");

					event.target.reset();
					this.resetForm();
				}
				if (response.status === 400) {
					const error_list = returnErrorMessages(response.data);
					error_list.forEach((el) => {
						this.toast.error(el);
					});
				}
			} catch (err) {
				throw new Error(err);
			}
		},

		resetForm() {
			for (const key in this.form_data) {
				if (Object.hasOwnProperty.call(this.form_data, key)) {
					this.form_data[key] = "";
				}
			}
		},
	},
}