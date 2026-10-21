import React from "react";
import { useState, useRef, useEffect } from "react";
import Playlist from "./Playlist";
import { IoPause, IoPlay } from "react-icons/io5";
import { FaStepForward, FaStepBackward, FaRegPlayCircle } from "react-icons/fa";
import "./VideoPlayer.css";

const Videoplayer = ({ movies }) => {
  const [playlist, setPlaylist] = useState([]);

  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  // to optimise application
  const videoRef = useRef(null);

  //push data to playlist array received from database
  useEffect(() => {
    if (movies && movies.length > 0) {
      const newPlaylist = movies.map((movie, index) => ({
        id: index,
        title: movie.title,
        src: movie.sources,
      }));
      setPlaylist(newPlaylist);
      setCurrentVideo(newPlaylist[0]);
      setCurrentTitle(newPlaylist[0]); // Set the current video to the first one in the playlist
    }
  }, [movies]);
  //fucntion for play and pause
  const playPauseToggle = (term) => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  if (isPlaying) {
    videoRef.current.play();
  }

  // update time as vedio plays
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    if (!metadataLoaded) {
      setDuration(videoRef.current.duration);
      setMetadataLoaded(true);
    }
  };

  // seeking function
  const handleSeek = (time) => {
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  //function to start next vedio once current vedio ends
  const handleVideoEnd = () => {
    // Auto play next video in the playlist if available

    const currentIndex = playlist.findIndex(
      (video) => video.id === currentVideo.id
    );
    if (!autoPlay) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
    if (autoplay) {
      if (currentIndex < playlist.length - 1) {
        setCurrentVideo(playlist[currentIndex + 1]);
        setCurrentTitle(playlist[currentIndex + 1]); // update title to display below vedio when next vedio is plyed
        setMetadataLoaded(false); // Reset metadataLoaded when changing video
        setIsPlaying(true);
        if (isPlaying) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          }, 500);
        }
      }
    }
  };
  // pause when is tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        if (autoplay && currentVideo) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentVideo, autoplay, isPlaying]);

  //for speed change of video playing
  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  // for full screen
  const toggleFullScreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      /* Firefox */
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      /* IE/Edge */
      videoRef.current.msRequestFullscreen();
    }
  };

  const playnextToggle = () => {
    const currentIndex = playlist.findIndex(
      (video) => video.id === currentVideo.id
    );
    if (currentIndex < playlist.length - 1) {
      setCurrentVideo(playlist[currentIndex + 1]);
      setCurrentTitle(playlist[currentIndex + 1]); // update title to display below vedio when next vedio is plyed
      setMetadataLoaded(false); // Reset metadataLoaded when changing video
      setIsPlaying(false);
      setTimeout(() => {
        // videoRef.current.play();
        setIsPlaying(true);
      }, 1000);
    }
  };
  const playpreviousToggle = () => {
    const currentIndex = playlist.findIndex(
      (video) => video.id === currentVideo.id
    );
    if (currentIndex < playlist.length - 1 && currentIndex > 0) {
      setCurrentVideo(playlist[currentIndex - 1]);
      setCurrentTitle(playlist[currentIndex - 1]); // update title to display below vedio when next vedio is plyed
      setMetadataLoaded(false); // Reset metadataLoaded when changing video
      setIsPlaying(false);
      setTimeout(() => {
        // videoRef.current.play();
        setIsPlaying(true);
      }, 1000);
    }
  };

  const autoPlay = () => {
    setAutoplay(!autoplay);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="my-2 text-purple-700 place-self-start text-xl font-bold font-serif	">
        Vedio Player Application
      </h1>
      <video
        ref={videoRef}
        src={currentVideo ? currentVideo.src : ""}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onClick={playPauseToggle}
        onLoadedMetadata={() => setMetadataLoaded(false)} // Reset metadataLoaded state when new video loaded
        className="bg-black sm:w-[1000px] sm:h-[400px]"
      />
      <div className="w-full p-2 flex sm:flex-row flex-col sm:justify-between">
        <div className="w-full flex sm:flex-row flex-col sm:justify-between justify-center  sm:gap-4 items-center">
          <div className="w-fit flex flex-row justify-center">
            <button onClick={playpreviousToggle}>
              <FaStepBackward />
            </button>
            <button onClick={playPauseToggle}>
              {isPlaying ? <IoPause /> : <IoPlay />}
            </button>
            <button onClick={playnextToggle}>
              <FaStepForward />
            </button>

            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(e.target.value)}
            />
            <span className="w-full">
              {currentTime.toFixed(2)}/{" "}
              {duration ? duration.toFixed(2) : (0.0).toFixed(2)}
            </span>
          </div>
          <span className="w-fit sm:px-2 sm:py-0 pb-4 font-semibold">
            {currentTitle.title}
          </span>
        </div>

        <div className="w-full flex sm:flex-row sm:justify-end gap-4 itmes-end ">
          <div className="w-full flex sm:justify-end items-end">
            <button
              onClick={autoPlay}
              className="flex flex-row justify-center items-center gap-2"
            >
              <FaRegPlayCircle />
              {autoplay ? "Autoplay on" : "Autoplay off"}
            </button>
          </div>
          <div className="w-full flex gap-2 justify-end items-end">
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="border border-black"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <button className="bg-slate-200 " onClick={toggleFullScreen}>
              Full Screen
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-start items-start" id="playlist">
        <Playlist
          playlist={playlist}
          setCurrentVideo={setCurrentVideo}
          setCurrentTitle={setCurrentTitle}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
};

export default Videoplayer;
