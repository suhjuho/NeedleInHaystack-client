function timeToSeconds(time) {
  const times = time.split(":").reverse();
  let seconds = 0;

  times.forEach((time, index) => {
    seconds += time * 60 ** index;
  });

  return seconds;
}

export default timeToSeconds;
