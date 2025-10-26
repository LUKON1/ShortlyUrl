function Registrsubmit({ children }) {
	return (
		<button
			type="submit"
			className="transition-all duration-200 ease-out
         hover:bg-rose-400 dark:hover:bg-rose-600 active:bg-rose-500 dark:active:bg-rose-700
          bg-rose-300 dark:bg-rose-500 shadow-lg hover:shadow-xl h-16
          lg:h-20  text-1xl md:text-2xl lg:text-3xl
          p-4  rounded-lg text-white dark:text-slate-900 font-extrabold
          w-3xs md:w-[55vw]
          lg:w-[70vw]
          max-w-5xl"
		>
			{children}
		</button>
	);
}

export default Registrsubmit;
