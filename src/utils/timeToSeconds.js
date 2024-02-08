function timeToSeconds(time) {
  try {
    const times = time.split(":").reverse();
    let seconds = 0;

    times.forEach((time, index) => {
      seconds += time * 60 ** index;
    });

    return seconds;
  } catch (error) {
    return false;
  }
}

export default timeToSeconds;
