/* hero extras: start the entrance if there is no intro to wait for, and keep the IST clock running */
(function () {
  var root = document.documentElement;
  function go() { root.classList.add("go"); }
  if (!document.getElementById("vintro")) go();
  setTimeout(go, 24000);                                  // never leave the slide unbuilt
})();
