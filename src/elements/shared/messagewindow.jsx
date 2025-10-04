import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const Notifications = forwardRef((props, ref) => {
	const fadeOutKeyframes = `
  @keyframes fadeOut {
    from {
      opacity: 70%;
      transform: translateX(0);
    }
    to {
     opacity: 0;
     transform: translateX(100px);
   }
  }
  `;
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
			<style>{fadeOutKeyframes}</style>
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className="text-xl lg:text-2xl animate-fade-out opacity-100 bg-rose-400 text-white px-4 py-2 lg:px-10 lg:py-6 rounded shadow-lg w-full"
					style={{
						animation: "fadeOut 0.5s ease-out 2.5s forwards",
					}}
				>
					{notification.message}
				</div>
			))}
		</div>
	);
});

export default Notifications;
