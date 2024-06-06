export const initializeScrolling = (container, scrollAmount = 1, speed = 20) => {
    let scrollInterval;
  
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        container.scrollLeft += scrollAmount;
        if (container.scrollLeft === container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0; // Reset to start
        }
      }, speed); // Adjust the interval for speed control
    };
  
    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };
  
    container.addEventListener('mouseover', stopScrolling);
    container.addEventListener('mouseout', startScrolling);
  
    startScrolling();
  
    return () => {
      container.removeEventListener('mouseover', stopScrolling);
      container.removeEventListener('mouseout', startScrolling);
      clearInterval(scrollInterval);
    };
  };
  