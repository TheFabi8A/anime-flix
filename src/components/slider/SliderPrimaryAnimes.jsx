import { useState, useEffect, useRef } from "react";
import { ArrowSVG } from "../svg";
import { Link } from "react-router-dom";

import { useFetch } from "@useFetch";
import { flushSync } from "react-dom";

export default function SliderPrimaryAnimes() {
  const { data } = useFetch("http://localhost:3000/animes");
  const [isThumbnail, setIsThumbnail] = useState(true);

  const handleMove = () => {
    document.startViewTransition(() => {
      flushSync(() => {
        setIsThumbnail((prev) => !prev);
      });
    });
  };

  const ANIMES_SLIDER_COUNT = data?.length;
  const timeToChangeImage = 7500;

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
      }, timeToChangeImage);
    } else if (
      touchDistance < -50 &&
      currentSlide !== ANIMES_SLIDER_COUNT - 1
    ) {
      handleNextClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, timeToChangeImage);
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
      }, timeToChangeImage);
    } else if (
      mouseDistance < -50 &&
      currentSlide !== ANIMES_SLIDER_COUNT - 1
    ) {
      handleNextClick();
      setIsDragging(true);
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setIsDragging(false);
      }, timeToChangeImage);
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
    }, timeToChangeImage);

    return () => clearTimeout(timeoutId);
  }, [currentSlide, ANIMES_SLIDER_COUNT]);

  const handlePrevClick = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + ANIMES_SLIDER_COUNT) % ANIMES_SLIDER_COUNT,
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
        className="relative h-1 w-8 bg-white/50"
        type="button"
        onClick={() => {
          setCurrentSlide(index);
          setIsDragging(false);
        }}
      >
        <span
          className={`absolute left-0 top-0 h-full w-full origin-left scale-x-0 bg-pink-600 transition-all duration-[${timeToChangeImage}ms] ${
            currentSlide === index
              ? "animate-[progress-animation-slider_7.5s_linear_1]"
              : "animate-none"
          }`}
        />
      </button>
    ),
  );

  const isMobileView = window.innerWidth <= 767;

  return (
    <>
      {/* <button onClick={handleMove}>Move</button>
      {isThumbnail && (
        <img
          src="https://res.cloudinary.com/djzsjzasg/image/upload/c_scale,w_300/v1678947391/malcolm-kee/meow_dtsn8h.png"
          alt="cat"
          className="cat-img thumbnail"
        />
      )}
      {!isThumbnail && (
        <div className="cat-details">
          <img
            src="https://res.cloudinary.com/djzsjzasg/image/upload/c_scale,w_500/v1678947391/malcolm-kee/meow_dtsn8h.png"
            alt="cat"
            className="cat-img detailed-img"
          />
          <div className="cat-desc">
            <h2>Cat Details</h2>
          </div>
        </div>
      )} */}
      <div
        className="relative bg-cover py-[10%] transition-[background] duration-500 md:py-0"
        style={{
          backgroundImage: isMobileView
            ? `url('${data?.[currentSlide]?.["image-mobile"]}')`
            : `url('${data?.[currentSlide]?.["image-desktop"]}')`,
        }}
      >
        <span className="absolute left-0 top-0 z-10 h-full w-full backdrop-blur-sm"></span>
        <div className="relative z-40 mx-auto flex w-3/4 max-w-xs items-center md:max-w-xl">
          <button
            className={`grid-place-items-center absolute -left-10 z-10 h-10 w-10 bg-yellow-500 md:-left-14 md:h-14 md:w-14 ${
              currentSlide === 0 ? "invisible" : ""
            }`}
            onClick={() => {
              handlePrevClick();
              setIsDragging(false);
            }}
          >
            <span>
              <ArrowSVG />
            </span>
          </button>
          <div
            className="relative min-h-[320px] overflow-hidden"
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`relative flex ${
                isDragging
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {isThumbnail && (
                <>
                  {data?.map((anime, index) => (
                    <div
                      key={anime?.["anime-name"]}
                      className="w-full shrink-0"
                    >
                      <Link
                        onClick={handleMove}
                        draggable={false}
                        to={`/${anime?.type}/${anime["anime-url"]}`}
                        className={`absolute z-50 h-full w-full`}
                        style={{
                          left: `calc(${index} * 100%)`,
                        }}
                      />
                      <picture>
                        <source
                          srcSet={anime?.["image-mobile"]}
                          media="(max-width: 767px)"
                        />
                        <img
                          onDragStart={handleDragStart}
                          className="anime-page-image w-full"
                          src={anime?.["image-desktop"]}
                          alt={`${anime["anime-url"]} portada`}
                        />
                      </picture>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <button
            className={`absolute -right-10 z-10 grid h-10 w-10 place-items-center bg-yellow-500 md:-right-14 md:h-14 md:w-14 ${
              currentSlide === ANIMES_SLIDER_COUNT - 1 ? "invisible" : ""
            }`}
            onClick={() => {
              handleNextClick();
              setIsDragging(false);
            }}
          >
            <span className="block rotate-180">
              <ArrowSVG />
            </span>
          </button>
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-wrap justify-center gap-2 p-2">
        {BUTTONS_SLIDER}
      </div>
    </>
  );
}
