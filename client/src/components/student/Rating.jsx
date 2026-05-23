const Rating = () => {
  return (
    <div>
      {Array.from({ length: 5 }, (_, idx) => {
        const starValue = idx + 1;
        return (
          <span
            key={idx}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors 
              ${starValue}`}
          >
            &#9733
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
