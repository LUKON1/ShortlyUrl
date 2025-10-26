import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const Notifications = forwardRef((props, ref) => {
	const [notifications, setNotifications] = useState([]);

	useImperativeHandle(ref, () => ({
		addNotification(message, duration = 5000) {
			const newNotification = {
				id: Date.now(),
				message,
				timestamp: Date.now(),
				duration,
			};
			setNotifications((prev) => [...prev, newNotification]);
		},
	}));

	useEffect(() => {
		notifications.forEach((notification) => {
			setTimeout(() => {
				setNotifications((prev) =>
					prev.filter((n) => n.id !== notification.id)
				);
			}, notification.duration);
		});
	}, [notifications]);

	return (
		<div className="opacity-70 fixed mt-21 right-1/2 translate-x-1/2 w-[90vw] space-y-2 z-50 sm:w-60 sm:right-4 sm:translate-none sm:top-4">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className="text-xl lg:text-2xl animate-fade-out opacity-100 bg-rose-400 dark:bg-slate-700 text-white dark:text-slate-100 px-4 py-2 lg:px-10 lg:py-6 rounded-lg shadow-xl border border-rose-500 dark:border-slate-600 w-full animate-fadeout"
				>
					{notification.message}
				</div>
			))}
		</div>
	);
});

export default Notifications;
