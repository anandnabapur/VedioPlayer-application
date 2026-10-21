import React from 'react';

const Playlist = ({ playlist, setCurrentVideo, setCurrentTitle, setIsPlaying }) => {
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setCurrentTitle(video);
    setIsPlaying(false); //when vedio changed from playlist, it should pause 1st after that it should play once clicked
    setTimeout(() => {
      setIsPlaying(true);
      
    }, 1000);
  };

  return (
    <div className="mt-4 p-6 flex flex-col justify-center items-center">
      <h2 className="text-lg font-semibold mb-2">Playlist</h2>
      <ul className='mb-6 flex flex-col justify-center items-center border border-white'>
        {playlist.map((video, index) => (
          <li key={video.id} className="w-full p-2 sm:cursor-pointer text-white border border-white" onClick={() => handleVideoSelect(video)} >
            {index+1}. {video.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist