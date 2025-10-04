function Registrsubmit({ children }) {
	return (
		<button
			type="submit"
			className="transition-all duration-200 ease-out
         hover:bg-rose-400 active:bg-rose-500 bg-rose-300
          shadow-md hover:shadow-lg h-16
          lg:h-20  text-1xl md:text-2xl lg:text-3xl
          p-4  rounded-md text-rose-950 font-extrabold
          w-3xs md:w-[55vw]
          lg:w-[70vw]
          max-w-5xl"
		>
			{children}
		</button>
	);
}

export default Registrsubmit;
