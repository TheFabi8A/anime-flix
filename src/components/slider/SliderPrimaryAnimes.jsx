import { useState, useEffect, useRef } from "react";
import { ArrowSVG } from "../svg";

const animeData = [
  {
    name: "horimiya",
  },
  {
    name: "mushoku-tensei-jobless-reincarnation",
  },
  {
    name: "reign-of-the-seven-spellblades",
  },
  {
    name: "rent-a-girlfriend",
  },
  {
    name: "sugar-apple-fairy-tale",
  },
  {
    name: "the-devil-is-a-part-timer",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  const inactivityTimer = useRef(null);

  const handleTouchStart = (event) => {
    setDragStartX(event.touches[0].clientX);
    clearTimeout(inactivityTimer.current);
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDistance = touchEndX - dragStartX;

    if (touchDistance > 50 && currentSlide !== 0) {
      handlePrevClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, 5000);
    } else if (touchDistance < -50 && currentSlide !== animeData.length - 1) {
      handleNextClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, 5000);
    }
  };

  const handleMouseUp = (event) => {
    const mouseUpX = event.clientX;
    const mouseDistance = mouseUpX - dragStartX;

    if (mouseDistance > 50 && currentSlide !== 0) {
      handlePrevClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, 5000);
    } else if (mouseDistance < -50 && currentSlide !== animeData.length - 1) {
      handleNextClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, 5000);
    }
  };

  const handleMouseDown = (event) => {
    setDragStartX(event.clientX);
    setIsDragging(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % animeData.length);
      setIsDragging(false);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [currentSlide]);

  const handlePrevClick = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + animeData.length) % animeData.length
    );
  };

  const handleNextClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % animeData.length);
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  console.log(isDragging);

  return (
    <>
      <div
        className="md:after:bg-none relative py-[10%] md:py-0 transition-[background] duration-500 bg-cover"
        style={{
          backgroundImage: `url('banner/mobile/${animeData[currentSlide].name}.webp')`,
        }}>
        <span className="absolute w-full h-full backdrop-blur-sm left-0 top-0 z-30"></span>
        <div className="relative flex w-3/4 max-w-xl mx-auto items-center z-50">
          <button
            className={`absolute -left-10 grid-place-items-center z-10 w-10 h-10 md:w-14 md:h-14 md:-left-14 bg-yellow-500 ${
              currentSlide === 0 ? "invisible" : ""
            }`}
            onClick={() => {
              handlePrevClick();
              setIsDragging(false);
            }}>
            <span>
              <ArrowSVG />
            </span>
          </button>
          <div
            className="relative overflow-x-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            <div
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className={`flex ${
                isDragging
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {animeData.map((animeData, index) => (
                <picture key={index} className="w-full shrink-0">
                  <source
                    srcSet={`banner/mobile/${animeData.name}.webp`}
                    media="(max-width: 1000px)"
                  />
                  <img
                    onDragStart={handleDragStart}
                    className="w-full cursor-grab active:cursor-grabbing"
                    src={`banner/${animeData.name}.webp`}
                    alt={`${animeData.name} banner`}
                  />
                </picture>
              ))}
            </div>
          </div>
          <button
            className={`absolute -right-10 md:-right-14 h-10 md:h-14 md:w-14 z-10 grid place-items-center w-10 bg-yellow-500 ${
              currentSlide === animeData.length - 1 ? "invisible" : ""
            }`}
            onClick={() => {
              handleNextClick();
              setIsDragging(false);
            }}>
            <span className="rotate-180 block">
              <ArrowSVG />
            </span>
          </button>
        </div>
      </div>
      <div className="flex w-full justify-center gap-2 p-2">
        {animeData.map((_, index) => (
          <button
            key={index}
            className="relative w-8 h-2 rounded-full border border-white"
            type="button"
            onClick={() => {
              setCurrentSlide(index);
              setIsDragging(false);
            }}>
            <span
              className={`left-0 absolute h-full top-0 rounded-full bg-white transition-all duration-500 ease-in-out bar ${
                currentSlide === index
                  ? "animate-[bar_10s_linear_1]"
                  : "opacity-0 animate-none"
              }`}></span>
          </button>
        ))}
      </div>
    </>
  );
}
