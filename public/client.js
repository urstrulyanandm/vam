const socket = io();
const pad = document.getElementById("pad");

// join the room based on URL path (e.g. /math or /notes/today)
socket.emit("join", location.pathname);

// receive initial content or remote updates
socket.on("init", text => (pad.value = text));
socket.on("update", text => (pad.value = text));

// send changes (debounced)
let timer;
pad.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    socket.emit("update", pad.value);
  }, 300);
});
