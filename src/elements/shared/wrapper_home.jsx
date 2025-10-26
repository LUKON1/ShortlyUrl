function PageWrapper({ children }) {
	return (
		<div className="flex flex-col text-center items-center w-full text-sky-500 dark:text-sky-400">
			{children}
		</div>
	);
}

export default PageWrapper;
