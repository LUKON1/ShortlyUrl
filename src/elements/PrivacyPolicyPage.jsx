function Aboutpage() {
	return (
		<div className="container mx-auto px-6 py-12 max-w-3xl">
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-slate-700">
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-sky-500 dark:text-sky-400">
					О проекте ShortURL
				</h1>
				<div className="space-y-6">
					<p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-justify">
						ShortURL — это полнофункциональный сервис для сокращения длинных
						URL-адресов, разработанный как мой первый React-проект для
						портфолио. Он позволяет пользователям сокращать ссылки,
						генерировать QR-коды для них, а также управлять своими
						сокращенными URL-адресами, устанавливая срок жизни и лимиты по
						кликам.
					</p>
					<p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-justify">
						Проект демонстрирует мои навыки работы с React,
						маршрутизацией, управлением состоянием, международной
						локализацией, интеграцией с API и тестированием.
					</p>
					<div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600">
						<h2 className="text-2xl font-semibold mb-4 text-rose-500 dark:text-rose-400">Основные возможности:</h2>
						<ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
							<li>Сокращение длинных URL-адресов</li>
							<li>Генерация QR-кодов для ссылок</li>
							<li>Управление временем жизни ссылок</li>
							<li>Отслеживание количества переходов</li>
							<li>Многоязычный интерфейс (RU/EN)</li>
							<li>Тёмная и светлая темы</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Aboutpage;
