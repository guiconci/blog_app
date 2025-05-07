// Select button
const darkToggle = document.getElementById('dark-toggle')

//Select document element
const htmlElement = document.documentElement

//-- Checks local storage for preferences or if system is in dark mode
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && 
                                                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark'); //adds dark to classlist, making layout dark - tailwind

    darkToggle.innerHTML = '🌞';
    darkToggle.ariaLabel= 'click for light mode'

} else {
    htmlElement.classList.remove('dark');

    darkToggle.innerHTML = '🌙'
    darkToggle.ariaLabel= 'click for dark mode'
}

//--Event Listener button dar-toggle
darkToggle.addEventListener('click', () => {

    const isDark = htmlElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    darkToggle.ariaLabel=isDark ? 'click for light mode' : 'click for dark mode' 
});

