// Select button
const darkToggle = document.getElementById('dark-toggle')
//Select sun icon
const sunIcon = document.getElementById('sunIcon');
//Select moon icon
const moonIcon = document.getElementById('moonIcon');

//Select document element
const htmlElement = document.documentElement
//function to set icons based on theme dark:light
function setIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    sunIcon.classList.toggle('hidden', !isDark);  // show sun if dark
    moonIcon.classList.toggle('hidden', isDark);  // show moon if light
  }

//-- Checks local storage for preferences or if system is in dark mode
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && 
                                                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark'); //adds dark to classlist, making layout dark - tailwind
    darkToggle.ariaLabel= 'click for light mode'

} else {
    htmlElement.classList.remove('dark');
    darkToggle.ariaLabel= 'click for dark mode';
}
setIcons(); 


//--Event Listener button dar-toggle

darkToggle.addEventListener('click', () => {

    const isDark = htmlElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    setIcons();
    darkToggle.ariaLabel=isDark ? 'click for light mode' : 'click for dark mode' 
});

