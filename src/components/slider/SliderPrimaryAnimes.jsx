import { useState, useEffect, useRef } from "react";
import { ArrowSVG } from "../svg";
import { Link } from "react-router-dom";

import { useFetch } from "@useFetch";

export default function SliderPrimaryAnimes() {
  const { data } = useFetch("http://localhost:3000/animes");

  const ANIMES_SLIDER_COUNT = data?.length;

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
    } else if (
      touchDistance < -50 &&
      currentSlide !== ANIMES_SLIDER_COUNT - 1
    ) {
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
    } else if (
      mouseDistance < -50 &&
      currentSlide !== ANIMES_SLIDER_COUNT - 1
    ) {
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
      setCurrentSlide((prevSlide) => (prevSlide + 1) % ANIMES_SLIDER_COUNT);
      setIsDragging(true);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [currentSlide, ANIMES_SLIDER_COUNT]);

  const handlePrevClick = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + ANIMES_SLIDER_COUNT) % ANIMES_SLIDER_COUNT
    );
  };

  const handleNextClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % ANIMES_SLIDER_COUNT);
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const BUTTONS_SLIDER = Array.from(
    { length: ANIMES_SLIDER_COUNT },
    (_, index) => (
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
    )
  );

  return (
    <>
      <div
        className="relative py-[10%] md:py-0 transition-[background] duration-500 bg-cover md:!bg-none"
        style={{
          backgroundImage: `url('')`,
        }}>
        <span className="absolute w-full h-full backdrop-blur-sm left-0 top-0 z-10"></span>
        <div className="relative flex w-3/4 max-w-xs md:max-w-xl mx-auto items-center z-40">
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
            className="relative overflow-hidden min-h-[320px]"
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            <div
              className={`relative flex ${
                isDragging
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}>
              {data?.map((anime, index) => (
                <>
                  <Link
                    key={index}
                    draggable={false}
                    to={`/${anime?.type}/${anime["anime-url"]}`}
                    className={`absolute w-full h-full`}
                    style={{
                      left: `calc(${index} * 100%)`,
                    }}
                  />
                  <picture className="w-full shrink-0">
                    <source
                      srcSet={anime?.images?.home?.mobile}
                      media="(max-width: 767px)"
                    />
                    <img
                      onDragStart={handleDragStart}
                      className="w-full"
                      src={anime?.images?.home?.desktop}
                      alt={`${anime["anime-url"]} portada`}
                    />
                  </picture>
                </>
              ))}
            </div>
          </div>
          <button
            className={`absolute -right-10 md:-right-14 h-10 md:h-14 md:w-14 z-10 grid place-items-center w-10 bg-yellow-500 ${
              currentSlide === ANIMES_SLIDER_COUNT - 1 ? "invisible" : ""
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
        <div className="flex w-full justify-center gap-2 p-2 relative z-10">
          {BUTTONS_SLIDER}
        </div>
      </div>
    </>
  );
}
