function Aboutpage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<h1 className="text-4xl font-bold text-center mb-6 text-sky-400">
				О проекте ShortURL
			</h1>
			<p className="text-lg leading-relaxed text-rose-900 text-justify">
				ShortURL — это полнофункциональный сервис для сокращения длинных
				URL-адресов, разработанный как мой первый React-проект для
				портфолио. Он позволяет пользователям сокращать ссылки,
				генерировать QR-коды для них, а также управлять своими
				сокращенными URL-адресами, устанавливая срок жизни и лимиты по
				кликам. Проект демонстрирует мои навыки работы с React,
				маршрутизацией, управлением состоянием, международной
				локализацией, интеграцией с API и тестированием.
			</p>
		</div>
	);
}
export default Aboutpage;
