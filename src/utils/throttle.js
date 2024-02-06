function throttle(func, wait) {
  let timerId = null;

  return () => {
    if (timerId === null) {
      func();
      timerId = setTimeout(() => {
        timerId = null;
      }, wait);
    }
  };
}

export default throttle;
